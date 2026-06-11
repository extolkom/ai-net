import { complete } from '../../venice/venice';

export class DesignAgent {
  async run(task: string): Promise<string> {
    console.log('[design] generating design spec...');
    return complete(
      `You are a UX/UI designer. Provide a design specification for:\n\n${task}`
    );
  }
}
