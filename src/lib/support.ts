/**
 * The support rail.
 *
 * Deliberately processor-free: there is no Stripe, no PayPal, no platform that
 * can decide this page is a political risk and switch it off. A viewer sends
 * USDC on Base directly to a wallet, and nothing sits in between.
 *
 * The page does NOT depend on the x402 facilitator being awake. The EIP-681
 * request is constructed here, from constants, so the rail keeps working even
 * if the facilitator is cold-starting on a free Render dyno. The facilitator is
 * an enhancement for tracking a payment, never the thing that makes it possible.
 */
import QRCode from 'qrcode';

/** Base mainnet. */
export const CHAIN_ID = 8453;
/** Native USDC on Base. */
export const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_DECIMALS = 6;

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

/** Set SUPPORT_WALLET in the host environment. Never commit an address. */
export function wallet(): string | null {
  const w = (import.meta.env.SUPPORT_WALLET ?? process.env.SUPPORT_WALLET ?? '').trim();
  return ADDRESS_RE.test(w) ? w : null;
}

/**
 * An EIP-681 payment request.
 *
 * The target is the TOKEN CONTRACT with the recipient as the `transfer`
 * argument. The arrangement that reads more naturally — recipient as target,
 * amount in `value` — asks the wallet for native ETH and delivers no USDC at
 * all. This ordering is not a style choice; the other one silently fails.
 */
export function paymentURI(to: string, usdAmount: number): string {
  const units = BigInt(Math.round(usdAmount * 10 ** USDC_DECIMALS));
  return `ethereum:${USDC}@${CHAIN_ID}/transfer?address=${to}&uint256=${units}`;
}

/** QR rendered to SVG on the server, so the page ships no QR library. */
export async function qrSVG(data: string): Promise<string> {
  return QRCode.toString(data, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 0,
    color: { dark: '#000000', light: '#FFFFFF' },
  });
}

export interface Tier {
  label: string;
  usd: number;
  note: string;
}

/** Framed as what a thing costs, not as what is wanted. */
export const TIERS: Tier[] = [
  { label: 'A month of hosting',  usd: 20,  note: 'What it costs to keep this online for thirty days.' },
  { label: 'The domain, a year',  usd: 25,  note: 'One .ca registration. The whole annual bill.' },
  { label: 'A research day',      usd: 250, note: 'One dossier, sourced and checked end to end.' },
];
