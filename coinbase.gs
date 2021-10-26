
/*
*
*  Coinbase Lib (c) 2021 Kyle Paul
*  Released under MIT license: https://opensource.org/licenses/MIT
*
*  Start tracking your Coinbase portfolio easily by importing this library
*  into your Google Apps Script project.
*
*  Visit https://github.com/neojato/coinbase-lib for more details.
*
*/

function auth(api_key = '', api_secret = '') {
  return new Client(api_key, api_secret);
}

class Client {
  constructor(api_key = '', api_secret = '') {
    let response_ = [];
    this.api_key = api_key;
    this.api_secret = api_secret;

    if (this.api_key == '') {
      throw 'Missing \'api_key\'.';
    }

    if (this.api_secret == '') {
      throw 'Missing \'api_secret\'.';
    }

    // Private Methods
    // --------------------------------------------------
    function request_(method, requestPath, params) {
      let timestamp = Math.floor(Date.now() / 1000).toString();
      let message = (timestamp + method + '/v2' + requestPath);
      let byteSignature = Utilities.computeHmacSha256Signature(message, api_secret);
      let signature = byteSignature.reduce(function(str,chr) {
        chr = (chr < 0 ? chr + 256 : chr).toString(16);
        return str + (chr.length==1?'0':'') + chr;
      },'');

      let options = {
        method: method,
        muteHttpExceptions: true, 
        headers: {
          'Content-Type':        'application/json',
          'CB-ACCESS-SIGN':      signature,
          'CB-ACCESS-TIMESTAMP': timestamp,
          'CB-ACCESS-KEY':       api_key,
          'CB-VERSION':          '2017-05-19'
        }
      };

      if (method in ['POST','PUT']) {
        options.payload = JSON.stringify(params);
      }

      // cache repeat calls to UrlFetch
      let cache = CacheService.getScriptCache();
      let result = JSON.parse(cache.get(requestPath));

      if (!result) {
        // path not found in cache, fetch then cache the response for 4.5 minutes
        result = handleResponse_(UrlFetchApp.fetch('https://api.coinbase.com/v2' + requestPath, options));
        cache.put(requestPath, JSON.stringify(result), 270);
      }
      
      return result;
    }

    function handleResponse_(response) {
      if (response.getResponseCode() !== 200) {
        throw 'Request failed with reponse code: ' + response.getResponseCode();
      }
      return JSON.parse(response.getContentText());
    }

    function get_(requestPath) {
      let content_ = [];
      // get requests can be paginated, make sure we iterate through all the pages
      let response = request_('GET', requestPath);

      if (!('pagination' in response)) {
        // result is not paginated
        return response.data;
      }

      response_.push(...response.data);
      if (response.pagination.next_uri == null) {
        // next_uri is null when the cursor has been iterated to the last element
        content_ = response_;
        response_ = [];
        return content_;
      }

      requestPath = response.pagination.next_uri.substring(3,); // remove API version from path
      return get_(requestPath);
    }

    function post_(requestPath, params) {
      return request_('POST', requestPath, params);
    }

    function put_(requestPath, params) {
      return request_('PUT', requestPath, params);
    }

    function delete_(requestPath) {
      return request_('DELETE', requestPath);
    }

    // Data API
    // --------------------------------------------------
    this.getCurrencies = function() {
      // https://developers.coinbase.com/api/v2#currencies
      return get_('/currencies');
    };

    this.getExchangeRates = function() {
      // https://developers.coinbase.com/api/v2#exchange-rates
      return get_('/exchange-rates');
    };

    this.getBuyPrice = function(currency_pair) {
      // https://developers.coinbase.com/api/v2#get-buy-price
      return get_('/prices/' + currency_pair + '/buy');
    };

    this.getSellPrice = function(currency_pair) {
      // https://developers.coinbase.com/api/v2#get-sell-price
      return get_('/prices/' + currency_pair + '/sell');
    };

    this.getSpotPrice = function(currency_pair) {
      // https://developers.coinbase.com/api/v2#get-spot-price
      return get_('/prices/' + currency_pair + '/spot');
    };

    this.getTime = function() {
      // https://developers.coinbase.com/api/v2#time
      return get_('/time');
    };

    // User API
    // --------------------------------------------------
    this.getUser = function(user_id) {
      // https://developers.coinbase.com/api/v2#show-a-user
      return get_('/users/' + user_id);
    };

    this.getCurrentUser = function() {
      // https://developers.coinbase.com/api/v2#show-current-user
      return get_('/user');
    };

    this.getAuthInfo = function() {
      // https://developers.coinbase.com/api/v2#show-authorization-information
      return get_('/user/auth');
    };

    this.updateCurrentUser = function(params) {
      // https://developers.coinbase.com/api/v2#update-current-user
      return put_('/user', params);
    };

    // Notifications API
    // --------------------------------------------------
    this.getNotifications = function() {
      // https://developers.coinbase.com/api/v2#list-notifications
      return get_('/notifications');
    };

    this.getNotification = function(notification_id) {
      // https://developers.coinbase.com/api/v2#show-a-notification
      return get_('/notifications/' + notification_id);
    }

    // Accounts API
    // --------------------------------------------------
    this.getAccounts = function() {
      // https://developers.coinbase.com/api/v2#list-accounts
      return get_('/accounts');
    };

    this.getAccount = function(account_id) {
      // https://developers.coinbase.com/api/v2#show-an-account
      return get_('/accounts/' + account_id);
    };

    this.updateAccount = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#update-account
      return put_('/accounts/' + account_id, params);
    };

    this.deleteAccount = function(account_id) {
      // https://developers.coinbase.com/api/v2#delete-account
      return delete_('/accounts/' + account_id);
    };

    // Addresses API
    // --------------------------------------------------
    this.getAddresses = function(account_id) {
      // https://developers.coinbase.com/api/v2#list-addresses
      return get_('/accounts/' + account_id + '/addresses');
    };

    this.getAddress = function(account_id, address_id) {
      // https://developers.coinbase.com/api/v2#show-addresss
      return get_('/accounts/' + account_id + '/addresses/' + address_id);
    };

    this.getAddressTransactions = function(account_id, address_id) {
      // https://developers.coinbase.com/api/v2#list-address39s-transactions
      return get_('/accounts/' + account_id + '/addresses/' + address_id + '/transactions');
    };

    this.createAddress = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#create-address
      return post_('/accounts/' + account_id + '/addresses', params);
    };

    // Transactions API
    // --------------------------------------------------
    this.getTransactions = function(account_id) {
      // https://developers.coinbase.com/api/v2#list-transactions
      return get_('/accounts/' + account_id + '/transactions');
    };

    this.getTransaction = function(account_id, transaction_id) {
      // https://developers.coinbase.com/api/v2#show-a-transaction
      return get_('/accounts/' + account_id + '/transactions/' + transaction_id);
    };

    this.sendMoney = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#send-money
      const required = ['to', 'amount', 'currency'];
      for (let x in required) {
        if (!(required[x] in params)) {
          throw 'Missing required parameter: ' + required[x];
        }
      }
      params.type = 'send';
      return post_('/accounts/' + account_id + '/transactions', params);
    };

    this.transferMoney = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#transfer-money-between-accounts
      const required = ['to', 'amount', 'currency'];
      for (let x in required) {
        if (!(required[x] in params)) {
          throw 'Missing required parameter: ' + required[x];
        }
      }
      params.type = 'transfer';
      return post_('/accounts/' + account_id + '/transactions', params);
    };

    this.requestMoney = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#request-money
      const required = ['to', 'amount', 'currency'];
      for (let x in required) {
        if (!(required[x] in params)) {
          throw 'Missing required parameter: ' + required[x];
        }
      }
      params.type = 'request';
      return post_('/accounts/' + account_id + '/transactions', params);
    };

    this.completeRequest = function(account_id, request_id) {
      // https://developers.coinbase.com/api/v2#complete-request-money
      return post_('/accounts/' + account_id + '/transactions/' + request_id + '/complete', params);
    };

    this.resendRequest = function(account_id, request_id) {
      // https://developers.coinbase.com/api/v2#re-send-request-money
      return post_('/accounts/' + account_id + '/transactions/' +request_id + '/resend', params);
    };

    this.cancelRequest = function(account_id, request_id) {
      // https://developers.coinbase.com/api/v2#cancel-request-money
      return post_('/accounts/' + account_id + '/transactions/' +request_id + '/cancel', params);
    };

    // Buys API
    // --------------------------------------------------
    this.getBuys = function(account_id) {
      // https://developers.coinbase.com/api/v2#list-buys
      return get_('/accounts/' + account_id + '/buys');
    };

    this.getBuy = function(account_id, buy_id) {
      // https://developers.coinbase.com/api/v2#show-a-buy
      return get_('/accounts/' + account_id + '/buys/' + buy_id);
    };

    this.buy = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#place-buy-order
      if(!('amount' in params) && !('total' in params)) {
        throw 'Missing required parameter: \'amount\' or \'total\'';
      }
      const required = ['currency', 'payment_method'];
      for (let x in required) {
        if (!(required[x] in params)) {
          throw 'Missing required parameter: ' + required[x];
        }
      }
      return post_('/accounts/' + account_id + '/buys', params);
    };

    this.commitBuy = function(account_id, buy_id, params) {
      // https://developers.coinbase.com/api/v2#commit-a-buy
      return post_('/accounts/' + account_id + '/buys/' + buy_id + '/commit', params);
    };

    // Sells API
    // --------------------------------------------------
    this.getSells = function(account_id) {
      // https://developers.coinbase.com/api/v2#list-sells
      return get_('/accounts/' + account_id + '/sells');
    };

    this.getSell = function(account_id, sell_id) {
      // https://developers.coinbase.com/api/v2#show-a-sell
      return get_('/accounts/' + account_id + '/sells/' + sell_id);
    };

    this.sell = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#place-sell-order
      if(!('amount' in params) && !('total' in params)) {
        throw 'Missing required parameter: \'amount\' or \'total\'';
      }
      const required = ['currency'];
      for (let x in required) {
        if (!(required[x] in params)) {
          throw 'Missing required parameter: ' + required[x];
        }
      }
      return post_('/accounts/' + account_id + '/sells', params);
    };

    this.commitSell = function(account_id, sell_id, params) {
      // https://developers.coinbase.com/api/v2#commit-a-sell
      return post_('/accounts/' + account_id + '/sells/' + sell_id + '/commit', params);
    };

    // Deposits API
    // --------------------------------------------------
    this.getDeposits = function(account_id) {
      // https://developers.coinbase.com/api/v2#deposit-resource
      return get_('/accounts/' + account_id + '/deposits');
    };

    this.getDeposit = function(account_id, deposit_id) {
      // https://developers.coinbase.com/api/v2#show-a-deposit
      return get_('/accounts/' + account_id + '/deposits/' + deposit_id);
    };

    this.deposit = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#deposit-funds
      const required = ['amount', 'currency', 'payment_method'];
      for (let x in required) {
        if (!(required[x] in params)) {
          throw 'Missing required parameter: ' + required[x];
        }
      }
      return post_('/accounts/' + account_id + '/deposits', params);
    };

    this.commitDeposit = function(account_id, deposit_id, params) {
      // https://developers.coinbase.com/api/v2#commit-a-deposit
      return post_('/accounts/' + account_id + '/deposits/' + deposit_id + '/commit', params);
    };

    // Withdrawals API
    // --------------------------------------------------
    this.getWithdrawals = function(account_id) {
      // https://developers.coinbase.com/api/v2#list-withdrawals
      return get_('/accounts/' + account_id + '/withdrawals')
    };

    this.getWithdrawal = function(account_id, withdrawal_id) {
      // https://developers.coinbase.com/api/v2#show-a-withdrawal
      return get_('/accounts/' + account_id + '/withdrawals/' + withdrawal_id);
    };

    this.withdrawal = function(account_id, params) {
      // https://developers.coinbase.com/api/v2#withdraw-funds
      const required = ['amount', 'currency', 'payment_method'];
      for (let x in required) {
        if (!(required[x] in params)) {
          throw 'Missing required parameter: ' + required[x];
        }
      }
      return post_('/accounts/' + account_id + '/withdrawals', params);
    };

    this.commitWithdrawal = function(account_id, withdrawal_id, params) {
      // https://developers.coinbase.com/api/v2#commit-a-withdrawal
      return post_('/accounts/' + account_id + '/withdrawals/' + withdrawal_id + '/commit', params);
    };

    // Payment Methods API
    // --------------------------------------------------
    this.getPaymentMethods = function() {
      // https://developers.coinbase.com/api/v2#list-payment-methods
      return get_('/payment-methods');
    };

    this.getPaymentMethod = function(payment_method_id) {
      // https://developers.coinbase.com/api/v2#show-a-payment-method
      return get_('/payment-methods/' + payment_method_id);
    };
  }
}
