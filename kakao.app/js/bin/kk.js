// monsterkodi/kode 0.256.0

var _k_

var args

import karg from '../lib/kxk/karg.js'
import build from './build.js'
import knrd from './knrd.js'
args = karg(`kk
    options                                 **
    build      build application            = false
    knrd       transpile kode, styl, pug    = false
    rebuild    rebuild all targets          = false
    watch      watch directory for changes  = false
    info       show build status            = false
    test       run tests                    = false
    verbose    log more                     = false
    quiet      log nothing                  = false
    debug      log debug                    = false`)
class kk
{
    static run ()
    {
        if (args.build)
        {
            build()
        }
        if (args.knrd)
        {
            return knrd(args.options)
        }
    }
}

export default kk.run;