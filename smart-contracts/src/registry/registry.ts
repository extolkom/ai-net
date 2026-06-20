export interface AgentRecord {
  id: string;
  name: string;
  capability: string;
  priceXLM: number;
  stellarAddress: string;
}

const registry = new Map<string, AgentRecord>();

export function registerAgent(agent: AgentRecord): void {
  registry.set(agent.id, agent);
}

export function discoverAgents(capability: string): AgentRecord[] {
  return Array.from(registry.values()).filter(
    (agent) => agent.capability === capability,
  );
}

export function getAgent(id: string): AgentRecord | undefined {
  return registry.get(id);
}

export function clearRegistry(): void {
  registry.clear();
}
