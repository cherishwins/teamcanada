# Fit For Gov — Canonical Facts Library

This file is the source-traceable inventory of facts Fit For Gov cites across its content. Every claim in every Fit For Gov post should trace to an entry here or to an equivalently-sourced external reference. When a post requires a fact not in the library, the choice is either to add it to the library (with full sourcing) or to omit the claim. The library is the mechanism that keeps the brand credible at the level of individual figures.

The facts are organized into five categories: Canadian municipal incidents, supply-chain compromises, institutional assessments and studies, procurement and regulatory facts, and technical architecture facts. Each entry carries the specific claim, the numeric detail, the source, the date of the source, and brief notes on where the fact belongs in Fit For Gov content and where it does not.

All sources referenced in this library are public. Fit For Gov does not cite private or confidential sources, and this library does not carry any entries that would require privileged access to verify.

---

## Category A — Canadian Municipal Incidents

### City of Hamilton Ransomware Attack, February 2024

**Incident date:** February 25, 2024.

**Recovery cost:** $18.3 million CAD as of June 30, 2025, paid out of the city's own budget after the insurance claim was denied.

**Ransom demand:** Approximately $18.5 million CAD, refused by the city.

**Insurance denial:** April 2025. The city's cyber insurance carrier denied the claim on the grounds that multi-factor authentication was not fully implemented across the environment at the time of the breach.

**Subsequent investment:** The city committed $33.6 million CAD in additional cybersecurity spending scheduled between 2025 and 2033.

**Operational impact:** Ransomware affected approximately 80% of the network. Phone lines went down. Council meetings were paralyzed. Transit scheduling, permit applications, and library WiFi were among the services disrupted. Recovery is ongoing as of the most recent public report.

**Attack vector:** The attackers gained initial access through an external internet-facing server, then studied the environment before encrypting systems and attempting to destroy the backups.

**Prior knowledge (critical):** Reporting surfaced around the November 2025 SecTor cybersecurity conference establishes that the City of Hamilton was aware of critical weaknesses in its IT cybersecurity posture for approximately three years before the February 2024 attack. The audit findings were on the record. The remediation was not completed prior to the breach.

**Sources:**
- City of Hamilton official news release, July 30, 2025 (Report CM24005(b), Report CM25008, Appendix 'A' — Post-Cyber Incident Summary by CYPFER Canada Inc.)
- CBC News coverage, June 18, 2024 and August 16, 2024 (Samantha Beattie, Saira Peesker)
- CP24 / CHCH reporting, November 2024 and July 29, 2025
- Specops Cybersecurity coverage of insurance denial, November 12, 2025
- Insidehalton / Metroland Media coverage of prior knowledge, November 18, 2025 (Loraine Centeno)

**Use notes:** Hamilton is the single most-cited anchor in Canadian municipal cybersecurity. The $18.3M figure is the primary number for cost-inversion comparisons. The prior-knowledge detail is central to Strand 3. Always name this as Canadian (not generic North American) when space permits. Do not confuse Hamilton's total recovery cost with the refused ransom — these are two different figures.

---

### City of Yellowknife Ransomware Incident, September 2025

**Incident date:** September 11, 2025.

**City response:** Yellowknife disconnected its municipal network from the internet in response to a suspected ransomware incident. Staff were instructed to change credentials.

**Preliminary outcome:** Initial reporting indicated no confirmed data compromise at the time of the disclosure. The city was praised in some coverage for the speed of its network-isolation response.

**Sources:**
- Secur-IT Toronto reporting, January 2026
- Canadian Cybersecurity Network reporting on OT-system attacks around the same period

**Use notes:** Yellowknife is the secondary Canadian municipal anchor after Hamilton. Its value is as a contrast case — Yellowknife took its network offline on day one, Hamilton's recovery is still in progress twenty-two months after the attack. Use Yellowknife to illustrate municipal decision-making under incident pressure rather than as a cost anchor (public cost figures are less developed than for Hamilton).

---

## Category B — Supply-Chain Compromises

### Essential Plugin WordPress Portfolio Attack, April 2026

**Compromise planted:** August 8, 2025, in version 2.6.7 of 31 plugins in the Essential Plugin portfolio, released under a changelog note describing compatibility with WordPress 6.8.2. The update added 191 additional lines of PHP, including a deserialization backdoor.

**Acquisition:** The Essential Plugin portfolio was acquired on Flippa for a six-figure sum by an attacker operating under the alias Kris. Ownership transfer was not reviewed by WordPress.org because WordPress has no mechanism for reviewing plugin ownership transfers.

**Activation:** April 5 and 6, 2026. For a 6-hour 44-minute window, a command-and-control server distributed payloads to every website running one of the compromised plugins. Dormant period: 241 days.

**Impact:** Approximately 20,000 active WordPress sites compromised.

**WordPress.org response:** April 7, 2026. WordPress.org permanently closed all 31 affected plugins. A forced auto-update (version 2.6.9.1) neutralized the phone-home mechanism but did not remove malicious code already injected into wp-config.php on compromised sites.

**Persistence:** Compromised sites continued to serve hidden SEO spam to search engines after the forced update, because the malicious code in wp-config.php was not removed by the auto-update. Manual remediation required.

**Sources:**
- TechCrunch coverage, April 14, 2026
- The Next Web coverage of Essential Plugin and the Flippa acquisition, April 2026
- TechRepublic coverage, April 16, 2026
- BigGo Finance technical breakdown with timeline, April 17, 2026
- DesignsTouch incident-response documentation, April 2026
- Cryptika Cybersecurity coverage of the 2017 Display Widgets precedent, April 2026

**Use notes:** This is the canonical supply-chain-compromise story for Fit For Gov. Use it to illustrate the WordPress ownership-transfer gap, the dormancy-plus-activation pattern, and the incompleteness of WordPress's own remediation mechanism. Do not inflate the 20,000-site figure or round it up. The "six-figure acquisition" detail is more potent than a specific dollar figure because it is exactly what was publicly reported and no more.

---

### Smart Slider 3 Pro Compromise, April 2026

**Installations affected:** Over 800,000 active installations.

**Compromise vector:** Separate from the Essential Plugin portfolio — Smart Slider 3 Pro was compromised via its own update infrastructure in the same week.

**Sources:**
- The Next Web coverage, April 2026

**Use notes:** Use Smart Slider 3 Pro as the second data point when establishing that the April 2026 supply-chain events were not a single anomaly. The 800,000+ figure is an order of magnitude larger than the Essential Plugin portfolio and illustrates the scale of what can happen when a single widely-installed plugin's update channel is compromised.

---

### Crisis24 / OnSolve CodeRED Ransomware Incident, November 2025

**Platform:** OnSolve CodeRED, a mass-notification system used by many U.S. counties, cities, and towns for weather notices, disaster updates, AMBER alerts, evacuation orders, and public safety notifications.

**Operator:** Crisis24, which reported approximately $436 million in earnings (partial figure in the reporting).

**Attack date:** The platform first went offline approximately November 10, 2025.

**Claim:** The INC ransomware gang claimed responsibility.

**Data stolen:** Names, addresses, emails, phone numbers, and passwords of OnSolve CodeRED users. Hackers published the stolen information online.

**Platform status:** CodeRED was decommissioned; Crisis24 is building a replacement platform. Backup data is current only as of March 31, 2025 — users who signed up after that date must re-register.

**Affected jurisdictions:** Municipalities across Colorado, Montana, Ohio, Georgia, New Mexico, Illinois, Missouri, Texas, Virginia, California, Massachusetts, and additional states.

**Sources:**
- Public incident reporting from the municipalities affected (letter from Jackson County Sheriff's Office, Illinois, published on Facebook)
- Crisis24 customer communications
- INC ransomware group public claim

**Use notes:** This is a U.S. story, not a Canadian one. Use it as a cautionary pattern illustrating the supply-chain-inheritance problem for SaaS-dependent municipal critical communications. Do not present it as equivalent to Canadian examples; it is a supporting data point, not a primary anchor. Do not name Crisis24 or OnSolve as Fit For Gov competitors — they are not. Fit For Gov does not build mass-notification platforms, so the relevance is the architectural lesson rather than the specific category.

---

## Category C — Institutional Assessments and Studies

### Canadian Centre for Cyber Security — National Cyber Threat Assessment 2025-2026

**Publication:** December 2025 (the most recent cycle).

**Key findings relevant to Fit For Gov:**
- Ransomware is the top cybercrime threat facing Canada's critical infrastructure.
- Ransomware directly disrupts critical infrastructure entities' ability to deliver services, with potential to endanger the physical and emotional wellbeing of victims.
- Ransomware actors in the next two years will "almost certainly escalate their extortion tactics and refine their capabilities."
- The majority of ransomware groups impacting Canada are assessed as Russian-speaking, operating out of the Commonwealth of Independent States.
- Cybercrime-as-a-service marketplaces are growing, enabling actors with a wider range of capabilities to conduct attacks.

**Sources:**
- Canadian Centre for Cyber Security, National Cyber Threat Assessment 2025-2026, published at cyber.gc.ca
- Canada.ca news release, January 28, 2026

**Use notes:** This is the foundational Canadian government document on the municipal cyber threat environment. Cite by full name ("Canadian Centre for Cyber Security") on first reference; CCCS thereafter. Do not cite as "the Canadian government" — it is a named, technical agency with a specific mandate.

---

### CCCS Cyber Threat to Canadian Water Infrastructure, November 2025

**Publication:** November 25, 2025.

**Key findings relevant to Fit For Gov:**
- Threats to Canadian water infrastructure are growing and evolving quickly.
- State-backed actors have almost certainly already gained access to networks used to operate Canadian water infrastructure and are maintaining dormant presence for later use.
- Ransomware is the most significant cyber threat to the reliable supply of water in Canada.
- Reconnaissance, supply-chain intelligence, and social engineering are named as the preparation vectors for subsequent attacks.

**Incident documented:** In October 2025 (prior to publication), hackers tampered with water pressure values at a municipality's water facility, producing degraded service. The municipality is not named in the public assessment.

**Key quoted figures:** Rajiv Gupta, head of the Canadian Centre for Cyber Security, and Bridget Walshe, CCCS deputy head.

**Sources:**
- CCCS water-infrastructure threat assessment, November 25, 2025
- National Post reporting, November 25, 2025 (Christopher Nardi)

**Use notes:** This is the anchor source for Strand 1 (Water-Threat). The October 2025 pressure-valve tampering detail is citable. Do not name the affected municipality — CCCS did not and speculation is off-limits. The "state actors are almost certainly already in water networks" line is the single most weaponizable sentence in Canadian municipal cybersecurity, but the phrasing must match the source — "almost certainly already gained access" is the CCCS's own language and should be used exactly.

---

### CCCS / RCMP Alert on ICS Compromises, October 2025

**Publication:** October 30, 2025.

**Key findings:**
- Canadian authorities confirmed multiple incidents where cybercriminals compromised internet-accessible Industrial Control Systems (ICS) devices protecting critical infrastructure.
- Affected sectors: water treatment, energy, agricultural operations.
- Specific incidents: water pressure tampering at a municipal water facility; Automated Tank Gauge compromise at a major Canadian oil and gas company triggering false alarms; temperature and humidity manipulation at a grain drying silo on a Canadian farm.
- Threat actors: a mix of sophisticated state-sponsored operators and hacktivists exploiting ICS targets of opportunity.
- Vulnerable component categories: PLCs, RTUs, HMIs, SCADA systems, and Building Management Systems (BMS).

**Sources:**
- Joint CCCS / Royal Canadian Mounted Police alert, October 30, 2025
- Secondary reporting at GBHackers and other outlets

**Use notes:** This alert extends Strand 1 (Water-Threat) beyond water into the broader ICS picture. Use when the post is about the cross-sector pattern rather than water specifically. Do not conflate hacktivist attacks with state-sponsored attacks in the same sentence — they are different threat profiles with different implications.

---

### Mathieu and Roy — SecTor 2025 Study on Canadian Government Websites

**Presentation:** November 18, 2025, at the SecTor Cybersecurity Conference in Toronto.

**Researchers:** Patrick Mathieu (co-founder of Hackfest) and Patrick Roy.

**Study duration:** Five years.

**Scope:** Federal, provincial, and municipal government websites across Canada.

**Key findings:**
- Canadian government websites are broadly vulnerable to attack.
- Many sites use 20-year-old legacy systems lacking modern defences.
- Vulnerabilities documented include SQL injection and misconfigurations.
- At least one government site was found leading users to a pornographic site via SEO poisoning.
- Ontario municipal sites specifically showed misconfigurations and exposed user interfaces that could allow an attacker to gain complete control of the site.
- Root cause identified: Canadian government agencies typically outsource website construction to third-party suppliers, and those suppliers typically do not have security expertise.
- Procurement obstacle identified: some cities lack the budget or internal knowledge to request proper security testing.

**Direct quote available for citation (under 15 words, used once per post maximum):**
- Patrick Mathieu: "You have to check everyone in the supply chain."

**Sources:**
- SecTor 2025 presentation, Toronto, November 18, 2025
- Insidehalton article by Loraine Centeno, Metroland Media, November 18, 2025
- Secondary reporting across Metroland Media outlets

**Use notes:** This is the anchor source for Strand 2 (SecTor-Validation). The Mathieu quote is the only direct quotation permitted from this source per post. Name both researchers when space permits — attribution to Mathieu alone is acceptable but slightly less strong. Do not attribute conclusions to the researchers that are not in the public reporting.

---

### Office of the Auditor General of Canada — Cybersecurity Audit, 2025

**Key findings relevant to Fit For Gov:**
- The federal government does not maintain a comprehensive, up-to-date inventory of all government IT assets.
- Without up-to-date IT information across all departments and agencies, the federal government risks being unaware of changing cybersecurity challenges.
- Coordination among agencies responsible for cybersecurity was insufficient during active attacks.
- An initiative to set up a cybersecurity collaboration platform and incident case management tool had not received funding.

**Sources:**
- Office of the Auditor General of Canada audit report, 2025

**Use notes:** The "no comprehensive IT asset inventory" finding is the single most citable element of this audit for Fit For Gov content. It generalizes the Hamilton pattern from one municipality to the federal level, and by implication to the entire Canadian public sector. Do not overstate — the audit covers federal agencies specifically, though the implications for provincial and municipal tiers are discussable.

---

### ArcaneDoor Campaign / Cisco ASA Vulnerabilities, September 2025

**Disclosure:** September 25, 2025.

**Affected product:** Cisco Adaptive Security Appliance (ASA) — commonly used to enable VPNs and sit at network edges for banks, hospitals, utilities, public agencies, and municipalities.

**Threat actor:** Assessed with high confidence by Cisco as state-sponsored, consistent with the ArcaneDoor campaign (espionage-focused, targeting critical infrastructure).

**Attack capabilities confirmed:** Implanting malware, executing commands, potentially exfiltrating data from compromised devices.

**CSE / CCCS response:** Described the threat as "serious and urgent." Called on critical infrastructure sectors including municipal, provincial, and territorial governments to act swiftly.

**U.S. response:** Cybersecurity and Infrastructure Security Agency issued an emergency directive requiring all federal civilian agencies to patch by midnight the following day — a rare and significant action.

**Notable quote available for citation:** Rajiv Gupta, CCCS head: "This is a critical moment for Canadian organizations. Threat actors are targeting legacy systems with increasing sophistication." (Under 15 words per segment; use carefully if quoting.)

**Sources:**
- CBC News reporting by Catharine Tunney, September 26, 2025
- Cisco's own advisory and statement
- U.K. National Cyber Security Centre warning
- CISA emergency directive

**Use notes:** Use this for posts about the sophistication of the threat environment and the unreliability of perimeter-security assumptions. Do not position Fit For Gov as a network security consultancy — it is not. The Fit For Gov angle is architectural: a statically-generated site has no network-interior attack surface for a compromised VPN gateway to pivot into.

---

## Category D — Procurement and Regulatory Facts

### Direct-Award Thresholds (Canada)

**British Columbia:** Under provincial and most municipal procurement bylaws, the threshold for direct-award contracting of goods and services is approximately $75,000 for a single award. Unsolicited procurements typically face lower thresholds.

**Ontario and other provinces:** Thresholds vary by province and by municipal bylaw. Fit For Gov's engagements are designed to fall beneath whatever the applicable threshold is for the specific municipality.

**Practical consequence:** A contract beneath the direct-award threshold does not require an RFP, a competitive evaluation, or a procurement committee process. The municipality's designated signing authority (typically the CAO) can authorize the engagement directly.

**Source:** Public municipal procurement bylaws, provincial procurement acts, industry standard practice.

**Use notes:** The $10,000 figure sometimes referenced in Fit For Gov content reflects a conservative practical ceiling Fit For Gov uses for standard municipal website engagements to ensure comfortable direct-award eligibility, not the threshold itself. When a municipality asks about its specific threshold, the correct answer is "we structure beneath whatever your signing authority is." Do not publish pricing above what the current copy already commits to.

---

### Enhancing Digital Security and Trust Act (EDSTA), Ontario

**Effective date:** January 2025.

**Context:** Ontario's provincial framework for enhancing cybersecurity across public-sector entities, including municipalities.

**Related resource:** Cyber Security Ontario Learning Portal — available to municipalities for cybersecurity education and baseline guidance.

**Sources:**
- Ontario Ministry of Public and Business Service Delivery and Procurement (public statements to Metroland Media, November 2025)

**Use notes:** Reference EDSTA when relevant in Ontario-specific posts. Do not claim Fit For Gov is EDSTA-certified — no such certification exists for website practices. Do reference EDSTA as the provincial regulatory context into which Fit For Gov delivers.

---

## Category E — Technical Architecture Facts

### Dependency Count Comparison

**Fit For Gov typical engagement:** Three production dependencies.

**Typical WordPress municipal site:** Approximately forty-seven to sixty plugins, commonly running outdated versions.

**Architectural implication:** Attack surface reduced from a sprawling plugin ecosystem (with opaque ownership transfers and uncoordinated update schedules) to a small, explicit, git-tracked dependency list.

**Use notes:** These are illustrative rather than universal figures — actual counts vary. Use "approximately" or "typical" when citing. Do not claim that every WordPress municipal site has exactly 47 plugins; the point is the order-of-magnitude difference.

---

### Page Load Performance

**Fit For Gov typical:** Under 0.8 seconds (p75, first contentful paint).

**WordPress typical:** Approximately 3.2 seconds (p75, first contentful paint).

**Architectural reason:** Static generation with edge CDN delivery versus PHP + database + plugin initialization on shared hosting.

**Use notes:** Performance numbers are cited in the brand kit's ledger voice. Variations depend on specific configurations; the order-of-magnitude delta is stable across configurations.

---

### Recovery Mechanics

**Fit For Gov:** Recovery is a git revert followed by atomic redeploy. No database rebuild, no plugin re-installation, no hosting-account recovery. Measured in minutes.

**WordPress:** Recovery typically requires database restore from backup, plugin-by-plugin verification, hosting-account recovery if the account itself is compromised. Measured in hours to days for simple incidents, weeks for complex incidents (see Hamilton).

**Use notes:** This is an architecture comparison, not a Service Level Agreement. Do not publish specific recovery-time commitments in public copy; SLAs live in engagement contracts.

---

## Rules for Adding Facts

New facts enter the library when they become citable in public sources and when Fit For Gov has a clear use for them. The process:

First, a new fact is drafted with the five-element structure used above — the specific claim, the numeric detail if applicable, the source, the date of the source, and use notes describing where and where not to deploy the fact in copy.

Second, the fact is reviewed against the existing library to ensure it is not redundant with an existing entry. Redundant facts are consolidated rather than stacked.

Third, the fact is added to the appropriate category (A–E). New categories require the principal's explicit decision.

Fourth, any narrative strand in `narrative-strands.md` that would benefit from the new fact has its "Source Pointers" section updated to reference the new entry.

Stale facts are archived rather than deleted. A fact is stale when the underlying public record has been superseded by a newer reference, when the incident or assessment it describes has been materially revised, or when its use has become infrequent enough that retention in the active library is not justified. Archived facts live in a section at the bottom of this file (not yet populated as of v1.0).

---

*Fit For Gov Canonical Facts v1.0 · Companion to SKILL.md · April 2026*
