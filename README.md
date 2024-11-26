# 🧰 Arbitrum Connect - WakeUp Labs

Welcome to [WakeUp Labs](https://www.wakeuplabs.io/) implementation of the front-end interface that enables users to force-include that we proposed here: [Arbitrum Forum Proposal](https://forum.arbitrum.foundation/t/tally-front-end-interface-to-force-transaction-inclusion-during-sequencer-downtime/21247).

You can take a look to the follow up or the project in the [Arbitrum Forum - Update Thread](https://forum.arbitrum.foundation/t/wakeup-labs-update-thread-front-end-interface-to-force-transaction-inclusion-during-sequencer-downtime/25926).

We have developed a web app designed to facilitate an uncommon type
of withdrawal that bypasses the Arbitrum sequencer, enabling users to transfer funds from the
Arbitrum network (Layer 2) to the Ethereum network (Layer 1). This web app demonstrates the
feasibility and functionality of these specialized cross-chain fund transfers, ensuring a seamless
and secure user experience.

This project aims to foster the decentralization of the Arbitrum chain by avoiding dependence on
a centralized single point of failure in cases where the Sequencer may not function
correctly —something currently achievable only by highly technical users—.

## Introduction

We developed a system that leverages Arbitrum's design to bypass the sequencer. Utilizing the
[Arbitrum SDK](https://github.com/OffchainLabs/arbitrum-sdk), we directly place user transactions into the delayed inbox on Layer 1 (L1). Once
a transaction is submitted, we must wait for the sequencer's required 24-hour window to
gracefully include the transaction. If the sequencer fails to do so within this time-frame, we use
the SDK to force the inclusion of the transaction.

The implementation is fully open source with MIT license.

## Arbitrum Connect User Guide

You can read our technical research [here](https://drive.google.com/file/d/1mBZLs-64t7PxTXpgJsqTmKRwsR5w5opG/view).

### Our Solution

Our dApp simplifies the process, providing users with an intuitive interface to follow the required steps to safely execute a withdrawal while bypassing the Sequencer. The steps are as follows:

1. Connect your wallet and set the amount to withdraw from Arbitrum.

2. Check the estimated fees and understand the process costs.

3. Sign the Arbitrum withdrawal transaction.

   - This may prompt the wallet once or twice: first to ensure the Arbitrum network is set, then to sign your L2 transaction.

4. Send the signed transaction to Arbitrum's Delayed Inbox (on the Ethereum network).

   - This bypasses the Sequencer's reading.
   - It may take 15-60 minutes for the Ethereum network to process the transaction.
   - The wallet may prompt you again to ensure the Ethereum network is set and to send your L2 transaction to the Delayed Inbox.

5. Force the inclusion of the transaction.

   - This bypasses the Sequencer's batching.
   - This step is only necessary if the Sequencer hasn't included the transaction within 24 hours.
   - The wallet may prompt you again to ensure the Ethereum network is set and to send your L2 transaction.

### Process Flow

The Arbitrum Connect SDK supports all types of transactions, but our user interface (UI) is currently
limited to handling withdrawals, the most popular and important use case. Here's a diagram of the withdrawal process:

![image.png](./assets/sequence-diagram-1.png)

> You can read more about the technical specifications [here](https://drive.google.com/file/d/1mBZLs-64t7PxTXpgJsqTmKRwsR5w5opG/view).

## Video Preview

[![Video](/assets/video-preview-1.png)](https://www.youtube.com/watch?v=zvqPVIODLC4&t)

> Check out the video preview of our dApp [here](https://www.youtube.com/watch?v=zvqPVIODLC4&t).

## Try It Out - Testnet

Sometimes, examples speak louder than words.

Here is the first implementation of the web app.
The core objective is to provide a user-friendly interface that guides users through the step-by-step process of withdrawing funds from the L2 (Arbitrum) to the L1 (Ethereum) network.

Try it out here: https://staging-transaction-enforcer.wakeuplabs.link/

![Demo](/assets/app-preview-1.png)

## How to run

### Local Setup Guide

TL;DR

#### Required Prerequisites

- Node version: 18.18.2
- npm version: 9.8.1

Also, Node 18.18.2 comes with npm 9.8.1, so the project should work properly with it. In any case, npm workspaces were added in npm 7.0.0, so you should have at least that version (9.8.1 strongly recommended).

#### Steps to Run Locally

1.  Clone the repository:

    ```bash
     git clone https://github.com/wakeuplabs-io/arbitrum-connect.git
    ```

2.  Install dependencies:

    ```bash
     npm install
    ```

3.  Start the local server:

    ```bash
     npm run dev
    ```

---

<div align="center">
  <a href='https://www.wakeuplabs.io/' target='_blank' rel='noreferrer'>
    Made with love ❤️ by WakeUp Labs
  </a>
</div>
