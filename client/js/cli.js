const commandLineArgs = require('command-line-args');
const decrypter = require('./decrypter.js');

const optionDefinitions = [
    { name: 'workerAddr', alias: 'w', type: String},
    { name: 'hash', type: String, alias: 'h' },
    { name: 'password', alias: 'p', type: String }
];

const options = commandLineArgs(optionDefinitions);
console.log(options);


let c = new decrypter.Client(
    new decrypter.RPTransport(
        options.workerAddr
    )
);

c.compare(options.password, options.pass)
.then((res) => {
    console.log("success: ", res)
})
.catch((err) => {
    console.log("err: ", err)
});