# Fit For Gov — Persuasion Rewriting Patterns

This file contains before/after sentence-level transformations that illustrate each of the six techniques codified in `SKILL.md`. Read it when a user asks Claude to make a Fit For Gov post more persuasive, when rewriting existing copy, or when a fresh post feels inert and needs a specific diagnosis of which technique to deploy. Each pattern includes the technique applied, the sentence before, the sentence after, and a short note on why the change works for the Fit For Gov audience.

---

## Pattern 1 — Grammatical Inversion (Loss Framing)

The most common intervention is inverting the grammatical subject of a sentence so that inaction becomes the cost-bearing choice rather than action being the cost-incurring choice.

**Before:** *A static-generated website is more secure than a WordPress site.*

**After:** *A WordPress site is an attack surface your municipality has chosen to maintain.*

**Why it works:** The "before" version frames security as an additive benefit the reader could obtain by doing something new. The "after" version frames the WordPress stack as an ongoing cost the reader is already paying. The reader's cognitive motion is different: in the first version they evaluate whether to purchase a better product; in the second they evaluate whether to stop paying an ongoing tax. The loss-aversion literature predicts the second motion produces faster decisions.

**Before:** *We can modernize your municipal website in thirty days.*

**After:** *Every month your site stays on WordPress is a month of continued exposure to the plugin supply-chain vector that compromised thirty-one plugins in April.*

**Why it works:** The "before" version is a promise of gain (modernization in thirty days). The "after" version is a description of the cost of delay, anchored on a specific and recent incident. The CAO reading the second sentence begins computing their own exposure; the CAO reading the first is evaluating vendor claims.

---

## Pattern 2 — Naming the Anchor First (Reference Anchoring)

When a Fit For Gov price or engagement cost appears in the same post as a peer-incident cost, the peer-incident cost must come first in the reader's cognitive flow. The rule is mechanical: the larger number goes earlier in the sentence, the paragraph, and the post.

**Before:** *A Fit For Gov municipal website costs under $10,000, which is far less than the cost of a ransomware recovery.*

**After:** *Hamilton's 2024 ransomware recovery has cost $18.3 million to date. A Fit For Gov municipal website costs under $10,000 under the direct-award threshold.*

**Why it works:** Anchoring is a sequential cognitive operation. The first number establishes the reference point against which subsequent numbers are evaluated. "Under $10,000" reads as expensive in isolation and as trivial when it follows "$18.3 million." The content is identical. The sequence is everything.

**Before:** *Our engagements are priced to fit municipal budgets.*

**After:** *The cost of remediating a ransomware incident is 1,830 times the cost of preventing one at municipal scale. The Fit For Gov engagement sits on the "preventing" side of that ratio.*

**Why it works:** The first version asserts fit without evidence. The second establishes the ratio first, then positions the product as the cheaper side of an already-accepted comparison. The reader does no work; the post has done the math.

---

## Pattern 3 — Replacing Rounded Figures With Source Figures (Specificity Bias)

Claude should never be the entity doing the rounding. If a source reports "approximately $18.3 million," write $18.3 million. If a source reports "800,000+ installations," write "800,000+." The appearance of precision is persuasive; the appearance of generalization is not.

**Before:** *Thousands of WordPress sites were compromised in a supply-chain attack earlier this year.*

**After:** *Roughly 20,000 WordPress installations were compromised in the Essential Plugin supply-chain attack that activated on April 5 and 6, 2026, with a simultaneous compromise of Smart Slider 3 Pro affecting over 800,000 additional installations.*

**Why it works:** The "before" sentence contains one number ("thousands") and two vague time references ("earlier," "this year"). The "after" sentence contains four specific figures and an exact two-day activation window. Every specific datum marginally increases the reader's belief in the underlying claim. Specificity is a credibility gradient.

**Before:** *The attack was dormant for several months before activating.*

**After:** *The backdoor was injected on August 8, 2025 in version 2.6.7, sat dormant for 241 days, and activated during a 6-hour-44-minute window on April 5–6, 2026.*

**Why it works:** "Several months" is the kind of phrase that reads as an author approximation; "241 days" reads as a forensic measurement. The latter implies someone counted. The former implies someone guessed.

---

## Pattern 4 — Replacing Hypothetical With Named Peer Incident (Peer-Incident Proof)

Generic risk language should be replaced with named, cited, Canadian incidents wherever possible.

**Before:** *Municipalities that run WordPress face significant cybersecurity risk, and a successful breach can cost millions.*

**After:** *In February 2024, the City of Hamilton's network was compromised through an external internet-facing server. Recovery has cost $18.3 million to date, the ransom demand of $18.5 million was refused, and the city's cyber insurer subsequently denied the claim on the grounds that multi-factor authentication was not fully implemented at the time of the breach.*

**Why it works:** The "before" version is a generic risk assertion — the kind of thing a CAO has read twenty times this year and discounts automatically. The "after" version is a named incident at a peer Canadian municipality with three specific financial figures and a named procedural failure (MFA absence). The CAO cannot discount it generically because it is not generic; they must engage with it as a specific case, which is the exact cognitive motion that sells the remediation.

**Before:** *Canadian cities have been hit by ransomware in recent years.*

**After:** *Hamilton (February 2024, $18.3M recovery) and Yellowknife (September 2025, municipal network disconnected from internet) are the two most-recently-documented Canadian municipal ransomware incidents, and the Canadian Centre for Cyber Security's 2025–2026 National Cyber Threat Assessment identifies ransomware as the top cybercrime threat to Canadian critical infrastructure.*

**Why it works:** The "after" version is a three-source construction: two named municipal incidents with dates and figures, plus a named government threat assessment. Each element makes the overall claim harder to dismiss. The CAO may have read about only one of these — the post educates them about the others while establishing the author's command of the file.

---

## Pattern 5 — Explicit Cost Inversion

The most potent Fit For Gov sentence form is the direct juxtaposition of problem cost and remediation cost in a single sentence, with the ratio stated rather than implied.

**Before:** *Investing in a secure municipal website is a smart use of public funds.*

**After:** *At Hamilton's $18.3 million recovery cost against a Fit For Gov direct-award engagement under $10,000, the ratio between the cost of the problem and the cost of the prevention is 1,830 to 1.*

**Why it works:** The "before" version is a value claim. The "after" version is a mathematical statement presented as evidence. A mathematical statement invites agreement or disagreement about the math, not about the value — which is the easier argument to win, because the math is correct. A CFO reading the "after" version processes it as a budgeting claim rather than a marketing claim.

**Before:** *WordPress hosting is cheap, but breach recovery is expensive.*

**After:** *WordPress hosting runs approximately $40 per month plus maintenance. Hamilton's breach recovery has run to $18.3 million. The delta between the operational and the incident cost is roughly five-hundred-thousand-fold over the span of a 36-month procurement cycle.*

**Why it works:** The "after" version forces the reader through an order-of-magnitude comparison. The specific multiplier (500,000-fold) is more cognitively destabilizing than "expensive" because it forces the reader to mentally scale two figures that operate at entirely different orders of magnitude. That mental work is itself persuasive.

---

## Pattern 6 — Shrinking the Call to Action (Low-Friction Commitment)

The call-to-action in every post must be reduced to the smallest possible next step. Phrasings that inflate the commitment must be rewritten.

**Before:** *Book a free 30-minute strategy session to explore how Fit For Gov can modernize your municipal website.*

**After:** *Call. I answer. +1 250 415 5678.*

**Why it works:** The "before" version contains four commitments: (1) booking, (2) committing to 30 minutes, (3) framing the conversation as a "strategy session" which implies preparation, and (4) inviting an open-ended exploration. Each of these is a point of friction. The "after" version contains one action (calling) and one implicit commitment (the principal will answer). The foot-in-the-door literature predicts the second version produces materially more calls.

**Before:** *Let's discuss your municipality's needs and explore whether Fit For Gov is a fit.*

**After:** *If this matches your procurement, I can usually take a call within the hour.*

**Why it works:** The "before" version frames the call as an exploration of fit, which implicitly asks the reader to pre-qualify themselves. The "after" version conditions the call on a concrete criterion ("matches your procurement") and then offers an availability window ("within the hour") that reduces the reader's uncertainty about when they might be committing to. Specificity reduces commitment friction.

---

## Pattern 7 — Removing Emotional Escalation (Voice Preservation)

This pattern is not itself a persuasion technique — it is a preservation pattern that prevents persuasion-oriented rewriting from drifting into fear-vocabulary violations. When Claude has applied techniques 1–6 and notices that the resulting sentence has adopted fear-adjacent vocabulary, the fear words are always redundant and always cut.

**Before (drafted with emotional escalation):** *In a terrifying new attack, hackers have weaponized dozens of WordPress plugins, putting thousands of municipalities at catastrophic risk of devastating ransomware attacks that could cripple essential services.*

**After:** *On April 5–6, 2026, a command-and-control server distributed payloads for six hours and forty-four minutes to every website running one of thirty-one compromised WordPress plugins. WordPress has no mechanism to review plugin ownership transfers or require code signing for updates, and the forced update released on April 7 neutralized the phone-home mechanism but did not remove the malicious code already injected into wp-config.php files.*

**Why it works:** The "before" version contains five fear-adjacent words ("terrifying," "weaponized," "catastrophic," "devastating," "cripple") and no specific facts. The "after" version contains zero fear-adjacent words and nine specific facts. The second version is substantially scarier *because* it does not try to be. This is the empirical core of the threat-brief register: evidence presented flatly is more alarming than evidence presented emotionally, because the reader does the emotional work themselves and therefore owns the conclusion.

---

## Summary Map — Technique to Grammatical Form

| Technique | Typical Grammatical Intervention |
|-----------|----------------------------------|
| Loss framing | Invert subject so inaction bears the cost |
| Anchoring | Move the larger figure earlier in the sentence |
| Specificity | Replace generalized quantifiers with source figures |
| Peer-incident proof | Replace hypothetical risk with named incident |
| Cost inversion | Juxtapose problem cost and remediation cost with ratio stated |
| Commitment pathway | Shrink the CTA to the smallest possible next step |

When Claude is stuck on a rewrite, Claude should work through this table row by row and ask: "Is this technique present in the current draft? If not, can the draft admit it without breaking the brand kit rules?"

---

*Rewriting Patterns v1.0 · For use with fitforgov-persuasion v1.0 and fitforgov-brand-kit v2.0*
