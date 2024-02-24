// monsterkodi/kode 0.252.0

var _k_

var args

import karg from '../lib/kxk/karg'
import build from './build.js'
import kode from './kode.js'
args = karg(`kk
    options                                 **
    build      build application            = false
    kode       transpile kode               = false
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
        if (args.kode)
        {
            return kode()
        }
    }
}

export default kk.run;