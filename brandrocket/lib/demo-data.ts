export const demoCampaigns = [
  {
    id: 'camp_1',
    name: 'Q3 SaaS Trial Boost',
    status: 'active',
    healthScore: 92,
    channels: ['SEO', 'Ads', 'Email'],
    budget: '$5,000',
    spent: '$1,240',
    conversions: 142,
    cpa: '$8.73',
    progress: 35,
    lastActiveAgent: 'Growth Intelligence',
    lastAction: 'Shifted $500 budget from LinkedIn to Meta due to lower CPA.'
  },
  {
    id: 'camp_2',
    name: 'Feature Launch: AI Workflows',
    status: 'learning',
    healthScore: 85,
    channels: ['Content', 'Social'],
    budget: '$2,000',
    spent: '$450',
    conversions: 28,
    cpa: '$16.07',
    progress: 15,
    lastActiveAgent: 'Content Agent',
    lastAction: 'Published 3 long-form blog posts and generated 12 social snippets.'
  },
  {
    id: 'camp_3',
    name: 'Retargeting: Cart Abandonment',
    status: 'optimizing',
    healthScore: 98,
    channels: ['Ads', 'Email'],
    budget: '$1,500',
    spent: '$890',
    conversions: 215,
    cpa: '$4.13',
    progress: 60,
    lastActiveAgent: 'Ads Agent',
    lastAction: 'Paused underperforming creative variant B; reallocated to variant A.'
  }
]

export const demoActivityFeed = [
  {
    id: 'act_1',
    agent: 'SEO Agent',
    action: 'Discovered high-intent keyword cluster: "autonomous AI marketing". Generating landing page structure.',
    time: '12 mins ago',
    type: 'opportunity'
  },
  {
    id: 'act_2',
    agent: 'Growth Intelligence',
    action: 'Detected a 15% spike in competitor ad spend. Recommend increasing Meta budget by $200/day to maintain SOV.',
    time: '1 hour ago',
    type: 'alert'
  },
  {
    id: 'act_3',
    agent: 'Content Agent',
    action: 'Drafted 5 Twitter threads based on the latest webinar transcript. Awaiting approval.',
    time: '3 hours ago',
    type: 'action'
  },
  {
    id: 'act_4',
    agent: 'Ads Agent',
    action: 'Successfully launched "Q3 SaaS Trial Boost" campaign across Meta and Google.',
    time: '1 day ago',
    type: 'success'
  }
]

export const demoMetrics = {
  totalConversions: 385,
  conversionGrowth: '+24%',
  totalSpend: '$2,580',
  spendEfficiency: '+12%',
  activeAgents: 4,
  tasksCompleted: 142
}
