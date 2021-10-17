# Coinbase Lib for Google Apps Script
This library provides a simple Coinbase API integration for [Google Apps Script](https://developers.google.com/apps-script/).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)


## Add to your Google Apps Script project
While in the editor, click the + next to "Libraries" in the Script menus
* Paste `1zfKYbXu33sgYgWPE6SKaFdeY-pqTWV5hEPBU4CSFs1dwKJDGfE0F55rF` (the project key for this script) in the window that appears
* Click the "Look up" button to load the library
* Select the most recent Version from the drop-down for best results
* Leave the Identifier as "CoinbaseLib"
* Click "Add" to confirm and add to your project

## Connecting to the Coinbase API
In order to get the cryptocurrency information we need from Coinbase, you will need to supply your `API Key` and `API Secret` tokens in order to interface with this library. Head on over to the API Settings page at [Coinbase.com](https://www.coinbase.com/settings/api) (this link should take you straight there) to get started.
* Click the "New API Key" button
* Under Accounts, select "All" or whichever specific Accounts you wish to enable
* Under Permissions, select all of the permissions needed for your script.
  * Typically basic read access is suffecient for a reporting app, for example:
    * `wallet.accounts.read`
    * `wallet.transactions.read`
    * `wallet.buys.read`
    * `wallet.sells.read`
    * `wallet.trades.read`
* Click the "Create" button.
* A new window appears with your `API Key` and `API Secret`, make sure to copy these down. Once you close this window you won't be able to retrieve them again!

## Use
Instantiate the library within your code as follows:

```javascript
let coinbase = new CoinbaseLib.auth(api_key, api_secret);
```

## Contributing

This project is open for contributions, suggestions, and ideas. Feel free to submit a PR and/or create an [Issue](https://github.com/neojato/coinbase-lib/issues) with bugs, suggestions, and ideas. Stars are always welcome too!

See [list of contributors](https://github.com/neojato/coinbase-lib/graphs/contributors).

## License

Project is published under the [MIT license](https://github.com/neojato/coinbase-lib/blob/main/LICENSE).  
Feel free to clone and modify repo as you want, but don't forget to keep the reference to original authors, thanks!
