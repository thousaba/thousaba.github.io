# pe-info-parser

A small, dependency-free C tool for the first pass of static PE (Windows executable) triage. [pe-info-parser.c](pe-info-parser.c) is a single file that parses the PE structures by hand — no `windows.h`, no third-party libraries — so it builds with any C99 compiler on Windows or Linux.

It dumps the File Header, Section Table (with per-section entropy and RWX flags), Optional Header (mitigations, entry point), Data Directories, the Export Table (EAT), a composite anomaly verdict, and the Import Table, flagging common packer / injector indicators along the way.

## Build

```sh
gcc -O2 -o pe-info-parser.exe pe-info-parser.c        # MinGW / MSVC-free Windows build
gcc -O2 -o pe-info-parser pe-info-parser.c -lm        # Linux (libm needed for log())
cl /O2 pe-info-parser.c                               # MSVC
```

Tested with MinGW-W64 GCC and MSVC on Windows. The only platform-specific bit is `_stricmp`/`strcasecmp`, which is handled by an `#ifdef`.

## Usage

```
pe-info-parser.exe <target_exe>
```

Walks `DOS_HEADER → PE signature → FILE_HEADER → OPTIONAL_HEADER64 → SECTION_HEADER[]`, then follows the Export and Import Directories through the section table with a manual RVA→file-offset translation. All offsets are bounds-checked against the file size, so a truncated or hand-crafted header produces an error instead of a crash or an infinite loop.

Before printing anything past the file header, the tool does one silent pass over the sections and headers to compute a composite anomaly verdict — see block 2. That verdict is what a reader sees first, and it also decides how block 7 (Imports) filters `KERNEL32.dll`.

The report has seven blocks.

**1. File header**

```
> pe-info-parser.exe sample.exe
+====================================================================+
|                                                                    |
|                           PE-INFO PARSER                          |
|                Static PE Triage & Anomaly Analysis                |
|                                                                    |
+====================================================================+
Target File             : sample.exe
Machine                 : 0x8664 -> x64 (AMD64)
Number of Sections      : 18
Compilation Date (Stamp): 2026-09-10 19:40:58 UTC
Optional Header Size    : 240 Byte
Characteristics         : 0x0026 [ EXE LARGE_ADDRESS_AWARE ]
======================================================================
```

The boxed masthead is fixed branding — the same 70 characters wide as every other separator in the report, drawn by `print_banner_border()`/`print_banner_line()` so it's unmistakably the report's title rather than another data line. Everything under it (`Target File` onward) is per-run data in the same plain `key : value` style as the rest of the tool.

- **Machine** is decoded for x86 / x64 / ARM64.
- **Compilation Date** is the `TimeDateStamp` rendered in UTC. Remember this field is trivially forgeable.
- **Characteristics** decodes `EXE`, `DLL`, `LARGE_ADDRESS_AWARE`, `RELOCS_STRIPPED`, `SYSTEM_DRIVER`.

**2. Anomaly summary**

```
======================================================================
PE TRIAGE ANOMALY SUMMARY
======================================================================
High Entropy Section (>7.5) : YES
RWX Section Present          : YES
Entry Point Anomaly          : no
TLS Callback Present         : no
----------------------------------------------------------------------
Verdict: [!] SUSPICIOUS -> KERNEL32 baseline suppression DISABLED, every import shown below.
```

Four independent signals, computed silently over the sections and headers below before anything else is printed, are combined into one verdict: a section above **7.5** entropy, an RWX section, an entry point outside `.text` (or unresolvable), and a present TLS directory. If **any** of them fires, the binary is treated as already flagged — and that changes how block 7 (Imports) behaves.

This exists because of a real blind spot: the `[~] CRT Baseline` noise filter in the imports block was designed to hide APIs like `GetProcAddress` and `VirtualProtect` when they're just normal CRT startup plumbing. But those two APIs are also exactly what a packer's unpacking stub calls to resolve and re-protect its decompressed payload — so on a genuinely suspicious binary, the same filter that reduces noise on clean binaries was hiding the clearest evidence. This verdict is the gate: noise suppression only applies to binaries with no other red flag. It leads the report, ahead of the section/header detail that produced it, so you see the verdict before you have to read the evidence for it.

**3. Section table**

```
SECTION NAME VIRT_SIZE    VIRT_ADDR(RVA) RAW_OFFSET   PERMISSIONS  ENTROPY
----------------------------------------------------------------------
.text      0x000042B0   0x00001000     0x00000600   0x60000020   5.50
.data      0x000000C0   0x00006000     0x00004A00   0xC0000040   0.64
.rdata     0x000015C8   0x00007000     0x00004C00   0x40000040   5.25
.bss       0x000001A0   0x0000C000     0x00000000   0xC0000080   0.00
.idata     0x00000AD0   0x0000D000     0x00006C00   0x40000040   3.71
.rsrc      0x000001E0   0x0000F000     0x00007A00   0x40000040   4.84
UPX1       0x00012000   0x00007000     0x00000400   0xE0000040   7.91  [!] HIGH (Packed / Encrypted?)  [!] RWX (Write+Execute)
...
[!] WARNING: At least one section is Read+Write+Execute! (Self-modifying / unpacking-stub pattern)
```

(The `UPX1` line is illustrative — it shows what a packed, self-unpacking section looks like next to the ordinary ones.)

- **PERMISSIONS** is the raw section `Characteristics` DWORD (`0x20000000` execute, `0x40000000` read, `0x80000000` write). A section that is **both** writable and executable (RWX) gets its own `[!] RWX` marker plus a summary warning line after the table — normal compilers never emit RWX sections, but a stub that decompresses its own payload and then jumps into it needs exactly that.
- **ENTROPY** is the Shannon entropy (0.0–8.0 bits/byte) of the section's raw bytes on disk. Native x64 code lands around 5–6.5, tables and string data lower. Anything above **7.0** gets a `[!] HIGH` marker on that row: compressed or encrypted content, i.e. a packer stub's payload section, an embedded encrypted blob, or a `.rsrc` hiding a second stage. Sections with no raw data (`.bss`, `PointerToRawData == 0`) report `0.00`.

Note the entropy threshold here (**7.0**, per-row) is slightly lower than the composite verdict's threshold (**7.5**, block 2) — one moderately compressed section is worth a row marker without necessarily flipping the whole binary's verdict on its own; the two thresholds are intentionally different bars.

**4. Optional header & mitigations**

```
======================================================================
OPTIONAL HEADER ANALYSIS & MITIGATIONS
======================================================================
ImageBase               : 0x0000000140000000
AddressOfEntryPoint     : 0x0000105F (RVA)
SizeOfImage             : 0x00018000 Byte
FileAlignment           : 0x00000200 | SectionAlignment: 0x00001000
Subsystem               : 3 [ Windows Console ]
Entry Point Section     : .text
DllCharacteristics      : 0x0160
  |-- ASLR (DYNAMIC_BASE) : ENABLED
  |-- DEP (NX_COMPAT)     : ENABLED
  |-- HIGH_ENTROPY_VA     : ENABLED
  |-- Guard CF            : DISABLED
  |-- Terminal Server     : NO
```

- **Entry Point Section** resolves `AddressOfEntryPoint` to the section that contains it. Anything other than `.text` is flagged as `[!] CRITICAL` — packers and injected stubs usually start execution from their own section. An entry point outside every section is reported as `UNKNOWN`.
- **FileAlignment == SectionAlignment** is flagged as a warning. Normal linkers use `0x200` / `0x1000`; equal values are typical of packed images and manually built shellcode loaders.
- **DllCharacteristics** is broken out into ASLR, DEP, high-entropy VA, CFG and Terminal Server awareness. A disabled ASLR or DEP gets a `[!]` marker.

**5. Data directories**

```
======================================================================
DATA DIRECTORIES (CRITICAL INDEXES)
======================================================================
[00] EXPORT Directory        : RVA 0x00000000 | Size 0x00000000 [ NOT PRESENT ]
[01] IMPORT Directory        : RVA 0x0000C000 | Size 0x00000AD0 [ PRESENT ]
[02] RESOURCE Directory      : RVA 0x0000E000 | Size 0x000001E0 [ PRESENT ]
[04] SECURITY Directory      : RVA 0x00000000 | Size 0x00000000 [ NOT PRESENT ]
[05] BASERELOC Directory     : RVA 0x0000F000 | Size 0x0000008C [ PRESENT ]
[09] TLS Directory           : RVA 0x00006DC0 | Size 0x00000028 [ PRESENT ] -> [!] CRITICAL: TLS Callback Present (Anti-Debug/Early Exec)!
[10] LOAD_CONFIG Directory   : RVA 0x00000000 | Size 0x00000000 [ NOT PRESENT ]
[13] DELAY_IMPORT Directory  : RVA 0x00000000 | Size 0x00000000 [ NOT PRESENT ]
```

Only the triage-relevant indexes are listed (export, import, resource, security, base relocation, TLS, load config, delay import). Three of them carry extra heuristics:

- **SECURITY present** → an Authenticode signature is attached. Presence is reported, the signature is not validated.
- **TLS present** → TLS callbacks run before the entry point, a classic anti-debug / early-execution spot. Note that MinGW-built binaries (like the sample above) legitimately carry a TLS directory, so treat this as "look here", not "malicious".
- **RESOURCE larger than 64 KiB** → possible embedded payload (droppers commonly stash the second stage in `.rsrc`).

**6. Exports**

```
======================================================================
EXPORT DIRECTORY ANALYSIS (EAT)
======================================================================
Module Name             : VERSION.dll
Base Ordinal            : 1
Total Functions         : 17
Named Functions         : 17
----------------------------------------------------------------------
[+] Printing first 15 exported functions:

ORDINAL FUNC RVA   FOFFSET      FUNCTION NAME
----------------------------------------------------------------------
@1      0x000010F0 0x000010F0   GetFileVersionInfoA
@2      0x00001110 0x00001110   GetFileVersionInfoByHandle
@3      0x00001AB0 0x00001AB0   GetFileVersionInfoExA
...
@15     0x00005F87 0x00005F87   VerLanguageNameW
... (2 more exports truncated)
```

Reads `IMAGE_EXPORT_DIRECTORY` (index 0 of the data directories) and walks the three parallel tables — `AddressOfNames`, `AddressOfNameOrdinals`, `AddressOfFunctions` — to resolve each named export to its real ordinal and code RVA. This is the block that matters for DLL samples: DLL side-loading payloads, hijacked system DLLs and reflective loaders tend to have a tell-tale export list (a single `DllMain`-style stub, `ReflectiveLoader`, or a cloned export set of the DLL they impersonate).

- **Module Name** is the internal name stored in the export table. If it does not match the file name on disk, the DLL has been renamed — normal for side-loading kits.
- **ORDINAL** is `Base + NameOrdinal[i]`, i.e. the number the DLL actually exports it under (`GetProcAddress` by ordinal works with this value).
- **FOFFSET** is the function's raw file offset after RVA translation. An RVA that cannot be mapped to any section prints as `0xFFFFFFFF`.
- Output is capped at the first 15 named exports; the remaining count is reported so you know when to open the file in a proper disassembler. A file without an export directory (most `.exe`s) prints a single `[-] No Export Directory Found` line.

**7. Imports**

```
======================================================================
IMPORTS (STATIC DLLs and CRITICAL APIs)
======================================================================

[+] Imported DLL: KERNEL32.dll
    |-- [~] CRT Baseline: GetProcAddress
    |-- [!] CRITICAL API: LoadLibraryA
    |-- [~] CRT Baseline: SetUnhandledExceptionFilter
    |-- [~] CRT Baseline: VirtualProtect
    |-- (... 10 hidden KERNEL32 APIs)

[+] Imported DLL: api-ms-win-crt-heap-l1-1-0.dll
    |-- API: calloc
    |-- API: free
    |-- API: malloc
```

For `KERNEL32.dll` the import list is filtered to cut noise — **but only when block 2's verdict is clean**:

- `[!] CRITICAL API` — process/memory-manipulation APIs commonly seen in loaders, injectors and droppers (`VirtualAlloc[Ex]`, `WriteProcessMemory`, `CreateRemoteThread`, `OpenProcess`, `CreateProcess*`, `WinExec`, `LoadLibrary[A|W]`, …). Always shown, regardless of verdict.
- `[~] CRT Baseline` — APIs almost every MSVC/MinGW CRT pulls in (`GetProcAddress`, `VirtualProtect`, `LoadLibraryExW`, `InitializeSListHead`, `SetUnhandledExceptionFilter`). Shown so you can tell "the CRT did it" from "the author did it". **Only applied when the anomaly verdict is clean.**
- Everything else from `KERNEL32` is collapsed into a `(... N hidden KERNEL32 APIs)` count — again, **only when clean**.

If the anomaly verdict is `SUSPICIOUS`, none of that filtering happens: every KERNEL32 import is printed individually, tagged `[?] API (baseline suppression disabled - binary flagged)` — including `GetProcAddress` and `VirtualProtect`, which would otherwise be downgraded to `[~] CRT Baseline` and lost in the noise. `[!] CRITICAL API` entries keep their own marker either way.

Imports from every other DLL are always listed in full. Ordinal-only imports are printed as `Ordinal: N`.

## Limitations

- Only **PE32+ (64-bit)** images are supported. 32-bit PE32 files are rejected with an error rather than mis-parsed.
- The import walker handles the classic Import Directory only. Delay-load imports and the load config are reported as present/absent in the data directory block but not parsed.
- The export walker lists **named** exports only (the first 15). Ordinal-only exports (`Total Functions > Named Functions`) are counted but not listed, and forwarded exports (`KERNEL32.HeapAlloc`-style strings in place of code) are printed with their RVA as if they were code.
- Section names are truncated at 8 bytes as stored in the header; long names via the string table (`/4`, `/14`, … in GCC-built binaries) are not resolved.
- The anomaly verdict is a simple OR of four signals, not a scored/weighted model. One high-entropy `.rsrc` (a legitimately compressed icon or embedded ZIP) is enough to flip it to `SUSPICIOUS` and disable KERNEL32 suppression, same as an actual RWX unpacking stub would. Treat the verdict as "look closer here", not "confirmed malicious" — same spirit as the individual `[!]` markers.
- The `[!]` markers are heuristics for prioritising what to look at next, not verdicts. Legitimate software trips several of them (see the TLS note above).

Compiled `.exe` files are ignored via `.gitignore`; rebuild from source with the command above.
