var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var CMD, FLG, LIB, OUT

CMD = "zig c++"
OUT = "../Contents/MacOS/kakao"
LIB = "-framework WebKit -framework Cocoa"
FLG = "-arch arm64 -Os -Wno-nullability-completeness"
import child_process from "child_process"

import slash from "../kxk/slash.js"

import fs from "../kxk/fs.js"

export default async function ()
{
    var cmd, cwd, opt, SRC, srcDir, srcFiles

    srcDir = slash.path(import.meta.dirname,'../../src')
    srcFiles = await fs.list(srcDir)
    srcFiles = srcFiles.filter(function (f)
    {
        return _k_.in(slash.ext(f.path),['cpp','mm'])
    })
    SRC = srcFiles.map(function (f)
    {
        return f.file
    }).join(' ')
    cmd = `${CMD} -I . ${SRC} ${LIB} ${FLG} -o ${OUT}`
    cwd = srcDir
    opt = {shell:true,cwd:cwd}
    return new Promise(function (resolve, reject)
    {
        return child_process.exec(cmd,opt,function (err, stdout, stderr)
        {
            if (err)
            {
                console.error('ERROR',err)
                return reject(err)
            }
            if (!_k_.empty(stdout))
            {
                console.log(stdout)
            }
            return resolve()
        })
    })
};