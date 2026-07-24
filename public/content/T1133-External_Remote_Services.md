# T1133 — External Remote Services

Multi-tactic (Initial Access, Persistence). **This technique splits into two halves
with completely different fidelity, and the MITRE analytics only cover one of them:**

1. **Auth-anomaly half (AN1004-AN1007)** -- the twin of T1078. Same problem, same
   low confidence. T1078 looks at the *account*, T1133 at the *service exposure*.
   Both fire on the same event -> **dedup required**.
2. **Adversary-installed remote service half** -- Dropbear SSH (Sandworm), SoftEther
   VPN (GALLIUM), ShadowLink (masquerading as Defender + Tor), Tor hidden service
   / `.onion`. This is not an auth anomaly, it is **software installation**, and
   all of the real fidelity lives here. Nobody installs Dropbear on a corporate
   host for a legitimate reason.

| Signal | Alone | Ceiling |
|--------|-------|---------|
| AN1004 Windows RDP/VPN/Citrix auth anomaly | 0.1 | 0.6 (stacked) |
| AN1005 Linux SSH / VPN gateway | 0.1 | 0.6 |
| AN1006 macOS VNC / Screen Sharing (external inbound is rarer) | 0.15 | 0.6 |
| AN1007 Docker API 2375 / K8s 6443 from external + container create | **0.5** | **0.85** |
| **Dropbear / SoftEther / ShadowLink / .onion installation** | **0.85** | **0.9** |

**Honest note:** the "off-hours + unusual geolocation" signal is effectively dead in
a remote-work era -- worse than T1078, because remote services are *designed* to be
reached from outside. The technique is literally "using the tool for its intended
purpose."

| Field | Value |
|-------|-------|
| **Technique** | External Remote Services, T1133 |
| **Tactic** | Initial Access, Persistence |
| **What it does** | Uses externally-exposed remote services (VPN, RDP, Citrix, SSH, VNC, Docker/K8s API) with valid credentials to enter the network and persist. **Or installs its own remote service** (Dropbear, SoftEther, Tor hidden service) -- a durable backdoor that bypasses perimeter controls entirely |
| **Impact** | **65 base** -- ingress inside the perimeter (above T1078's 60: not a single host, but network ingress plus persistence capability). **80** via third-party/MSP tunnel (APT41 -> payment processor; trust-boundary crossing, also T1199). **70** adversary-installed backdoor (Tor hidden service = a persistent channel that cannot be IP-blocked). Cluster-admin K8s API -> 85 |
| **Confidence** | 0.1 single external logon (remote work = noise) -> 0.6 stacked (fail->success + new geo + concurrent sessions + subsequent lateral). **0.9 ceiling only on the adversary-installed-service half**: a service masquerading as Defender making Tor connections (ShadowLink), Dropbear on a corporate host, unexpected SoftEther |
| **Detection** | **AN1004** (Windows): VPN/Citrix/RDP auth logs + 4625->4624 sequence, logon type 10, geo/hour deviation -> subsequent lateral. **Concurrent sessions: same user, different source IPs** (sharper signal). **AN1005** (Linux): SSH/VPN gateway auth -> successful logon -> shell/scp/sftp. **AN1006** (macOS): external VNC/Screen Sharing inbound -> interactive session / abnormal file transfer. **AN1007** (container): unauthorized external IP -> **2375/2376 (Docker, unauthenticated by design!), 6443 (K8s API), 10250 (kubelet)** -> abnormal container create/start -> node lateral. **Installation half:** new service registration (name mimicking Defender), Dropbear/SoftEther process+service, Tor process + `.onion` config, VPN connections from hosting/Tor-exit IP ranges |
| **FP sources** | **Remote work -- the thing that kills the signal.** Travel, pooled VPN IPs, employees using commercial VPNs, privacy-minded Tor users. **fail->success = mistyped passwords / MFA hiccups, extremely common.** Concurrent sessions: multi-device users. **Legitimate MSP/third-party access looks identical to the APT41 vector** -- the biggest FP source is also the most real threat. AN1007: internal orchestration/CI-CD creates containers constantly (the discriminator is the *external* IP) |
| **RBA/Alert** | Auth-anomaly half = **pure RBA feeder**, **dedup with T1078 mandatory**. Concurrent-session signal is mid-tier. **Docker API from external + container create = direct alert** (an internet-exposed 2375 gets a cryptominer within minutes). **Adversary-installed service = direct alert, no correlation needed** -- also dedup against T1543 (service creation) and T1036 (ShadowLink masquerading). **External attack-surface scanning (is 2375/6443/10250 exposed?) is not detection -- it is preventive hygiene.** Be honest about the distinction |

**Risk check:** `65 x 0.1 = 6.5` (single VPN logon, noise) . `65 x 0.6 = 39`
(stacked anomalies) . `70 x 0.85 = 60` (external Docker API + container create) .
`70 x 0.9 = 63` (ShadowLink/Dropbear backdoor, direct alert).

Key observation: **stacked auth anomalies reach 39, but a single Dropbear
installation reaches 63.** Same technique -- hunting the artifact the adversary
*leaves behind* is consistently more productive than chasing behavioral anomalies.

**v19 detection strategy:** DET0354, analytics AN1004-AN1007 (Windows / Linux / macOS / container), plus the adversary-installed-service patterns from the prose guidance.

---



### 🎭 1. Two Different Worlds: Splitting the Rule in Two

MITRE gave this technique a single name, but in reality it covers two attack types that have nothing to do with each other:

🌐 First Half: "The Attacker Trying to Log In Legitimately" (Auth-Anomaly)

    The attacker tries to get into the corporate network using a compromised VPN, RDP, Citrix, or SSH password.

    The problem: This looks exactly like the everyday behavior of legitimate employees. The guy opens a VPN from home, goes on vacation and connects from there. It produces exactly the same logs as T1078 (Valid Accounts). Dedup is mandatory, otherwise the system produces double alerts.

🖥️ Second Half: "The Attacker Building Its Own Door Inside" (Adversary-Installed)

    The attacker has already gotten in somehow (maybe via phishing). To stay persistent and freely reach back in from outside without hitting the company's firewall blocks, they install their own SSH/VPN server on the machine.

    For example: going to Linux and installing Dropbear SSH, slapping SoftEther VPN onto Windows, or spinning up a Tor (.onion) service running quietly in the background.

    This is where 100% fidelity lives. In a corporate company, no employee installs Dropbear on their computer out of nowhere and opens an SSH tunnel to the outside!


### 📊 2. Confidence ("Lies and Truths")

    0.10 (Login Alone): Pure noise. "Tevfik, who works from home, logging into the system via VPN." If we write an alert for this, the IT team will curse us out.

    0.60 (Stacked Anomalies): The same user typing the password wrong 5 times and then logging in successfully + coming from a different country + appearing to have sessions open from two different IPs at the same time (concurrent sessions). This is suspicious, but the risk score only climbs this far.

    0.85 - 0.90 (Backdoor Installation - The Holy Grail): A service disguising itself as Windows Defender while opening a Tor connection behind the scenes (ShadowLink), or Dropbear/SoftEther installation. No need to look for correlation at all, fire the red alert directly!

### 🎯 3. Detection Strategies (What Are We Catching, and How?)

🐳 The Container World's Nightmare (AN1007 - The Cleanest Signal)

Attackers search for Docker or Kubernetes APIs exposed to the internet.

    Docker API Port 2375 (if not protected by TLS!): If this port is open to the outside world, the attacker comes in from an external IP, sends a container create command, and slips their own cryptominer container inside.

    How Do We Catch It? We'll write an alert for requests coming from external IPs to port 2375 (Docker), 6443 (K8s API), or 10250 (Kubelet), followed immediately by abnormal container-creation logs. Confidence goes straight to 85%.

🟦 Windows (AN1004)

    In the sign-in logs (EID 4624/4625) we'll watch for consecutive "fail then success" (Type 10 - RDP) logs.

    Concurrent Sessions: The same user opening RDP/VPN sessions from two different external IPs at the same time (this is the sharpest auth signal).

    Newly Created Services: A new service registration disguised under the Defender name, or Tor connection requests running in the background.

🟨 Linux (AN1545)

    dropbear or softether processes, which are not normally present on the system, starting to run.

    Tor (.onion) configuration files being created on the host.


### 💥 4. Impact (The Attack's Impact and Decision Table)

    Impact 65 (Standard Ingress): Got in from outside via VPN.

    Impact 70 (Malicious Backdoor): The system connected out via an unblockable Tor tunnel.

    Impact 80 (Third-Party / MSP Tunnel): The attacker got in not by targeting the company directly, but by hijacking the VPN tunnel of the external IT/MSP firm that supports the company (like APT41's famous payment-processor breach). Because it crosses a trust boundary, the impact is very high.


The Logic of Our Risk Calculation:

    Even if we stack up a bunch of behavioral anomalies (off-hours login, new country, etc.), the risk score only reaches 39.

    But the moment we catch just a single Dropbear SSH installation on the system, the risk score jumps straight to 63!

Main Takeaway:

Instead of wearing ourselves out chasing behavioral anomalies (who logged in from where), we'll focus on catching the concrete backdoor software traces (ShadowLink, Dropbear, SoftEther) the attacker leaves behind after breaching the system. We can produce far more accurate (high-fidelity) alerts with far less effort.