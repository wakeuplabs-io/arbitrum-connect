import { Transaction } from '@/lib/transactions';
import { customMainnet, customSepolia, customArbitrum, customArbitrumSepolia } from '@/lib/wagmi-config';
import { CustomChain } from '@/types';
import Dexie, { type EntityTable } from 'dexie';


const db = new Dexie('CustomChainsDatabase') as Dexie & {
    chains: EntityTable<
        CustomChain,
        'id'
    >,
    transactions: EntityTable<Transaction, "bridgeHash">;
};

db.version(1).stores({
    chains: '++id, chainId, [user+chainId]',
    transactions: 'bridgeHash, [account+bridgeHash]'
});

async function initializeChains() {
    const count = await db.chains.count();
    if (count === 0) {
        await db.chains.bulkAdd([
            { ...customMainnet, id: undefined },
            { ...customSepolia, id: undefined },
            { ...customArbitrum, id: undefined },
            { ...customArbitrumSepolia, id: undefined }
        ]);
    }
}

initializeChains().catch(console.error);

export { db };