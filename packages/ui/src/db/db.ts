import { CustomChain } from '@/types';
import Dexie, { type EntityTable } from 'dexie';


const db = new Dexie('CustomChainsDatabase') as Dexie & {
    chains: EntityTable<
        CustomChain,
        'chainId'
    >;
};

db.version(1).stores({
    chains: 'chainId, [user+chainId]'
});

export { db };