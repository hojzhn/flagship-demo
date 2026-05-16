// Editorial content for basket detail pages. Kept separate from the
// basket catalog so the catalog stays focused on operational metadata
// (composition, fee, risk). Content is keyed by basket id.
//
// Fields per basket
//   thesisHeadline   the single-sentence thesis statement shown as H2
//                    in the thesis block
//   thesisBody       array of paragraphs that follow the headline. Each
//                    paragraph is a string. The first paragraph
//                    explains the structural argument. The second
//                    explains what the basket holds in relation to it.
//                    The third names who the basket suits.
//   holdingsIntro    one sentence that frames the holdings table as
//                    evidence for the thesis
//   newsIntro        one sentence that frames the news section

export const BASKET_CONTENT = {
  "ai-infra-expansion": {
    thesisHeadline:
      "The compute, networking, and power layer underneath AI is being rebuilt, and the companies supplying it capture most of the value.",
    thesisBody: [
      "Training and serving large models requires unprecedented amounts of compute, specialized chips, high-bandwidth networking, and electrical capacity. The hyperscalers and enterprises building this infrastructure are spending on a multi-year cycle that has only begun.",
      "This basket holds companies positioned at the bottleneck. Chip designers and fabricators that supply training clusters. Networking vendors connecting them. Power and cooling infrastructure scaling to meet the demand. The thesis is that infrastructure providers benefit before application-layer companies, and the spending wave outlasts the current cycle of AI hype.",
      "The basket suits people who hold a long-term view of structural demand rather than a short-term position on any one model or platform.",
    ],
    holdingsIntro:
      "Each holding is selected for direct exposure to the thesis above. Weights reflect the curator's view of relative impact.",
    newsIntro: "Stories covering the holdings and the underlying thesis.",
  },

  "semi-leaders": {
    thesisHeadline:
      "A small number of chipmakers and equipment vendors set the pace of every digital industry, and the moats around them are widening.",
    thesisBody: [
      "Semiconductor manufacturing has consolidated to a handful of companies. The capital and expertise required to build at the leading edge keeps challengers out. The result is concentrated pricing power across the design, fabrication, and equipment layers.",
      "This basket holds the design leaders (Nvidia, AMD), the foundries that fabricate at advanced nodes (TSM), and the equipment makers without which no one can build (ASML, AVGO). The thesis is that this concentration persists across cycles and that the companies inside it benefit from every downstream technology wave, not just AI.",
      "The basket suits people backing the long-term direction of computing rather than any specific product or end market.",
    ],
    holdingsIntro:
      "Holdings are weighted by the curator's view of competitive position and demand exposure across cycles.",
    newsIntro:
      "Coverage of the companies and the underlying industry structure.",
  },

  "cyber-resilience": {
    thesisHeadline:
      "Enterprise security has shifted from cost center to mandatory infrastructure, and the platforms that provide it are entrenched.",
    thesisBody: [
      "Cyber attacks have moved from technical nuisance to existential business risk. Boards now treat security spend as non-discretionary. Regulators in the EU and U.S. have added compliance requirements that further institutionalize it. The result is a structural lift in software security budgets that does not unwind during downturns.",
      "This basket holds the platforms enterprises actually deploy. Endpoint detection (CrowdStrike), network security (Palo Alto, Fortinet), zero-trust access (Zscaler, Okta), and edge protection (Cloudflare). The thesis is that consolidation around a few platforms continues and that the incumbents widen their moats through cross-sell.",
      "The basket suits people who view security as durable infrastructure rather than a cyclical technology bet.",
    ],
    holdingsIntro:
      "Each holding is a platform with meaningful enterprise market share in its category.",
    newsIntro:
      "Stories on enterprise security spend, regulation, and incident-driven demand.",
  },

  "energy-transition": {
    thesisHeadline:
      "The shift off fossil fuels is constrained by physical infrastructure, and the companies that build that infrastructure capture the spending.",
    thesisBody: [
      "Renewable generation is now economically competitive in most markets. The bottleneck is no longer the cost of power. It is grid capacity, storage, transmission, and the industrial supply chain that builds them. Government policy in the U.S. and EU has added decades of committed spending behind these areas.",
      "This basket holds the companies positioned at the physical layer. Utilities scaling renewable capacity (NextEra), industrial gas and materials companies (Linde, Albemarle), electrical equipment makers (Eaton), and construction firms building the grid (Quanta Services).",
      "The basket suits people backing a multi-decade infrastructure cycle rather than a specific energy technology.",
    ],
    holdingsIntro:
      "Holdings are concentrated in the physical layer of the transition rather than in fuel-source bets.",
    newsIntro:
      "Coverage of policy, grid capacity, and supply chain across the transition.",
  },

  "em-consumer": {
    thesisHeadline:
      "Consumer spending in Latin America and Southeast Asia is growing faster than in mature markets, and a handful of platforms own the channels.",
    thesisBody: [
      "Middle-class consumption in Brazil, Mexico, Indonesia, the Philippines, and India is expanding from a low base. Smartphone penetration, payment infrastructure, and logistics are mature enough to support digital commerce at scale. The platforms that built early networks now hold positions that would cost competitors years to replicate.",
      "This basket holds those platforms. Mercado Libre across Latin America, Sea Limited in Southeast Asia, Coupang in Korea, MakeMyTrip in India. Each one is the dominant or co-dominant player in its category and geography.",
      "The basket suits people who view consumer growth in emerging markets as a structural rather than cyclical trend, and who are willing to hold through currency and policy volatility.",
    ],
    holdingsIntro:
      "Holdings are platform companies with leadership positions in their core markets.",
    newsIntro:
      "Stories on consumer demand, platform competition, and macroeconomic conditions in EM.",
  },

  "us-infra": {
    thesisHeadline:
      "U.S. federal capex is at a multi-decade high, and the companies that execute the work are working through a backlog that extends past the next election cycle.",
    thesisBody: [
      "The Bipartisan Infrastructure Law, Inflation Reduction Act, and CHIPS Act together committed over $1 trillion to physical infrastructure spending. Execution has been slower than the headlines suggest, which means most of the spending is still ahead. State and municipal capex has expanded alongside it.",
      "This basket holds the companies doing the work. Heavy equipment (Caterpillar), aggregates and materials (Vulcan), rail and freight (Union Pacific), grid construction (Quanta Services), and electrical equipment (Eaton).",
      "The basket suits people who view the current capex cycle as a multi-year tailwind that survives political turnover.",
    ],
    holdingsIntro:
      "Holdings span equipment, materials, transport, and electrical infrastructure.",
    newsIntro:
      "Coverage of federal capex execution, state-level spending, and capacity constraints.",
  },
};

export const findBasketContent = (basketId) => BASKET_CONTENT[basketId];
