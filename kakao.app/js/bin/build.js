// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var CMD, FLG, LIB, OUT, SRC

CMD = "zig c++"
SRC = "main.cpp app.mm bundle.mm win.mm view.mm route.mm watch.mm"
OUT = "../Contents/MacOS/kakao"
LIB = "-framework WebKit -framework Cocoa"
FLG = "-arch arm64 -Os -Wno-nullability-completeness"
import fs from "fs"
import process from "process"
import childp from "child_process"
import path from 'path'
export default function ()
{
    var cmd, opt, __dirname

    cmd = `${CMD} -I . ${SRC} ${LIB} ${FLG} -o ${OUT}`
    __dirname = path.dirname(import.meta.url.slice(7))
    opt = {cwd:__dirname + '/../../src'}
    return childp.exec(cmd,opt,function (err, stdout, stderr)
    {
        if (err)
        {
            console.error('ERROR',err)
            process.exit(2)
        }
        if (!_k_.empty(stdout))
        {
            console.log(stdout)
        }
        console.log('app built')
    })
};