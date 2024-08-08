import { BigNumber, ethers, providers, Wallet } from "ethers";
import { ArbitrumDelayedInbox } from "../src";
import { hardhatMineBlocks } from "./utils/hardhat-mine";
import { resetHardhatForkEth } from "./utils/hardhat-reset";
import { config } from "./utils/config";

xdescribe("Arbitrum delayed inbox", () => {
    let delayedInbox: ArbitrumDelayedInbox;
    let l1Provider: providers.Provider;
    let l2Provider: providers.Provider;
    let l1ChainId: number;
    let l2ChainId: number;
    let l1Signer: Wallet;
    let l2Signer: Wallet;
    let fromAddress: string; // testing wallet address
    let fromPrivateKey: string; // testing wallet private key

    beforeEach(async () => {
        // providers
        l1Provider = new providers.JsonRpcProvider(config.L1_RPC)
        l2Provider = new providers.JsonRpcProvider(config.L2_RPC)
        l1ChainId = (await l1Provider.getNetwork()).chainId
        l2ChainId = (await l2Provider.getNetwork()).chainId

        // signers from hardhat
        fromAddress = config.FROM_ADDRESS
        fromPrivateKey = config.FROM_PRIVATE_KEY
        l1Signer = new Wallet(fromPrivateKey, l1Provider)
        l2Signer = new Wallet(fromPrivateKey, l2Provider)

        // delayed inbox
        delayedInbox = new ArbitrumDelayedInbox(l2ChainId)
    })


    describe("assembleChildTransaction", () => {
        it("should take a random tx and prepare it for signing", async () => {
            const srcTx = {
                to: fromAddress,
                value: BigNumber.from("1")
            }
            const assembledChildTx = await delayedInbox.assembleChildTransaction(l2Signer, srcTx)

            expect(assembledChildTx).toBeDefined()
            expect(assembledChildTx.value).toBe(srcTx.value)
            expect(assembledChildTx.to).toBe(srcTx.to)
            expect(assembledChildTx.from).toBe(fromAddress)
            expect(assembledChildTx.chainId).toBe(l2ChainId)
            expect(assembledChildTx.nonce).toBeDefined()
            expect(assembledChildTx.maxFeePerGas).toBeDefined()
            expect(assembledChildTx.maxPriorityFeePerGas).toBeDefined()
        })
    })

    describe("signChildTransaction", () => {
        it("signChildTransaction should take a random tx and prepare it for sending through delayedInbox including signing it", async () => {
            const signedTx = await delayedInbox.signChildTransaction(l2Signer, {
                to: fromAddress,
                value: BigNumber.from("1")
            })

            expect(signedTx).toBeDefined()
            expect(typeof signedTx).toBe("string")
        })
    })

    describe("sendChildTransaction", () => {
        it("sendChildTransaction should take a random tx, prepare it and send it in L2", async () => {
            const srcTx = {
                to: fromAddress,
                value: BigNumber.from("1")
            }
            const txHash = await delayedInbox.sendChildTransaction(l2Signer, srcTx)

            expect(txHash).toBeDefined()
            expect(typeof txHash).toBe("string")

            await l2Provider.waitForTransaction(txHash)
            const tx = await l2Provider.getTransaction(txHash)

            expect(tx).not.toBeNull()
            expect(tx.to).toBe(srcTx.to)
            expect(tx.value.toString()).toBe(srcTx.value.toString())
        })
    })

    describe("sendChildTransactionToParent", () => {
        it("sendChildTransactionToParent should take tx and deliver it to the delayed inbox", async () => {
            // arrange just a random tx
            const signedTx = await l2Signer.signTransaction({
                to: fromAddress,
                value: BigNumber.from(1),
            })
            const txHash = await delayedInbox.sendChildTransactionToParent(l1Signer, signedTx)

            // assert
            expect(txHash).toBeDefined()
            await l1Provider.waitForTransaction(txHash)
            const l1TxReceipt = await l1Provider.getTransaction(txHash)
            expect(l1TxReceipt).toBeDefined()
            expect(l1TxReceipt.to).toBe("0xaAe29B0366299461418F5324a79Afc425BE5ae21") // rollup contract
            expect(l1TxReceipt.data.startsWith("0xb75436bb")).toBe(true) // 0xb75436bb sendL2Message function signature -> https://sepolia.etherscan.io/tx/0x150db411d4534ef8590347d0e3f358b832f53493cd21c16c72010282e2cc222d
        })
    })

    describe("canForceInclude", () => {
        beforeEach(async () => {
            await resetHardhatForkEth()
        })

        it("canForceInclude should return false if not enough time has past or there's nothing to include", async () => {
            // arrange tx that could be force included in some time
            const signedTx = await l2Signer.signTransaction({
                to: fromAddress,
                value: BigNumber.from(1),
            })
            await delayedInbox.sendChildTransactionToParent(l1Signer, signedTx)

            // act
            const canForceInclude = await delayedInbox.canForceInclude(l1Signer)

            // assert
            expect(canForceInclude).toBe(false)
        })

        it("canForceInclude should return false if the particular signer has no messages in delayed inbox", async () => {
            // act
            const canForceInclude = await delayedInbox.canForceInclude(l1Signer)

            // assert
            expect(canForceInclude).toBe(false)
        })

        it("canForceInclude should return true if enough time past by", async () => {
            // arrange tx that could be force included in some time and make time flow
            const signedTx = await l2Signer.signTransaction({
                to: fromAddress,
                value: BigNumber.from(1),
            })
            const tx = await delayedInbox.sendChildTransactionToParent(l1Signer, signedTx)
            await l1Provider.waitForTransaction(tx)
            const l1TxReceipt = await l1Provider.getTransaction(tx)
            await hardhatMineBlocks(config.L1_RPC, 6600, l1TxReceipt.timestamp)

            // act
            const canForceInclude = await delayedInbox.canForceInclude(l1Signer)

            // assert
            expect(canForceInclude).toBe(true)
        })
    })

    describe("forceInclude", () => {
        beforeEach(async () => {
            await resetHardhatForkEth()
        })


        it("forceInclude should return null if there're no transactions to force through", async () => {
            // arrange
            const canForceInclude = await delayedInbox.canForceInclude(l1Signer)
            expect(canForceInclude).toBe(false)

            // act
            const tx = await delayedInbox.forceInclude(l1Signer)

            // assert
            expect(tx).toBe(null)
        })

        it("forceInclude should force a tx in l1 if it was pending", async () => {
            // arrange tx that could be force included in some time and make time flow
            const signedTx = await l2Signer.signTransaction({
                to: fromAddress,
                value: BigNumber.from(1),
            })
            await delayedInbox.sendChildTransactionToParent(l1Signer, signedTx)
            await hardhatMineBlocks(config.L1_RPC, 6600)
            const canForceInclude = await delayedInbox.canForceInclude(l1Signer)
            expect(canForceInclude).toBe(true)

            //  act
            const l1TxReceipt = await delayedInbox.forceInclude(l1Signer)
            
            

            // assert
            expect(l1TxReceipt).not.toBe(null)
            const tx = await l1Provider.getTransaction(l1TxReceipt?.transactionHash!)
            expect(tx.data.startsWith("0xf1981578")).toBe(true) // 0xf1981578 forceInclusion method signature https://sepolia.etherscan.io/address/0x6c97864CE4bEf387dE0b3310A44230f7E3F1be0D#writeProxyContract
        })
    })
})