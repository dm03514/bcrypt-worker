var rp = require('request-promise');


class CompareResult {
    constructor(result) {
        console.log("CompareResult.constructor: ", result);
        if (!result.hasOwnProperty("Match")) {
            throw Error("object requires 'match' property, received: " + JSON.stringify(result));
        }
        this.match = result.Match;
        this.result = result;
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
        TODO - Compare returns a promise for a comparison
        result.  Will raise error on any non 200 status
        code.
    */
    async compare(plainTextPassword, hash) {
        let result = await this.transport.makeRequest(
            this.transport.buildRequest(plainTextPassword, hash)
        );
        console.log("Client.compare result: ", result);

        return new CompareResult(result);
    }
}

exports.Client = Client;
exports.RPTransport = RPTransport;
