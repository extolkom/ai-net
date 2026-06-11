# Open Issues — ai-net

These issues are open for community contribution. Issues tagged **`wave`** are part of the [Drips Wave](https://www.drips.network) program organized by the Stellar Development Foundation. Contributors earn rewards from the Wave pool upon PR merge.

To claim an issue: comment on it in the [GitHub issue tracker](../../issues) and open a PR referencing `Closes #<issue-number>`.

---

## Good First Issues

These are well-scoped, self-contained tasks suitable for new contributors.

---

### #1 · Write unit tests for the Agent Registry `good first issue` `wave`

**File**: `src/registry/registry.ts`

The registry has no tests. Write Jest unit tests covering:
- `registerAgent` stores an agent correctly
- `discoverAgents` returns agents matching a given capability
- `discoverAgents` returns an empty array when no match exists
- `getAgent` returns the correct record by ID

**Skills**: TypeScript, Jest  
**Estimated effort**: 1–2 hours

---

### #2 · Write unit tests for the Coordinator Agent `good first issue` `wave`

**File**: `src/coordinator/coordinator.ts`

Write Jest tests for `CoordinatorAgent.run()` using mocked agents and Venice AI:
- Verifies all three agents are called
- Verifies the final result is assembled from their outputs
- Verifies payment is skipped when no Stellar secret key is set

**Skills**: TypeScript, Jest, mocking  
**Estimated effort**: 2–3 hours

---

### #3 · Add input validation to the payment layer `good first issue` `wave`

**File**: `src/payment/payment.ts`

The `pay()` function does not validate inputs. Add guards that:
- Throw a clear error if `fromSecret` is empty or malformed
- Throw if `toAddress` is not a valid Stellar public key
- Throw if `amountXLM` is not a positive numeric string

**Skills**: TypeScript, Stellar SDK  
**Estimated effort**: 1–2 hours

---

### #4 · Add a `deregisterAgent` function to the registry `good first issue` `wave`

**File**: `src/registry/registry.ts`

The registry can register agents but not remove them. Add:
- `deregisterAgent(id: string): boolean` — removes the agent, returns `true` if found
- Export and test the new function

**Skills**: TypeScript  
**Estimated effort**: 30 minutes–1 hour

---

### #5 · Improve Venice AI error handling `good first issue` `wave`

**File**: `src/venice/venice.ts`

The `complete()` function does not handle API errors. Improve it to:
- Catch HTTP errors and throw a descriptive message including the status code
- Retry once on 429 (rate limit) with a 1-second delay
- Add a test that mocks a failed API response

**Skills**: TypeScript, axios, Jest  
**Estimated effort**: 1–2 hours

---

## Intermediate Issues

---

### #6 · Replace in-memory registry with Soroban smart contract `wave`

**Files**: `src/registry/registry.ts`, `contracts/`

The registry is currently in-memory and resets on restart. Replace the read/write operations with calls to a Soroban smart contract on Stellar testnet.

- Write a minimal Soroban contract (Rust) that stores agent records
- Deploy to testnet and add the contract ID to `.env.example`
- Update `registerAgent` and `discoverAgents` to read from / write to the contract

**Skills**: TypeScript, Rust, Soroban, Stellar SDK  
**Estimated effort**: 1–2 days

---

### #7 · Add a Coding Agent with Soroban contract generation `wave`

**File**: `src/agents/coding/coding.ts`

The Coding Agent is a stub. Implement it to:
- Accept a task describing a smart contract feature
- Call Venice AI with a prompt tuned for Soroban/Rust code generation
- Return the generated contract code with brief explanation

**Skills**: TypeScript, Venice AI, Soroban/Rust  
**Estimated effort**: 2–4 hours

---

### #8 · Add a Design Agent for UI layout generation `wave`

**File**: `src/agents/design/design.ts`

The Design Agent is a stub. Implement it to:
- Accept a task description
- Return a structured JSON layout spec (component tree, color palette, copy)
- Include a test with a mocked Venice AI response

**Skills**: TypeScript, Venice AI  
**Estimated effort**: 2–3 hours

---

### #9 · Build a CLI for submitting tasks `wave`

**File**: `src/cli.ts` (new)

Build a simple CLI using Node.js `readline` or `commander` that:
- Accepts a task description as an argument or interactive prompt
- Runs the coordinator and prints the result
- Shows payment transaction hashes if payments were made

**Skills**: TypeScript, Node.js CLI  
**Estimated effort**: 2–4 hours

---

## How to Contribute

1. Find an issue you want to work on.
2. Comment on the corresponding GitHub issue to claim it.
3. Fork the repo and create a branch: `git checkout -b fix/issue-3`
4. Make your changes. Add tests.
5. Run `npm test` — all tests must pass.
6. Open a PR: `Closes #<number>`

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.
