# T1091 — Replication Through Removable Media

T1200's sibling, but inverted: there, the raw USB event was 0.02 noise. Here the
target is **dead technology** -- no legitimate software writes `autorun.inf` in
2026. Dead tech makes a clean signal. **The only technique that crosses an air gap.**

| Signal | Conf. | Note |
|--------|-------|------|
| **`autorun.inf` creation** | **0.85** | Nobody writes this legitimately anymore (Agent.btz, Stuxnet) |
| **Re-enabling Autorun via `NoDriveTypeAutoRun`** | **0.8** | Turning back on what policy disabled = intent |
| Hidden nested directories + a shortcut as the only visible item | 0.75 | HIUPAN signature |
| Process execution from a removable path | 0.4 | Users do run installers from USB |
| USB mount -> rapid bulk file copy | 0.6 | Worm self-replication (PlugX, Gamaredon) |

| Field | Value |
|-------|-------|
| **Technique** | Replication Through Removable Media, T1091 |
| **Tactic** | Initial Access, Lateral Movement |
| **What it does** | Malware copies itself to USB media and spreads. **No adversary present** (unlike T1200) -- worm logic |
| **Impact** | **55** base (code execution on a host, delivery band). **80** in an air-gapped/OT/sensitive segment -- Stuxnet logic: there is no other way in |
| **Confidence** | 0.4 execution from a removable path -> **0.85** (`autorun.inf` / Autorun re-enabled) |
| **Detection** | AN0841: EID 6416 + `USBSTOR` registry -> Sysmon EID 1 execution from removable path -> EID 11 `autorun.inf`/LNK/hidden files -> EID 3 outbound right after USB insertion (Raspberry Robin) or lateral spread |
| **FP sources** | Legitimate installers run from USB, IT technician USB toolkits, portable apps, camera/phone media, genuine `autorun.inf` on old vendor media (rare) |
| **RBA/Alert** | **`autorun.inf` write + Autorun re-enable = direct alert.** Execution from removable = feeder. **Dedup with T1200 (device arrival) and T1204 (user execution)** |

**Risk check:** `55 x 0.4 = 22` (exec from USB, feeder) . `55 x 0.85 = 47`
(autorun.inf) . **`80 x 0.85 = 68`** (autorun.inf in an air-gapped segment -- where
USB is the only vector that exists).

**v19 detection strategy:** DET0301, analytic AN0841.

---




### 💥 1. The Only Force That Breaches the Air Gap: Impact

Impact 55 (Standard Network): On a normal internet-connected office machine, this worm running produces a standard foothold-level impact score.

Impact 80 (Air-Gapped / OT / Critical Infrastructure): This is the Stuxnet scenario! Think of nuclear plant, military base, or dam control system (OT/SCADA) segments that are completely closed off from the internet with no connection to the outside world. There is no way into these systems other than USB. If this behavior is observed on that isolated network, the impact score is a direct 80 — because the fortress has been conquered from the inside.


### 📊 2. The Power of Dead Technology (Confidence Analysis)

0.40 (Passing Signal): Running a program from a USB drive (D:\setup.exe). This is very normal. IT technicians or users may still install programs from USB. It's just a feeder.

0.80 (Forcibly Re-enabling Autorun): Normally, per company policy (GPO), automatic execution (Autorun) is disabled on machines when a USB is inserted. The malware going into the registry and changing the NoDriveTypeAutoRun setting to bypass this protection is a clear sign of intent. Confidence: 80%.

0.85 (autorun.inf Creation - The Holy Grail!): Writing autorun.inf into the USB or the machine the moment it's inserted. This is the signature of legends like Agent.btz or Stuxnet. No modern software legitimately does this today. The moment it appears, a direct red alert fires!

0.75 (Classic USB Shortcut Virus): We open the USB and all the folders inside are hidden; there's only a single shortcut (.lnk) file. The moment we click it, it runs the malware in the background (HIUPAN signature). A very clear signal.


### 🎯 3. Detection Strategy (AN0841 - Hunting Map)

The correlation query we'd write in Splunk should follow this chain:

Sysmon EID 1 + Registry / Event 6416: A USB device was mounted on the machine via the USBSTOR driver.

Sysmon EID 11 (File Create): Right after this USB was inserted, autorun.inf, .lnk (shortcut), or hidden system files suddenly appeared inside the USB drive (e.g. E:\).

Sysmon EID 1 (Process Create): A suspicious exe/script was triggered from the USB directory (with explorer or cmd as its parent). Sysmon EID 3 (Network Connection): If the device is connected to the internet, a suspicious outbound C2 connection fired off right after the USB was inserted (like the infamous Raspberry Robin worm).


💥 Risk Score Analysis and the Big Takeaway

Catching autorun.inf on a normal office network:

Risk Score 47 ($55 \times 0.85$).
Catching this in an air-gapped, sensitive OT segment with no internet access: Risk Score 68 ($80 \times 0.85$).

The biggest lesson to take from this document is this: monitoring protocols/features that are dead or disabled by design always gives the highest fidelity. If worms of this kind — leftover from the Windows XP/7 era — can still actively spread in a company, that's not just a cybersecurity incident; it also means there's a serious lack of physical port security and Active Directory GPO hardening.