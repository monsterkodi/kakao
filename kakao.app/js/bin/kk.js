// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var args

import os from '../lib/kxk/os.js'
import karg from '../lib/kxk/karg.js'
import slash from '../lib/kxk/slash.js'
import knrd from './knrd.js'
import build from './build.js'
import childp from 'child_process'
import path from 'path'
args = karg(`kk
    options                                 **
    build      build application            = false
    knrd       transpile kode, styl, pug    = false
    run        run application executable   = false
    rebuild    rebuild all targets          = false -R
    watch      watch directory for changes  = false
    info       show build status            = false
    test       run tests                    = false
    verbose    log more                     = false
    quiet      log nothing                  = false
    debug      log debug                    = false`)
class kk
{
    static async run ()
    {
        var sleep

        sleep = async function (ms)
        {
            await new Promise((function (r)
            {
                return setTimeout(r,ms)
            }).bind(this))
            return true
        }
        while (!os.loaded)
        {
            await sleep(150)
        }
        if (args.run)
        {
            kk.spawn()
        }
        if (args.build)
        {
            build()
        }
        if (args.knrd)
        {
            return knrd(args.options)
        }
    }

    static spawn ()
    {
        var cmd, dirname, opt

        dirname = path.dirname(import.meta.url.slice(7))
        cmd = slash.join(dirname,'../../Contents/MacOS/kakao')
        opt = {shell:true}
        return childp.exec(cmd,opt,function (err, stdout, stderr)
        {
            if (err)
            {
                console.error('ERROR',err)
            }
            if (!_k_.empty(stdout))
            {
                console.log(stdout)
            }
            if (!_k_.empty(stderr))
            {
                console.error(stderr)
            }
        })
    }
}

export default kk.run;