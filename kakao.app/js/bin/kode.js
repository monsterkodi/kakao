// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var dirname

import Kode from './kode/kompile.js'
import slash from '../lib/kxk/slash.js'
import kolor from '../lib/kxk/kolor.js'
import dirlist from '../lib/kxk/dirlist.js'
import fs from 'fs/promises'
kolor.globalize()
import path from 'path'
dirname = path.dirname(import.meta.url.slice(7))
class kode
{
    static async run ()
    {
        var compText, file, item, jsDir, jsFile, kode, kodeDir, kodeFile, kodeText, list, origText

        kode = new Kode
        kodeDir = slash.resolve(dirname + '/../../kode')
        jsDir = slash.resolve(dirname + '/../../js')
        list = await dirlist(kodeDir)
        var list1 = _k_.list(list)
        for (var _33_17_ = 0; _33_17_ < list1.length; _33_17_++)
        {
            item = list1[_33_17_]
            if (item.type === 'dir')
            {
                continue
            }
            file = item.name
            if (slash.ext(file) === 'kode')
            {
                kodeFile = item.path
                jsFile = slash.swapExt(item.path.replace(kodeDir,jsDir),'js')
                kodeText = await fs.readFile(kodeFile,{encoding:'utf8'})
                origText = await fs.readFile(jsFile,{encoding:'utf8'})
                compText = kode.compile(kodeText)
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
        }
    }
}

export default kode.run;