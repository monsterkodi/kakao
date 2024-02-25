// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = process.hrtime.bigint()}, profilend: function (id) { var b = process.hrtime.bigint()-_k_.hrtime[id]; let f=1000n; for (let u of ['ns','μs','ms','s']) { if (u=='s' || b<f) { return console.log(id+' '+(1000n*b/f)+' '+u); } f*=1000n; }}}

var dirname

import Kode from './kode/kompile.js'
import slash from '../lib/kxk/slash.js'
import kolor from '../lib/kxk/kolor.js'
import fs from 'fs/promises'
kolor.globalize()
import path from 'path'
dirname = path.dirname(import.meta.url.slice(7))
class kode
{
    static async run ()
    {
        var compText, file, files, jsDir, jsFile, kode, kodeDir, kodeFile, kodeText, origText, stat

        kode = new Kode
        kodeDir = slash.resolve(dirname + '/../../kode')
        jsDir = slash.resolve(dirname + '/../../js')
        console.log(kodeDir,'▸',jsDir)
        files = await fs.readdir(kodeDir,{recursive:false})
        console.log("files:",files)
        var list = _k_.list(files)
        for (var _36_17_ = 0; _36_17_ < list.length; _36_17_++)
        {
            file = list[_36_17_]
            stat = await fs.stat(slash.join(kodeDir,file))
            console.log(file,'isDir',stat.mode & 0o040000)
            if (slash.ext(file) === 'kode')
            {
                kodeFile = slash.join(kodeDir,file)
                jsFile = slash.join(jsDir,slash.swapExt(file,'js'))
                if (global.Bun)
                {
                    kodeText = await Bun.file(kodeFile).text()
                    origText = await Bun.file(jsFile).text()
                }
                else
                {
                    kodeText = await fs.readFile(kodeFile,{encoding:'utf8'})
                    origText = await fs.readFile(jsFile,{encoding:'utf8'})
                }
                _k_.profile('comp')
                compText = kode.compile(kodeText)
                _k_.profilend('comp')
                if (origText !== compText)
                {
                    console.log(kodeFile,'▸',jsFile)
                    console.log(red(origText))
                    console.log(blue(compText))
                }
                else
                {
                    console.log(kodeFile)
                }
            }
            else
            {
                stat = await fs.stat(slash.join(kodeDir,file))
                console.log('not kode',file,stat.mode & 0x040000)
            }
        }
    }
}

export default kode.run;