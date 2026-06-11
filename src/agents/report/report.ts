import { complete } from '../../venice/venice';

interface ReportInput {
  task: string;
  research: string;
  risk: string;
}

export class ReportAgent {
  async run({ task, research, risk }: ReportInput): Promise<string> {
    console.log('[report] compiling findings...');
    return complete(
      `You are a report writer. Compile the following into a professional market-entry report.

Task: ${task}

Research findings:
${research}

Risk analysis:
${risk}

Write a clear, structured report.`
    );
  }
}
