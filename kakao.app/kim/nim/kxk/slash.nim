import std/[os, paths, strutils, sequtils]

proc normalize*(path : string) : string = 
    var p = path
    for i, c in p: 
        if (c == "\\"[0]): 
            p[i] = '/'
    if ((p.len > 1) and (p[^1] == '/')): 
        p[0..^2]
    else: 
        p

proc split*(path : string) : seq[string] = 
    path.split("/").filter(proc (s : string) : bool = (s.len > 0))

proc parse*(path : string) : tuple[path:string,dir:string,file:string,name:string,ext:string] = 
    var path = path.normalize()
    var split = path.split()
    var dir = split[0..^2].join("/")
    var file = split[^1]
    var name = file
    var ext = ""
    if ((dir.len == 0) and (path notin @[".", ".."])): 
        dir = if (path[0] == '/'): "/" else: "."
    elif (((dir.len > 0) and (path[0] == '/')) and (dir[0] != '/')): 
        dir = "/" & dir
    var nmspl = file.split(".")
    if (nmspl.len > 1): 
        name = nmspl[0..^2].join(".")
        ext = nmspl[^1]
    (path: path, dir: dir, file: file, name: name, ext: ext)

proc dir*(path : string) : string = 
    path.parse.dir
    # splitFile(path.Path)[0].string

proc dirs*(path : string) : seq[string] = 
    var dirs = path.dir.split('/')
    if ((dirs[0] == "") and (dirs.len == 1)): 
        dirs.delete(0..0)
    dirs

proc file*(path : string) : string = 
    path.splitPath[1]

proc name*(path : string) : string = 
    splitFile(path.Path)[1].string

proc ext*(path : string) : string = 
    splitFile(path.Path)[2].string[1..^1]

proc mkdir*(dir : string) = 
    if not dirExists(dir): 
        createDir(dir)

proc copy*(src : string, dest : string) = 
    mkdir(dest.parentDir())
    copyFileWithPermissions(src, dest)

proc write*(path : string, text : string) = 
    mkdir(path.parentDir())
    path.writeFile(text)

proc read*(path : string) : string = 
    path.readFile()

proc swapExt*(path : string, ext : string) : string = 
    $path.Path.changeFileExt("." & ext)

proc swapLastPathComponentAndExt*(path : string, src : string, tgt : string) : string = 
    var dirs = path.dirs()
    for i in countdown(dirs.high, 0): 
        if (dirs[i] == src): 
            dirs[i] = tgt
            break
    dirs.add(path.file.swapExt(tgt))
    dirs.join("/")