import { complete } from '../../venice/venice';

export class RiskAgent {
  async run(task: string): Promise<string> {
    console.log('[risk] analyzing risks...');
    return complete(
      `You are a risk analyst. Identify the top regulatory and financial risks for:\n\n${task}`
    );
  }
}
