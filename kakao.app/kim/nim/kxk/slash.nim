import std/[os, paths, strutils, sequtils]

proc mkdir*(dir : string) = 
    if not dirExists(dir): 
        createDir(dir)

proc copy*(src : string, dest : string) = 
    mkdir(dest.parentDir())
    copyFileWithPermissions(src, dest)

proc write*(path : string, text : string) = 
    mkdir(path.parentDir())
    path.writeFile(text)

proc swapLastPathComponentAndExt*(file : string, src : string, tgt : string) : string = 
    var (dir, _, _) = splitFile(file.Path)
    var dirParts = dir.string.split(DirSep)
    if ((dirParts[0] == "") and (dirParts.len == 1)): 
        dirParts.delete(0..0)
    for i in countdown(dirParts.high, 0): 
        if (dirParts[i] == src): 
            dirParts[i] = tgt
            break
    dirParts.add(file.Path.changeFileExt("." & tgt).splitPath[1].string)
    dirParts.join("/")