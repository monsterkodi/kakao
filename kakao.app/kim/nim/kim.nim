# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███
import std/[os, osproc, parseopt, random, streams, asyncdispatch, asyncfile, posix]
import kommon
import rndr
import greet
var params : seq[string]
var files : seq[string]
var optParser = initOptParser()
var outdir = ""
var tests = false
var verbose = false
var testFiles = walkDir((((getAppFilename().splitFile()[0] / "..") / "nim") / "test")).toSeq().map(proc (r : tuple) : string = r.path)
randomize()
proc verb(msg : string) = 
    if verbose: echo(msg)
#  ███████   ████████  █████████         ███████   ████████   █████████
# ███        ███          ███           ███   ███  ███   ███     ███   
# ███  ████  ███████      ███           ███   ███  ████████      ███   
# ███   ███  ███          ███           ███   ███  ███           ███   
#  ███████   ████████     ███            ███████   ███           ███   
for kind, key, val in optParser.getopt(): 
    case kind:
        of cmdArgument: 
            params.add(key)
            files.add(key)
        of cmdLongOption, cmdShortOption: 
            params.add('-' & key)
            case key:
                of "test", "t": 
                    tests = true
                of "verbose", "v": 
                    verbose = true
                of "outdir", "o": 
                    outdir = val
                of "help", "h": 
                    echo("usage: ", getAppFilename().extractFilename(), " [options] [file.kim ...]")
                    echo("")
                    echo("      transpiles kim files to nim")
                    echo("      watches cwd if no files are given")
                    echo("")
                    echo("options:")
                    echo("  -o --outdir:DIR  output directory")
                    echo("     --test        run tests")
                    echo("  -v --verbose     verbose output")
                    quit(1)
                else: 
                    echo("unknown option!: ", key)
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
    proc restart = 
        let args = allocCStringArray(@[getAppFilename()] & params)
        discard execv(getAppFilename().cstring(), args)
        quit(1) # only reaches here if execve fails
# ███       ███████    ███████   ████████  ███  ███      ████████
# ███      ███   ███  ███        ███       ███  ███      ███     
# ███      ███   ███  ███  ████  ██████    ███  ███      ███████ 
# ███      ███   ███  ███   ███  ███       ███  ███      ███     
# ███████   ███████    ███████   ███       ███  ███████  ████████
proc logFile(f : string, prefix = "") = 
    let (dir, name, ext) = f.relativePath(getCurrentDir()).splitFile()
    var d = if dir.len: dir & "/" else: ""
    var icon = if (ext == ".kim"): "  " else: "  "
    var color = if (ext == ".kim"): fgGreen else: fgMagenta
    styledEcho(color, prefix, styleDim, icon, resetStyle, color, styleBright, d, styleBright, name, resetStyle)
#  ███████   ███████   ██     ██  ████████   ███  ███      ████████
# ███       ███   ███  ███   ███  ███   ███  ███  ███      ███     
# ███       ███   ███  █████████  ████████   ███  ███      ███████ 
# ███       ███   ███  ███ █ ███  ███        ███  ███      ███     
#  ███████   ███████   ███   ███  ███        ███  ███████  ████████
proc compile(file : string, outDir = "bin") : bool = 
    profileScope("comp")
    var cmd = &"nim c --outDir={outdir} {file}"
    # let cmd = &"nim c --outDir={outdir} --stackTrace:on --lineTrace:on {file}"
    let (output, exitCode) = execCmdEx(cmd)
    if (exitCode != 0): 
        styledEcho(fgRed, "✘ ", $cmd)
        echo(output)
        false
    else: 
        if verbose: 
            styledEcho(fgGreen, "✔ ", fgWhite, cmd)
        true
# █████████  ████████   ███████  █████████   ███████
#    ███     ███       ███          ███     ███     
#    ███     ███████   ███████      ███     ███████ 
#    ███     ███            ███     ███          ███
#    ███     ████████  ███████      ███     ███████ 
proc runTests() : bool = 
    profileScope("test")
    var fail = false
    for f in testFiles: 
        # let cmd = &"nim r --colors:on {f}"
        let p = startProcess(command = "nim", args = @["r", f], options = {poInteractive, poUsePath})
        let startTime = getMonoTime()
        var output = ""
        let fd = p.outputHandle
        var flags = fcntl(fd, F_GETFL, 0)
        discard fcntl(fd, F_SETFL, (flags or O_NONBLOCK))
        while true: 
            let elapsed = (getMonoTime() - startTime).inMilliseconds
            if (elapsed >= 5000): 
                fail = true
                output.add(&"test killed after {elapsed} ms!!")
                p.terminate()
                sleep(50)
                if p.running: 
                    p.kill()
                break
            var line = newString((1024 * 10))
            let bytesRead = read(fd, addr(line[0]), line.len)
            if (bytesRead > 0): output.add(line & "\n")
            elif (bytesRead == 0): break
            elif (errno == EAGAIN): discard poll(nil, 0, 50)
            else: break
        let exitCode = p.waitForExit()
        if (((exitCode != 0) or verbose) or fail): 
            styledEcho(output.replace("[Suite]", fg(fgYellow) & "▸\x1b[0m").replace("[OK]", fg(fgGreen) & "✔\x1b[0m").replace("[FAILED]", fg(fgRed) & "✘\x1b[0m"))
        else: 
            let okCount = output.count("[OK]")
            styledEcho(output.replace("[Suite]", fg(fgYellow) & "▸\x1b[0m").replace(peg"'[OK]' .+", &"{ansiStyleCode(styleDim)} ✔ {okCount}\x1b[0m"))
        if (exitCode != 0): 
            styledEcho(fgRed, "✘ ", $f)
            fail = true
    # log ""
    not fail
if files.len: 
    # profileStart 'translate'
    var transpiled = rndr.files(files)
    # profileStop 'translate'
    quit((transpiled.len - files.len))
if tests: 
    var exit = if runTests(): 0 else: 1
    quit(exit)
#  ███████  █████████   ███████    ███████   ████████
# ███          ███     ███   ███  ███        ███     
# ███████      ███     █████████  ███  ████  ███████ 
#      ███     ███     ███   ███  ███   ███  ███     
# ███████      ███     ███   ███   ███████   ████████
proc stage(kimFiles : seq[string], src : string, dst : string) : bool = 
    profileStart(dst & " ")
    for f in kimFiles: 
        copyFileWithPermissions(f, f.replace("/kim/kim/", &"/kim/{dst}/kim/"))
    for f in kimFiles: 
        let (output, exitCode) = execCmdEx(&"{src}/bin/kim " & f.replace("/kim/kim/", &"/kim/{dst}/kim/"))
        if (exitCode != 0): 
            echo(output)
            logFile(f, "✘ ")
            return false
        # else
        #     log output[0..^2].replace(getCurrentDir(), ".")
    profileStop(dst & " ")
    if compile(&"{dst}/nim/kim.nim", &"{dst}/bin"): 
        profileStart("test")
        let (output, exitCode) = execCmdEx(&"{dst}/bin/kim --test")
        profileStop("test")
        if (exitCode == 0): 
            return true
        else: 
            echo(output)
    echo(&"✘ {dst}")
    false
# ███   ███   ███████   █████████   ███████  ███   ███
# ███ █ ███  ███   ███     ███     ███       ███   ███
# █████████  █████████     ███     ███       █████████
# ███   ███  ███   ███     ███     ███       ███   ███
# ██     ██  ███   ███     ███      ███████  ███   ███
proc watch(paths : seq[string]) = 
    proc hook() {.noconv.} = 
    
        styledEcho("")
        styledEcho(fgGreen, farewells[rand(farewells.high)])
        quit(0)
    setControlCHook(hook)
    var modTimes : Table[string,times.Time]
    styledEcho("")
    styledEcho(fgGreen, greetings[rand(greetings.high)])
    styledEcho("")
    for p in paths: 
        let (dir, name, ext) = p.splitFile()
        styledEcho(fgBlue, styleDim, "● ", resetStyle, styleBright, fgBlue, dir, " ", resetStyle, styleBright, fgYellow, name, styleDim, ext, resetStyle)
    var firstLoop = true
    while true: 
        var toTranspile : seq[string]
        var kimFiles : seq[string]
        for path in paths: 
            if not dirExists(path): 
                continue
            for f in walkDirRec(path): 
                let (_, _, ext) = f.splitFile()
                if (ext == ".kim"): kimFiles.add(f) else: continue
                let modTime = getFileInfo(f).lastWriteTime
                if not modTimes.hasKey(f): 
                    modTimes[f] = modTime
                    continue
                if (modTimes[f] == modTime): 
                    continue
                modTimes[f] = modTime
                if (ext == ".kim"): 
                    toTranspile.add(f)
        if firstLoop: 
            firstLoop = false
            if verbose: 
                for f in kimFiles: logFile(f)
        if toTranspile: 
            echo("\x1bc")
            for f in toTranspile: 
                logFile(f, "▸ ")
            if stage(kimFiles, ".", "k1m"): 
                if stage(kimFiles, "k1m", "k2m"): 
                    echo("-> deploy")
                    for f in kimFiles: 
                        let srcNim = f.replace("/kim/kim/", "/kim/k2m/nim/").replace(".kim", ".nim")
                        let tgtNim = f.replace("/kim/kim/", "/kim/nim/").replace(".kim", ".nim")
                        copyFileWithPermissions(srcNim, tgtNim)
                    if compile("k2m/nim/kim.nim", "bin"): 
                        restart()
        sleep(200)
watch(@[getCurrentDir() & "/kim"])