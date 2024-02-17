// monsterkodi/kode 0.249.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var cmd, CMD, FLG, LIB, opt, OUT, PRE, SRC

CMD = "zig c++"
SRC = "main.cpp app.mm bundle.mm win.mm view.mm"
OUT = "../Contents/MacOS/kakao"
PRE = "--std=c++17 -I ."
LIB = "-framework WebKit -framework Cocoa"
FLG = "-DMACOSX_DEPLOYMENT_TARGET=10.7 -Wno-deprecated-declarations -arch arm64 -Os"
import fs from "node:fs"
import process from "node:process"
import childp from "node:child_process"
try
{
    fs.unlinkSync(__dirname + '/log.txt')
}
catch (e)
{
    null
}
cmd = `${CMD} ${PRE} ${SRC} ${LIB} ${FLG} -o ${OUT}`
opt = {cwd:__dirname + '/src'}
childp.exec(cmd,opt,function (err, stdout, stderr)
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
    console.log('kakao built')
})