import type { NavbarLink } from '@/components/layout/navbar';
import envParsed from '@/envParsed';

export const LEARN_MORE_URI = 'https://docs.arbitrum.io/how-arbitrum-works/sequencer';
export const NAV_LINKS: NavbarLink[] = [
  {
    label: 'Learn more',
    to: envParsed().RESERCH_LINK_URL,
    targetBlank: true,
  },
];

export const arbitrumScan = `https://${envParsed().IS_TESTNET ? "sepolia." : ""}arbiscan.io`;
export const l1Scan = `https://${envParsed().IS_TESTNET ? "sepolia." : ""}etherscan.io`;

export enum TransactionState {
  INITIATED = "INITIATED",
  CONFIRMED = "CONFIRMED",
  CLAIMABLE = "CLAIMABLE",
  FORCEABLE = "FORCEABLE",
  COMPLETED = "COMPLETED",
}
export enum Step {
  INITIATE_WITHDRAWAL = "INITIATE_WITHDRAWAL",
  CONFIRM_WITHDRAWAL = "CONFIRM_WITHDRAWAL",
  FORCE_WITHDRAWAL = "FORCE_WITHDRAWAL",
  CLAIM = "CLAIM",
}

export enum StepState {
  ACTIVE = "ACTIVE",
  RUNNING = "RUNNING",
  DONE = "DONE",
  PENDING = "PENDING",
}
