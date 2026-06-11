import { complete } from '../../venice/venice';

export class CodingAgent {
  async run(task: string): Promise<string> {
    console.log('[coding] generating code...');
    return complete(
      `You are a software engineer. Complete the following coding task:\n\n${task}`
    );
  }
}
