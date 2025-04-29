# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███

use std ▪ monotimes logging os osproc sequtils tables terminal times strformat strutils parseopt random pegs osproc streams asyncdispatch asyncfile posix
use kommon
use trans
use rndr
use greet

var params    = default seq[string]
var optParser = initOptParser()
var ◇seq[string] files     
var outdir    = ""
var tests     = false
var verbose   = false
var transpile = false

var testFiles = walkDir(currentSourcePath().splitFile()[0] / "test").toSeq().map(◇tuple r ➜string -> r.path)

randomize()

verb = ◇string msg -> 

    if verbose:
        echo msg 

#  ███████   ████████  █████████         ███████   ████████   █████████
# ███        ███          ███           ███   ███  ███   ███     ███   
# ███  ████  ███████      ███           ███   ███  ████████      ███   
# ███   ███  ███          ███           ███   ███  ███           ███   
#  ███████   ████████     ███            ███████   ███           ███   

for kind key val in optParser.getopt():
    switch kind
        cmdArgument
            params.add key
            files.add(key)
        cmdLongOption cmdShortOption
            params.add '-' & key
            switch key
                "test"
                    tests = true
                "verbose" "v"
                    verbose = true
                "outdir" "o"
                    outdir = val
                "transpile" "t"
                    transpile = true
                "help" "h"
                    echo "usage: " getAppFilename().extractFilename " [options] [file.kim ...]"
                    echo ""
                    echo "      transpiles kim files to nim"
                    echo "      watches cwd if no files are given"
                    echo ""
                    echo "options:"
                    echo "  -o --outdir:DIR  output directory"
                    echo "  -t --transpile   log transpilat"
                    echo "     --test        run tests"
                    echo "  -v --verbose     verbose output"
                    quit(1)
                ➜ 
                    echo "unknown option: " key
                    quit(1)
        cmdEnd
            discard
                        
# ████████   ████████   ███████  █████████   ███████   ████████   █████████
# ███   ███  ███       ███          ███     ███   ███  ███   ███     ███   
# ███████    ███████   ███████      ███     █████████  ███████       ███   
# ███   ███  ███            ███     ███     ███   ███  ███   ███     ███   
# ███   ███  ████████  ███████      ███     ███   ███  ███   ███     ███   
            
when defined(posix):
    use posix
    restart = () ->
        args = allocCStringArray(@[getAppFilename()] & params)
        discard execv(getAppFilename().cstring, args)
        quit(1) # only reaches here if execve fails
    
# ███       ███████    ███████   ████████  ███  ███      ████████
# ███      ███   ███  ███        ███       ███  ███      ███     
# ███      ███   ███  ███  ████  ██████    ███  ███      ███████ 
# ███      ███   ███  ███   ███  ███       ███  ███      ███     
# ███████   ███████    ███████   ███       ███  ███████  ████████

logFile = ◇string f prefix="" ->

    if not verbose:
        return  
    let (dir name ext) = f.relativePath(getCurrentDir()).splitFile()
    d = if dir.len ➜ dir & "/" ➜ ""
    icon  = if ext == ".kim" ➜ "  " ➜ "  "
    color = if ext == ".kim" ➜ fgGreen ➜ fgMagenta
    
    styledEcho color prefix styleDim icon resetStyle color styleBright d styleBright name resetStyle # styleDim ext resetStyle
        
#  ███████   ███████   ██     ██  ████████   ███  ███      ████████
# ███       ███   ███  ███   ███  ███   ███  ███  ███      ███     
# ███       ███   ███  █████████  ████████   ███  ███      ███████ 
# ███       ███   ███  ███ █ ███  ███        ███  ███      ███     
#  ███████   ███████   ███   ███  ███        ███  ███████  ████████

compile = ◇string file outDir="bin" ➜ bool ->
    profileScope "comp"       
    let cmd = "nim c --outDir:#{outdir} --stackTrace:on --lineTrace:on #{file}"
    let (output exitCode) = execCmdEx(cmd)
        
    if exitCode != 0:
        styledEcho fgRed "✘ " "#{cmd}"
        echo output
        false
    else:
        if verbose:
            styledEcho fgGreen "✔ " fgWhite cmd
        true

# █████████  ████████   ███████  █████████   ███████
#    ███     ███       ███          ███     ███     
#    ███     ███████   ███████      ███     ███████ 
#    ███     ███            ███     ███          ███
#    ███     ████████  ███████      ███     ███████ 

runTests = ->
    profileScope "test"
    for f in testFiles:
        let cmd = "nim r --colors:on #{f}"
        let p = startProcess(command = "nim", args = ["r", f], options = {poStdErrToStdOut, poUsePath})
        let startTime = getMonoTime()
        var output = ""
        
        var fd = p.outputHandle
        var flags = fcntl(fd, F_GETFL, 0)
        discard fcntl(fd F_SETFL flags or O_NONBLOCK)
        
        while true:
            let elapsed = (getMonoTime() - startTime).inMilliseconds
            if elapsed >= 2000:
                output.add("test killed after #{elapsed} ms!!")
                p.terminate()
                sleep(50)
                if p.running:
                    p.kill()
                break
                            
            var line = newString 1024*10
            let bytesRead = read(fd, addr(line[0]), line.len)
            if bytesRead > 0:
                output.add(line & "\n")
            elif bytesRead == 0:
                break
            elif errno == EAGAIN:
                discard poll(nil, 0, 50)
            elif not p.running:
                break
            else:
                break
        
        let exitCode = p.waitForExit()
        
        if exitCode != 0 or verbose:
            styledEcho output.replace("[Suite]", ansiForegroundColorCode(fgYellow) & "▸").replace("[OK]", ansiForegroundColorCode(fgGreen) & "✔\x1b[0m").replace("[FAILED]", ansiForegroundColorCode(fgRed) & "✘\x1b[0m")
        else:
            okCount = output.count "[OK]"
            styledEcho output.replace("[Suite]", ansiForegroundColorCode(fgYellow) & "▸").replace(peg"'[OK]' .+", "#{ansiStyleCode styleDim} ✔ #{okCount}")
            
        if exitCode != 0:
            styledEcho fgRed, "✘ ", "#{cmd}"
    echo ""

if files.len:

    if transpile:
        let transpiled = rndr.files(files)
        quit(transpiled.len - files.len)    
    else:
        let transpiled = trans.pile(files)
        quit(transpiled.len - files.len)    

if tests:
    runTests()
    quit(0)
 
# ███   ███   ███████   █████████   ███████  ███   ███
# ███ █ ███  ███   ███     ███     ███       ███   ███
# █████████  █████████     ███     ███       █████████
# ███   ███  ███   ███     ███     ███       ███   ███
# ██     ██  ███   ███     ███      ███████  ███   ███

watch = ◆seq[string] paths ->

    addHandler(newConsoleLogger(fmtStr = "▸ ", useStderr = true))
    
    setControlCHook(() ->  {.noconv.}
        
        styledEcho ''
        styledEcho fgGreen, farewells[rand(farewells.high)]
        quit 0)
    
    var ◇Table[string,times.Time] modTimes
    
    styledEcho ''
    styledEcho fgGreen, greetings[rand(greetings.high)]
    styledEcho ''
    
    for p in paths:
        let (dir name ext) = p.splitFile()
        styledEcho fgBlue, styleDim, "● ", resetStyle, styleBright, fgBlue, dir, " ", resetStyle, styleBright, fgYellow, name, styleDim, ext, resetStyle
    
    var firstLoop = true
    
    while true:
    
        var doBuild = false
        var ◇seq[string] toTranspile
        var ◇seq[string] kimFiles
        var ◇seq[string] nimFiles
        
        for path in paths:
        
            if not dirExists(path):
            
                continue
                
            for f in walkDirRec(path):
            
                let (dir name ext) = f.splitFile()
                
                if ext == ".kim":
                    kimFiles.add(f)
                elif ext == ".nim":
                    nimFiles.add(f)
                else:
                    continue
                
                let modTime = getFileInfo(f).lastWriteTime
                
                if not modTimes.hasKey(f):
                    modTimes[f] = modTime
                    continue
                  
                if modTimes[f] == modTime:
                    continue
        
                modTimes[f] = modTime
                if ext == ".nim" and not testFiles.contains(f):
                    doBuild = true
                elif ext == ".kim":
                    toTranspile.add f
                
        if firstLoop:
                                    
            firstLoop = false
            for f in kimFiles:
                logFile f
            for f in nimFiles:
                logFile f
                
        if toTranspile:
            verb "toTranspile: #{toTranspile}"
            for f in trans.pile(toTranspile):
                verb "transpiled #{f}"    
                logFile f, "✔ "
            runTests()
            
        if doBuild:
            if compile("nim/kim.nim", "bin"):
                for f in kimFiles:
                    let transpiled = trans.trans(f)
                    logFile transpiled, "✔ "
                restart()
        sleep 200

watch @[getCurrentDir()]
