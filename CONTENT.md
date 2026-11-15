# Content model

Everything shown on the site comes from these files. To add, edit or remove something, change only the data.

```
src/data/profile.json          name, role line, links, cv path, current status
src/content/projects/*.md      one file per project
src/content/writing/*.md       papers and write-ups
public/cv.pdf                  replace this file when the CV changes
```

## profile.json
```json
{
  "name": "Rayn Hanash Fasya",
  "roleLine": "TODO: one specific sentence, e.g. what you build and what you look for",
  "status": "TODO: e.g. Looking for a SOC analyst internship",
  "links": {
    "github": "https://github.com/anyvc",
    "linkedin": "https://linkedin.com/in/hanashrayn/",
    "email": "TODO: public contact email (do not publish phone number or student ID)"
  },
  "cv": "/cv.pdf"
}
```

## Project frontmatter
```yaml
---
title: ""              # required
summary: ""            # one sentence, factual
year: 2026
order: 10              # lower shows first
draft: false           # true hides it
category: soc          # soc | pentest | cloud | research
tags: []
severity: null         # only for findings-style projects: critical | high | medium | low
stack: []              # real tools used
outcomes: []           # measurable results only, taken from the write-up
links:
  repo: ""
  writeup: ""
sanitized: false       # must be true before any write-up or repo link is shown
---
```

## Writing frontmatter
```yaml
---
title: ""
type: paper            # paper | writeup
status: manuscript     # manuscript | preprint | published   (must match reality)
authors: []
year: 2026
sanitized: false
draft: true
---
```

## Draft entries (owner must verify every line before setting draft: false)
1. **Wazuh SOC lab** (`soc`): Wazuh manager on Azure, Windows 10 agent and Kali attacker on VMware.
   Outcomes: SMB brute-force detected by rule 60204 (level 10, MITRE T1110); Nmap scan not detected by default rules;
   PowerShell active-response script blocks the attacker IP; Atomic Red Team coverage documented with detected,
   undetected and test-failed results kept separate. Open item: Sysmon not yet added.
2. **Zero Trust lab** (`cloud`): Keycloak as identity provider, OpenZiti for per-service access, UFW deny-by-default.
3. **Project Epsilon** (`pentest`): self-built Linux privilege-escalation lab on Azure behind WireGuard.
4. **Leaky Whale and DarkHole 2 write-ups** (`pentest`): Linux and Docker privilege escalation, findings mapped to CWE.
5. **Juice Shop and DVAPI write-ups** (`pentest`): web and API vulnerabilities; note which parts used official solutions.
6. **RuleDetonate paper** (`research`): three authors; detects dependency redirection in coding-agent rule files;
   26.2% detection at 5% false-positive rate against at most 7.8% for general detectors. Status: TODO (manuscript?).

## Before publishing anything
- Confirm that the lab or competition allows public write-ups. Some course or recruitment material may be confidential.
- Remove passwords, tokens, internal IPs and flags where required. Set `sanitized: true` only after checking.
- Use the job title exactly as confirmed in `profile.json`. Do not upgrade or shorten it.
