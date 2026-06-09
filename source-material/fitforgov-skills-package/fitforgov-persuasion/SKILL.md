---
name: fitforgov-persuasion
description: "Persuasion and conversion psychology for Fit For Gov sales content — LinkedIn posts, Dossier openings, RFP cover letters, outreach emails. Codifies loss-aversion framing, reference anchoring, specificity bias, peer-incident proof, cost inversion, and low-friction commitment pathways for the Fit For Gov brand voice. Triggers on 'make this post convert', 'more persuasive', 'stronger hook', 'sales copy', 'loss aversion', 'prospect theory', 'conversion', 'rewrite this to sell', 'make them call', 'close rate', or any request to make Fit For Gov copy more effective at generating inbound calls. Also triggers for net-new Fit For Gov LinkedIn posts or outreach that need to drive a phone call rather than just inform. Use ALONGSIDE fitforgov-brand-kit — never instead of it. The brand kit governs voice and visual identity; this skill governs how words move the reader. NOT for Cherish/VI Care, 주체강, Ibrahim Energy, or iPurpose sales content."
---

# Fit For Gov — Persuasion & Conversion Skill

The brand kit tells Claude what a Fit For Gov surface *looks and sounds like*. This skill tells Claude what a Fit For Gov surface *does to the reader*. Both are required. This skill is composed on top of `fitforgov-brand-kit` v2.0 — it assumes the Dossier voice, phone-first closer, banned-words list, and four-type LinkedIn post family are already in force. Nothing in this skill overrides the brand kit. Everything in this skill makes what the brand kit produces more effective at generating inbound calls.

**Read this file completely before producing persuasion-oriented content. For rewriting patterns (before/after transformations), read `references/rewriting-patterns.md`. For two fully-worked example posts showing every technique applied end-to-end, read `references/worked-examples.md`.**

---

## The Foundation — Prospect Theory in One Paragraph

Daniel Kahneman and Amos Tversky's 1979 paper on Prospect Theory established that humans do not evaluate outcomes on a symmetric utility curve. A loss of $100 registers with roughly twice the emotional weight of a $100 gain. The implication for persuasion is structural: the same underlying fact framed as an avoided loss will typically produce a stronger behavioural response than the same fact framed as a secured gain. A message that reads "Avoid a $18.3M ransomware recovery" will move a CAO more reliably than one that reads "Invest in modern infrastructure." This is not a rhetorical trick — it is a description of how the median human brain processes options under uncertainty. The original paper is Kahneman & Tversky, "Prospect Theory: An Analysis of Decision Under Risk," *Econometrica*, 1979. Kahneman's 2002 Nobel Prize in Economics was partly for this work.

The practical consequence for Fit For Gov is that the same technical material — the same CVEs, the same incident timelines, the same cost figures — should be framed around what the reader stands to lose by inaction rather than what they stand to gain by engagement. This is not a change in the facts. It is a change in the grammar of the conclusion.

---

## The Ethical Perimeter (Read This First)

This section is non-negotiable. It exists because loss aversion is a powerful enough mechanism that its misuse degrades the field, degrades the Fit For Gov brand specifically, and — most importantly — fails at the specific task of persuading sophisticated municipal administrators. The following rules are both ethical *and* strategic: breaking them produces both worse behaviour and worse conversion.

**Every loss cited must be real, documented, and proportionate to the frame.** If a post invokes the Hamilton ransomware incident, the figures must match the City of Hamilton's own public reporting: $18.3M recovery cost through June 30, 2025, $18.5M ransom demand refused, claim denied by insurer in April 2025 citing missing MFA. A Fit For Gov post may not round these up, conflate them with other incidents, or apply Hamilton-scale numbers to speculative scenarios at smaller municipalities. The anchor must match the reality.

**Every urgency claim must reflect a real temporal constraint.** Legitimate urgency frames include: an active CVE with a known activation date, an insurance renewal window, an upcoming budget vote, a vendor contract expiry, a regulatory deadline, the publication of a new federal cybersecurity directive. Illegitimate urgency frames include: "only three spots left this month," "limited-time pricing," countdown timers on landing pages, or any scarcity claim that cannot be independently verified. If Claude is ever writing a post that asserts a deadline, Claude must be able to point to the specific external event creating it. If no such event exists, the deadline does not exist, and the post does not claim one.

**Every relative-risk framing must be proportionate.** A Fit For Gov post may cite the CCCS assessment that ransomware is the top cybercrime threat to Canadian critical infrastructure, because that is what the assessment says. A Fit For Gov post may not assert that a specific municipality is "likely" to be attacked, or that an attack is "imminent," or that readers are "a target" — because these are speculative individualizations of a population-level risk. The distinction matters: "ransomware is a systemic risk to municipalities and these are the documented incidents" is accurate and persuasive. "You will be hit next" is speculative and evasive of evidence.

**Peer-incident framing names only what is public.** Named case studies — Hamilton, Yellowknife, any other municipality — may be cited only from their own public disclosures or from established news reporting. Fit For Gov may not imply knowledge of confidential incidents, active investigations, or unreported breaches, even if such knowledge exists.

**The reader must leave the post with accurate information even if they never buy.** This is the single most important rule. A legitimate Fit For Gov post is one that, if a CAO reads it and decides Fit For Gov is not for them, still leaves the CAO better informed about their threat environment. If removing the sales frame would render the post empty of useful information, the post is propaganda, not marketing, and it does not ship.

---

## The Six Techniques

Every persuasion-oriented Fit For Gov piece draws on some combination of six techniques. Not every post uses all six — in fact, the best posts typically use two or three, deployed precisely. The techniques are listed here in approximate order of load-bearing weight for this audience.

### Technique 1 — Loss Framing (Primary)

The default grammatical orientation of every Fit For Gov sales post is that inaction is the risky choice. The reader is not being asked to *do* something new (which feels additive and therefore defensible). The reader is being shown what continuing to *not do* something costs (which feels subtractive and therefore urgent). This is not accomplished by adding fear-vocabulary — the brand kit forbids that — but by inverting the grammatical subject of the sentence.

A gain-framed sentence: "Fit For Gov websites are more secure than WordPress." A loss-framed sentence: "A WordPress website is the attack surface you've agreed to maintain." Same technical claim. Different emotional valence. The second sentence asks the reader to recognize that they are *already* bearing a cost, which makes the alternative feel like *removing* a burden rather than *adding* a purchase. Every persuasion post should be screened for this inversion.

### Technique 2 — Reference Anchoring

The Hamilton $18.3M figure is the single most powerful reference anchor in Canadian municipal cybersecurity. Anchoring is a second well-established finding from the same behavioural literature (Tversky & Kahneman, *Science*, 1974): humans use the first number they encounter as the reference point against which subsequent numbers are evaluated. A Fit For Gov price of $10,000 feels expensive in isolation. The same $10,000 feels trivial after the reader has just processed "$18.3M."

Anchoring works best when the two numbers are presented close together in the reader's cognitive flow — not in separate paragraphs and certainly not in separate posts. The most potent Fit For Gov anchoring sentence is the direct ratio statement: "Hamilton's 2024 ransomware recovery has cost $18.3 million to date. A Fit For Gov municipal website falls under the $10,000 direct-award threshold. The cost ratio is 1,830 to 1." This is a legitimate anchoring frame because both figures are real and the comparison is structurally honest — one is the cost of prevention and the other is the cost of recovery, which is precisely the comparison a municipal CFO needs to make.

### Technique 3 — Specificity Bias

Humans trust specific numbers more than round numbers, and round numbers more than qualitative claims. "Twenty thousand sites compromised" is more persuasive than "thousands of sites compromised." "Six hours and forty-four minutes" is more persuasive than "several hours." "$18.3 million" is more persuasive than "eighteen million." "191 additional lines of PHP" is more persuasive than "hundreds of lines."

The brand kit already enforces specific-number discipline in the voice section, but the persuasion application is stricter: *every* sales claim should include a specific number if a specific number exists in the source material. Round numbers are permitted only when the source itself is round (e.g., "over 800,000 installations" is acceptable because the source figure is "800,000+"). The heuristic: Claude should never be the one doing the rounding.

### Technique 4 — Peer-Incident Proof

Social proof in B2B cybersecurity is not about testimonials. It is about peer incidents. A municipal CAO is not moved by "our customers love us" — they are moved by "here is what happened to a municipality like yours." Canadian incidents are more potent than American or European incidents because the regulatory environment, procurement culture, and population size map more closely.

The canonical peer incidents to reference, in order of persuasive weight for Canadian municipal audiences: Hamilton (February 2024, $18.3M), Yellowknife (September 2025), and the CCCS National Cyber Threat Assessment's standing finding that ransomware is the top Canadian critical-infrastructure cybercrime threat. Each of these is cited exclusively from public sources. American incidents (Atlanta, Baltimore, New Orleans, etc.) may be referenced but are supplementary — a Canadian reader always weights Canadian incidents more heavily.

### Technique 5 — Cost Inversion

Cost inversion is the explicit juxtaposition of the cost of the problem against the cost of the remediation, presented as a single cognitive unit. The Fit For Gov version is structurally as follows: the ransomware incident ($18.3M) is the cost of the problem; the Fit For Gov engagement (under $10,000, direct-award threshold) is the cost of the remediation; the ratio (1,830×) is the quantitative conclusion. This is a legitimate loss-aversion frame because the municipality is, at the moment of reading, bearing the full exposure of the problem without having paid for the remediation.

A well-constructed cost-inversion sentence does not require the reader to do the math. Claude should do the math in the post, present the ratio as a single figure, and caption it. "The cost ratio between a Fit For Gov engagement and Hamilton's ransomware recovery is 1,830 to 1" is a sentence a CFO understands on first read. Asking the CFO to compute it themselves diffuses the effect.

### Technique 6 — Low-Friction Commitment Pathway

The final technique is behavioural rather than rhetorical: the call-to-action in every Fit For Gov post must be as low-commitment as possible, because the foot-in-the-door effect (Freedman & Fraser, 1966) is well-established. The Fit For Gov brand kit already specifies the answer: the phone call. A phone call is lower commitment than a discovery meeting, which is lower commitment than an RFP response, which is lower commitment than a signed engagement.

The persuasion implication is that the call-to-action must make the phone call feel like the smallest possible next step. Phrasings that inflate the commitment are forbidden: "book a strategy session," "schedule a 30-minute consultation," "let's explore your needs" all make the phone call feel larger than it is. The preferred phrasing is the plainest possible: "Call. I answer." or "Direct line: +1 250 415 5678." The phone number, unadorned, is the most persuasive CTA available to the brand because it implies the principal will answer — which is, by the brand's own commitments, exactly what happens.

---

## Integration With the Brand Kit

This skill extends the brand kit. It does not replace any rule. Specifically, the following v2.0 constraints remain in force for every persuasion-oriented post:

The banned-words list (revolutionary, cutting-edge, leverage, robust, seamless, scalable, etc.) still applies. Persuasion techniques do not license promotional adjectives. The phone-first closer still applies: every post ends with `+1 250 415 5678` and `jesse@fitforgov.com`. No exceptions. The four post types (Incident Note, Ledger Post, Procurement Note, Dossier Release) remain the structural templates; this skill adjusts the *framing* within each type, not the structure. The threat-brief register's prohibition on fear-adjacent vocabulary (terrifying, alarming, shocking, nightmare, worst-case, disaster) remains absolute — loss-aversion framing is achieved through grammatical inversion and cited evidence, not through emotional escalation.

The explicit rule: **persuasion techniques operate below the surface of the sentence, never above it.** A reader should not be able to identify that a post is "using loss aversion on them." If the technique is visible, it has failed.

---

## Application to the Four Post Types

The six techniques combine differently across the four post types defined in the brand kit. This table is the decision matrix Claude uses when applying the skill.

| Post Type | Primary Technique | Secondary Techniques | Cost Inversion? | Typical CTA |
|-----------|-------------------|----------------------|-----------------|-------------|
| Incident Note (Type 1) | Peer-incident proof | Specificity, anchoring | Optional | "Direct line: +X" |
| Ledger Post (Type 2) | Anchoring | Specificity, cost inversion | Strongly yes | "If this fits, call." |
| Procurement Note (Type 3) | Loss framing | Commitment pathway | No | "Signed today. +X" |
| Dossier Release (Type 4) | Loss framing | Anchoring, peer-incident | Optional | Phone + Dossier URL |

**Incident Notes** are the natural home of peer-incident proof because their job is to tell the reader what happened to someone else. The persuasion layer is in the closing procurement note — the sentence that asks the reader to recognize they bear the same exposure. Never state "you will be hit next." Instead, ask the procurement-translation question: "The question to put to your current website vendor today is..."

**Ledger Posts** are the natural home of anchoring and cost inversion because their job is to present numbers in juxtaposition. The loss-aversion layer is in the row ordering — highest-asymmetry row first. A ledger that leads with the attack-surface comparison (47 plugins vs. 3 dependencies) does less work than one that leads with the recovery-cost comparison ($18.3M vs. $10,000).

**Procurement Notes** are the natural home of loss framing because procurement is fundamentally about what happens if you don't move. The loss to frame is not the breach — it is the *procurement delay cost*. Every month a municipality stays on WordPress while it prepares an RFP is a month of continued exposure. The loss-aversion sentence is: "An RFP cycle takes ninety days. The direct-award path takes thirty. The difference is sixty days of additional exposure on the current stack." This converts a procurement discussion into a temporal risk discussion.

**Dossier Releases** are the natural home of the full stack: the Dossier itself is the evidence, the release post is the invitation to engage with the evidence. The loss-aversion frame is that the Dossier contains information the reader needs, and not reading it is a choice to remain under-informed. The phrasing is: "Dossier №02 is live. It covers the incident that cost $18.3M and the insurance denial that followed it. The details are in the Dossier."

---

## The Pre-Publish Self-Check

Before any persuasion-oriented Fit For Gov post ships, Claude runs the following six-question screen. Any "no" answer sends the post back for revision. Any "uncertain" answer requires a source check.

**1. Is every cited loss figure traceable to a named public source?** If the post asserts "$18.3M," can Claude cite the City of Hamilton report or a major news outlet reporting that figure? If the post asserts "800,000+ installations," can Claude cite the Next Web or Smart Slider's own disclosure?

**2. Is every urgency claim tied to a real external event?** If the post says "this is the window to act," what is the specific event defining the window?

**3. Does the post name any municipality based on non-public information?** It must not.

**4. Would removing the phone-call CTA leave the post informative on its own?** The body of the post should pass the standalone-informative test.

**5. Are there any banned words from the brand kit?** Run the list. One banned word kills the post.

**6. Is there any fear-adjacent vocabulary from the threat-brief register?** "Terrifying," "alarming," "shocking," "nightmare," "worst-case," "disaster" — if any of these appear, rewrite.

---

## What NOT to Do (Explicit Prohibitions)

Many of these overlap with the Ethical Perimeter above. They are restated here as a flat prohibition list because the explicit form is easier to scan during drafting.

Do not invent or round loss figures. Do not assert breach probabilities for specific municipalities. Do not imply foreknowledge of confidential incidents. Do not use countdown timers, fake-scarcity language ("only N spots left"), or manufactured-urgency phrasings ("act in the next 24 hours") unless tied to a real external deadline. Do not use testimonial-style framing ("one of our customers said..."). Do not invent case studies. Do not use fear-adjacent vocabulary. Do not name competitors. Do not name current or prospective clients without their explicit public authorization. Do not make accessibility, compliance, or security *certifications* claims that lack supporting audit evidence. Do not invite the reader to "imagine" a breach scenario — anchor on real ones. Do not use the word "risk" as a noun more than once per post (it diffuses into abstraction; specific incidents are more potent).

---

## Working With Claude on Persuasion Rewrites

When a user asks Claude to "make this post more persuasive" or "increase the conversion strength" of an existing Fit For Gov post, Claude runs the following sequence. First, identify which of the six techniques the current post already deploys. Second, identify which techniques are missing that the post type (per the table above) would naturally admit. Third, rewrite only the sentences that implement the missing techniques — not the entire post. Fourth, run the pre-publish self-check on the revision.

The bias should always be toward *less* change rather than more. A persuasion rewrite that touches 80% of the original sentences has probably discarded good copy. A persuasion rewrite that touches two sentences and adds one ledger row has probably done the right work.

For concrete before/after examples of this process, read `references/rewriting-patterns.md`. For two complete worked examples — a fresh post built end-to-end and a re-write of an underperforming post — read `references/worked-examples.md`.

---

## A Note on the Price Delta

The explicit comparison Jesse has authorized for this brand is: the Fit For Gov engagement costs significantly less than any comparable agency and dramatically less than a ransomware incident. The dramatic-less claim is defensible because the $10,000 direct-award ceiling against the $18.3M Hamilton anchor produces a verifiable 1,830-to-1 ratio. This ratio may be used directly in copy. The "significantly less than competitors" claim is defensible in general terms but should not name specific competitor pricing without a public source, because competitive pricing is frequently negotiated and vendor-specific.

The price delta is itself a loss-aversion argument: the municipality is, at the moment of reading, already exposed to the full $18.3M-equivalent risk. The Fit For Gov engagement removes that exposure at less than 1% of the incident cost. The most potent single-sentence articulation of the Fit For Gov value proposition is: "The cost of not fixing this is 1,830 times the cost of fixing it."

That sentence may appear in copy. It should not appear in every post, because overuse would dilute it. Treat it as a rhetorical ace — play it sparingly.

---

*Fit For Gov · Persuasion & Conversion Skill v1.0 · April 2026*
*Composed over fitforgov-brand-kit v2.0. Read this file first, then consult the two references files for rewriting patterns and worked examples. Always run the pre-publish self-check before shipping.*
