import { discoverAgents, registerAgent } from '../registry/registry';
import { pay } from '../payment/payment';
import { ResearchAgent } from '../agents/research/research';
import { RiskAgent } from '../agents/risk/risk';
import { ReportAgent } from '../agents/report/report';

// Register built-in agents on startup
registerAgent({ id: 'research-1', name: 'Research Agent', capability: 'research', priceXLM: 1, stellarAddress: '' });
registerAgent({ id: 'risk-1',     name: 'Risk Agent',     capability: 'risk',     priceXLM: 1, stellarAddress: '' });
registerAgent({ id: 'report-1',   name: 'Report Agent',   capability: 'report',   priceXLM: 1, stellarAddress: '' });

export class CoordinatorAgent {
  async run(task: string): Promise<string> {
    console.log(`[coordinator] task: ${task}`);

    const [researchAgent] = discoverAgents('research');
    const [riskAgent]     = discoverAgents('risk');
    const [reportAgent]   = discoverAgents('report');

    if (!researchAgent || !riskAgent || !reportAgent) {
      throw new Error('Required agents not found in registry.');
    }

    const research = await new ResearchAgent().run(task);
    const risk     = await new RiskAgent().run(task);
    const report   = await new ReportAgent().run({ task, research, risk });

    // Pay agents if addresses and secret key are configured
    const secret = process.env.STELLAR_SECRET_KEY;
    if (secret) {
      for (const agent of [researchAgent, riskAgent, reportAgent]) {
        if (agent.stellarAddress) {
          const hash = await pay(secret, agent.stellarAddress, String(agent.priceXLM));
          console.log(`[payment] paid ${agent.name} — tx: ${hash}`);
        }
      }
    }

    return report;
  }
}
