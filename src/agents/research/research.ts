import { complete } from '../../venice/venice';

export class ResearchAgent {
  async run(task: string): Promise<string> {
    console.log('[research] gathering data...');
    return complete(
      `You are a market research analyst. Research the following and provide key findings:\n\n${task}`
    );
  }
}
