import { Transaction } from '@/lib/transactions';
import { CustomChain } from '@/types';
import Dexie, { type EntityTable } from 'dexie';


const db = new Dexie('CustomChainsDatabase') as Dexie & {
    chains: EntityTable<
        CustomChain,
        'chainId'
    >,
    transactions: EntityTable<Transaction, "bridgeHash">;
};

db.version(1).stores({
    chains: 'chainId, [user+chainId]',
    transactions: 'bridgeHash, [account+bridgeHash]'
});

export { db };