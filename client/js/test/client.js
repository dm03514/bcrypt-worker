const assert = require('assert');
const decrypter = require('./../decrypter.js');


class StubTransport {
    constructor(returnPromise) {
        this.returnPromise = returnPromise;
    }

    buildRequest(plainTextPassword, hash) {}

    makeRequest(req) {
        return this.returnPromise;
    }
}

describe('Client', function() {
    describe('compare()', function() {
        it('should resolve a compare result when successful', async function() {
            let c = new decrypter.Client(
                new StubTransport(
                    new Promise((resolve, reject) => {
                        resolve(
                            {
                                Match: false,
                            }
                        )
                    })
                )
            );
            let result = await c.compare("plainTextPassword", "hash");
            assert.equal(result.match, false);
        });

        it('should reject an error when CompareResult parsing is invalid', async function() {
            let c = new decrypter.Client(
                new StubTransport(
                    new Promise((resolve, reject) => {
                        resolve(
                            {
                                INVALID_KEY: true,
                            }
                        )
                    })
                )
            );
            let errCalled = false;
            try {
                await c.compare("plainTextPassword", "hash");
            } catch (err) {
                assert.equal("Error: object requires 'match' property, received: {\"INVALID_KEY\":true}", err);
                errCalled = true;
            } finally {
                assert.ok(errCalled);
            }
        });

        xit('should reject an error when an a transport error is encountered', function() {});
    });
});