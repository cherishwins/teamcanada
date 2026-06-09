# Fit For Gov — Active Narrative Strands

This file expands Part 5 of `SKILL.md`. It contains the three strategic narrative storylines Fit For Gov is currently operating, each written as a deployable frame that Claude can draw on when writing a post, a Dossier, or a pitch. Each strand has five elements: the source (what entered the public record, when, and where), the hinge (the argumentative move that lets a websites practice speak to this story without overclaiming), the phrasing family (the sentences Claude can use or adapt), the do-not rules (the specific overclaims the strand must avoid), and the source pointers (which facts in `canonical-facts.md` are load-bearing for this strand).

New strands may be added only with the principal's explicit decision. Active strands may be retired or archived when the underlying news environment ceases to make them relevant — though the strands below are currently active and expected to remain so through at least mid-2026.

---

## Strand 1 — The Water-Threat Strand

### Source

On November 25, 2025, the Canadian Centre for Cyber Security published a new assessment of the cyber threat to Canadian water infrastructure. The assessment finds that threats are growing, that state-backed actors have almost certainly already gained access to Canadian water infrastructure networks and are maintaining dormant presence for later use, and that ransomware is the most significant cyber threat to the reliable supply of water in Canada. The assessment also documents an October 2025 incident in which a municipality's water facility had its pressure valves tampered with, producing degraded service. Primary reporting ran in the National Post on November 25, 2025, under Christopher Nardi's byline. An earlier October 30, 2025 alert from the Cyber Centre and the RCMP documented additional incidents across water, energy, and agricultural operations, showing the pattern extending beyond water OT into critical-infrastructure ICS generally.

### The Hinge

The strategic insight connecting Fit For Gov's website practice to the water-infrastructure threat environment is that a municipal website is part of the *reconnaissance and social-engineering preparation surface* for the attacks the CCCS is describing. Threat actors preparing a deeper attack on a municipality — whether ransomware operators planning an extortion play or state actors planning a dormant-access operation — do not begin the attack with the attack. They begin it with intelligence gathering. Who is the public works director. Who authorizes operational changes to water treatment. Who is the IT lead. Which vendors provide operational-technology systems. When does council meet. When is the next contract cycle. What is the municipality's procurement structure. Almost every element of this intelligence target list is routinely published on the municipal website.

Once the reconnaissance is complete, social engineering follows. Emails "from the mayor." Invoices "from the vendor." Calls "from the IT team." The credibility of these campaigns is directly supplied by the accuracy of the intelligence, which was supplied by the public-facing surface.

The website is therefore not the target of a water-OT attack — it is a *precursor surface.* This is not a claim that a WordPress website causes a water-system hack, which would be overclaiming and would read as ambulance-chasing. It is a claim, defensible and evidence-based, that the public-facing municipal technology posture is part of a municipality's overall signalling, and that signal is part of what threat actors use to select and prepare their targets. The CCCS itself names supply-chain intelligence as one of the principal vectors, and municipal websites are where supply chains are most often publicly documented.

### The Phrasing Family

The canonical phrases for this strand:

*The website is the reconnaissance surface.*

*The public-facing municipal technology posture is part of the municipality's overall signalling. That signal is read.*

*Before the water attack is the intelligence gathering. Before the intelligence gathering is the website.*

*A municipality with forty-seven outdated plugins on shared hosting is advertising something it does not mean to advertise.*

*State actors have almost certainly already gained access to Canadian water-infrastructure networks and are maintaining dormant presence. This is the CCCS's assessment, not an inference.*

### Do-Not Rules

Do not assert that Fit For Gov secures water infrastructure. Do not assert that a municipality with a clean website is safe from water-OT attack. Do not assert that specific threat actors have targeted specific municipalities unless the municipality or CCCS has publicly stated so. Do not use this strand to manufacture urgency in individual sales conversations — the story is a public-interest frame, not a closing tool. Do not name the specific municipality whose pressure valves were tampered with; the CCCS report does not name it and speculation is off-limits.

### Source Pointers in `canonical-facts.md`

CCCS water-infrastructure threat assessment of November 25, 2025. CCCS/RCMP alert of October 30, 2025 on ICS compromises across water, energy, and agricultural sectors. National Post reporting, November 25, 2025.

---

## Strand 2 — The SecTor-Validation Strand

### Source

On November 18, 2025, Patrick Mathieu (co-founder of Hackfest) and Patrick Roy presented the results of a five-year study of Canadian federal, provincial, and municipal government websites at the SecTor cybersecurity conference in Toronto. Canada's largest cybersecurity conference. The study tested public-facing government sites across every level of government and found them broadly vulnerable, with Ontario municipal sites specifically showing misconfigurations and exposed user interfaces that could allow an attacker to gain complete control of the site. The researchers named the root cause directly: Canadian government agencies typically outsource website construction to third-party suppliers, and those suppliers typically do not have security expertise. Mathieu summarized the procurement implication: you have to check everyone in the supply chain. Reporting ran in Insidehalton and across Metroland Media on November 18, 2025, under Loraine Centeno's byline.

### The Hinge

The SecTor study is the single strongest piece of independent validation the Fit For Gov thesis has ever received. The strategic move is not to treat the study as a generic "cybersecurity is bad" story — it is to treat the study as specifically a *validation of the Fit For Gov architecture and business model.* The study identifies, as the root cause of widespread Canadian municipal website vulnerability, the exact operational pattern Fit For Gov is structured to break: external suppliers without security expertise, legacy stacks, absent audit discipline, uncoordinated supply chains. Fit For Gov is a single-principal practice with security literacy, building static-generated architecture with three production dependencies and an auditable git-history of every change. The study's diagnosis is Fit For Gov's business plan, stated by someone who has never heard of Fit For Gov.

The argumentative move that makes this a strand rather than a one-time post is that the SecTor findings now serve as the standing external reference the Fit For Gov voice can cite whenever the question "why is this even a problem?" is in play. The study has a name, a date, a venue, a methodology, two named researchers, and a specific quote from one of them. These five elements give any Fit For Gov post referencing it the weight of peer review without requiring the brand to have commissioned anything.

### The Phrasing Family

The canonical phrases for this strand:

*In a five-year peer-presented study of Canadian government websites, the researchers found them broadly vulnerable and named the cause: suppliers without security expertise.*

*"You have to check everyone in the supply chain." Patrick Mathieu, Hackfest, SecTor 2025.*

*The Fit For Gov thesis has now been stated by independent researchers who have never heard of Fit For Gov.*

*The diagnosis is on the record. The remediation is structural — a different kind of practice, building a different kind of software.*

*This is what a civic-technology practice looks like when the supplier is part of the security posture, not part of the attack surface.*

### Do-Not Rules

Do not attribute claims to Patrick Mathieu or Patrick Roy that are not in the public reporting. The direct Mathieu quote ("You have to check everyone in the supply chain") may be used once per post under the quotation rules, and no additional verbatim quotations from the researchers should be used in the same post. Do not imply that the study named Fit For Gov — it did not. Do not imply that the researchers endorsed Fit For Gov — they did not, and they likely have not heard of it. The strand leverages the study's *independent* existence; claiming any direct connection between the research and Fit For Gov would undermine that leverage.

### Source Pointers in `canonical-facts.md`

SecTor Cybersecurity Conference 2025, Toronto, November 18, 2025. Mathieu and Roy study findings on Canadian government websites. Insidehalton article of November 18, 2025 (Loraine Centeno, Metroland Media). Office of the Auditor General of Canada findings on federal IT asset inventory gaps. Enhancing Digital Security and Trust Act (EDSTA), Ontario, in effect January 2025.

---

## Strand 3 — The Hamilton-Prior-Knowledge Strand

### Source

The City of Hamilton suffered a ransomware attack beginning February 25, 2024, which has cost the city $18.3 million CAD in recovery through June 30, 2025. The ransom demand, refused, was $18.5 million. The city's cyber insurance claim was denied by the insurer in April 2025 on the grounds that multi-factor authentication was not fully implemented at the time of the breach. A subsequent audit finding, surfaced in reporting tied to the November 2025 SecTor coverage, established that the City of Hamilton had been aware of critical weaknesses in its IT cybersecurity posture for approximately three years before the February 2024 attack, and did not action the remediation. The Hamilton incident is now the single most complete worst-case in Canadian municipal cybersecurity: a known vulnerability, an unactioned audit, a refused ransom, a denied insurance claim, and a recovery bill that is still growing.

### The Hinge

Hamilton has been cited twenty times in every Canadian municipal cybersecurity pitch since 2024, and most CAOs have developed partial immunity to it. The "Hamilton is just bad luck" rationalization is a frequent mental exit. The prior-knowledge detail closes that exit. A vulnerability that was known for three years and not remediated is not bad luck. It is an unaddressed audit finding, which is a category of risk every municipality has on its own books.

The strategic move for Fit For Gov is to use the prior-knowledge detail to reframe Hamilton from "a cautionary tale about a city that got hit" to "a cautionary tale about what happens when audit findings aren't actioned." This reframe is not a fear appeal — it is a governance question. Every municipality has audits. Every audit produces recommendations. Every recommendation produces a remediation plan. The gap between plan and execution is where breaches live. Fit For Gov's positioning, at this angle, is that a website rebuild on auditable static architecture closes a specific category of long-standing audit findings — plugin sprawl, legacy hosting, third-party supplier accountability — in a single procurement cycle that sits under the direct-award threshold.

This strand is most effective in procurement-oriented posts (Type 3 Procurement Note per the brand kit), because it converts a threat story into an audit-remediation story, which is the register CAOs engage with professionally rather than emotionally.

### The Phrasing Family

The canonical phrases for this strand:

*The City of Hamilton knew. They knew for three years. The audit was on the record.*

*Hamilton's $18.3 million is not a bad-luck story. It is an unaddressed-audit-findings story.*

*Every municipality has audits. Every audit produces recommendations. Every recommendation produces a remediation schedule. The gap between recommendation and remediation is where breaches live.*

*The question that matters is not "will this happen to us?" It is "what is in our own audit that has not been actioned, and why?"*

*A rebuild on auditable static architecture closes a specific category of long-standing audit findings in one procurement cycle, under the direct-award threshold.*

### Do-Not Rules

Do not claim knowledge of any specific unaddressed audit findings at any municipality other than Hamilton. Do not name other municipalities as examples of the same pattern. Do not speculate about what Hamilton's specific audit findings were beyond what is publicly documented. Do not frame the strand as "your audits are ticking time bombs" — the strand is a procurement-governance question, not a fear appeal. Do not imply that Fit For Gov has seen any municipality's audits; the brand has not, and the claim would be false.

### Source Pointers in `canonical-facts.md`

City of Hamilton Cybersecurity Incident Summary, July 30, 2025 (CM25008). Hamilton ransomware timeline February 25, 2024. Hamilton recovery cost of $18.3M CAD as of June 30, 2025. Hamilton insurance claim denial, April 2025. Hamilton prior-knowledge audit finding, surfaced in reporting around the November 2025 SecTor coverage.

---

## Composing Strands Across a Post

In most posts, one strand is the primary frame and, optionally, a second strand provides supporting context in a single paragraph or sentence. A post that tries to deploy all three strands is a post that has become a survey rather than an argument.

The typical compositions:

**Water-Threat primary, SecTor-Validation supporting.** A post leading with the CCCS water-infrastructure assessment, citing the SecTor study in one paragraph as additional confirmation that Canadian municipal posture is documented-weak. The Water-Threat hinge runs the body; the SecTor study reinforces the municipal-website-specific vulnerability.

**SecTor-Validation primary, Hamilton-Prior-Knowledge supporting.** A post leading with the Mathieu and Roy findings, citing Hamilton's three-year prior knowledge as the compounding detail that proves the diagnosis was known before the consequences landed. This is the structure of Post A in the pipeline brief.

**Hamilton-Prior-Knowledge primary, SecTor-Validation supporting.** A procurement-oriented post leading with the Hamilton audit story, citing the SecTor study as evidence that the pattern Hamilton exemplifies is general rather than particular. This is a good standalone post design.

**Water-Threat standalone.** When the critical-infrastructure story is large enough to carry a post on its own, a second strand is not required. The water-threat post deployed as Part 6 of the Narrative System v1.0 document uses only this strand.

The strands are designed to interlock without requiring reinforcement. Claude should pick the primary strand for a piece based on which fact-pattern the piece is built around, then decide whether a second strand adds load or just noise.

---

## Strand Retirement and New Strand Admission

A strand is retired when the news environment that supports it moves past relevance — e.g., a particular CVE ceasing to be actively exploited, a study's findings being superseded by a newer study, a named incident's coverage cycle closing. Retirement is a deliberate editorial decision by the principal. Retired strands are archived in a section at the bottom of this file (not yet populated as of v1.0).

A new strand is admitted when a public event or document of sufficient strategic weight enters the record that cannot be folded into an existing strand. New-strand admission requires the principal's explicit decision and typically begins with a drafted strand specification following the five-element template used above. Do not improvise new strands inside individual posts.

---

*Fit For Gov Narrative Strands v1.0 · Companion to SKILL.md · April 2026*
