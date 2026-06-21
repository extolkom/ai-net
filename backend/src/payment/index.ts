import { Keypair } from '@stellar/stellar-sdk';
import type { PaymentReleaseFn } from '../coordinator/coordinator';
import { getTask } from '../coordinator/taskStore';

/**
 * Matches the signature of smart-contracts/src/payment/payment.ts releasePayment.
 * Typed here to avoid a cross-package TypeScript rootDir import.
 */
export type StellarReleasePaymentFn = (
  coordinatorKeypair: Keypair,
  agentPublicKey: string,
  taskId: string
) => Promise<string>;

/**
 * Builds the PaymentReleaseFn used by the coordinator after each node completes.
 *
 * Behaviour:
 *  - STELLAR_COORDINATOR_SECRET unset → logs a warning, returns a no-op (CI-safe).
 *  - stellarRelease not provided     → logs a warning, returns a no-op.
 *  - Both present                    → constructs the coordinator Keypair and calls
 *                                      stellarRelease on every successful node.
 *
 * @param stellarRelease  The underlying Stellar release function (smart-contracts).
 *                        Pass undefined when the module is unavailable (e.g. CI).
 */
export function createPaymentReleaseFn(
  stellarRelease?: StellarReleasePaymentFn
): PaymentReleaseFn {
  const secret = process.env.STELLAR_COORDINATOR_SECRET;

  if (!secret) {
    console.warn(
      '[payment] STELLAR_COORDINATOR_SECRET not set — payment release skipped'
    );
    return async () => 'noop';
  }

  if (!stellarRelease) {
    console.warn(
      '[payment] Stellar release function unavailable — payment release skipped'
    );
    return async () => 'noop';
  }

  const coordinatorKeypair = Keypair.fromSecret(secret);

  return async (taskId: string, nodeId: string): Promise<string> => {
    const task = getTask(taskId);
    if (!task) {
      throw new Error(`[payment] Task not found: ${taskId} (node: ${nodeId})`);
    }
    // task.walletPublicKey is the Stellar address that receives the escrowed payment
    return stellarRelease(coordinatorKeypair, task.walletPublicKey, taskId);
  };
}
