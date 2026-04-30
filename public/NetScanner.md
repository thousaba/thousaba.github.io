# Network Scanner

A lightweight, terminal-based local network discovery tool built with Python & Scapy. Finds devices on your LAN, identifies open ports, grabs service banners, guesses operating systems via TTL fingerprinting, and resolves vendor names from MAC addresses — all from a single command.

## Features

- **ARP-based host discovery** — Reliable device detection that bypasses firewalls (ARP can't be blocked on a LAN)
- **Service probing** — Port-specific payloads (FTP HELP, Redis INFO, SMTP EHLO, etc.) to wake up services that won't respond without a prompt
- **Port scanning with banner grabbing** — Scans 26 common ports by default, grabs service banners (SSH, HTTP, FTP, etc.)
- **Multi-layer OS fingerprinting** — Three-stage detection: banner keyword analysis → port signature matching → TTL fallback. Port 445+3389 open = Windows, port 62078 = iPhone, etc.
- **Offline MAC vendor lookup** — Resolves device manufacturers from MAC addresses using the Wireshark OUI database via `manuf`, no API calls
- **mDNS device discovery** — Identifies devices via Bonjour/Zeroconf announcements, useful for randomized-MAC devices like iPhones
- **Three-layer hostname resolution** — mDNS (Apple/Android) → NBNS/NetBIOS (Windows) → reverse DNS fallback, all resolved in parallel
- **Watch mode** — Continuously monitors the network and alerts when devices join *or leave*
- **Hybrid passive mode (`--passive`)** — After each active scan, sniffs for ARP, DHCP, and mDNS traffic during the interval — catches sleeping devices the moment they wake up, without sending a single packet
- **Parallel scanning** — Devices and ports are scanned concurrently (up to 20 devices × 50 ports simultaneously)
- **Custom port targeting** — Override the default port list with `--ports`
- **JSON output** — Machine-readable output for scripting and piping
- **ARP spoofing detection** — Flags duplicate MACs across different IPs, a reliable indicator of ARP cache poisoning / MITM attacks
- **Beautiful terminal UI** — Rich tables, spinners, and colored output via `rich`

## Installation

```bash
# Clone the repository
git clone https://github.com/thousaba/NetScanner.git
cd NetScanner

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt
```

## Usage

> **Note:** ARP scanning requires root/administrator privileges.

### Basic scan

```bash
# Linux/Mac
sudo python app.py --subnet 192.168.1.0/24

# Windows (run terminal as Administrator)
python app.py --subnet 192.168.1.0/24
```

### Example output

```
                              Network Scan Results (192.168.1.0/24)
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃  IP Address   ┃    MAC Address    ┃ Hostname     ┃ Vendor       ┃ OS             ┃ Open Ports & Banner     ┃  Status    ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ 192.168.1.1   │ aa:bb:cc:dd:ee:ff │ router.local │ TP-Link      │ Windows        │ 80 [HTTP/1.1 200 OK..], │ OK         │
│               │                   │              │              │                │ 443                     │            │
│ 192.168.1.42  │ 11:22:33:44:55:66 │ macbook.lan  │ Apple Inc.   │ Linux/Mac/     │ 22 [SSH-2.0-OpenSSH..], │ OK         │
│               │                   │              │              │ Mobile         │ 8080                    │            │
│ 192.168.1.100 │ de:ad:be:ef:00:01 │ -            │ Dell         │ Windows        │ 3389, 445               │ OK         │
└───────────────┴───────────────────┴──────────────┴──────────────┴────────────────┴─────────────────────────┴────────────┘
```

When ARP spoofing is detected:

```
⚠ ARP SPOOFING DETECTED! The following MAC addresses appear on multiple IPs:
  MAC aa:bb:cc:dd:ee:ff → 192.168.1.1, 192.168.1.254

┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
┃  IP Address   ┃    MAC Address    ┃ Hostname     ┃ Vendor  ┃ OS      ┃ Open Ports  ┃   Status     ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━┩
│ 192.168.1.1   │ aa:bb:cc:dd:ee:ff │ router.local │ TP-Link │ Windows │ 80, 443     │ ⚠ ARP SPOOF  │
│ 192.168.1.254 │ aa:bb:cc:dd:ee:ff │ -            │ TP-Link │ Windows │ 80, 443     │ ⚠ ARP SPOOF  │
└───────────────┴───────────────────┴──────────────┴─────────┴─────────┴─────────────┴──────────────┘
```

### All options

```
Usage: app.py [options]

Options:
  -s, --subnet    Target subnet to scan (required)     e.g. 192.168.1.0/24
  -t, --timeout   ARP scan timeout in seconds           default: 2
  -p, --ports     Custom port list (comma-separated)    e.g. 22,80,443,3306
  --json          Output results as JSON
  --watch         Continuously monitor the network for new devices
  --interval      Seconds between scans in watch mode   default: 30
  --passive       Hybrid mode: active scan + passive ARP/DHCP/mDNS sniffing between rounds
  --iface         Network interface to sniff on (default: auto-detect via Scapy)
```

### Watch mode

Monitors the network and alerts when devices **join or leave**. Each scan compares the current device set against the previous one using set arithmetic — so a phone toggling WiFi is caught both on disconnect and reconnect.

```bash
python app.py --subnet 192.168.1.0/24 --watch --interval 15
```

```
👀 WATCH MODE ACTIVE! Scanning 192.168.1.0/24 every 15 seconds... Press CTRL+C to stop.

🚨 ALERT! NEW DEVICE(S) JOINED THE NETWORK!
[table with newly detected devices]

👋 DEVICE(S) LEFT THE NETWORK: ab:cd:ef:12:34:56

No new activity detected... (14:32:30)
```

### Passive hybrid mode

Combines active scanning with passive sniffing. After each active ARP scan, instead of sleeping, the tool listens on the network interface for wake-up signals for the full interval duration. Catches devices that were asleep during the active scan — the moment they generate any traffic, they're detected.

```bash
python app.py --subnet 192.168.1.0/24 --watch --passive

# Manual interface (useful on Windows where auto-detect sometimes picks wrong adapter)
python app.py --subnet 192.168.1.0/24 --watch --passive --iface "Wi-Fi"
```

```
👀 WATCH MODE ACTIVE! Scanning 192.168.1.0/24 every 20s (active + passive sniffing on Wi-Fi)...

🔍 PASSIVE CAPTURE! Device(s) detected without active scan:
  IP: 192.168.1.77  MAC: ab:cd:ef:12:34:56  Vendor: Apple Inc.
```

Three signals are listened for during the passive window:

| Signal | Port/Protocol | Triggered when |
|---|---|---|
| Gratuitous ARP | Layer 2 | Device joins or reasserts its IP |
| DHCP Request | UDP 67/68 | Device wakes up and renews IP lease |
| mDNS announcement | UDP 5353 | Apple/Android device unlocks and broadcasts services |

The BPF filter is precisely `arp or (udp and (port 67 or port 68 or port 5353))` — no generic UDP flood, only these three protocols. This also works when **client isolation** is enabled on the AP, since DHCP and mDNS are broadcast/multicast and bypass client-to-client filtering.


### JSON output

```bash
python app.py --subnet 192.168.1.0/24 --json
```

```json
[
    {
        "ip": "192.168.1.1",
        "mac": "aa:bb:cc:dd:ee:ff",
        "hostname": "router.local",
        "vendor": "TP-Link",
        "os": "Windows",
        "open_ports": "80 [HTTP/1.1 200 OK..], 443",
        "mdns_name": "-",
        "arp_spoof": false
    }
]
```

### Custom ports

```bash
# Scan only database ports
python app.py --subnet 10.0.0.0/24 --ports 3306,5432,27017,6379,1433

# Scan only web-related ports
python app.py --subnet 10.0.0.0/24 --ports 80,443,8080,8443,3000,5000
```

## Default Port List

| Port  | Service              |
|-------|----------------------|
| 21    | FTP                  |
| 22    | SSH                  |
| 23    | Telnet               |
| 25    | SMTP                 |
| 53    | DNS                  |
| 80    | HTTP                 |
| 110   | POP3                 |
| 143   | IMAP                 |
| 443   | HTTPS                |
| 445   | SMB                  |
| 1433  | MSSQL                |
| 2222  | Alt SSH              |
| 3000  | Dev Server (React)   |
| 3306  | MySQL                |
| 3389  | RDP                  |
| 5000  | Dev Server (Flask)   |
| 5432  | PostgreSQL           |
| 5900  | VNC                  |
| 6379  | Redis                |
| 8000  | Dev Server (Django)  |
| 8080  | HTTP Proxy           |
| 8443  | HTTPS Alt            |
| 27017 | MongoDB              |
| 548   | AFP (macOS file sharing) |
| 631   | CUPS (Linux printing)    |
| 62078 | iOS lockdownd            |

## How It Works

1. **ARP Scan** — Broadcasts ARP requests across the subnet. Every device that responds reveals its IP and MAC address. This is more reliable than ICMP ping because ARP operates at Layer 2 and can't be blocked by software firewalls.

2. **Vendor Lookup** — Matches the first 3 octets of each MAC address against the Wireshark OUI database (via `manuf`) to identify the device manufacturer. Fully offline, no API calls.

3. **Port Scan + OS Fingerprinting** — All devices are port-scanned in parallel while hostname resolution runs concurrently in the background.

4. **Hostname Resolution (three layers, parallel)** — After port scans complete, NBNS and mDNS queries run concurrently:
   - **mDNS** — Listens for Bonjour/Zeroconf announcements for 3 seconds. Apple and Android devices reveal their hostname via `info.server` (e.g. `Ileris-iPhone`). The service instance name (e.g. `iPhone (2)`) is shown separately in the Vendor column.
   - **NBNS** — Sends NetBIOS Node Status Requests (UDP 137) to every discovered IP in parallel. Windows machines respond with their computer name (e.g. `DESKTOP-MJ170VE`) in ~1 second.
   - **Reverse DNS** — For any device still unresolved after mDNS and NBNS, `gethostbyaddr` is called in a thread pool. Rarely populated on home LANs, but included as a last resort.

   Reverse DNS used to run sequentially per device (2–5 s per unresponsive host). All three layers now run in parallel so worst-case latency is bounded by the mDNS window (3 s), not by the number of devices.

5. **Port Scan** — All discovered devices are scanned in parallel (`ThreadPoolExecutor`, up to 20 devices simultaneously). Each device's ports are also scanned concurrently (up to 50 threads), giving a maximum of ~1000 concurrent connections. Full TCP connect scan with banner grabbing. Ports returning no response within timeout are marked `[Filtered]` — distinguishing firewall DROP from explicit REJECT.

6. **Service Probing** — Each port is sent a protocol-appropriate payload before reading the banner. SSH and MySQL announce themselves on connect; Redis, FTP, SMTP and others are silent until prodded (`INFO`, `HELP`, `EHLO`, etc.).

7. **Banner Grabbing** — Reads the first 1024 bytes returned by open ports to identify the running service. HTTP responses are parsed for the `Server:` header instead of the status line.

8. **OS Fingerprinting** — Three-layer detection, tried in priority order:
   - **Banner analysis**: scans service banners for OS keywords (`openssh` → Linux, `IIS` → Windows, `darwin` → macOS, etc.). Uses a voting system when multiple banners give conflicting signals.
   - **Port signatures**: specific open port combinations are unique to certain OSes. `{445, 3389}` → Windows, `{62078}` → iOS, `{548}` → macOS, etc.
   - **TTL fallback**: ICMP Echo Request as a last resort when no banner or port clue is available. ≤64 → Linux/Mac, ≤128 → Windows, ≤255 → Network device.
   - The OS column also shows which method produced the result (`via banner`, `via ports`, `via ttl`).

9. **ARP Spoofing Detection** — After all devices are collected, checks for duplicate MACs (same MAC on multiple IPs) and duplicate IPs (same IP with multiple MACs). Both are flagged in the Status column.

The timeline in a single scan: ARP sweep → parallel port scans → NBNS + mDNS concurrently → parallel reverse DNS for remaining → table output.

## Technical Notes

### Why ARP instead of ICMP ping for host discovery?

Most tutorials use ICMP ping (`ping 192.168.1.x`) to discover devices. The problem: firewalls can and regularly do block ICMP. A Windows machine with its firewall on won't respond to a ping — but it will always respond to an ARP request, because ARP operates at Layer 2 (Data Link), below the IP stack entirely. There is no firewall that can block ARP on a local network without breaking the network itself. That's why ARP gives far more complete results on a LAN.

### How does TTL-based OS fingerprinting work?

Every IP packet carries a TTL (Time To Live) value — an integer that decrements by 1 at each router hop to prevent infinite loops. Operating systems set different **initial TTL values** when sending packets:

| Initial TTL | OS                        |
|-------------|---------------------------|
| 64          | Linux, macOS, Android/iOS |
| 128         | Windows                   |
| 255         | Cisco routers, network devices |

When an ICMP Echo Reply arrives, the TTL has already been decremented by the number of hops between the target and us. On a LAN that's typically 0-1 hops, so the received TTL is very close to the initial value. The tool uses `≤64`, `≤128`, `≤255` thresholds instead of exact matches to account for those hops.

**Limitation:** Linux and macOS both use TTL 64, so they can't be distinguished by TTL alone. Modern smartphones also use 64. That's why the tool reports `Linux/Mac/Mobile` as a group rather than pretending to know more than the data allows. The Vendor column (from MAC OUI lookup) helps narrow it down further — if vendor is `Apple Inc.`, it's almost certainly macOS or iOS.

### Why three layers for OS fingerprinting?

TTL alone is a weak signal — Linux, macOS, and every smartphone all use TTL 64, making them indistinguishable. The tool now uses three layers in priority order:

**Layer 1 — Banner analysis** is the most precise. Service banners often contain explicit OS identifiers: `SSH-2.0-OpenSSH_8.9p1 Ubuntu` immediately identifies the host as Linux Ubuntu. The tool scans all captured banners for ~25 keywords covering Linux distros, Windows IIS, macOS Darwin, network vendors (Cisco, MikroTik, Ubiquiti), and IoT servers. When multiple banners give conflicting signals, a voting system picks the winner.

**Layer 2 — Port signatures** exploit the fact that certain port combinations are unique to specific OSes. No other OS runs SMB (445) + RDP (3389) by default — that combination is Windows. Port 62078 is iOS's `lockdownd` service, only present on iPhones and iPads. Signatures are split into `strong` (deterministic) and `hint` (probable), and the tool only falls back to hints when no strong match is found.

**Layer 3 — TTL fallback** is kept as a last resort for hosts with no open ports or unrecognized banners. It's cheap (one ICMP packet) and sometimes the only available signal.

The OS column in the table also shows which method produced the result (`via banner`, `via ports`, `via ttl`) so you can judge confidence at a glance.

### Why `manuf` instead of an API for MAC vendor lookup?

Earlier versions of this tool hit an external API to resolve MAC vendors. The problems: latency on every device found, rate limits, and it breaks in offline/air-gapped environments. `manuf` ships with the same OUI database Wireshark uses, so lookups are instant and work with no internet connection. The previous dependency (`mac-vendor-lookup`) was replaced because its sync wrapper around an async core produced spurious `RuntimeWarning: coroutine was never awaited` warnings — `manuf` is fully synchronous and has no such issue.

### Why three layers for hostname resolution?

`socket.gethostbyaddr()` (reverse DNS / PTR lookup) is the obvious choice, but it almost never works on home networks — consumer routers don't maintain PTR records for DHCP clients. The tool uses two faster and more reliable sources first:

**Layer 1 — mDNS** is best for Apple and Android devices. When a phone unlocks it broadcasts its services via Bonjour. `info.server` in the zeroconf response contains the actual hostname (`Ileris-iPhone`), while the service instance name (`iPhone (2)`) is preserved separately in the Vendor column.

**Layer 2 — NBNS (NetBIOS Name Service)** covers Windows machines. Windows broadcasts its computer name on UDP port 137, so a Node Status Request (a single UDP packet) gets an immediate response with the machine name (e.g. `DESKTOP-MJ170VE`). This is why Windows hostnames show up reliably without any DNS configuration.

**Layer 3 — Reverse DNS** is kept as a last resort. It's parallelized across remaining unresolved IPs so 30 unresolvable hosts don't add 60–150 seconds to the scan time.

### Why ThreadPoolExecutor for port scanning and not asyncio?

Port scanning is I/O-bound — the bottleneck is waiting for TCP connection timeouts, not CPU. Both threads and async coroutines work well here. `ThreadPoolExecutor` was chosen because it integrates naturally with the existing synchronous `socket` calls without requiring a full async rewrite. Each thread blocks on `connect_ex()` independently, so 50 ports effectively scan in parallel. The cap at 50 threads is to avoid exhausting the OS socket descriptor limit on Windows, which defaults to 512 per process.

### How does ARP spoofing detection work?

In a normal network, each MAC address belongs to exactly one physical device, which means it maps to exactly one IP. ARP spoofing (a.k.a. ARP cache poisoning) is a classic MITM technique where an attacker sends forged ARP replies to trick other devices into routing traffic through them. The attacker's machine ends up with the same MAC as the gateway (or another target), so two different IPs point to the same hardware.

The detection logic is intentionally simple: after collecting all ARP responses, build a `{mac → [ip1, ip2, ...]}` map and flag any MAC that appears more than once. This is a passive, zero-noise check — no extra packets are sent, and false positives are essentially impossible under normal conditions (a MAC collision on a real LAN would require a hardware fault, not a misconfiguration).

**Limitation:** This only catches spoofing that is *active during the scan window*. A hit-and-run spoof that completes between scans won't be detected. Watch mode (`--watch`) reduces this window by scanning repeatedly.

### Banner grabbing: why HEAD for HTTP?

For most ports, the tool simply opens a connection and reads whatever the service sends first (SSH sends its version string, FTP sends a greeting, etc.). HTTP servers don't send anything until the client speaks first. Sending `HEAD / HTTP/1.0\r\n\r\n` asks for response headers only — no body — which triggers the server to respond with its `Server:` header (e.g. `Apache/2.4.54`, `nginx/1.23.1`) without transferring any actual content. This keeps the scan fast and avoids triggering request-body size limits.

### Why passive sniffing catches sleeping devices that ARP misses

Active ARP scanning works by broadcasting a "who has this IP?" request. A device in deep sleep with its WiFi radio powered down never receives the request and therefore never responds — it's invisible to the scan.

Passive sniffing flips the model: instead of asking, it listens. When a sleeping device wakes up — triggered by a push notification, an alarm, or the user unlocking the screen — it immediately generates network traffic before the next active scan:

- **DHCP Request**: The device checks whether its IP lease is still valid. This is a broadcast packet, always visible on the LAN.
- **mDNS announcement**: Apple and Android devices broadcast their available services (AirPlay, Cast, etc.) to the local network on unlock.
- **Gratuitous ARP**: The device asserts its IP-to-MAC mapping to update neighboring ARP caches.

The passive window replaces the `time.sleep()` between active scans. The result: a device that woke up 5 seconds after the active scan completed is still caught in the same cycle, rather than waiting up to `--interval` seconds for the next poll.

### Why does Watch mode use set subtraction instead of a seen-list?

Early versions tracked a `known_macs` set that only ever grew. A device that joined, left, and rejoined would only trigger an alert on the *first* join — because its MAC was already in the set. The fix is to track `previous_macs` (the state from the last scan, not all-time history) and compare:

```
new_macs     = current_macs - previous_macs  # appeared this round
dropped_macs = previous_macs - current_macs  # disappeared this round
```

This makes Watch mode stateless between rounds — each scan is compared only to the one before it, so toggling WiFi on a device reliably triggers both a "left" and a "joined" alert.

## Tech Stack

- **[Scapy](https://scapy.net/)** — Packet crafting, ARP scanning, passive sniffing, OS fingerprinting
- **[Rich](https://github.com/Textualize/rich)** — Terminal tables, spinners, and styled output
- **[manuf](https://github.com/coolbho3k/manuf)** — Offline MAC-to-vendor resolution using Wireshark's OUI database
- **[zeroconf](https://pypi.org/project/zeroconf/)** — mDNS/Bonjour device discovery and hostname resolution
- **Python stdlib** — `socket` (TCP scanning, NBNS queries, reverse DNS), `concurrent.futures`, `argparse`, `json`

## Disclaimer

This tool is intended for **authorized network auditing and educational purposes only**. Only scan networks you own or have explicit permission to scan. Unauthorized network scanning may violate local laws and regulations.


## License 

MIT License