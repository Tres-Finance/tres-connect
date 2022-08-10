# Tres Connect

## TL;DR

> Readonly wallet addresses for any DeFi app

## What does extension do?

Some DeFi apps do not support viewing the stats of an arbitrary address. These apps allow us to connect using a wallet provider.  
TresConnect enables you to connect to these apps using any address you choose, in a _read only_ mode (e.g. can only view, not sign messages / transactions)

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
