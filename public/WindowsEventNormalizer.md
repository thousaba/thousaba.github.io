# windows-event-normalizer

Turns raw Windows event logs into a normalized, queryable schema — driven by
declarative mapping files rather than code.

```
Windows EVTX  ──▶  reader  ──▶  transform engine  ──▶  NDJSON  ──▶  Azure Data Explorer  ──▶  KQL
 (Security,      (EventData,     (mapping.json)      (one file        (schema-matched         (unmodified
  Sysmon)         locale-free)                        per table)        tables)                Defender queries)
```

The same source events can be emitted into **Microsoft Defender advanced
hunting** tables or **Microsoft Sentinel ASIM** schemas. Switching target is a
command-line flag, not a code change.

```bash
python normalize.py -i Security.evtx -t mde  -o out/
python normalize.py -i Security.evtx -t asim -o out/
```

---

## Why not just rename fields

Normalization is usually described as renaming columns. It mostly isn't, and
the gap is where hand-written normalizers break. Mapping Windows 4625 into
`DeviceLogonEvents` needs four different kinds of transform:

| Target column   | Source                 | What actually happens                                    |
| --------------- | ---------------------- | -------------------------------------------------------- |
| `AccountName`   | `TargetUserName`       | rename — the easy case                                    |
| `LogonType`     | `LogonType`            | `3` → `"Network"`; Defender's column is a string enum     |
| `ActionType`    | *(nothing)*            | `"LogonFailed"`, derived from the event ID alone          |
| `Timestamp`     | `TimeCreated`          | type conversion                                           |
| `FailureReason` | `SubStatus` ∥ `Status` | first non-empty source, then a status-code lookup         |

So a mapping file supports five primitives, applied in order:

```json
"LogonType":    { "from": "LogonType", "lookup": "logon_type" },
"ActionType":   { "const": "LogonFailed" },
"Timestamp":    { "from": "TimeCreated", "cast": "datetime" },
"FileName":     { "from": "NewProcessName", "derive": "basename" },
"RemoteIP":     { "from": "IpAddress", "null_if": ["-"] },
"AdditionalFields": { "from": "GrantedAccess", "wrap_json": "DesiredAccess" },
"FailureReason":{ "from": ["SubStatus", "Status"], "lookup": "status_code" }
```

`wrap_json` exists because MDE's `AdditionalFields` is a dynamic column, not a
string — public queries read it as `tostring(AdditionalFields.DesiredAccess)`,
so emitting a bare scalar would silently break all of them.

`from` accepting a list removes most of the branching people write by hand.
`derive` is a closed set of named helpers — deliberately not an `expr` key that
evaluates arbitrary expressions, because the moment a mapping file can run code
it stops being data and slowly turns back into Python.

Adding an event ID means editing JSON. `wen/engine.py` contains no
event-specific logic and should not need to change.

---

## Two decisions worth explaining

**Readers converge before the engine.**
EVTX, `ToXml()` output, a Splunk search export and a Turkish `ConvertTo-Json`
dump all reach the engine as the same flat dict of manifest `EventData` names.
Adding Splunk as a source meant writing one reader — `mappings/mde.json` was not
touched. Splunk's Windows TA renames fields (`Subject_Account_Name`,
`New_Process_Name`), resolves SIDs to display names, and emits multi-valued
fields as lists; all three are normalised away in `wen/splunk_export.py` rather
than leaking into every mapping.

**Read `EventData`, never the rendered `Message`.**
The `Message` string is localized. A parser written against it works on exactly
one display language of Windows — this project started on a Turkish host, where
`TargetUserName` renders as `Hesap Adı`, and where Windows' own translation of
event 4799 ships with a typo (`İşlem Bigileri`). `EventData` attribute names
come from the event manifest and are identical everywhere. The localized parser
still exists in `wen/locale_message.py` as a salvage path for data already
collected in that form, and it is the only file in the project that knows about
any human language.

**Route on `Channel:EventID`, never `EventID` alone.**
Sysmon event 1 is process creation. Security event 1 is not. Keying a mapping
on the bare integer merges them silently, and the bug only appears once a second
log source shows up.

---

## Usage

```bash
pip install -r requirements.txt

# normal path
python normalize.py -i Security.evtx -t mde -o out/
python normalize.py -i Sysmon.evtx   -t mde -o out/     # same tables

# many small downloaded files, one output set, one ADX load
python normalize.py -i .\downloads\ -t mde -o out/           # a whole directory
python normalize.py -i a.evtx b.evtx c.evtx -t mde -o out/   # explicit list
python normalize.py -i ".\downloads\*.evtx" -t mde -o out/   # glob

# ASIM instead
python normalize.py -i Security.evtx -t asim -o out/

# see what your mapping doesn't cover yet
python normalize.py -i Security.evtx -t mde -o out/ --report-unmapped

# strip identifying values before publishing samples
python normalize.py -i Security.evtx -t mde -o out/ --sanitize --seed mylab

# legacy: PowerShell ConvertTo-Json export with only a localized Message
python normalize.py -i Security30.json -t mde -o out/ --locale tr

# Splunk search Export -> JSON (already field-extracted; format is sniffed)
python normalize.py -i botsv3_export.json -t mde -o out/
```

`-i` accepts one or more files, a glob, or a directory — every input is merged
into the same set of output tables, so a folder of ten small EVTX samples still
means one `Get data` per table in ADX, not ten.

Then load `out/*.jsonl` into ADX using `kql/01_mde_tables.kql`, and query with
Defender KQL that needs no modification.

---

## Publishing lab data

Lab captures carry your account name, hostname, SID, and internal addressing.
Event 4648 and 5145 records contain the account name verbatim; command lines
contain user profile paths, which in one test run included the full filename of
a CV sitting in `Documents`.

`--sanitize` rewrites those deterministically: the same user maps to the same
pseudonym everywhere, so joins and aggregations still behave identically, but
nothing identifying survives. Well-known principals (`SYSTEM`, `LOCAL SERVICE`,
`Administrator`) are preserved, because detections filter on them.

It is a "don't publish your own name by accident" control, not a security
guarantee. Read the output before pushing it.

---

## Layout

```
normalize.py              CLI
wen/engine.py             transform engine — no event-specific logic
wen/reader.py             EVTX / XML / JSON input, all emitting one flat shape
wen/splunk_export.py      Splunk search-export reader (TA field names -> EventData)
wen/locale_message.py     localized-Message fallback (the only language-aware file)
wen/sanitize.py           deterministic pseudonymisation
mappings/mde.json         Defender advanced hunting target
mappings/asim.json        Sentinel ASIM target
kql/01_mde_tables.kql     ADX table definitions + detections
tests/test_engine.py      pytest suite
```

## Coverage

| Source                | Events                          | → Defender tables                                    |
| --------------------- | ------------------------------- | ---------------------------------------------------- |
| Security              | 4688                            | `DeviceProcessEvents`                                 |
| Security              | 4624, 4625, 4648                | `DeviceLogonEvents`                                   |
| Security              | 4698                            | `DeviceEvents`                                        |
| Sysmon                | 1                               | `DeviceProcessEvents`                                 |
| Sysmon                | 2                               | `DeviceFileEvents` (see gaps)                         |
| Sysmon                | 3                               | `DeviceNetworkEvents`                                 |
| Sysmon                | 7                               | `DeviceImageLoadEvents`                               |
| Sysmon                | 10, 22                          | `DeviceEvents`                                        |
| Security               | 4768, 4771                      | `IdentityLogonEvents` (needs Defender for Identity)   |
| Security               | 1102                             | `DeviceEvents`                                        |
| Security               | 5156, 5157                       | `DeviceNetworkEvents` (WFP allow / block)             |
| Security               | 4663, 4672, 4799                 | `DeviceEvents` (see gaps — extensions)                |
| Sysmon                | 11                              | `DeviceFileEvents`                                    |
| Sysmon                | 13                              | `DeviceRegistryEvents`                                |

`--report-unmapped` lists what a capture contains that the mappings don't cover
yet; each one is a JSON edit.

## Known gaps

- `FolderPath` holds the full path including the file name. Microsoft's schema
  reference says "folder containing the file", but real Defender data and the
  November 2024 `InitiatingProcessFolderPath` change both use the full path, and
  public hunting queries depend on it (`FolderPath endswith "\\schtasks.exe"`).
  Documented rather than guessed at.
- The ASIM mapping was built from the published schema references, not from the
  official parsers. Diff it against `Azure/Azure-Sentinel` and run the ASIM
  schema tester before claiming conformance.
- Handle-level auditing (4656/4658/4663) and Credential Manager reads (5379) are
  unmapped; Defender has no clean equivalent table for them.
- `DeviceEvents` carries around 180 `ActionType` values and Microsoft does not
  publish the list publicly — it appears only in the in-portal schema reference.
  `OpenProcessApiCall` (Sysmon 10) is confirmed by published MDE-internals
  research and by multiple public hunting queries. `DnsQueryResponse` (Sysmon 22)
  is still unverified — check it against the in-product reference if you have
  portal access.
- `IdentityLogonEvents` (Security 4768/4771, Kerberos) is populated in a real
  tenant only by **Microsoft Defender for Identity**, which requires a sensor on
  the domain controller — a DC log export alone does not reach this table in
  production. Mapped here for schema completeness and offline analysis, not as
  a claim that this pipeline replaces MDI. The `ActionType` and `FailureReason`
  values were cross-checked against a real `IdentityLogonEvents` export and
  matched exactly.
- `AuditLogCleared` (Security 1102) is still unverified.
- Four `ActionType` values are **project extensions**, not real MDE values:
  `SensitivePrivilegeAssigned` (4672), `GroupMembershipEnumerated` (4799),
  `ObjectAccessAttempted` (4663) and `FileTimestampModified` (Sysmon 2).
  Defender models none of these. They are mapped because the signals matter —
  admin logon, group recon (T1069), object access, timestomping (T1070.006) —
  but they will not exist in a real Defender tenant.
- 4689 (process exit) is deliberately left unmapped here. `DeviceProcessEvents`
  models creation only, and inventing a termination action would corrupt every
  process-count query. It belongs in the ASIM target, where `ProcessEvent`
  defines `ProcessTerminated`.
- Coverage percentage is a poor metric for this project. A normalizer that
  reaches 100% by inventing schema is worse than one that stops at what the
  target actually models; the unmapped list is documentation of where Defender
  has no equivalent, not a to-do list.
- `FileTimestampModified` (Sysmon 2) is **not** a real MDE `ActionType`.
  Timestomping has no Defender equivalent, so it is mapped as a project
  extension because the signal is worth keeping — not as schema conformance.
- The localized-`Message` fallback ships with Turkish rules only. This matters
  **only if your input is a `ConvertTo-Json` export** rather than EVTX. The EVTX
  and `ToXml()` paths read `EventData`, whose field names are language-
  independent, so they work on any Windows in any display language with no
  locale rules at all. Adding a locale to the fallback is a dict in
  `wen/locale_message.py` — no code changes.

## Tests

```bash
python -m pytest tests/ -v
```

Covers routing collisions, all five transform primitives, multi-source
fallback, both target schemas from one event, mapping validation, and the
sanitizer's stability.
