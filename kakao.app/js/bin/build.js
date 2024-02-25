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
    var args, cmd, cp, dirname, opt, out

    cmd = `${CMD} -I . ${SRC} ${LIB} ${FLG} -o ${OUT}`
    console.log('cmd',cmd)
    dirname = path.dirname(import.meta.url.slice(7))
    console.log('dirname',dirname)
    opt = {cwd:slash.resolve(dirname + '/../../src')}
    args = cmd.split(' ')
    cmd = args.shift()
    out = args.pop()
    out = slash.resolve(opt.cwd + '/' + out)
    args.push(out)
    console.log('cmd',cmd,'args',args,'opt',opt)
    cp = childp.spawn(cmd,args,opt)
    cp.stdout.on('data',function (data)
    {
        console.log(`${data}\n`)
    })
    cp.stderr.on('data',function (data)
    {
        console.log(`${data}\n`)
    })
    return cp.on('close',function (code)
    {
        console.log('exit',code)
    })
};