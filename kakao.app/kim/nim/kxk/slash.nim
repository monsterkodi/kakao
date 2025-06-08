import std/[os, paths, strutils, sequtils, strformat, macros, dirs, appdirs]

proc normalize*(path : string) : string = 
    var p = path
    var swallow : int = (p.high + 1)
    for i in countdown(p.high, 0): 
        if (i >= swallow): 
            p.delete(i..i)
            if (i == swallow): 
                if ((p[0] == '/') and (path[0] != '/')): 
                    p.delete(0..0)
                return slash.normalize(p)
            continue
        if (p[i] == '\\'): 
            p[i] = '/'
        if ((i < p.high) and (p[i] == '/')): 
            if (i < (p.high - 1)): 
                if ((p[(i + 1)] == '.') and (p[(i + 2)] == '/')): 
                    p.delete((i + 1)..(i + 2))
                if ((((p[(i + 1)] == '.') and (p[(i + 2)] == '.')) and (i > 0)) and (p[(i - 1)] != '.')): 
                    p.delete(i..(i + 2))
                    swallow = (i - 1)
                    while ((swallow > 0) and (p[swallow] != '/')): 
                        (swallow -= 1)
            if (p[(i + 1)] == '/'): 
                p.delete((i + 1)..(i + 1))
    if ((p.len >= 4) and (p[0..3] == "./..")): 
        p.delete(0..1)
    if ((p.len > 1) and (p[^1] == '/')): 
        p[0..^2]
    elif (((p.len > 1) and (p[0] == '/')) and (path[0] notin {'/', '\\'})): 
        p[1..^1]
    else: 
        p

proc files*(path : string) : seq[string] = walkDirRec(path).toSeq()

proc path*(args : seq[string]) : string = 
    
    proc slsh(s : string) : string = s.replace("\\", "/")
    slash.normalize args.filter(proc (s : string) : bool = (s.len > 0)).map(slsh).join("/")

proc path*(args : varargs[string]) : string = 
    slash.path(args.toSeq())

proc split*(path : string) : seq[string] = 
    var s = path.split("/")
    if (s[^1].len == 0): s.setLen((s.len - 1))
    s

proc has*(path : string, subpath : string) : bool = (subpath in slash.split(path))

proc home*(args : varargs[string]) : string = slash.path(@[slash.normalize(appDirs.getHomeDir().string)].concat(args.toSeq()))

proc cwd*(args : varargs[string]) : string = slash.path(@[paths.getCurrentDir().string].concat(args.toSeq()))

proc app*(args : varargs[string]) : string = slash.path(@[getAppDir().string].concat(args.toSeq()))

proc exe*() : string = getAppFilename().string

proc untilde*(path : string) : string = path.expandTilde()

proc tilde*(path : string) : string = path.replace(slash.home(), "~")

type parseInfo* = tuple[dir: string, name: string, ext: string, file: string, path: string]

proc parse*(path : string) : parseInfo = 
    var path = path.normalize().untilde()
    var split = path.split()
    var dir = ""
    if (split.len > 2): 
        dir = split[0..^2].join("/")
    elif (split.len == 2): 
        dir = split[0]
    var file = split[^1]
    var name = file
    var ext = ""
    if ((dir.len == 0) and (path notin @[".", ".."])): 
        dir = if (path[0] == '/'): "/" else: "."
    var nmspl = file.split(".")
    if (nmspl.len > 1): 
        name = nmspl[0..^2].join(".")
        ext = nmspl[^1]
    (dir: dir, name: name, ext: ext, file: file, path: path)

proc dirNameExt*(path : string) : tuple[dir:string,name:string,ext:string] = 
    var (dir, name, ext, _, _) = slash.parse(path)
    (dir: dir, name: name, ext: ext)

proc dir*(path : string) : string = path.parse.dir

proc file*(path : string) : string = path.splitPath[1]

proc name*(path : string) : string = splitFile(path.Path)[1].string

proc ext*(path : string) : string = splitFile(path.Path)[2].string[1..^1]

proc mkdir*(dir : string) = 
         if not dirExists(dir): createDir(dir)

proc copy*(src : string, dest : string) = 
         mkdir(dest.parentDir()) ; copyFileWithPermissions(src, dest)

proc write*(path : string, text : string) = 
         mkdir(path.parentDir()) ; path.writeFile(text)

proc read*(path : string) : string = path.readFile()

proc dirs*(path : string) : seq[string] = 
    var dirs = path.dir.split('/')
    if ((dirs[0] == "") and (dirs.len == 1)): 
        dirs.delete(0..0)
    dirs

proc swapExt*(path : string, ext : string) : string = 
    $path.Path.changeFileExt("." & ext)

proc splitExt*(path : string) : seq[string] = 
    var split = path.split()
    var dotidx = split[^1].rfind(".")
    var ext = ""
    if (dotidx > 0): 
        ext = split[^1][(dotidx + 1)..^1]
        split[^1] = split[^1][0..<dotidx]
    var pth = split.join("/")
    @[pth, ext]

proc removeExt*(path : string) : string = path.splitExt[0]

proc swapLastPathComponentAndExt*(path : string, src : string, tgt : string) : string = 
    var dirs = path.dirs()
    for i in countdown(dirs.high, 0): 
        if (dirs[i] == src): 
            dirs[i] = tgt
            break
    dirs.add(path.file.swapExt(tgt))
    dirs.join("/")

proc isRelative*(path : string) : bool = ((path.len == 0) or ((path.len > 0) and (path[0] notin @['/', '~'])))

proc isAbsolute*(path : string) : bool = ((path.len > 0) and (path[0] in @['/', '~']))

proc isRoot*(path : string) : bool = (path.normalize() == "/")

proc absolute*(path : string, parent : string) : string = 
    if slash.isRelative(path): 
        slash.path(parent, path)
    else: 
        slash.untilde(path)

proc absolute*(path : string) : string = slash.absolute(path, slash.cwd())

proc relative*(path : string, base : string) : string = 
    paths.relativePath(slash.normalize(path).Path, slash.normalize(base).Path).string

proc relative*(path : string) : string = 
    slash.relative(path, slash.cwd())