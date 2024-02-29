// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var args

import os from '../lib/kxk/os.js'
import karg from '../lib/kxk/karg.js'
import slash from '../lib/kxk/slash.js'
import knrd from './knrd.js'
import build from './build.js'
import process from 'process'
import childp from 'child_process'
import path from 'path'
import fs from 'fs/promises'
args = karg(`kk
    options                                  **
    build      build application executable  = false
    knrd       transpile kode, styl, pug     = false
    run        run application executable    = false
    rebuild    rebuild all targets           = false -R
    info       show build status             = false
    test       run tests                     = false
    clean      remove transpilated files     = false 
    verbose    log more                      = false
    quiet      log nothing                   = false
    debug      log debug                     = false`)
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
        if (!(args.info || args.test || args.knrd || args.build || args.run || args.clean || args.rebuild))
        {
            args.info = true
            args.test = true
            args.knrd = true
            args.build = true
            args.run = true
        }
        if (args.info)
        {
            await kk.info()
        }
        if (args.test)
        {
            await kk.test()
        }
        if (args.knrd)
        {
            await knrd(args.options)
            delete args.options
        }
        if (args.build)
        {
            await build()
        }
        if (args.run)
        {
            await kk.spawn()
        }
        if (args.clean)
        {
            await kk.clean()
        }
        if (args.rebuild)
        {
            await kk.rebuild()
        }
        if (!_k_.empty(args.options))
        {
            console.log('leftover options',args.options)
        }
    }

    static async rebuild ()
    {
        await knrd()
        await build()
        return kk.spawn()
    }

    static spawn ()
    {
        var cmd, opt

        cmd = slash.path(import.meta.dirname,'../../Contents/MacOS/kakao')
        opt = {shell:true,detached:true}
        return childp.spawn(cmd,[],opt)
    }

    static appPath ()
    {
        return slash.path(import.meta.dirname,'../../')
    }

    static appName ()
    {
        return slash.name(kk.appPath())
    }

    static async info ()
    {
        console.log('info',kk.appPath())
    }

    static async test ()
    {
        var cmd, opt

        cmd = "node js/test/test.js"
        opt = {shell:true,cwd:kk.appPath()}
        return new Promise(function (resolve, reject)
        {
            return childp.exec(cmd,opt,function (err, stdout, stderr)
            {
                if (err)
                {
                    console.error('ERROR',err)
                    return reject(err)
                }
                else
                {
                    if (!_k_.empty(stdout))
                    {
                        console.log(stdout)
                    }
                    return resolve()
                }
            })
        })
    }

    static async clean ()
    {
        var appExe, jsDir

        jsDir = slash.path(import.meta.dirname,'../../js')
        appExe = slash.path(import.meta.dirname,'../../Contents/MacOS/kakao')
        await fs.rm(jsDir,{recursive:true,force:true})
        return await fs.unlink(appExe)
    }
}

global['kk'] = kk
export default kk.run;