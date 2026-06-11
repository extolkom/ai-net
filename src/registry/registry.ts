export interface AgentRecord {
  id: string;
  name: string;
  capability: string;
  priceXLM: number;
  stellarAddress: string;
}

// In-memory registry — replace with on-chain Soroban contract call
const agents: Map<string, AgentRecord> = new Map();

export function registerAgent(agent: AgentRecord): void {
  agents.set(agent.id, agent);
}

export function discoverAgents(capability: string): AgentRecord[] {
  return Array.from(agents.values()).filter(
    (a) => a.capability === capability
  );
}

export function getAgent(id: string): AgentRecord | undefined {
  return agents.get(id);
}
