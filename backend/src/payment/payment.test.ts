import { Keypair } from '@stellar/stellar-sdk';
import { createPaymentReleaseFn, type StellarReleasePaymentFn } from './index';
import * as taskStore from '../coordinator/taskStore';
import type { Task } from '../coordinator/types';

jest.mock('@stellar/stellar-sdk', () => ({
  Keypair: {
    fromSecret: jest.fn(() => ({ publicKey: () => 'GCOORDINATOR_PUBLIC_KEY' })),
  },
}));

const mockTask: Task = {
  taskId: 'task_abc123',
  prompt: 'test prompt',
  walletPublicKey: 'GAGENT_WALLET_PUBLIC_KEY',
  status: 'running',
  dag: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('createPaymentReleaseFn', () => {
  let stellarRelease: jest.MockedFunction<StellarReleasePaymentFn>;

  beforeEach(() => {
    stellarRelease = jest.fn();
    delete process.env.STELLAR_COORDINATOR_SECRET;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a no-op and warns when STELLAR_COORDINATOR_SECRET is unset', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fn = createPaymentReleaseFn(stellarRelease);

    const result = await fn('task_abc123', 'node_research');

    expect(result).toBe('noop');
    expect(stellarRelease).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('STELLAR_COORDINATOR_SECRET not set')
    );
    warnSpy.mockRestore();
  });

  it('returns a no-op and warns when stellarRelease is not provided', async () => {
    process.env.STELLAR_COORDINATOR_SECRET = 'STEST_SECRET_KEY_FOR_UNIT';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fn = createPaymentReleaseFn(undefined);

    const result = await fn('task_abc123', 'node_research');

    expect(result).toBe('noop');
    expect(stellarRelease).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Stellar release function unavailable')
    );
    warnSpy.mockRestore();
  });

  it('calls stellarRelease with the coordinator keypair, walletPublicKey, and taskId', async () => {
    process.env.STELLAR_COORDINATOR_SECRET = 'STEST_SECRET_KEY_FOR_UNIT';
    jest.spyOn(taskStore, 'getTask').mockReturnValue(mockTask);
    stellarRelease.mockResolvedValue('stellar_tx_hash_abc');

    const fn = createPaymentReleaseFn(stellarRelease);
    const result = await fn('task_abc123', 'node_research');

    expect(result).toBe('stellar_tx_hash_abc');
    expect(Keypair.fromSecret).toHaveBeenCalledWith('STEST_SECRET_KEY_FOR_UNIT');
    expect(stellarRelease).toHaveBeenCalledWith(
      expect.objectContaining({ publicKey: expect.any(Function) }),
      'GAGENT_WALLET_PUBLIC_KEY',
      'task_abc123'
    );
  });

  it('passes nodeId context in the error when task is not found', async () => {
    process.env.STELLAR_COORDINATOR_SECRET = 'STEST_SECRET_KEY_FOR_UNIT';
    jest.spyOn(taskStore, 'getTask').mockReturnValue(undefined);

    const fn = createPaymentReleaseFn(stellarRelease);

    await expect(fn('missing_task', 'node_risk')).rejects.toThrow(
      '[payment] Task not found: missing_task (node: node_risk)'
    );
    expect(stellarRelease).not.toHaveBeenCalled();
  });
});
