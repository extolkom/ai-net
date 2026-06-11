import { CoordinatorAgent } from './coordinator/coordinator';

async function main() {
  const coordinator = new CoordinatorAgent();
  const result = await coordinator.run(
    'Generate a market-entry report for solar energy in Southeast Asia.'
  );
  console.log('Result:', result);
}

main().catch(console.error);
