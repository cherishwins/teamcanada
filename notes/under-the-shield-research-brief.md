<!--
  KEPT, NOT PUBLISHED. The research brief the owner supplied with the PDF of
  "Under the Shield" on 22 October 2026, verbatim below this note. It is the
  research behind Paper No. 04 (/read/under-the-shield), not part of it.
  notes/ is in .vercelignore, so nothing here deploys; the repo is public, so
  nothing here may be private either.

  READ THIS BEFORE QUOTING THE BRIEF. It was checked against its sources on
  22 October 2026 while the paper was prepared, and four of its claims are
  wrong or unsupported as written. The published page is right in each case;
  its frontmatter lists the sources.
    1. The brief attributes "financial backstops and compute off-take
       agreements" to Minister Solomon. The cited BetaKit story says Ottawa
       is exploring guarantees and compute purchase commitments and quotes
       Solomon: "We're not here to be backstopping everybody."
    2. Lefdal's PUE: the cited Rittal page says "under 1.1", not 1.08.
    3. S3NS "17 months" to SecNumCloud: no live source states it. Thales
       states S3NS (founded 2022) was certified on 17 December 2025.
    4. Protected B in commercial cloud dates from SPIN 2017-01
       (1 November 2017), not 2018.
  Unverified from this sandbox and still the brief's own claims: the SSC
  ITQ's primary MERX page (403; aggregators agree on CS-SOVC-2026 and the
  dates), quarterly intake months (third-party trackers), GPU prices
  (trackers, not vendor quotes), underground build costs (no feasibility
  study exists), and office-holders' names (confirm before any use). The
  brief's own Caveats section, at the end, says the same.
-->

# Northern Temper Research Brief: A Constructive Plan for Canadian Digital and Compute Sovereignty

Canada already has the pieces of a truly sovereign home for its most sensitive government, defence and critical-sector data. These include a new Shared Services Canada (SSC) qualification process limited to Canadian-owned and controlled suppliers, a committed classified cloud build, a federal AI strategy with a sovereign infrastructure pillar, and a NATO pledge that pays for resilient infrastructure. What's missing is a single, Canadian-controlled classified and continuity tier that ties them together. The most useful thing Northern Temper can do is offer a plan that helps the people already building it finish the job: Canadian-owned end to end, Canadian-held keys, Indigenous partners from day one, and a hardened continuity tier (possibly underground in the Shield) as a premium option rather than the whole idea.

## TL;DR

- **Canada is further along than most people think, and that deserves credit.** SSC opened a Sovereign Cloud Invitation to Qualify (CS-SOVC-2026) for Canadian-owned and controlled vendors. Its first intake closed October 19 to 20, 2026, and SSC invoked the National Security Exception for it. SSC's 2026-27 plan commits to "a secure classified cloud environment" and a "sovereign private cloud." DND's 2026-27 plan commits to "accelerate the adoption of classified and sovereign cloud services."
- **The shared challenge is narrow and fixable.** Most federal and Defence productivity work still runs on US-parented platforms. Defence 365 is cleared mainly to Protected A, with Protected B only partly enabled. US law can compel US-parented providers regardless of where the servers sit. The Defence Industrial Strategy also doesn't define "Canadian" by ownership. No Canada-US CLOUD Act agreement exists after more than four years of talks.
- **The plan: qualify a Canadian consortium in SSC's January 2027 intake, anchor it with government offtake, count the hardened tier toward NATO's 1.5% resilience envelope, and finance Indigenous equity through the $10 billion Indigenous Loan Guarantee Program.** A small (5 to 20 MW) underground continuity tier in the Shield is a credible premium add-on. It should come after, not before, a certified surface tier.

## Key Findings

**What Canada is already doing well (credit generously)**

1. **SSC is building a Canadian-only procurement lane.**
   - The 2025 RFI (CS-IAAS-2025) required that Canada's data be "processed, transmitted and stored exclusively in Canada" and be "at all times only under the control of service providers, up to and including their ultimate parent corporations, that are not subject to foreign laws that permit foreign governments to obtain access to Canada's data without Canada's prior written consent."
   - SSC invoked the National Security Exception, which exempts all later phases from the trade agreements.
   - The follow-on Sovereign Cloud Invitation to Qualify (CS-SOVC-2026) was posted September 25, 2026. It covers IaaS, PaaS, AI enabling services and managed classified cloud services.
2. **Classified cloud is a funded commitment, not a wish.** SSC's 2026-27 Departmental Plan says that "by 2026–27, this initiative will encompass the creation of a secure classified cloud environment, a significant enhancement to the existing secret infrastructure, and the launch of an enterprise platform dedicated to secure voice, video, and messaging," which will "keep sensitive government data within Canada." The same plan provisions "a sovereign private cloud environment within Canadian jurisdiction."
3. **DND/CAF is moving in the same direction.** The 2026-27 Departmental Plan (tabled March 13, 2026) says Defence "will also accelerate the adoption of classified and sovereign cloud services, modernize networks and cross-domain solutions, and retire legacy systems." It also mentions modernizing networks across "more than 480 sites" with SSC.
4. **The federal AI agenda has a sovereign infrastructure pillar.** Prime Minister Carney launched "AI for All" on June 4, 2026. Its Pillar 4 is "Building a foundation for Canadian sovereign AI."
   - Budget 2025 pledged $925.6 million over five years for "large-scale sovereign public AI infrastructure."
   - The Enabling Large-Scale Sovereign AI Data Centres call (January 15 to February 15, 2026) drew 160 applications.
   - TELUS was the first successful applicant (May 11, 2026). It proposes 60,000+ GPUs and 150 MW by 2032, but "no funding has yet been committed or distributed."
   - Minister Evan Solomon has said Ottawa is open to "financial backstops and off-take agreements."
5. **Canadian industry has stepped up.** ThinkOn, Hypertec, Aptum and eStruxture launched what they call "Canada's first end-to-end sovereign, AI-ready government cloud." The press release is dated October 8, 2025.
   - Hypertec is "the only NVIDIA OEM headquartered in Canada."
   - ThinkOn says it is the only Canadian-owned provider approved under SSC's framework agreement for Protected B workloads.
   - TELUS's Rimouski Sovereign AI Factory opened September 2025 and is fully sold out.
   - BUZZ HPC (HIVE) announced a three-year contract with Bell AI Fabric for Cohere on June 18, 2026, using 2,304 GB200 GPUs in Merritt, BC. HIVE's SEC 8-K puts the "total contract value of approximately USD $220 million," with go-live expected "late 2026 to early 2027" and about $70 million in annual recurring revenue. Hypertec supplies the servers.

**The remaining gaps (stated as shared challenges)**

- **Defence 365's ceiling is still mostly Protected A.**
  - Official DND guidance has long authorized it "up to Protected A," with Protected B allowed for audio conversation only.
  - The 2025-26 Departmental Plan set a goal of "implementing security measures to allow for information storage and processing data up to Protected B."
  - An internal DND service agreement describes Protected B SharePoint sites in an early-adopter rollout, while "Microsoft Teams is not authorized for Protected B."
  - We found no public announcement that the whole platform was raised to Protected B.
- **Data residency is not the same as sovereignty.** Treasury Board's own 2018 white paper said: "As long as a CSP that operates in Canada is subject to the laws of a foreign country, Canada will not have full sovereignty over its data." In June 2025, Microsoft France's Anton Carniaux told a French Senate inquiry under oath: "No, I cannot guarantee that, but, again, it has never happened before." To its credit, when Microsoft announced its $7.5 billion Canadian AI data centre expansion, it pledged to "keep Canadian data on Canadian soil," to challenge government demands for Canadian data "when legally possible," and to pursue "every available legal and diplomatic avenue" against any order to suspend service (BetaKit).
- **"Canadian" is not yet defined by ownership in defence procurement.** At a technical briefing for reporters before the Defence Industrial Strategy launched (February 2026, targeting 70% Canadian procurement over a decade, up from 43%), an unnamed government official said sovereign capabilities "are not defined in terms of Canadian companies or by ownership," adding, "They're really about the capabilities that Canada is seeking to build in Canada" (Global News). Policy Options (Al Vigier, June 22, 2026) argued Defence 365 "is Microsoft 365 with a Canadian wrapper" and proposed tests for auditability, data jurisdiction and Canadian-controlled IP.
- **The CLOUD Act agreement is unfinished.** On March 22, 2022, the US Department of Justice announced "formal negotiations for a bilateral agreement" with Canada under the CLOUD Act. Attorney General Merrick Garland said such an agreement, "if finalized and approved, would pave the way for more efficient cross-border disclosures of data." As of 2026 no agreement exists. Microsoft's transparency report confirms only the UK and Australia have agreements in force with the US.

## Details

### 1. Where sensitive data lives today

| Level | Current home | Notes |
|---|---|---|
| Unclassified / Protected A | Defence 365 (Microsoft 365), multi-cloud (Microsoft, AWS, Google via SSC frameworks) | US-parented providers with Canadian regions |
| Protected B | Partially in Defence 365 (designated SharePoint sites); ThinkOn (Canadian-owned) approved for Protected B under SSC framework | Platform-wide Protected B not confirmed publicly |
| Secret | Government-run, air-gapped networks: SSC's GC Secret Systems ("not connected to the Internet or to any departmental network"); DND's Consolidated Secret Network Infrastructure (CSNI) | Public detail on CSNI is thin |
| Top Secret | Canadian Top Secret Network 2.0, Polaris | DND 2026-27 plan funds interoperability work |

The honest reading: Canada's classified holdings are already on government-run Canadian networks. The sovereignty gap is mostly in the large Protected A and B middle tier, and in any future classified cloud and AI compute. That is good news, because the gap sits exactly where SSC is now buying.

**Policy Options (IRPP) context.**
- Beaumier and Cadieux (April 2026) warned Canada risks "funding its own dependence at a cost of billions of dollars" if hyperscaler capacity is branded sovereign.
- An October 2025 Policy Options piece made a fair counterpoint: sovereignty can be built "into contracts and cryptography, not concrete," as the UK MoD did.
- A June 2026 piece proposed a "portability reserve" so critical systems keep an exit path.

A balanced plan uses both ideas. Build Canadian-owned capacity where control matters most, and use contracts, Canadian-held keys and exit plans everywhere else.

### 2. The SSC intake: what a consortium must actually do

- **Who can apply:** Canadian-owned and controlled businesses. SSC's RFI Q&A confirmed that publicly traded companies may take part if they meet the ownership and control criteria.
- **Classified requirement (exact wording from the ITQ notice):** "Vendors intending to operate as infrastructure providers will be required to provide certification from a recognized classified cloud solution provider in the Five Eyes confirming their authorization and agreement to deliver classified cloud services and associated managed solutions."
- **Timing:** The ITQ is "open, ongoing, and continuously available through CanadaBuys." The first intake closed October 19, 2026 (CanadaBuys lists October 20). Respondents hear back within 20 working days. Third-party trackers report quarterly intakes in January, April, July and October. Confirm the next date in the ITQ itself.
- **A design question worth raising respectfully:** the classified stream depends on certification from an existing Five Eyes classified cloud provider. That makes sense for interoperability. It may also mean a fully Canadian classified tier depends on an authorizing partner's cooperation. SSC and CSE could consider a parallel Canadian accreditation path.

### 3. Funding levers already on the table

- **Government offtake and backstops:** Solomon has publicly opened the door to offtakes and financial backstops, with the Canada Infrastructure Bank enabled to invest.
- **NATO 1.5% envelope:** Canada's pledge is 3.5% of GDP for core defence plus 1.5% for "critical defence and security-related" investment by 2035. The 1.5% explicitly includes "telecommunication, emergency preparedness systems, and other dual-use investments." NATO's declaration adds "defend our networks" and "ensure our civil preparedness and resilience." NAADSN's November 3, 2025 policy primer, using 2024 GDP of $2.27 trillion, says "Canada has committed to spend approximately $34 billion per year" under the 1.5%. DND later told the Parliamentary Budget Officer that 1.5% of GDP in 2035 "could be approximately" $60 billion (CBC). Canada reported reaching 2% in FY2025-26. The Parliamentary Budget Officer notes the government expects to meet the 1.5% "under current planned spending," and it is not yet clear which projects count. A hardened, Canadian-owned continuity facility for defence data is a strong, defensible candidate. Ottawa would have to decide that it counts.
- **New sovereign wealth fund (Canada Strong Fund):** announced in the 2026 Spring Economic Update as an arm's-length Crown corporation alongside the CIB, Canada Growth Fund and Canada Indigenous Loan Guarantee Corporation (CILGC).
- **Indigenous equity:**
  - The federal Indigenous Loan Guarantee Program was doubled to $10 billion in March 2025 and opened to infrastructure beyond energy. Guarantees range from $20 million to $1 billion and can be stacked with provincial programs.
  - The CIB's Indigenous investment target is $3 billion.
  - Manitoba has a $300 million Indigenous loan guarantee program tied to its wind call.
  - Precedents include $400 million for 38 BC First Nations' 12.5% stake in Enbridge's Westcoast system, and a June 2026 guarantee supporting First Nations equity in Canada's first grid-scale SMR. In data centres, Woodland Cree First Nation holds 51% of a proposed 650 MW Alberta project. PureSpirIT, an Indigenous-owned firm, partners with ThinkOn on sovereign cloud.

### 4. Power and provinces

- **Manitoba:**
  - On June 4, 2026, Premier Wab Kinew rejected the 141-hectare, gas-powered hyperscale proposal near Ile des Chênes (RM of Ritchot), saying hyperscale centres "don't appear to be in the best interests of Manitobans."
  - He added that government data is held in smaller centres: "That's the scale of data centre that we're going to do."
  - On 17 Wing, he said: "Saying 'no' to AI hyperscale data centres allows us to say 'yes' to nation-building projects like 17 Wing."
  - In October 2025 he signalled preference for data centres "that keep information in Canadian hands."
  - Manitoba Hydro's 2025 resource plan adds about 1,760 MW by 2035, including 750 MW of gas turbines in Brandon by 2030. Interconnections let it withstand mid-winter shortfalls "for the next four years."
  - A small sovereign facility fits Manitoba's stated preference. A large one does not.
- **Kinew and Indigenous involvement:** reporting confirms Kinew declined to join the premiers' pipeline push because he prefers to consult Indigenous nations "from the start." We could not confirm that he refused a data centre project for this reason. Don't state that as fact.
- **BC:** TELUS's cluster runs on BC Hydro. **Quebec:** home to Rimouski and the Hypertec and eStruxture base. **Ontario:** Sudbury and North Bay have deep-underground expertise. A 5 to 20 MW facility is realistic in Manitoba (small scale, if grid access is approved), Quebec, Ontario or BC. Confirm each province's current allocation rules before naming a site.

### 5. International lessons

- **France:**
  - S3NS (Thales and Google) earned SecNumCloud 3.2 qualification on December 17, 2025, 17 months after its J0 milestone.
  - Bleu (Orange and Capgemini, running Microsoft technology) passed J0 in April 2025 and J1 in November 2025. As of October 2026 it is still not qualified, now targeting late 2026.
  - Lesson: a clear national standard works, but certification takes 1.5 to 2+ years, so start now.
- **Germany and the EU:** S3NS is launching a German sovereign offer (preview, general availability targeted by end of 2026). AWS's European Sovereign Cloud (Brandenburg) went live in January 2026, operated by EU residents. Germany's Delos was not re-verified for this brief.
- **UK and Australia:** both have CLOUD Act agreements in force with the US. Lawfare argues Canada's Bill C-22 could jeopardize a Canadian deal. UK MoD signed a sovereign cloud contract governed under UK law. Australia's January 2026 effective date was not verified here.
- **Microsoft's own direction:** Microsoft now offers Azure Local and Microsoft 365 Local in fully disconnected mode, supported "through at least 2035." This could be a useful bridge for Defence productivity on Canadian-owned hardware while Canadian alternatives mature.

### 6. The underground hardened tier: honest pros and cons

**Precedents:**
- **Lefdal Mine (Norway):**
  - A former olivine mine with 75 chambers and 120,000 m² of space.
  - Potential capacity of 200 MW, PUE of 1.08 to 1.15, fjord-water cooling, and up to 50 kW per rack.
  - On March 11, 2026, 3i Infrastructure agreed to invest "c.€300m" for a majority stake, bought from a Columbia Threadneedle fund, with total investment of about €400 million. At the time Lefdal had "37 MW of operational capacity" and "43 MW of contracted capacity under construction" (3i press release). That is proof serious investors value it.
- **Bahnhof Pionen (Stockholm):** a Cold War bunker 30 m under bedrock with about 1.5 MW of cooling.
- **Iron Mountain:** its western Pennsylvania underground complex is about 1.7 million sq ft.
- **SNOLAB:** located 2 km down in Vale's Creighton Mine near Sudbury, it shows Canada can run clean, deep underground infrastructure for decades.

**Canadian sites:**
- **North Bay:** the former NORAD complex (180 m deep, operated 1963 to 2006) was declared surplus in 2012. DND says transferring it to a third party "is not possible" because it sits under an active base.
- **AECL's Underground Research Laboratory near Lac du Bonnet:** reported closed and sealed around 2010. Not re-verified here.
- The best candidates are recently closed or active Shield mines with existing shafts, power, road and fibre, chosen with the host First Nation.

**Pros:**
- Physical protection against blast, weather and wildfire.
- Stable temperatures that help with cooling.
- A strong continuity story worth a premium.
- A second life for mining communities.

**Cons:**
- Water ingress and pumping.
- Ventilation and fire suppression in confined space.
- Getting heat out at GPU density (needs liquid cooling and a heat sink like Lefdal's fjord).
- Slower hardware access and staffing.
- Uncertain retrofit costs. We found no reliable public cost-per-MW for Canadian mine conversions, so a feasibility study must come first.

**Recommendation:** treat the underground tier as a Phase 2 continuity and backup site for the most critical data and models, paired with a certified surface tier.

### 7. Hardware sovereignty: the honest gap

- **GPUs are US products under US export law.** Canada is a close ally, but control over supply and firmware sits outside Canada. We did not re-verify the current US export rules for this brief.
- **Practical mitigations:**
  - Use Canadian integrators: Hypertec, Canada's only NVIDIA OEM, and Celestica.
  - Run air-gapped operation for classified tiers.
  - Turn off or isolate remote management (BMC) features.
  - Hold encryption keys in Canada only.
  - Run open-weight or Canadian models (for example, Cohere) offline.
- **Model licensing terms** need legal review.

### 8. Economics

- **Rental:**
  - Denvr Dataworks (Calgary) lists H100 SXM at about US$2.45 per GPU-hour on demand in 8-GPU instances.
  - Market averages (Mercatus GPU Index, September 2026) are H100 $3.84, H200 $4.43 and B200 $6.39 per GPU-hour.
  - TELUS sells H200 capacity on 1 to 3 year flat monthly terms (rates not public).
- **Purchase:** secondary estimates put an 8-GPU H200 server around US$315,000 and H100 around US$215,000. These are not vendor quotes.
- **Own vs. rent (our estimate):** an 8×H200 server rented 24/7 at $4.43 per GPU-hour costs about US$310,000 a year. At high, steady use, owning the hardware pays back in roughly one to two years once power, networking and staff are added. That is why a guaranteed government offtake changes the financing picture.

### 9. Security and governance requirements

A credible consortium needs:
- Contract Security Program facility clearances (Secret at minimum for the classified stream).
- Personnel security clearances.
- A Canadian ownership and control attestation down to the ultimate parent.
- CSE/Cyber Centre assessment.
- The Five Eyes classified-provider certification named in the ITQ.

The Canadian Program for Cyber Security Certification Level 1 opened April 1, 2026. Level 2 third-party assessments follow in spring 2027.

### 10. Who decides

- **Federal:**
  - Prime Minister Mark Carney.
  - Evan Solomon, Minister of Artificial Intelligence and Digital Innovation.
  - The Minister of National Defence and the DND Chief Information Officer.
  - Scott Jones, President of SSC.
  - The President of the Treasury Board.
  - The Minister of Public Services and Procurement.
  - Mélanie Joly, Minister of Industry.
  - François-Philippe Champagne, Minister of Finance.
  - Canada Infrastructure Bank and CILGC leadership.
- **Manitoba:** Premier Wab Kinew; Adrien Sala, minister responsible for Manitoba Hydro.
- **Other partners:** the Assembly of Manitoba Chiefs, Southern Chiefs' Organization and other regional Indigenous leaders.
- **Channels:**
  - The SSC ITQ itself.
  - ISED's AI infrastructure team.
  - Parliamentary committees (OGGO, NDDN).
  - The Major Projects Office.

Verify current office-holders before publishing.

## Recommendations: A Phased Plan

**Phase 1: Now to mid-2027 (use the intake cycles)**
1. Form a Canadian-owned consortium (operator, integrator, facility owner, Indigenous equity partner, university) and submit in SSC's January 2027 intake.
2. Ask, respectfully, that SSC and CSE publish a Canadian accreditation path for classified cloud alongside the Five Eyes certification route.
3. Propose a plain ownership test for "sovereign" in the Defence Industrial Strategy and Buy Canadian policy: control up to the ultimate parent, plus Canadian-held keys.
4. Ask DND to identify which Protected B and classified workloads should land in the SSC sovereign private cloud first.

**Phase 2: 2027 to 2029 (build)**
1. Stand up a certified surface tier (5 to 20 MW) on a 5 to 10 year government offtake, backstopped through the CIB or Canada Strong Fund.
2. Fund Indigenous equity of 25 to 51% through CILGC and provincial guarantees, with partners at the table before site selection.
3. Commission a feasibility study for one hardened Shield continuity site, including mine owners, the host Nation, SNOLAB-type expertise and the provincial utility.
4. Seek a ruling that hardened sovereign data infrastructure counts toward NATO's 1.5%.

**Phase 3: 2029 to 2035 (capability)**
1. Bring the underground continuity tier online if the study supports it.
2. Expand sovereign AI compute for defence and the public service, with offline Canadian models.
3. Export the model to allies as a trusted Canadian service.

## Strongest Verified Facts for a LinkedIn Post

- SSC's Sovereign Cloud Invitation to Qualify is open only to Canadian-owned and controlled businesses. Its first intake closed October 19, 2026.
- SSC's 2026-27 plan commits to "a secure classified cloud environment" that will "keep sensitive government data within Canada."
- DND's 2026-27 plan: Defence "will also accelerate the adoption of classified and sovereign cloud services."
- Treasury Board, 2018: "As long as a CSP that operates in Canada is subject to the laws of a foreign country, Canada will not have full sovereignty over its data."
- Canada's NATO pledge includes 1.5% of GDP for resilience and dual-use investment by 2035.
- The Indigenous Loan Guarantee Program is now $10 billion.
- Lefdal Mine in Norway runs a fjord-cooled data centre inside a former mine at a PUE as low as 1.08.

## Caveats

- **Could not verify:**
  - The October 13, 2026 consortium announcement (we found the October 8, 2025 launch).
  - The Cohere–CoreWeave Cambridge deal.
  - SCIP and AI Compute Access Fund figures.
  - The Digital Sovereignty Framework (November 2025).
  - Buy Canadian (December 2025) details.
  - Australia's CLOUD Act effective date.
  - Delos.
  - US export rules.
  - Any Canadian Microsoft testimony.
  - The Kinew Indigenous-involvement claim for a data centre.
- **Quarterly intake months:** these come from third-party trackers.
- **GPU prices:** mostly tracker data; confirm with vendors.
- **Underground costs:** unknown until a feasibility study is done.
- **Office-holders:** confirm current names before publishing.
