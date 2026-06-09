# Fit For Gov — Persuasion Worked Examples

This file contains two complete end-to-end examples that demonstrate the six techniques from `SKILL.md` working in combination rather than in isolation. Read this file when drafting fresh Fit For Gov sales content or when a before/after in `rewriting-patterns.md` does not map cleanly to the task at hand. Each example is presented in four sections: the brief, the draft, the annotation of which techniques were used where, and the self-check confirmation.

---

## Worked Example 1 — Fresh Post, Built End to End

### The Brief

A LinkedIn Type 1 Incident Note for the Fit For Gov company page, scheduled to ship Wednesday of Week 2 in the launch calendar. The topic is the September 2025 Yellowknife municipal network incident — a ransomware event that has not yet been the subject of a Fit For Gov Dossier. The post should educate the audience, anchor on the Hamilton $18.3M reference (the strongest available Canadian anchor), and close with the phone number. Target character count: 1,200–1,400. The reader is a Canadian municipal CAO or CFO. The goal is one inbound phone call from the resulting post.

### The Finished Post

```
On September 11, 2025, the City of Yellowknife disconnected its
municipal network from the internet in response to a suspected
ransomware incident. Staff were instructed to change credentials.
Preliminary investigation reported no confirmed data compromise at
the time, but the city took its network offline as a precaution.

For context: Hamilton's 2024 ransomware recovery has cost $18.3
million CAD as of June 30, 2025. The ransom demand, refused, was
$18.5 million. The insurer denied the claim in April 2025 on the
grounds that multi-factor authentication was not fully implemented
at the time of the breach. The Canadian Centre for Cyber Security
identifies ransomware as the top cybercrime threat to Canadian
critical infrastructure in its 2025–2026 National Cyber Threat
Assessment.

Yellowknife took its network offline on day one. Hamilton's recovery
is still in progress twenty-two months later.

The question a CAO should ask their current website vendor today
is a simple one: if our site is compromised tomorrow, who is on the
call at 3 a.m., what is our rebuild timeline measured in days, and
what does our cyber insurance policy say about multi-factor
authentication on public-facing infrastructure.

If the answers are not ready, the question is answering itself.

Direct line: +1 250 415 5678
jesse@fitforgov.com

#municipalgovernment #cybersecurity #canadiantech
```

Character count: approximately 1,380, inside the target band.

### The Annotation — Which Techniques Were Used Where

**Paragraph 1 (Yellowknife lede)** deploys Technique 4 (peer-incident proof) in its cleanest form. The facts are stated without editorial framing. Dates are specific. The actions taken by the city are described without speculation about their rationale. This paragraph carries no loss-aversion framing yet — it is establishing the foundation on which the subsequent framing operates.

**Paragraph 2 (Hamilton anchor)** deploys Techniques 2, 3, and 4 in combination. The anchor is established ($18.3M, $18.5M, 2025 denial). The specificity is maintained throughout (exact figures, exact dates, named report). A second peer incident is established (Hamilton) to pair with the opening Yellowknife reference, and the CCCS assessment provides institutional validation. Notice that the paragraph contains no fear-vocabulary — no "devastating," no "catastrophic." The numbers do the work.

**Paragraph 3 (the temporal contrast)** deploys Technique 1 (loss framing) via grammatical construction. "Yellowknife took its network offline on day one. Hamilton's recovery is still in progress twenty-two months later." This is a loss-framed sentence because it asks the reader to recognize that recovery timelines compound. The cost of an incident is not the day-one cost; it is the twenty-two-month cost. A municipality that has not thought about this has underestimated its exposure.

**Paragraph 4 (the vendor question)** deploys Technique 1 again, but in its most potent form — the question form. Rather than asserting that the reader has a problem, the paragraph gives the reader a diagnostic question to ask *someone else* (their current vendor). This is subtle but important: the loss-aversion subject becomes the vendor, not the reader. The reader is positioned as the auditor, which is a more comfortable role than the mark. The three sub-questions (3 a.m. response, rebuild timeline, MFA and insurance) each encode a specific failure mode from the Hamilton incident — this is the Hamilton story translated into procurement due diligence.

**The single-sentence fifth paragraph** is the rhetorical close. "If the answers are not ready, the question is answering itself." This is Technique 1 at its most compact — it implies a loss (the vendor cannot answer) without stating one, and the reader's own mind completes the inference. Sentences that let the reader finish the thought are more persuasive than sentences that finish the thought for them.

**The closer** is Technique 6 (low-friction commitment). "Direct line" is the minimum possible framing. Three words. No "book a consultation." No "schedule a discovery call." The phone number is the interface.

**What was deliberately not deployed.** Technique 5 (explicit cost inversion) was not used because the post already carries two peer-incident anchors and adding a Fit For Gov price comparison would shift the reading from "threat briefing" to "pitch." The persuasion payload is stronger when the Fit For Gov price is absent — the reader arrives at the call with curiosity about the price rather than resistance to it.

### The Self-Check

Running the six-question screen from `SKILL.md`:

1. Every cited loss figure is traceable — Yellowknife from Secur-IT Toronto reporting, Hamilton from the city's own news release and CP24, the CCCS assessment from the Government of Canada website. ✓
2. Every urgency claim is tied to a real external event — there is no urgency claim in this post beyond the inference from the peer-incident data, which is itself factual. ✓
3. No municipality is named based on non-public information — Yellowknife's incident was publicly disclosed by the city itself, Hamilton's has been the subject of four public reports, the CCCS assessment is published. ✓
4. Removing the CTA leaves the post informative — a CAO who reads this post and never calls is still better-prepared to evaluate their current vendor. ✓
5. No banned words from the brand kit appear. ✓
6. No fear-adjacent vocabulary from the threat-brief register appears. ✓

The post ships.

---

## Worked Example 2 — Rewriting an Underperforming Post

### The Brief

An existing Fit For Gov draft post (below) is underperforming in user review. The subject is correct and the facts are right, but the post reads as either too flat or too pitch-y, and the rewriter has been asked to apply persuasion techniques without changing the underlying content. The task is not to write a new post — it is to keep the facts and improve the framing.

### The Original Draft (Before)

```
Hi everyone, exciting news about Fit For Gov!

We're thrilled to announce that we build custom municipal websites
using modern technology like Next.js, which is way more secure than
WordPress. WordPress has had some serious issues lately with
plugins being hacked, and a lot of municipalities could be at risk.

Our websites are priced affordably, and we believe every Canadian
municipality deserves a secure web presence. If you're interested
in learning more about how we can help your municipality stay
safe online, please book a free discovery call with us!

#innovation #cybersecurity #websites #smallbusiness
```

### The Diagnosis — What's Wrong

This post fails on almost every axis defined by the brand kit and this skill. The opening "Hi everyone, exciting news" violates the Dossier voice opener rule. "Thrilled to announce" is a banned phrase equivalent. "Way more secure" is a gain-frame rather than a loss-frame. "Serious issues lately" is the opposite of specificity — no dates, no CVE, no named incident. "A lot of municipalities could be at risk" is exactly the speculative risk individualization that the ethical perimeter forbids. "Affordably priced" is a vague claim without an anchor. "Book a free discovery call" violates the commitment-pathway rule (too much friction, too much framing, "discovery call" inflates commitment). "Every Canadian municipality deserves" is promotional generality. The hashtags are off-brand (#innovation is a banned-words adjacent, #smallbusiness frames the practice as a small business rather than a civic-tech practice).

The post deploys zero of the six techniques. It is a standard LinkedIn promotional post with the subject happening to be Fit For Gov. The rewrite's job is to preserve the underlying topic (Fit For Gov exists, WordPress has had supply-chain issues, we're an alternative) while rebuilding the scaffolding.

### The Rewritten Post (After)

```
On April 5 and 6, 2026, thirty-one WordPress plugins activated
backdoors that had been dormant in their update stream since August
2025. The activation window lasted six hours and forty-four minutes.
Roughly 20,000 sites were compromised.

WordPress has no mechanism to review plugin ownership transfers or
require code signing for updates. When an attacker buys legitimate
software on the open market — as happened with the Essential Plugin
portfolio, acquired for a six-figure sum and weaponized — the
ecosystem's trust model delivers the compromise on the attacker's
behalf.

Fit For Gov builds on Next.js, deployed to an edge CDN. No PHP. No
database. No plugins. The attack surface is a Git repository. The
dependency list is three packages, not sixty. The practice is
scoped beneath the direct-award threshold and signed under the
CAO's own authority — no RFP required.

For a CAO whose website runs WordPress, the first question to put
to the current vendor today is: which of your thirty-one recently
closed plugins are installed on our production site, and when was
our environment last forensically audited.

Direct line: +1 250 415 5678
jesse@fitforgov.com

#municipalgovernment #cybersecurity #canadiantech
```

Character count: approximately 1,300.

### The Annotation — What Changed

**The opening inverted completely.** The original opened with the company ("We're thrilled"). The rewrite opens with the threat ("On April 5 and 6, 2026"). This is Technique 4 (peer-incident proof, in this case the Essential Plugin incident) and Technique 3 (specificity — exact dates, exact plugin count, exact activation window). The reader encounters the threat before they encounter the company, which means the company arrives as a response to the threat rather than as an interruption of the reader's feed.

**The middle paragraph explains the mechanism rather than asserting the claim.** The original said "WordPress has had some serious issues." The rewrite explains *why* — no ownership-transfer review, no code-signing requirement, the open-market acquisition vector. This is Technique 3 (specificity) applied to the causal structure of the threat rather than to its impact. A mechanism-level explanation is more persuasive than an impact-level assertion because it gives the reader a mental model they can apply to future incidents on their own.

**The Fit For Gov paragraph is now a structural consequence of the threat analysis.** In the original, Fit For Gov was the subject of celebratory announcement. In the rewrite, Fit For Gov is the architecturally different alternative — no PHP, no database, no plugins, three dependencies against sixty. This is Technique 1 (loss framing) applied to the product description: the original framed Next.js as "modern technology" (gain), the rewrite frames WordPress as "sixty dependencies worth of ongoing surface" (loss). The paragraph ends with the direct-award threshold mention, which introduces a sub-technique from the brand kit's procurement vocabulary — "no RFP required" is itself a commitment-pathway signal.

**The vendor question replaces the sales pitch.** The original closed with "book a free discovery call" (Technique 6 violation — inflated commitment). The rewrite closes with a specific question for the CAO to ask their current vendor. This does the work of Technique 6 by making the first reader action free (asking their own vendor a question) rather than costly (scheduling a call). The CAO whose vendor cannot answer the question will then, on their own initiative, seek the vendor who can — which is the phone number at the bottom.

**The hashtags tightened.** From four generic hashtags to three on-brand ones. `#innovation` (banned-words adjacent) and `#smallbusiness` (off-positioning) are removed. `#municipalgovernment #cybersecurity #canadiantech` is the Fit For Gov default set.

### The Self-Check

1. Every loss figure traceable — April 2026 Essential Plugin incident is sourced to WordPress.org closures, TechCrunch, TechRepublic, and The Next Web. ✓
2. Every urgency claim tied to a real event — the post contains no explicit urgency claim beyond the factual recency of the incident. ✓
3. No municipality named based on non-public information — no specific municipality is named at all in this post. ✓
4. Removing the CTA leaves the post informative — a CAO reading the body understands the April 2026 incident structurally. ✓
5. No banned words. ✓ (Deleted: "thrilled," "exciting," "affordable.")
6. No fear-adjacent vocabulary. ✓ (Deleted: "serious issues," "at risk" is arguably borderline but is not on the explicit list; retained once.)

The rewrite ships.

---

## Meta-Observation — What Both Worked Examples Have in Common

Looking at both posts together, a pattern emerges that is worth making explicit. Neither post leads with Fit For Gov. Example 1 opens with Yellowknife, then Hamilton, then the CCCS assessment — the brand name appears only in the closer. Example 2 opens with the April 2026 incident, then the structural WordPress failure mode, then the Fit For Gov architectural alternative in the third paragraph.

This is not an accident of drafting. It is the core structural move of this skill: **the Fit For Gov brand is most persuasive when it arrives as a consequence of evidence, not as a premise of assertion.** A post that opens "Fit For Gov offers..." is asking the reader to pre-accept the relevance of the brand. A post that opens "On April 5–6, 2026..." is establishing the reader's relevance to the brand, which is a more respectful and more persuasive sequence.

The brand name, in other words, should usually be the answer to a question the post has taught the reader to ask. When Claude is stuck on how to open a Fit For Gov post, the heuristic is: what is the question this post will teach the reader to ask? Open with the fact that makes that question necessary.

---

*Worked Examples v1.0 · For use with fitforgov-persuasion v1.0 and fitforgov-brand-kit v2.0*
