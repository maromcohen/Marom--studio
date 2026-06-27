# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MAROM Digital Studio — a single-page portfolio/marketing website for a boutique web design studio based in Tel Aviv. The entire site is a single `index.html` file with inline CSS and JavaScript (no build step, no frameworks).

## Deployment

- **Hosting:** GitHub Pages via GitHub Actions (`.github/workflows/static.yml`)
- **Live URL:** https://maromcohen.github.io/Marom--studio/
- Deploys automatically on push to `main`
- No build step — the repo root is uploaded directly as the Pages artifact

## Architecture

Single `index.html` containing:
- **Inline `<style>`** — all CSS including responsive breakpoints, accessibility classes, and animations
- **Inline `<script>`** — all JS including particle system, GSAP animations, accessibility widget, cookie banner, and modals
- **External dependencies** (CDN only):
  - Google Fonts (Inter, Marcellus)
  - GSAP 3.12.5 + ScrollTrigger plugin from cdnjs

Key JS systems:
- **Particle intro animation** — canvas-based "M" letter formation on page load, then disperses into floating particles with mouse interaction
- **GSAP/ScrollTrigger** — hero entrance timeline and `.reveal` class scroll-triggered animations
- **Accessibility widget** — 17 toggle options stored in `localStorage` under key `a11y`
- **Legal modals** — privacy, terms, accessibility statement triggered via `data-modal` attributes
- **Cookie consent** — stored in `localStorage` under key `cookie-consent`

## Content Details

- Contact: WhatsApp link to +972532748125, email marom7777@icloud.com
- Language: English with Hebrew toggle placeholder (not yet implemented)
- Legal compliance: Israeli accessibility standards (IS 5568), Privacy Protection Law
