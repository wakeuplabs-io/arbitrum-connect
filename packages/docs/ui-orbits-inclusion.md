# UI Changes to Support Orbit Chains

## Chain Selector

To broaden Arbitrum Connect's capabilities, a chain selector was implemented for seamless withdrawals across any Arbitrum network.

The default configuration remains the same: users can withdraw from Arbitrum to Ethereum.

Users can now add their own chains to withdraw funds from any Arbitrum Orbit Chain (L3) to Arbitrum (L2).

### UI

The UI is straightforward — configure the required chain values and start your withdrawal.  
Custom chains are stored for later use or editing.

Users can also mark chains as favorites for an improved experience.

## Backend Enhancements to Support Orbit Chains

Orbit Chains are now configurable!  
Users can now withdraw funds while bypassing the sequencer, regardless of whether the Orbit Chain is an L2 or L3.

To enhance privacy and ensure consistent handling of user data, we implemented an API that runs on AWS Lambda functions. These are backed by a dedicated PostgreSQL database, which keeps track of:

- Users  
- Features and custom chains (created by the user)  
- Records of transactions associated with each user  

With this approach, users now enjoy a complete experience on the dApp — they can monitor their transactions and create a personalized environment by adding their own or custom Orbit Chains.
