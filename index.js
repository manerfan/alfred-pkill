'use strict';

const alfy = require('alfy');
const alfredNotifier = require('alfred-notifier');

const psList = require('ps-list');
const pidFromPort = require('pid-from-port');

const _ = require('lodash');

// Checks for available update and updates the `info.plist`
alfredNotifier();

let pidFromPortCache = async () => {
    let pids = alfy.cache.get("PKILL_PID_FROM_PORT");
    if (!!pids) {
        let _pids = new Map();
        for (let k of Object.keys(pids)) {
            _pids.set(k, pids[k]);
        }
        pids = _pids;
    } else {
        pids = null;
    }

    if (!pids || !_.isMap(pids) || _.isEmpty(pids)) {
        pids = await pidFromPort.list() || new Map();

        let cache = {};
        for (let k of pids.keys()) {
            cache[k] = pids.get(k);
        }
        alfy.cache.set("PKILL_PID_FROM_PORT", cache, { maxAge: 5000 });
    }

    return pids;
}

let psListCache = async () => {
    let ps = alfy.cache.get("PKILL_PS_LIST");
    if (!ps || !_.isArray(ps)) {
        ps = await psList() || [];
        alfy.cache.set("PKILL_PS_LIST", ps, { maxAge: 5000 });
    }
    return ps;
}

(async () => {
    let input = (alfy.input || '').trim().toLowerCase();

    let processes = [];
    if (input.startsWith(':')) {
        input = input.slice(1).trim();
        const result = await Promise.all([
            pidFromPortCache(),
            psListCache()
        ]);

        const ports = result[0];
        const ps = result[1];

        const pidM = new Map();
        ports.forEach((pid, port) => {
            if (`${port}`.includes(input)) {
                pidM.set(pid, port);
            }
        });

        processes = ps.map(p => Object.assign({}, p, { port: pidM.get(p.pid) })).filter(p => !!p.port)
    } else if (input.startsWith('?')) {
        input = input.slice(1).trim();
        const ps = await psListCache();
        processes = ps.filter(p => `${p.pid}` == input);
    } else {
        const ps = await psListCache();
        processes = ps.filter(p => p.cmd.toLowerCase().includes(input));
    }

    let items = processes
        .filter(p => !p.name.endsWith(' Helper'))
        .map(p => {
            const path = p.cmd.replace(/\.app\/Contents\/.*$/, '.app');
            const icon = path.replace(/ -.*/, '');

            let subtitle = `pid: ${p.pid} - ${path}`;
            if (!!p.port) {
                subtitle = `Listen: ${p.port} - pid: ${p.pid} - ${path}`;
            }

            return {
                title: p.name,
                autocomplete: p.name,
                subtitle,
                arg: JSON.stringify({ name: p.name, pid: p.pid, force: false }),
                icon: {
                    type: 'fileicon',
                    path: icon
                },
                mods: {
                    shift: {
                        subtitle: `CPU: ${p.cpu}% | Mem: ${p.memory}%`
                    },
                    alt: {
                        subtitle: `Force Kill!`,
                        arg: JSON.stringify({ pid: p.pid, force: true })
                    },
                    cmd: {
                        subtitle: `按Command展示并复制全路径`,
                        arg: path
                    }
                }
            }
        });

    if (items.length < 1) {
        items = [{
            title: alfy.input,
            subtitle: '无匹配项'
        }]
    }

    alfy.output(items);
})();