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

