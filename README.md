# Tres Connect

## TL;DR

> Readonly wallet addresses for any DeFi app

## What does this extension do?

Some DeFi apps do not support viewing the stats of an arbitrary address. These apps allow us to connect using a wallet provider.  
TresConnect enables you to connect to these apps using any address you choose, in a _read only_ mode (e.g. can only view, not sign messages / transactions)

## Usage

1. Make sure you have [MetaMask](https://metamask.io/) installed
2. Install the Tres Connect extension from the [chrome webstore](https://chrome.google.com/webstore/detail/tresconnect-metamask-impe/dcncbippcdfiljhcfpdieipdjfjoaihl)
3. (Optional) Pin the extension to the chrome toolbar
4. Click on the extension, enter an address and click `start`
5. Click `stop` when you are done

![example-usage](media/example%20usage.gif)

## Known limitations

Does not support apps that require signing a message for login (e.g. Polygon Staking)

## Requirements

You must have [MetaMask](https://metamask.io/) installed, as this extension changes the results returned from MetaMask when an app asks for the current connected address.

## Developing

### Available Scripts

In the project directory, you can run:

#### `npm install`

Install all required packages to build the extension.

#### `npm run build`

Builds the extension for production to the `build` folder.

#### `npm run watch`

Monitors `./src` and `./public` for changes, and rebuilds when changes are detected.
