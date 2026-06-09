# Fit For Gov — Narrative System Worked Examples

This file demonstrates the full doctrine deployed end-to-end on real posts. Two examples: one primary-strand post built against a single narrative strand (the SecTor-Validation strand carrying the load, Hamilton-Prior-Knowledge supporting), and one multi-strand post showing how two strands compose inside a single piece without collision.

Both examples are publication-ready as written. The annotations are for Claude's reference — they explain which doctrine elements from `SKILL.md` (positioning rung, promise deployment, signature phrase selection) are active in each paragraph, and why. When Claude is writing a fresh Fit For Gov post from scratch, these annotations are the model for how the system's components compose in practice.

---

## Example 1 — SecTor-Validation Primary, Hamilton-Prior-Knowledge Supporting

### Brief

A LinkedIn company page post for the week of November 24, 2025. The post leads with the Mathieu and Roy SecTor study as a peer-validated assertion that Canadian municipal websites are broadly vulnerable, brings in the Hamilton prior-knowledge detail as the compounding proof that the diagnosis has been known for years without remediation, and closes with the Fit or Forward promise. Audience: Canadian CAOs, CFOs, and municipal IT leads. Target character count: approximately 1,700.

### The Post

```
On November 18, 2025, a five-year study of Canadian federal,
provincial, and municipal government websites was presented at
the SecTor cybersecurity conference in Toronto. The overall
finding: Canadian government websites are broadly vulnerable to
attack, with Ontario municipal sites specifically showing
misconfigurations and exposed user interfaces that could allow a
hacker to gain complete control of the site.

The researchers, Patrick Mathieu and Patrick Roy, named the root
cause directly. Canadian government agencies typically outsource
website construction to third-party suppliers, and those suppliers
typically do not have security expertise. Mathieu, co-founder of
Hackfest, summarized the procurement implication in nine words:
"You have to check everyone in the supply chain."

Two compounding details from the broader reporting. First, the
City of Hamilton was aware of critical weaknesses in its IT
systems three years before the February 2024 ransomware attack
that has now cost the city $18.3 million. The audit findings
were on the record. The remediation was not. Second, the federal
Auditor General reported earlier in 2025 that the federal
government does not maintain a comprehensive, up-to-date inventory
of all government IT assets.

The structural problem has now been named by a five-year peer-
reviewed study, by the Canadian Centre for Cyber Security, by
Hamilton's own post-incident review, and by the Office of the
Auditor General. The diagnosis is not in dispute. Canadian
municipal websites have been built by suppliers without security
expertise, on legacy stacks, with no consistent audit discipline.

Fit For Gov is the alternative. One principal with security
literacy. Static architecture with three production dependencies
rather than sixty. No PHP, no database, no plugin supply chain,
no third-party admin surface. The attack surface is a git
repository. The principal signs every deliverable.

If your municipality is considering a rebuild, call. If what you
actually need is something else, I will tell you on the first
call and connect you with the practice that does it. Fit or
Forward.

Direct line: +1 250 415 5678
jesse@fitforgov.com

#municipalgovernment #cybersecurity #canadiantech
```

### Doctrine Annotation

Paragraph 1 establishes the SecTor study as the factual ground. The post leads with the study rather than with Fit For Gov — this is the positioning rule from SKILL.md Part 1, applied at the level of sentence ordering. The practice brand name will not appear until paragraph five. The reader first encounters the evidence.

Paragraph 2 carries the single direct quote from the source — Mathieu's nine-word "You have to check everyone in the supply chain." Per the canonical-facts library entry on the SecTor study, this is the one permitted verbatim quote per post from this source. The quote is the load-bearing credibility moment of the entire piece; everything before builds to it, and everything after operates downstream of it.

Paragraph 3 introduces the Hamilton-Prior-Knowledge strand in support of the primary strand. The deployment follows the strand-composition pattern documented in `narrative-strands.md` — Hamilton prior-knowledge is the secondary strand, cited in a single paragraph rather than developed across the post. The "audit findings were on the record. The remediation was not." construction is the signature phrasing from the Hamilton strand.

Paragraph 4 is the cumulative-authority paragraph, listing by name the four independent parties that have now named the problem (peer-reviewed study, CCCS, Hamilton's own review, Auditor General). The grammatical construction — "has now been named by A, by B, by C, and by D" — is a loss-framed statement from the persuasion skill's Technique 1: the reader is being shown that the evidence has accumulated to where continued inaction becomes a choice rather than a default.

Paragraph 5 introduces Fit For Gov for the first time. The positioning rung selected is the middle rung — "custom software for Canadian municipalities" is implied through the architectural specifics. The signature phrase "The attack surface is a git repository" appears here. "The principal signs every deliverable" is the second signature phrase, deployed where it does maximum work — immediately after the architectural claims — to signal that the named architectural choices are the principal's personal responsibility.

Paragraph 6 is the Fit or Forward commitment in its conditional form, from the SKILL.md Part 2 phrasing family. The construction respects the reader's autonomy to conclude that a rebuild isn't what they need, and promises the referral path if that's the case. This is the brand promise deployed at its highest-leverage moment — after a long evidence-based body, where trust signals matter most.

The closer is the standard phone-first CTA from the brand kit. The hashtag set is the default `#municipalgovernment #cybersecurity #canadiantech`.

### Self-Check Pass

Every cited fact traces to a canonical-facts entry. The Mathieu quote is attributed and kept within the 15-word ceiling. No municipality is named on speculation. No banned words from the brand kit appear. No fear-adjacent vocabulary from the persuasion skill's threat-brief register appears. The Fit or Forward promise appears in its compressed conditional form. The signature phrases deployed are two — within the one-to-three per post rule. The positioning ladder is active through implication rather than explicit rung-naming, which is appropriate for a post whose primary job is threat validation rather than brand introduction.

The post ships.

---

## Example 2 — Water-Threat Primary, SecTor-Validation Supporting

### Brief

A LinkedIn company page post scheduled for roughly two weeks after Example 1. The post leads with the November 25, 2025 CCCS water-infrastructure assessment, develops the Water-Threat strand's "website is the reconnaissance surface" hinge, and cites the SecTor study as supporting evidence that the municipal public-facing surfaces are in fact weak at the structural level the reconnaissance argument depends on. Audience: same. Target character count: approximately 1,600.

### The Post

```
On November 25, 2025, the Canadian Centre for Cyber Security
published a new assessment of the cyber threat to Canadian water
infrastructure. Three findings are load-bearing.

First: state-backed actors have almost certainly already gained
access to networks operating Canadian water systems and are
maintaining dormant presence for later use.

Second: ransomware is the most significant cyber threat to the
reliable supply of water in Canada.

Third: in October 2025, a municipality's water facility had its
pressure valves tampered with, producing degraded service.

The assessment names reconnaissance, supply-chain intelligence,
and social engineering as the preparation vectors for the attacks
themselves. Each of these operates against the municipality's
public-facing surfaces before it operates against the operational
technology.

A separate study, presented at the SecTor cybersecurity conference
one week earlier, tested Canadian federal, provincial, and
municipal government websites across five years and found them
broadly vulnerable, with Ontario municipal sites specifically
showing exposed user interfaces that could allow an attacker to
gain complete control. The researchers identified the structural
cause as reliance on third-party suppliers without security
expertise.

The two findings compose. The municipal website is the first
surface a threat actor maps when preparing a deeper attack, and
the SecTor study establishes that in Canada that first surface is
typically weak.

The website is the reconnaissance surface.

Fit For Gov builds municipal websites that are not intelligence
products. Static generation, three dependencies, edge CDN, no
PHP, no plugins, no public admin surface. The attack surface is
a git repository.

If your municipality is reassessing its threat posture in the
wake of the November CCCS assessment and a secure public-facing
technology stack is part of that reassessment, call. If a rebuild
is not what you actually need, I will tell you on the first call
and connect you to the team that does what you need. Fit or
Forward.

Direct line: +1 250 415 5678
jesse@fitforgov.com

#municipalgovernment #cybersecurity #canadiantech
```

### Doctrine Annotation

The post opens with the Water-Threat strand's canonical source (CCCS assessment, November 25, 2025). The three-finding enumeration is the strand's standard opening pattern documented in `narrative-strands.md` — each finding isolated as its own short paragraph to maximize scan-readability and to make each fact individually screenshot-able.

The fifth paragraph introduces the SecTor-Validation strand in support. The composition pattern is the one specified in `narrative-strands.md` as "Water-Threat primary, SecTor-Validation supporting": the water strand runs the body, the SecTor study reinforces the municipal-website-specific vulnerability that the reconnaissance argument depends on. Without the SecTor validation, the reconnaissance claim would rest on inference; with the SecTor validation, the claim rests on peer-reviewed measurement.

The seventh paragraph (the one-sentence "The website is the reconnaissance surface") is the signature phrase deployment. Its placement is strategic — after the two strands have been joined and the combined case has been made, the signature phrase arrives as the cumulative conclusion. A CAO screenshotting this post will screenshot that line.

The eighth paragraph deploys Fit For Gov's architectural response. The signature phrase "The attack surface is a git repository" is deployed in immediate adjacency to "The website is the reconnaissance surface" — two signature phrases in a row, framing Fit For Gov's architecture as the literal structural answer to the literal structural problem. This is the permitted two-phrase cluster in a post that supports two signature phrases strategically.

The ninth paragraph is Fit or Forward in conditional form, matching Example 1's closing structure. The closer is standard.

### Self-Check Pass

Every cited fact traces to a canonical-facts entry. No direct quotes are used in this post; the SecTor-Validation strand has no verbatim quotation deployed, which is within-budget. No municipality is named on speculation. The water-threat assessment's "almost certainly already gained access" language is used exactly per the strand's phrasing-family rule. The fear-adjacent vocabulary remains absent. The positioning is implicit through architecture-naming. Signature phrases deployed: two ("The website is the reconnaissance surface" and "The attack surface is a git repository"), which is within the one-to-three rule and which work in demonstrated adjacency rather than scattered across the post.

The post ships.

---

## Composition Patterns Summary

The two examples illustrate the two most common strand-composition patterns the Fit For Gov brand operates with. Example 1 uses Pattern A: a peer-validation strand (SecTor) carrying the load, with a named-incident strand (Hamilton prior-knowledge) as the compounding detail in one paragraph. This pattern works when the post's primary job is establishing that Fit For Gov's architectural thesis is correct. Example 2 uses Pattern B: a threat-environment strand (Water-Threat) carrying the load, with a peer-validation strand (SecTor) providing the bridge from the threat environment to the specific Fit For Gov service domain. This pattern works when the post's primary job is connecting a wider threat story to the specific municipal-websites service lane.

Other composition patterns exist. A single-strand post with no secondary strand is valid when one strand is large enough to carry the post alone — the Water-Threat standalone post in the Narrative System v1.0 Part 6 worked example is one such piece. A Hamilton-Prior-Knowledge primary post with SecTor-Validation supporting is the natural structure for a procurement-oriented post where the audit-remediation frame is the primary message. A three-strand post is generally not recommended — the cognitive load on the reader exceeds what a LinkedIn post can carry without becoming a survey rather than an argument.

When Claude is composing a fresh Fit For Gov post, the first decision is always which strand is carrying the primary load. Most posts for the practice over the coming months will use one of Patterns A or B above. When in doubt, model on Example 1 or Example 2.

---

*Fit For Gov Narrative System Worked Examples v1.0 · Companion to SKILL.md · April 2026*
