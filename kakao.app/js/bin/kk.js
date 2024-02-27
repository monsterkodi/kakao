// monsterkodi/kode 0.256.0

var _k_

var args

import os from '../lib/kxk/os.js'
import karg from '../lib/kxk/karg.js'
import slash from '../lib/kxk/slash.js'
import knrd from './knrd.js'
import build from './build.js'
import process from 'process'
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
        if (args.knrd)
        {
            knrd(args.options)
        }
        if (args.build)
        {
            build()
        }
        if (args.run)
        {
            return kk.spawn()
        }
    }

    static spawn ()
    {
        var cmd, opt

        cmd = slash.join(import.meta.dirname,'../../Contents/MacOS/kakao')
        opt = {shell:true,detached:true}
        console.log('spawn',cmd)
        return childp.spawn(cmd,[],opt)
    }
}

global['kk'] = kk
export default kk.run;