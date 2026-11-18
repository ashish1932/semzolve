# Semzolve Technologies — Deployment & Domain / SSL Integration Guide

This guide details the complete deployment architecture for **Semzolve Technologies**, covering backend database persistence, production server execution, custom domain configuration (`semzolve.com`), automated Let's Encrypt SSL certificate provisioning, and admin lead management.

---

## 1. System Architecture Overview

The Semzolve web platform is structured as a full-stack, enterprise-grade application:
- **Frontend**: Responsive static HTML5, CSS3, and JavaScript with modern UI animations, interactive RFQ forms, and local storage fallback.
- **Backend API (`server.py`)**: Lightweight, zero-dependency Python REST service running on standard library `http.server`, `sqlite3`, and `json`.
- **Database Engine (`data/inquiries.db`)**: SQLite3 ACID-compliant persistent database storing all contact inquiries, RFQs, technical data sheet requests, and customer contact information.
- **Admin Portal (`/admin` / `admin.html`)**: Real-time management interface to filter, search, view, and export all customer leads to CSV.
- **Reverse Proxy & SSL**: Nginx with TLS 1.3 / 1.2, HTTP/2, security headers, rate limiting, and automated Let's Encrypt SSL certificate management.

---

## 2. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/inquiries` | Validates, generates unique RFQ ID (`SZ-RFQ-YYMMDD-XXXXXX`), and persists inquiry to SQLite. |
| `GET` | `/api/inquiries` | Retrieves JSON list of all captured customer inquiries (sorted newest first). |
| `GET` | `/api/export-csv` | Streams downloadable CSV spreadsheet of all inquiry records for CRM import. |
| `GET` | `/api/health` | Healthcheck returning `{ "status": "ok", "db": "connected", "records": N }`. |
| `GET` | `/admin` | Directly serves the admin dashboard interface. |

---

## 3. Deployment Option A: Cloud Platform (Render / Railway / Fly.io)

Cloud platforms provide the simplest path to production with **automated, zero-maintenance SSL certificates** and custom domain linking.

### Option A1: Deploying to Render (Recommended)
1. Push your repository to GitHub or GitLab.
2. In the [Render Dashboard](https://dashboard.render.com/):
   - Click **New** &rarr; **Blueprint** (or **Web Service**).
   - Select your repository. The repository contains `render.yaml` which automatically configures:
     - Runtime: Python 3
     - Build Command: `pip install -r requirements.txt` (or none needed)
     - Start Command: `python3 server.py`
     - Disk: 1 GB persistent disk mounted to `/app/data` to ensure database persistence across redeploys.
3. **Link Custom Domain**:
   - In Render Web Service settings, navigate to **Settings** &rarr; **Custom Domains**.
   - Add `semzolve.com` and `www.semzolve.com`.
   - Render automatically provisions and renews a free Let's Encrypt SSL certificate within minutes.

### Option A2: Deploying with Docker / Railway
1. A production-ready [Dockerfile](file:///home/ashish-kumar/Downloads/iceV1/ice/Dockerfile) and [docker-compose.yml](file:///home/ashish-kumar/Downloads/iceV1/ice/docker-compose.yml) are included in the workspace root.
2. Build and run locally or on any cloud container host:
   ```bash
   docker build -t semzolve-web .
   docker run -d -p 8000:8000 -v $(pwd)/data:/app/data --name semzolve semzolve-web
   ```
3. In Railway or Fly.io:
   - Import the GitHub repo. The platform detects the `Dockerfile` and builds the container automatically.
   - In the service networking settings, add your custom domain.

---

## 4. Deployment Option B: Ubuntu / Debian Linux VPS (Nginx + Systemd + Certbot)

For complete control on a dedicated virtual private server (DigitalOcean, AWS EC2, Linode, Hetzner, GCP Compute Engine).

### Step 1: Install Required Packages
```bash
sudo apt update
sudo apt install -y python3 python3-pip nginx certbot python3-certbot-nginx git ufw
```

### Step 2: Configure Systemd Service for `server.py`
Create a persistent background service so `server.py` restarts automatically on server reboot or process failure:

```bash
sudo nano /etc/systemd/system/semzolve.service
```

Paste the following configuration:
```ini
[Unit]
Description=Semzolve Technologies Web & API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/semzolve
ExecStart=/usr/bin/python3 server.py
Restart=always
RestartSec=5
Environment=PORT=8000
Environment=PYTHONUNBUFFERED=1

# Security Sandbox
ProtectSystem=full
PrivateTmp=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable semzolve
sudo systemctl start semzolve
sudo systemctl status semzolve
```

### Step 3: Configure Nginx Reverse Proxy
Copy the provided Nginx configuration to your server:
```bash
sudo cp deploy/nginx-semzolve.conf /etc/nginx/sites-available/semzolve.conf
sudo ln -s /etc/nginx/sites-available/semzolve.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Provision Let's Encrypt SSL Certificate
Run Certbot to automatically obtain and install the SSL certificate:
```bash
sudo certbot --nginx -d semzolve.com -d www.semzolve.com
```
Certbot will:
1. Verify domain ownership via HTTP-01 challenge.
2. Generate 2048-bit RSA or ECDSA TLS certificate.
3. Automatically configure Nginx with SSL paths and HTTP &rarr; HTTPS redirection.
4. Install an automatic renewal cron / systemd timer (`certbot.timer`) that checks twice daily and renews certificates before expiration.

To verify automatic renewal:
```bash
sudo certbot renew --dry-run
```

---

## 5. DNS Records Configuration

Configure the following DNS records at your domain registrar (GoDaddy, Namecheap, Google Domains, Cloudflare):

| Type | Host / Name | Target / Value | TTL | Note |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (or `semzolve.com`) | `YOUR_SERVER_PUBLIC_IP` | 300 / Auto | Directs apex domain to server |
| **CNAME** | `www` | `semzolve.com` (or Cloud Host alias) | 300 / Auto | Directs `www` subdomain |
| **TXT** | `@` | `v=spf1 include:... ~all` | 3600 | SPF record for email deliverability |

> [!TIP]
> If using **Cloudflare DNS**, enable the orange proxy cloud for immediate DDoS mitigation, free global edge SSL, and HTTP/3 support while retaining full end-to-end encryption.

---

## 6. Verifying the End-to-End Pipeline

1. **Submit Test Inquiry**:
   - Open `https://semzolve.com/contact.html` (or `http://localhost:8000/contact.html`).
   - Fill in: Name, Company, Email, Phone, Product needed, and Message.
   - Click **Submit RFQ / Inquiry**.
   - Confirm receipt of instantaneous green confirmation pill with unique inquiry reference number (`SZ-RFQ-...`).

2. **Verify Database Persistence**:
   - Query SQLite directly:
     ```bash
     sqlite3 data/inquiries.db "SELECT id, ref_id, name, company, email, created_at FROM inquiries ORDER BY id DESC LIMIT 5;"
     ```
   - Query API:
     ```bash
     curl -s http://localhost:8000/api/health
     ```

3. **Verify Admin Portal & CSV Export**:
   - Navigate to `https://semzolve.com/admin`.
   - Confirm the new inquiry is displayed in the real-time table.
   - Click **Export CSV** to download the complete spreadsheet.
