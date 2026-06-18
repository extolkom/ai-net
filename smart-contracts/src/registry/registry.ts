import { AgentMeta } from '../types';

const registry: Map<string, AgentMeta> = new Map();

export function registerAgent(meta: AgentMeta): void {
  registry.set(meta.id, meta);
}

export function discoverAgents(capability: string): AgentMeta[] {
  return [...registry.values()].filter((a) => a.capability === capability);
}

export function getAgent(id: string): AgentMeta | undefined {
  return registry.get(id);
}
