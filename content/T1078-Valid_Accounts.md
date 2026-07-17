### T1078 — Valid Accounts

Sub-techniques: .001 Default Accounts · .002 Domain Accounts · .003 Local
Accounts · .004 Cloud Accounts. Scored at the parent-technique level; the
detection logic is shared, and the impact is determined by account privilege.

| Field | Value |
|-------|-------|
| **Technique** | Valid Accounts, T1078 (parent technique) |
| **Tactic** | Initial Access, Persistence, Privilege Escalation, Defense Evasion (multiple tactics, v19) |
| **What it does** | Authenticates using legitimate (stolen / default / compromised) account credentials. No malware, no exploit — just a valid login. The hardest technique in ATT&CK to distinguish from benign activity; detection is entirely behavioral/anomaly-based. |
| **Impact** | Determined by account privilege — this is the sole deciding factor. **Base 60** (standard user access). **90** for privileged/Domain Admin, cloud admin (.004, tenant-wide), or cluster-admin kubeconfig. Local admin reuse (.003) -> lateral movement (Pass-the-Hash) potential ~65 |
| **Confidence** | 0.05 (noise) for a single generic login -> **0.7 ceiling**. The ceiling is set by AN1545 (service account interactive logon + child process) and the AN1546 MFA-fatigue pattern; others only reach ~0.6 when stacked together |
| **Detection** | **AN1543** Windows: 4624/4625 + logon type (2/3/10), new source host per user, impossible travel, off-hours activity -- `tstats` over the Authentication DM. **AN1544** Linux/mac: auth.log/secure SSH + sudo/su + service account deviation (auditd). **AN1545** service account interactive/remote logon + unexpected child process (highest hit rate in the family). **AN1546** IdP (Entra/Okta) sign-in logs: impossible travel, risky sign-in, MFA fatigue/failures. **AN1547** K8s audit: kubeconfig used from an unexpected node/IP |
| **False positive sources** | Remote work, shared VPN IPs, admins hopping between hosts, travel, shared workstations, **legitimate service accounts** (AN1545 requires a baseline), automation/CI. A huge false-positive surface -- this is why the base confidence stays low |
| **RBA/Alert** | Most of the family is a **pure RBA feeder** -- a single anomaly = low score, no alert; the threshold only kicks in when anomalies for the same identity stack up. **Exceptions:** AN1545 (service account interactive + child process) and the MFA-fatigue + impossible-travel combination come close to direct-alert confidence on their own |

**Risk check:** `60 x 0.05 = 3` (single user login, noise). `90 x 0.6 = 54`
(privileged + stacked Windows anomalies). `90 x 0.7 = 63` (service account
interactive + child process, AN1545 -- the highest contribution in the
family, and already close to a direct alert). Same technique, ranging from
3 to 63 depending on correlation. This is exactly why RBA exists.

**v19 detection strategy:** analytics AN1543-AN1547 (Windows / Linux-mac /
service account / IdP / container).

---

*Scoring reference points are fixed across all entries to keep scores comparable.*


### 💥 1. Impact ("Whoever Owns the Account, Owns the Power")

There's exactly one thing that determines this technique's impact score: the privilege of the compromised account.

    Impact 60 (Standard User): A regular employee's (e.g. an accountant's) account is gone. The attacker has a foothold in the system. A standard starting point.

    Impact 90 (Privileged / DA / Cloud-Admin): Game over, shut the shop down. A Domain Admin (DA), Cloud Global Admin, or Kubernetes Cluster Admin account has been compromised. The attacker is now the absolute owner of your entire system, cloud infrastructure, or container fleet.

    Impact ~65 (Local Admin Reuse): The attacker compromised a local admin account on a single machine. If that local admin password is the same across every machine company-wide (no LAPS in use), the attacker takes the password/hash and jumps to other machines (Pass-the-Hash / Lateral Movement).

### 📊 2. Confidence ("How Do We Know Who Actually Logged In?")

Since the attacker logs in like a legitimate user, the confidence ratio is very low and caps out at 0.70 (70%) at most.

    0.05 (Pure Noise): "User X logged into the system." Thousands of people log in company-wide every day — this is pure noise. It means nothing on its own.

    0.60 - 0.70 (Strong Signals): Two analytics push the confidence ratio to the ceiling:

        AN1545: A service account (a non-human account that's only supposed to connect to a database in the background) logged in interactively (via RDP or by opening a CMD) and, on top of that, spawned a child process (cmd.exe). This is 100% an attack.

        AN1546: MFA Fatigue. The attacker knows the password and bombards the victim with 50 approval notifications. The anomaly pattern that emerges the moment the exhausted victim finally taps "Yes."

### 🎯 3. Detection Strategies (The SOC Team's Hunting Map)

Here are the key things to use when writing rules in Splunk or threat hunting:

🟦 Windows (AN1543)

We look at Sysmon or Security Event logs (EID 4624/4625):

    Logon Type Check: Is the login interactive (Logon Type 2), over the network (Type 3 - psexec etc.), or remote desktop (Type 10 - RDP)?

    Anomaly Analysis: Has this user ever logged in from this machine (src_host) before?

    Impossible Travel: The user logged in from Istanbul 10 minutes ago — are they now trying to log in from London?

    Off-Hours: The guy's shift ends at 17:00, but there are active logs at 03:00 at night. For this we use Splunk's Authentication data model (tstats).

🟨 Linux (AN1544)

    We monitor SSH logins and the sudo/su commands that follow in /var/log/auth.log or secure logs.

    Service Account Deviation: Did a system user (in auditd logs) that's supposed to run silently in the background suddenly start running interactive commands?

🚨 Service Account Anomaly (AN1545 - The Cleanest Signal)

    Catch application or service accounts (SQL, IIS, Backup services) logging into the system remotely and spawning unexpected child processes. Under normal circumstances these accounts never open a shell (cmd/powershell/bash). If they do, it's a direct alarm!

☁️ Identity / IdP Side (AN1546 - Entra/Okta)

    In sign-in logs: geographic anomalies (Impossible Travel), logins from suspicious devices (Risky Sign-in), and repeated failed MFA approval requests (MFA Fatigue).

☸️ Kubernetes (AN1547)

    In K8s audit logs, is a kubeconfig (access credential file) making requests to the API server from an unexpected external IP or an unusual node?
