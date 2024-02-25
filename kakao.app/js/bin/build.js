// monsterkodi/kode 0.256.0

var _k_

var CMD, FLG, LIB, OUT, SRC

CMD = "zig c++"
SRC = "main.cpp app.mm bundle.mm win.mm view.mm route.mm watch.mm"
OUT = "../Contents/MacOS/kakao"
LIB = "-framework WebKit -framework Cocoa"
FLG = "-arch arm64 -Os -Wno-nullability-completeness"
import fs from "fs"
import process from "process"
import childp from "child_process"
import slash from '../lib/kxk/slash.js'
import path from 'path'
export default function ()
{
    var args, cmd, cp, cwd, dirname, opt, out

    cmd = `${CMD} -v -I . ${SRC} ${LIB} ${FLG} -o ${OUT}`
    console.log(cmd)
    dirname = path.dirname(import.meta.url.slice(7))
    cwd = slash.resolve(dirname + '/../../src')
    opt = {shell:true,cwd:cwd}
    args = cmd.split(' ')
    cmd = 'cd'
    out = args.pop()
    out = slash.resolve(opt.cwd + '/' + out)
    args.push(out)
    args.unshift('&&')
    args.unshift(cwd)
    cp = childp.spawn(cmd,args,opt)
    cp.stdout.on('data',function (data)
    {
        console.log(`${data}`)
    })
    cp.stderr.on('data',function (data)
    {
        console.log(`${data}`)
    })
    cp.on('close',function (code)
    {
        if (code === 0)
        {
            console.log('app built')
        }
    })
    return null
};