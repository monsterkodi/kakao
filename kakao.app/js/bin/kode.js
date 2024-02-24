// monsterkodi/kode 0.252.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kompile from './kode/kompile'
import { readdir } from 'fs/promises'
import slash from '../lib/kxk/slash'
class kode
{
    static async run ()
    {
        var compText, file, jsDir, jsFile, kodeDir, kodeFile, kodeText, origText

        kodeDir = slash.resolve(__dirname + '/../../kode')
        jsDir = slash.resolve(__dirname + '/../../js')
        console.log(kodeDir,'▸',jsDir)
        var list = _k_.list(await readdir(kodeDir,{recursive:true}))
        for (var _20_17_ = 0; _20_17_ < list.length; _20_17_++)
        {
            file = list[_20_17_]
            if (slash.ext(file) === 'kode')
            {
                kodeFile = slash.join(kodeDir,file)
                jsFile = slash.join(jsDir,slash.swapExt(file,'js'))
                kodeText = await Bun.file(kodeFile).text()
                origText = await Bun.file(jsFile).text()
                compText = kompile(kodeText)
                if (origText !== compText)
                {
                    console.log(kodeFile,'▸',jsFile)
                }
            }
        }
    }
}

export default kode.run;