# Enterprise Security Policy

## Our Philosophy

We take security seriously—but we also know that **security should not be a barrier to innovation**. This policy is designed to protect our users and infrastructure while ensuring that contributors, maintainers, and security researchers can work together efficiently, transparently, and without unnecessary friction.

We **encourage** over‑reporting rather than under‑reporting. Even if you are unsure whether something is a vulnerability, please reach out.

---

## Supported Versions

We provide security updates only for actively maintained release lines.

| Version | Support Level | Notes |
| :------ | :------------ | :---- |
| `v2.x` (Current Stable) | ✅ Fully Supported | All critical and high‑severity fixes are backported. |
| `v1.x` (Legacy) | ⚠️ Best‑Effort | We will review reports, but we strongly recommend upgrading. |
| `< 1.0` / `main` (Unstable) | ❌ No Support | Not intended for production. Bugs may be fixed in the next release. |

---

## Reporting a Vulnerability (The Easy Way)

We provide **three reporting channels**—pick the one that is easiest for you.

| Channel | When to use | How to use |
| :------ | :---------- | :--------- |
| **GitHub Private Report** | **Preferred & Fastest** | Go to the repository **Security** tab → **Report a vulnerability**. |
| **Email (Optional)** | For large attachments (e.g., binaries) or if you prefer email. | Send to `security@your-domain.com` (PGP encryption optional—we will work with you either way). |
| **Slack / Discord** | **Not for direct reporting.** | Please do not disclose vulnerabilities in public channels. Use the options above instead. |

---

## What Happens After You Report?

We follow a clear, predictable workflow—**no black boxes, no endless waiting**.

1. **Acknowledgment** (within 1–2 business days)  
   We confirm receipt and assign a dedicated triage handler.
2. **Severity Assessment** (within 3–5 business days)  
   We evaluate the report using the **CVSS v3.1** standard. We will share our initial score with you.
3. **Fix & Release** (timeline based on severity – see table below)  
   We develop a patch, run it through our CI, and deploy a new release.
4. **Public Disclosure** (coordinated with you)  
   We publish a security advisory, credit you (if you wish), and close the loop.

### Severity‑Based SLAs (Service Level Agreements)

| Severity (CVSS Score) | Target Fix Time | Example Issues |
| :-------------------- | :-------------- | :------------- |
| **Critical** (9.0–10.0) | Within **7 calendar days** | RCE, SQL Injection, Authentication Bypass, Privilege Escalation. |
| **High** (7.0–8.9) | Within **14 calendar days** | XSS with high impact, Path Traversal, CSRF on sensitive endpoints. |
| **Medium** (4.0–6.9) | Within **30 calendar days** | Information Disclosure, Rate Limiting Bypass, Minor Injection risks. |
| **Low** (0.1–3.9) | **Best‑effort** / Next release | Security Headers missing, Verbose error messages, Non‑exploitable issues. |

> **Note**: These are **targets**, not strict deadlines. We prioritize stability—we will never rush a broken patch just to meet a date. We will keep you updated on progress every step of the way.

---

## What We Need From You (Simple Reporting Template)

To make triage lightning‑fast, please paste this template into your report (GitHub private form or email):
