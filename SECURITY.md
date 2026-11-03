# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Brian E-commerce, please **do not** open a
public issue. If private vulnerability reporting is enabled, use the repository's
**Security → Advisories → Report a vulnerability** workflow. Otherwise, contact the
maintainer privately through the [GitHub profile](https://github.com/BrianObonyo) to
arrange a secure channel.

- A description of the vulnerability
- Steps to reproduce
- Potential impact

The maintainer aims to respond within 72 hours.

## Supported Versions

| Version | Supported |
|---------|-----------|
| main    | ✅ |

Brian E-commerce is pre-1.0 and under active development; only `main` is supported.

## Scope

This covers the Brian E-commerce backend API and frontend. Payment handling uses Stripe
in test mode only in this reference implementation — do not use the included
checkout flow with real payment credentials without a full security review.
Self-hosted deployments are the operator's responsibility to keep patched and
configured securely (TLS, secrets management, PCI considerations if handling
real payments, etc.).
