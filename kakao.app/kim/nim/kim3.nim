# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███

import std/[monotimes, logging, os, osproc, sequtils, tables, terminal, times, strformat, strutils, parseopt, random, pegs, osproc, streams, asyncdispatch, asyncfile, posix]
import kommon
import trans
import rndr
import greet

var params = default(seq[string])
var optParser = initOptParser()
var files : seq[string]
var outdir = ""
var tests = false
var verbose = false
var transpile = false

var testFiles = walkDir((currentSourcePath().splitFile()[0] / "test")).toSeq().map(proc (r : tuple) : string = r.path)

randomize()

proc verb(msg : string) = 

    if verbose: 
        log(msg)
#  ███████   ████████  █████████         ███████   ████████   █████████
# ███        ███          ███           ███   ███  ███   ███     ███   
# ███  ████  ███████      ███           ███   ███  ████████      ███   
# ███   ███  ███          ███           ███   ███  ███           ███   
#  ███████   ████████     ███            ███████   ███           ███   

for kind, key, val in optParser.getopt(): 
    case kind:
        of cmdArgument: 
            params.add key
            files.add(key)
        of cmdLongOption, cmdShortOption: 
            params.add '-' & key
            case key:
                of "test": 
                    tests = true
                of "verbose", "v": 
                    verbose = true
                of "outdir", "o": 
                    outdir = val
                of "transpile", "t": 
                    transpile = true
                of "help", "h": 
                    log("usage: ", getAppFilename().extractFilename, " [options] [file.kim ...]")
                    log("")
                    log("      transpiles kim files to nim")
                    log("      watches cwd if no files are given")
                    log("")
                    log("options:")
                    log("  -o --outdir:DIR  output directory")
                    log("  -t --transpile   log transpilat")
                    log("     --test        run tests")
                    log("  -v --verbose     verbose output")
                    quit(1)
                else: log("unknown option: ", key)
            
                    quit(1)
        of cmdEnd: 
            discard 
                        
# ████████   ████████   ███████  █████████   ███████   ████████   █████████
# ███   ███  ███       ███          ███     ███   ███  ███   ███     ███   
# ███████    ███████   ███████      ███     █████████  ███████       ███   
# ███   ███  ███            ███     ███     ███   ███  ███   ███     ███   
# ███   ███  ████████  ███████      ███     ███   ███  ███   ███     ███   

            
when defined(posix): 
    import posix
    proc restart() = 
        args = allocCStringArray(@[getAppFilename()] & params)
        discard execv(getAppFilename().cstring, args)
        quit(1) # only reaches here if execve fails
# ███       ███████    ███████   ████████  ███  ███      ████████
# ███      ███   ███  ███        ███       ███  ███      ███     
# ███      ███   ███  ███  ████  ██████    ███  ███      ███████ 
# ███      ███   ███  ███   ███  ███       ███  ███      ███     
# ███████   ███████    ███████   ███       ███  ███████  ████████

proc logFile(f : string, prefix = "") = 

    if not verbose: return
    let (dir, name, ext) = f.relativePath(getCurrentDir()).splitFile()
    d = if dir.len: dir & "/" else: ""
    icon = if (ext == ".kim"): "  " else: "  "
    color = if (ext == ".kim"): fgGreen else: fgMagenta

    styledEcho(color, prefix, styleDim, icon, resetStyle, color, styleBright, d, styleBright, name, resetStyle) # styleDim ext resetStyle
    
        
#  ███████   ███████   ██     ██  ████████   ███  ███      ████████
# ███       ███   ███  ███   ███  ███   ███  ███  ███      ███     
# ███       ███   ███  █████████  ████████   ███  ███      ███████ 
# ███       ███   ███  ███ █ ███  ███        ███  ███      ███     
#  ███████   ███████   ███   ███  ███        ███  ███████  ████████

proc compile(file : string, outDir = "bin") : bool = 
    profileScope("comp")
    let cmd = &"nim c --outDir:{outdir} --stackTrace:on --lineTrace:on {file}"
    let (output, exitCode) = execCmdEx(cmd)
    
        
    if (exitCode != 0): 
        styledEcho(fgRed, "✘ ", &"{cmd}")
        log(output)
        false
    else: 
        if verbose: styledEcho(fgGreen, "✔ ", fgWhite, cmd)
        true
        
# █████████  ████████   ███████  █████████   ███████
#    ███     ███       ███          ███     ███     
#    ███     ███████   ███████      ███     ███████ 
#    ███     ███            ███     ███          ███
#    ███     ████████  ███████      ███     ███████ 

proc runTests = 
    profileScope("test")
    for f in testFiles: 
        let cmd = &"nim r --colors:on {f}"
        let p = startProcess(command = "nim", args = @["r", f], options = {poStdErrToStdOut, poUsePath})
        let startTime = getMonoTime()
        var output = ""
    
        var fd = p.outputHandle
        var flags = fcntl(fd, F_GETFL, 0)
        discard fcntl(fd, F_SETFL, (flags or O_NONBLOCK))
    
        while true: 
            let elapsed = (getMonoTime() - startTime).inMilliseconds
            if (elapsed >= 2000): 
                output.add(&"test killed after {elapsed} ms!!")
                p.terminate()
                sleep(50)
                if p.running: 
                    p.kill()
                break
                
                            
            var line = newString((1024 * 10))
            let bytesRead = read(fd, addr(line[0]), line.len)
            if (bytesRead > 0): 
                    output.add(line & "\n")
            elif (errno == EAGAIN): 
                    discard poll(nil, 0, 50)
            else: 
                    break
                            
        
        let exitCode = p.waitForExit()
        
        if ((exitCode != 0) or verbose): 
            styledEcho(output.replace("[Suite]", ansiForegroundColorCode(fgYellow) & "▸").replace("[OK]", ansiForegroundColorCode(fgGreen) & "✔\x1b[0m").replace("[FAILED]", ansiForegroundColorCode(fgRed) & "✘\x1b[0m"))
        else: 
            okCount = output.count("[OK]")
            styledEcho(output.replace("[Suite]", ansiForegroundColorCode(fgYellow) & "▸").replace(peg, "'[OK]' .+", &"{ansiStyleCode, styleDim} ✔ {okCount}"))
        if (exitCode != 0): 
            styledEcho(fgRed, "✘ ", &"{cmd}")
        echo("")
        
if files.len: 

    let transpiled = if transpile: rndr.files(files) else: trans.pile(files)
    quit((transpiled.len - files.len))

if tests: 
    runTests()
    quit(0)
# ███   ███   ███████   █████████   ███████  ███   ███
# ███ █ ███  ███   ███     ███     ███       ███   ███
# █████████  █████████     ███     ███       █████████
# ███   ███  ███   ███     ███     ███       ███   ███
# ██     ██  ███   ███     ███      ███████  ███   ███

proc watch(paths : var seq[string]) = 

    addHandler(newConsoleLogger(fmtStr = "▸ ", useStderr = true))

    setControlCHook(proc () {.noconv.} = 
        
        styledEcho('')
        styledEcho(fgGreen, farewells[rand(farewells.high)])
        quit(0))

    var modTimes : Table[string,times.Time]

    styledEcho('')
    styledEcho(fgGreen, greetings[rand(greetings.high)])
    styledEcho('')

    for p in paths: 
        let (dir, name, ext) = p.splitFile()
        styledEcho(fgBlue, styleDim, "● ", resetStyle, styleBright, fgBlue, dir, " ", resetStyle, styleBright, fgYellow, name, styleDim, ext, resetStyle)

    var firstLoop = true

    while true: 
    
        var doBuild = false
        var toTranspile : seq[string]
        var kimFiles : seq[string]
        var nimFiles : seq[string]
    
        for path in paths: 
        
            if not dirExists(path): 
            
                continue
            
            for f in walkDirRec(path): 
            
                let (dir, name, ext) = f.splitFile()
            
                case ext:
                    of ".kim": kimFiles.add(f)
                    of ".nim": nimFiles.add(f)
                    else: continue
            
                let modTime = getFileInfo(f).lastWriteTime
            
                if not modTimes.hasKey(f): 
                    modTimes[f] = modTime
                    continue
                if (modTimes[f] == modTime): 
                    continue
                modTimes[f] = modTime
                if ((ext == ".nim") and not testFiles.contains(f)): 
                    doBuild = true
                elif (ext == ".kim"): 
                    toTranspile.add f
            
        if firstLoop: 
                                    
            firstLoop = false
            for f in kimFiles: logFile(f)
            for f in nimFiles: logFile(f)
            
                
        if toTranspile: 
            verb(&"toTranspile: {toTranspile}")
            for f in trans.pile(toTranspile): 
                verb(&"transpiled {f}")
                logFile(f, "✔ ")
            runTests()
        if doBuild: 
            if compile("nim/kim.nim", "bin"): 
                for f in kimFiles: 
                    logFile(trans.trans(f), "✔ ")
                restart()
        sleep(200)
                
watch(@[getCurrentDir()])
