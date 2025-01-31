# UI changes to support Orbit Chains

## Chain selector

To enwiden Arbitrum Connects capabilities, a chain selector was implemented for a seamless withdrawal across any Arbitrum network.

The default configuration remains the same, being able to withdraw from Arbitrum to Ethereum.

Users are now allowed to add their own chains in order to withdraw funds from any Arbitrum Orbit Chain (L3) to Arbitrum (L2).

### UI

The UI is straightforward, configure the required chain values and start your withdrawal. 
Custom chains are stored for its later use or edition.

Users are also able to mark chains as favourite for an improved experience.

### Backend

Configured chains are retained on browser's indexed DB.