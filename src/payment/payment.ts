import StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL =
  process.env.STELLAR_NETWORK === 'mainnet'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org';

const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const networkPassphrase =
  process.env.STELLAR_NETWORK === 'mainnet'
    ? StellarSdk.Networks.PUBLIC
    : StellarSdk.Networks.TESTNET;

export async function pay(
  fromSecret: string,
  toAddress: string,
  amountXLM: string
): Promise<string> {
  const keypair = StellarSdk.Keypair.fromSecret(fromSecret);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: toAddress,
        asset: StellarSdk.Asset.native(),
        amount: amountXLM,
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  return result.hash;
}
