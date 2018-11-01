var rp = require('request-promise');


class CompareResult {
    constructor(match) {
        this.match = match;
    }
}

class RPTransport {
    constructor(workerAddr, client=rp) {
        this.client = client;

        this.opts = {
            method: 'GET',
            uri: workerAddr,
            json: true,
            headers: {
                "Content-Type": "application/json",
            }
        };
    }

    // clone the opts since this can be executed concurrently:
    buildRequest(plainTextPassword, hash) {
        let options = { ... this.opts };
        options.body = {
            "HashedPassword": hash,
            "Password": plainTextPassword,
        };
        return options
    }

    makeRequest(req) {
        return this.client(req)
    }
}

class Client {
    constructor(transport) {
        this.transport = transport;
    }

    /*
        Compare returns a promise for a comparison
        result.  Will raise error on any non 200 status
        code.
    */
    compare(plainTextPassword, hash) {
        return new Promise((resolve, reject) => {
            this.transport.makeRequest(this.transport.buildRequest(plainTextPassword, hash))
                .then(function(result) {
                    // resolve with a CompareResult as an adapter
                    // instead of returning the response from the API directly
                    if (!result.hasOwnProperty("Match")) {
                        throw "object requires 'match' property, received: " + JSON.stringify(result);
                    }
                    return resolve(
                        new CompareResult(result.Match)
                    )
                })
                .catch(function(err) {
                    return reject(err)
                });
        })
    }
}

exports.Client = Client;
exports.RPTransport = RPTransport;
