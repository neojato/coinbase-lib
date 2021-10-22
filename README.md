# Coinbase Lib for Google Apps Script
This library provides a simple Coinbase API integration for [Google Apps Script](https://developers.google.com/apps-script/).

New to Coinbase? Use [my referral link](https://www.coinbase.com/join/paul_35bk) and we each get $10 USD worth of Bitcoin (BTC).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
[![Donate with Bitcoin](https://en.cryptobadges.io/badge/micro/1KHCz4fZaCdgUExPs2Lis147SnTqAUHu76)](https://en.cryptobadges.io/donate/1KHCz4fZaCdgUExPs2Lis147SnTqAUHu76)

## Add to your Google Apps Script project
While in the Apps Script editor:
* Click the "+" button next to "Libraries" in the Script menus
* Paste `1zfKYbXu33sgYgWPE6SKaFdeY-pqTWV5hEPBU4CSFs1dwKJDGfE0F55rF` (the project key for this script) in the window that appears
* Click the "Look up" button to load the library
* Select the most recent Version from the drop-down for best results
* Leave the Identifier as "CoinbaseLib"
* Click "Add" to confirm and add to your project

## Connecting to the Coinbase API
In order to get the cryptocurrency information from Coinbase, you will need to supply your `API Key` and `API Secret` tokens in order to interface with this library. Head on over to the API Settings page at [Coinbase.com](https://www.coinbase.com/settings/api) (this link should take you straight there) to get started.
* Click the "+ New API Key" button
* Under Accounts, select "All" or whichever specific Accounts you wish to enable
* Under Permissions, select all of the permissions needed for your script.
  * Typically, basic read access is suffecient for a reporting app, for example:
    * `wallet.accounts.read`
    * `wallet.transactions.read`
    * `wallet.buys.read`
    * `wallet.sells.read`
    * `wallet.trades.read`
* Click the "Create" button.
* A new window appears with your `API Key` and `API Secret`, make sure to copy these down. Once you close this window you won't be able to retrieve them again!

## Use
Instantiate the library within your code and replace `api_key` and `api_secret` with the tokens you acquired in the previous step:

```javascript
// Authenticate to access your own account via signed API Key
let coinbase = new CoinbaseLib.auth('api_key', 'api_secret');

// Lists current user's accounts to which the authentication method has access to
let accounts = coinbase.getAccounts();
```

### List of Supported Endpoints

#### Notification Endpoints
* [Notifications](https://developers.coinbase.com/api/v2#notifications)

#### Data Endpoints
* [Currencies](https://developers.coinbase.com/api/v2#currencies)
* [Exchange Rates](https://developers.coinbase.com/api/v2#exchange-rates)
* [Prices](https://developers.coinbase.com/api/v2#prices)
* [Time](https://developers.coinbase.com/api/v2#time)

#### Wallet Endpoints
* [Users](https://developers.coinbase.com/api/v2#users)
* [Accounts](https://developers.coinbase.com/api/v2#accounts)
* [Addresses](https://developers.coinbase.com/api/v2#addresses)
* [Transactions](https://developers.coinbase.com/api/v2#transactions)
* [Buys](https://developers.coinbase.com/api/v2#buys)
* [Sells](https://developers.coinbase.com/api/v2#sells)
* [Deposits](https://developers.coinbase.com/api/v2#deposits)
* [Withdrawals](https://developers.coinbase.com/api/v2#withdrawals)
* [Payment Methods](https://developers.coinbase.com/api/v2#payment-methods)

## Contributing

This project is open for contributions, suggestions, and ideas. Feel free to submit a PR and/or create an [Issue](https://github.com/neojato/coinbase-lib/issues) with bugs, suggestions, and ideas. Stars are always welcome too!

See [list of contributors](https://github.com/neojato/coinbase-lib/graphs/contributors).

## License

Project is published under the [MIT license](https://github.com/neojato/coinbase-lib/blob/main/LICENSE).  
Feel free to clone and modify repo as you want, but don't forget to keep the reference to original author, thanks!
