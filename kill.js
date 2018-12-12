'use strict';

const alfy = require('alfy');
const execa = require('execa');
const processExists = require('process-exists');

(async () => {
    const p = JSON.parse(process.argv[2]);

    const cmd = 'kill';
    const args = [p.pid];
    
    if (!!p.force) {
        args.unshift('-9');
    }

    const exists = await processExists(p.pid)
    if (exists) {
        await execa(cmd, args);
        console.log(`${cmd} ${args.join(' ')} ${p.name}`);

        alfy.cache.set("PKILL_PID_FROM_PORT", {}, { maxAge: 10 });
        alfy.cache.set("PKILL_PS_LIST", [], { maxAge: 10 });
    }
})()



