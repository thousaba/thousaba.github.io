# T1189 — Drive-by Compromise

Endpoint aftermath is nearly identical to T1659 (browser -> unexpected child ->
temp drop -> outbound). The discriminator is on the network side: T1659 = content
injected **in transit** (content-type mismatch), T1189 = the user actually reached
a **malicious/compromised site** (newly-seen domain, obfuscated JS, exploit kit).
Both will fire on the same event -- **dedup required** to avoid double-counting risk.

| Field | Value |
|-------|-------|
| **Technique** | Drive-by Compromise, T1189 |
| **Tactic** | Initial Access |
| **What it does** | Executes code via the browser when a user visits a compromised/malicious site -- exploit kit, watering hole, malvertising. May require no user click at all (0-day -> drive-by execution) |
| **Impact** | **55** -- single-host foothold, delivery vector (same band as T1659). Payload impact is scored under follow-on techniques. In the **AN0501 scenario** (browser token/session stolen and replayed against the IdP), the real impact belongs to T1539 / T1550.001 -- not double-counted here |
| **Confidence** | 0.3-0.35 loose (browser hit a new domain and spawned a child) -> **0.75 tight**: **process injection / unsigned module load into the browser** + no user click + script-host child + temp drop + newly-seen domain. Ceiling sits above T1659 (0.7) specifically because the injection signal naturally excludes the updater/Electron noise that plagues T1659 |
| **Detection** | **AN0498** (Windows): Sysmon EID 3/22 (rare/new domain, DNS) -> EID 8 CreateRemoteThread or EID 7 ImageLoad (unsigned, into browser) -> EID 1 anomalous child (parent=browser) -> EID 11 drop / EID 12-13 registry, correlated on small time-delta. **AN0499** (Linux): proxy/Zeek HTTP rare domain or mutated JS -> python/ruby/sh child from browser -> /tmp staging -> off-baseline outbound. **AN0500** (macOS): WebKit fetch -> interpreter/launchd + dylib load + /var/folders drop. **AN0501** (IdP): post-compromise -- new refresh token issuance, consent grants, unusual OAuth client registration, MFA bypass patterns |
| **FP sources** | **Ad-tech / CDN churn** -- "previously unseen domain" is enormous noise from ad networks, meaningless alone. Browser updaters, extensions, Electron. **Critical for AN0498: EDR/AV agents legitimately inject into browsers** (CrowdStrike, Defender, etc.) -> allowlist mandatory or the strongest signal drowns. Legitimate unsigned plugins |
| **RBA/Alert** | Tight chain (injection/unsigned module + browser parent + auto-exec) = **direct alert**. Loose signals (rare domain, single child) = **feeder**. **AN0501 must be handled separately** -- it is post-compromise and belongs to a different entity (identity), so it feeds identity RBA rather than the endpoint's risk bucket. **Dedup against T1659.** |

**Risk check:** `55 x 0.32 = ~18` (rare domain + child, feeder) . `55 x 0.75 = ~41`
(injection + unsigned module + auto-exec, direct alert). AN0501, if triggered,
raises a separate risk object on the identity side.

**v19 detection strategy:** DET0176, analytics AN0498-AN0501 (Windows / Linux / macOS / identity).

---

*Scoring anchors are fixed across all entries to keep scores comparable.*


### 💥 1. Impact (Impact of the Attack: "Entry Ticket")

    Impact 55 (Single Host/Workstation Foothold): This attack, too, is a "ticket" for taking over the end user's machine and pivoting into the network. The real damage from dangerous payloads (ransomware, infostealer, etc.) is scored in the subsequent steps of the chain.

    Session Theft Exception (AN0501): If, instead of blowing up the browser and dropping a file on the system, the attacker instead steals the user's session token (T1539) and replays it against the cloud (Azure AD/Okta), we don't inflate the impact score here. We route the event straight to identity-theft rules (no double counting).


### 📊 2. Confidence (Confidence Ratio: "Holy Grail: The Injection Signal")

This is the most critical part of the table. The confidence ratio suddenly spikes:

    0.30 - 0.35 (Loose Chain): If all we see is a log saying "browser hit a new site, a process spawned underneath it," confidence is low. Ad networks, CDNs, and the like generate this noise every single day.

    0.75 (Tight Chain - Monster Signal): Why is the confidence ceiling here higher than the previous injection technique (0.70)? Because it involves "code injected into the browser process from the outside" (process injection) or "an unsigned DLL being loaded"!

    Naturally Filtering Out Noise: The Google Updater or legitimate Electron app noise that normally torments the rules doesn't randomly inject code into the browser's memory. If this unsigned DLL / injection signal shows up, followed by a file dropped into Temp with no user click, followed by an outbound connection to a rare domain, this is a clear exploit kit attack with 75% probability.


### 🎯 3. Detection Strategies (Chaining Rules for Splunk)

Here's the hardcore rule map we'll use in the lab to chain the Sysmon logs together:

🟦 Windows (AN0498)

We'll capture Sysmon events back-to-back within a very small time window (small Δt):

    Sysmon EID 3 or 22: The browser makes a DNS query and connects to a rare/new domain that has never been requested before in the company.

    Sysmon EID 8 (CreateRemoteThread) or EID 7 (ImageLoad): A thread is injected into the browser's (chrome.exe) memory from outside, or a suspicious unsigned module is loaded into it.

    Sysmon EID 1: The browser suddenly spawns an abnormal child process (mshta.exe, powershell.exe).

    Sysmon EID 11 or EID 12/13: That process drops a file into Temp or tampers with registry settings.

🟨 Linux (AN0499)

    We'll catch mutated/obfuscated JavaScript or rare-domain traffic in HTTP traffic via Zeek or the proxy.

    A script host such as python, ruby, or sh will suddenly launch from under the browser.

    Malicious code is staged in the /tmp folder, then opens a connection to an off-baseline external IP (outside normal outbound traffic).

🍎 macOS (AN0500)

    A file is fetched through Safari's engine (WebKit).

    A suspicious command interpreter or launchd is triggered on the system, and a dynamic library (.dylib) is loaded.

    The file is temporarily dropped into /var/folders.

☁️ Identity / IdP Layer (AN0501)

What do we see if the attacker jumps to the cloud after blowing up the endpoint?

    A new "refresh token" suddenly issued for the same user.

    A consent grant given to a suspicious application.

    An unusual or fake OAuth client registration being opened.

    MFA bypass patterns following a string of failed requests.

🍻 In summary:

This table says: it's not enough for the browser to just download a file or visit a site. If we see suspicious activity in the browser's memory (EID 7/8), immediately followed by script hosts flying around on the computer with zero user interaction, the victim has been served the exploit by the agent site they visited.