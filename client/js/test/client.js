const assert = require('assert');
const decrypter = require('./../decrypter.js');


class StubSuccessTransport {
    constructor(resolveVal) {
        this.resolveVal = resolveVal;
    }

    buildRequest(plainTextPassword, hash) {}

    makeRequest(req) {
        return new Promise((resolve, reject) => {
            resolve(this.resolveVal);
        })
    }
}

class StubRejectTransport {
    constructor(val) {
        this.val = val;
    }

    buildRequest(plainTextPassword, hash) {}

    makeRequest(req) {
        return new Promise((resolve, reject) => {
            reject(this.val);
        })
    }
}

describe('Client', function() {
    describe('compare()', function() {
        it('should resolve a compare result when successful', function() {
            let c = new decrypter.Client(
                new StubSuccessTransport({
                    Match: false,
                })
            );
            return c.compare("plainTextPassword", "hash")
            .then(function(result) {
                assert.equal(result.match, false);
            })
            .catch(function(err) {
                assert.fail("no error expected, received: " + err);
            })
        });

        it('should reject an error when CompareResult parsing is invalid', function() {
            let c = new decrypter.Client(
                new StubSuccessTransport({
                    INVALID_KEY: true,
                })
            );
            return c.compare("plainTextPassword", "hash")
            .catch(function(err) {
                assert.equal("object requires 'match' property, received: {\"INVALID_KEY\":true}", err);
            })
        });

        it('should reject an error when an a transport error is encountered', function() {
            let c = new decrypter.Client(
                new StubRejectTransport({
                    REJECTED: "REJECTED",
                })
            );
            return c.compare("plainTextPassword", "hash")
                .catch(function(err) {
                    assert.deepEqual({ REJECTED: 'REJECTED' }, err);
                })
        });

    });
});