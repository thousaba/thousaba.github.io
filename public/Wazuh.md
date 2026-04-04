# Sentryfy — Wazuh Tabanlı Gerçek Zamanlı SIEM Dashboard

Windows agent üzerinden Wazuh ile log toplayan, özel kurallarla alert üreten, Telegram bildirimi gönderen ve canlı React dashboard'u olan bir güvenlik izleme projesi.

---

## Mimari

```
Windows Agent (Wazuh) → Wazuh Manager → Webhook (ngrok) → Node.js Backend → React Dashboard
                                                                          ↓
                                                                   Telegram Bot
```

---

## Kurulum & Yapılandırma

### 1. Wazuh Agent — ossec.conf Log Kaynakları

Windows agent'a izlenecek log kaynakları eklendi.

![ossec.conf localfile config](/wazuh-images/ss2.png)

### 2. Windows Audit Policy Aktifleştirme

Başarısız login olaylarının loglanması için `auditpol` ile denetim politikası açıldı.

![auditpol powershell](/wazuh-images/ss3.png)

### 3. Özel Wazuh Kuralları

Windows başarısız login ve USB takma olayları için özel kurallar tanımlandı.

![custom wazuh rules](/wazuh-images/ss6.png)

### 4. Wazuh Webhook Entegrasyonu

Wazuh manager, alertleri ngrok üzerinden backend'e iletecek şekilde yapılandırıldı.

![wazuh integration config](/wazuh-images/ss7.png)

### 5. ngrok Tüneli

Backend'i dışarıya açmak için ngrok kullanıldı.

![ngrok tunnel](/wazuh-images/ss5.png)

### 6. Backend Kodu

Express + Socket.IO + Telegram entegrasyonu ile webhook'tan gelen alertler işlendi.

![backend code](/wazuh-images/ss4.png)

---

## Test

### Yanlış Kullanıcı ile Giriş Denemesi

`runas` komutu ile kasıtlı başarısız login denemesi yapıldı.

![failed login test](/wazuh-images/ss8.png)

---

## Sonuçlar

### Wazuh Discover — Alertler

![wazuh discover login](/wazuh-images/ss10.png)

![wazuh discover usb](/wazuh-images/ss11.png)

### React Dashboard

![sentryfy dashboard](/wazuh-images/ss9.png)

### Telegram Bildirimleri

![telegram alerts](/wazuh-images/signal-2026-04-04-144304_002.jpeg)
