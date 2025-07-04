--  ███████  ███       ███████    ███████  ███   ███
-- ███       ███      ███   ███  ███       ███   ███
-- ███████   ███      █████████  ███████   █████████
--      ███  ███      ███   ███       ███  ███   ███
-- ███████   ███████  ███   ███  ███████   ███   ███

ffi = require "ffi"
os = require "os"
io = require "io"
array = require "kxk.array"
kstr = require "kxk.kstr"
kseg = require "kxk.kseg"

ffi.cdef([[

    typedef void *FILE; 
    typedef struct DIR DIR;
    typedef int pid_t;
    
    struct dirent {
        unsigned long  d_ino;       
        unsigned long  d_seekoff;   
        unsigned short d_reclen;    
        unsigned short d_namlen;    
        unsigned char  d_type;      
        char           d_name[1024];
    };
    
    struct dirent *readdir(DIR *dirp);
    
    struct stat {
        uint32_t    st_dev;
        uint16_t    st_mode;
        uint16_t    st_nlink;
        uint64_t    st_ino;
        uint32_t    st_uid;               
        uint32_t    st_gid;                
        uint32_t    st_rdev;                
        int64_t     st_atime;        
        int64_t     st_atimensec;    
        int64_t     st_mtime;        
        int64_t     st_mtimensec;    
        int64_t     st_ctime;        
        int64_t     st_ctimensec;    
        int64_t     st_btime;    
        int64_t     st_btimensec;
        int64_t     st_size;                
        int64_t     st_blocks;              
        int32_t     st_blksize;             
        uint32_t    st_flags;               
        uint32_t    st_gen;                 
        int32_t     st_lspare;              
        int64_t     st_qspare[2];
    };

    DIR *opendir(const char *filename);
    int closedir(DIR *dirp);
    int close(int fd);
    
    int stat64(const char *path, struct stat *buf);
    int lstat64(const char *path, struct stat *buf);

    char *getcwd(char *buf, size_t size);
    int pipe(int pipefd[2]);
    int dup2(int oldfd, int newfd);
    int execvp(const char *file, char *const argv[]);
    int execv(const char *path, char *const argv[]);
    int fcntl(int fd, int cmd, ...);
    int fileno(FILE *stream);
    ssize_t read(int fd, void *buf, size_t count);
    pid_t fork();
    pid_t waitpid(pid_t pid, int *wstatus, int options);
    void _exit(int status);
    int chdir(const char *path);
    
    typedef void (*sighandler_t)(int);
    sighandler_t signal(int signum, sighandler_t handler);
    
    int write(int fd, const char *buf, size_t count);
]])


function sigint() 
    return os.exit(0)
end
ffi.C.signal(2, ffi.cast("sighandler_t", sigint))


function cmdargs(cmd, args) 
    assert(cmd)
    args = args or ({})
    local alen = (#args + 2)
    local argv = ffi.new("char*[?]", alen)
    argv[0] = ffi.cast("char*", cmd)
    for i = 1, (#args + 1)-1 do 
        argv[i] = ffi.cast("char*", ffi.string(args[i]))
    end
    
    argv[alen] = nil
    return argv
end

local slash = {}

-- ████████   ████████   ███████  ████████    ███████   ███   ███  ███   ███
-- ███   ███  ███       ███       ███   ███  ███   ███  ███ █ ███  ████  ███
-- ███████    ███████   ███████   ████████   █████████  █████████  ███ █ ███
-- ███   ███  ███            ███  ███        ███   ███  ███   ███  ███  ████
-- ███   ███  ████████  ███████   ███        ███   ███  ██     ██  ███   ███


function slash.respawn() 
    ffi.C.fcntl(0, 2, 0) -- clear close on exit flags
    ffi.C.fcntl(1, 2, 0)
    ffi.C.fcntl(2, 2, 0)
    
    local cmd = arg[0]
    if arg[-1] then 
        cmd = arg[-1]
        table.insert(arg, 1, arg[0])
        arg[0] = cmd
        arg[-1] = nil
    end
    
    local args = cmdargs(cmd, arg)
    return ffi.C.execv(args[0], args)
end

--  ███████  ███   ███  ████████  ███      ███    
-- ███       ███   ███  ███       ███      ███    
-- ███████   █████████  ███████   ███      ███    
--      ███  ███   ███  ███       ███      ███    
-- ███████   ███   ███  ████████  ███████  ███████


function slash.shell(cmd, ...) 
    local read_pipe = ffi.new("int[2]")
    local write_pipe = ffi.new("int[2]")
    local output = ""
    local exitcode = nil
    local failreason = nil
    
    if ((ffi.C.pipe(read_pipe) ~= 0) or (ffi.C.pipe(write_pipe) ~= 0)) then return nil, false, nil end
    
    local pid = ffi.C.fork()
    
    if (pid == 0) then 
        ffi.C.close(read_pipe[1])
        ffi.C.close(write_pipe[0])
        ffi.C.dup2(write_pipe[1], 1)
        ffi.C.dup2(write_pipe[1], 2)
        ffi.C.close(read_pipe[0])
        ffi.C.close(write_pipe[1])
        
        local argv = cmdargs(cmd, {...})
        ffi.C.execvp(argv[0], argv)
        return ffi.C._exit(127)
    elseif (pid > 0) then 
        ffi.C.close(read_pipe[0])
        ffi.C.close(write_pipe[1])
        --                  F_SETFL▾                    F_GETFL▾      ▾O_NONBLOCK
        ffi.C.fcntl(write_pipe[0], 4, bit.bor(ffi.C.fcntl(write_pipe[0], 3, 0), 0x0004))
        
        local buf = ffi.new("char[4096]")
        while true do 
            local bytes_read = ffi.C.read(write_pipe[0], buf, 4096)
            if (bytes_read > 0) then 
                output = output .. ffi.string(buf, bytes_read)
                sleep(0.002)
            else 
                break
            end
        end
        
        ffi.C.close(write_pipe[0])
        
        local wstatus = ffi.new("int[1]")
        local waitpid = ffi.C.waitpid(pid, wstatus, 0)
        
        return output, ((waitpid == pid) and (wstatus[0] == 0)), wstatus[0]
    else 
        return nil, false, nil
    end
end

--  ███████  ███   ███  ███████  
-- ███       ███ █ ███  ███   ███
-- ███       █████████  ███   ███
-- ███       ███   ███  ███   ███
--  ███████  ██     ██  ███████  


function slash.cwd() 
    local buf = ffi.new("char[?]", 4096)
    local cwd = ffi.C.getcwd(buf, 4096)
    if cwd then 
        return ffi.string(cwd)
    end
end


function slash.chdir(dir) 
    if (ffi.C.chdir(dir) == 0) then 
        return slash.cwd()
    end
end

-- ███   ███   ███████   ████████   ██     ██   ███████   ███      ███  ███████  ████████
-- ████  ███  ███   ███  ███   ███  ███   ███  ███   ███  ███      ███     ███   ███     
-- ███ █ ███  ███   ███  ███████    █████████  █████████  ███      ███    ███    ███████ 
-- ███  ████  ███   ███  ███   ███  ███ █ ███  ███   ███  ███      ███   ███     ███     
-- ███   ███   ███████   ███   ███  ███   ███  ███   ███  ███████  ███  ███████  ████████


function slash.normalize(path) 
    if empty(path) then return end
    local p = kseg(path)
    local frst = p[1]
    local swallow = 0xffff
    for i in iter(#p, 1) do 
        if (i >= swallow) then 
            table.remove(p, i)
            if ((i == swallow) or (i == 1)) then 
                if ((p[1] == '/') and (frst ~= '/')) then 
                    p:shift()
                end
                
                return slash.normalize(p:str())
            end
        else 
            if (p[i] == '\\') then p[i] = '/' end
            if ((i < #p) and (p[i] == '/')) then 
                if (i < (#p - 1)) then 
                    if ((p[(i + 1)] == '.') and (p[(i + 2)] == '/')) then 
                        p = p:splice((i + 1), 2)
                    end
                    
                    if ((((p[(i + 1)] == '.') and (p[(i + 2)] == '.')) and (i > 1)) and (p[(i - 1)] ~= '.')) then 
                        p = p:splice(i, 3)
                        swallow = (i - 1)
                        while ((swallow > 0) and (p[swallow] ~= '/')) do 
                            swallow = swallow - 1
                        end
                    end
                end
                
                if (p[(i + 1)] == '/') then 
                    p = p:splice((i + 1), 1)
                end
            end
        end
    end
    
    if ((#p >= 4) and (p:slice(1, 4):str() == "./..")) then 
        p:shift()
        p:shift()
    end
    
    while ((#p > 1) and (p[#p] == '/')) do 
        p:pop()
    end
    
    if ((((#p > 1) and (p[1] == '/')) and (frst ~= '/')) and (frst ~= '\\')) then 
        p:shift()
    end
    
    return p:str()
end

-- ████████    ███████   █████████  ███   ███
-- ███   ███  ███   ███     ███     ███   ███
-- ████████   █████████     ███     █████████
-- ███        ███   ███     ███     ███   ███
-- ███        ███   ███     ███     ███   ███


function slash.path(...) 
    
    function slsh(s) 
    return string.gsub(s, "\\", "/")
    end
    
    function mpty(s) 
    return (#s > 0)
    end
    local fpth = array(...)
    fpth = fpth:filter(mpty)
    fpth = fpth:map(slsh)
    fpth = table.concat(fpth, "/")
    return slash.normalize(fpth)
end


function slash.isRelative(path) 
    return ((#path == 0) or (((#path > 0) and (path:sub(1, 1) ~= '/')) and (path:sub(1, 1) ~= '~')))
end

function slash.isAbsolute(path) 
    return ((#path > 0) and array('/', '~'):has(path:sub(1, 1)))
end

function slash.isRoot(path) 
    return (slash.normalize(path) == "/")
end


function slash.home(...) 
    return slash.path(os.getenv("HOME"), unpack({...}))
end


function slash.tilde(path) 
    return string.gsub(path, slash.home(), "~")
end

function slash.untilde(path) 
    if empty(path) then return end
    if (string.sub(path, 1, 1) == '~') then 
        return slash.path(slash.home(), kstr.shift(path))
    end
    
    return slash.path(path)
end


function slash.absolute(path, parent) 
    if empty(path) then return end
    if slash.isRelative(path) then 
        parent = parent or (slash.cwd())
        return slash.path(parent, path)
    else 
        return slash.untilde(path)
    end
end


function slash.splitFile(path) 
    local slsidx = kstr.rfind(path, "/")
    
    local dir = ""
    if (slsidx > 0) then 
        dir = slice(path, 1, (slsidx - 1))
        path = slice(path, (slsidx + 1))
    end
    
    return dir, path
end


function slash.split(path) 
    return kstr.split(path, "/")
end

function slash.join(...) 
    return table.concat({...}, "/")
end

function slash.contains(path, subpath) 
    return array(unpack(slash.split(path))):has(subpath)
end

-- ████████    ███████   ████████    ███████  ████████
-- ███   ███  ███   ███  ███   ███  ███       ███     
-- ████████   █████████  ███████    ███████   ███████ 
-- ███        ███   ███  ███   ███       ███  ███     
-- ███        ███   ███  ███   ███  ███████   ████████


function slash.parse(path) 
    path = slash.untilde(slash.normalize(path))
    local dir, file = slash.splitFile(path)
    name, ext = slash.splitExt(file)
    return {dir = dir, name = name, ext = ext, file = file, path = path}
end


function slash.dir(path) 
    return slash.parse(path).dir
end

function slash.file(path) 
    return slash.parse(path).file
end

function slash.name(path) 
    return slash.parse(path).name
end

function slash.ext(path) 
    return slash.parse(path).ext
end


function slash.swapExt(path, ext) 
    if ((ext == nil) or (ext == "")) then return path end
    local p = slash.parse(path)
    local r = ""
    if (string.sub(path, 1, 1) == "/") then r = "/" end
    return slash.path(r, p.dir, p.name .. "." .. ext)
end


function slash.splitExt(path) 
    local dotidx = kstr.rfind(path, ".")
    local slsidx = kstr.rfind(path, "/")
    
    local ext = ""
    
    if ((dotidx > 0) and (dotidx > slsidx)) then 
        ext = slice(path, (dotidx + 1))
        path = slice(path, 0, (dotidx - 1))
    end
    
    return path, ext
end


function slash.removeExt(path) 
    return slash.splitExt(path)
end


function slash.swapLastPathComponentAndExt(path, src, tgt) 
    local dirs = path.dirs()
    for i in iter(#dirs, 0) do 
        if (dirs[i] == src) then 
            dirs[i] = tgt
            break
        end
    end
    
    array.push(dirs, slash.swapExt(path.file, tgt))
    return slash.path(unpack(dirs))
end


function prettyTimeSpan(seconds) 
    if (seconds == 0) then return "0" end
    seconds = math.abs(seconds)
    
    local days = math.floor((seconds / 86400))
    seconds = (seconds % 86400)
    
    local hours = math.floor((seconds / 3600))
    seconds = (seconds % 3600)
    
    local minutes = math.floor((seconds / 60))
    seconds = (seconds % 60)
    
    local parts = {}
    if (days > 0) then 
        table.insert(parts, string.format("%d day%s", days, (((days == 1) and "") or "s")))
    end
    
    if (hours > 0) then 
        table.insert(parts, string.format("%d hour%s", hours, (((hours == 1) and "") or "s")))
    end
    
    if (minutes > 0) then 
        table.insert(parts, string.format("%d minute%s", minutes, (((minutes == 1) and "") or "s")))
    end
    
    if ((seconds > 0) or (#parts == 0)) then 
        table.insert(parts, string.format("%.2f second%s", seconds, (((seconds == 1) and "") or "s")))
    end
    
    return table.concat(parts, " ")
end

local sbuf = ffi.new("struct stat")

--  ███████  █████████   ███████   █████████
-- ███          ███     ███   ███     ███   
-- ███████      ███     █████████     ███   
--      ███     ███     ███   ███     ███   
-- ███████      ███     ███   ███     ███   


function slash.stat(path) 
    if (ffi.C.stat64(path, sbuf) == 0) then 
        local mode = tonumber(sbuf.st_mode)
        local typ = "?"
        if (bit.band(mode, 0x4000) ~= 0) then typ = "dir"
        elseif (bit.band(mode, 0x8000) ~= 0) then typ = "file"
        elseif (bit.band(mode, 0xa000) ~= 0) then typ = "link"
        end
        
        return {
                mode = mode, 
                nlink = tonumber(sbuf.st_nlink), 
                ino = tonumber(sbuf.st_ino), 
                uid = tonumber(sbuf.st_uid), 
                gid = tonumber(sbuf.st_gid), 
                atime = tonumber(sbuf.st_atime), 
                mtime = tonumber(sbuf.st_mtime), 
                ctime = tonumber(sbuf.st_ctime), 
                btime = tonumber(sbuf.st_btime), 
                blksize = tonumber(sbuf.st_blksize), 
                blocks = tonumber(sbuf.st_blocks), 
                ["type"] = typ, 
                -- modage:     prettyTimeSpan(os.time()-tonumber(sbuf.st_mtime))
                }
    end
end

-- ███   ███   ███████   ███      ███   ███
-- ███ █ ███  ███   ███  ███      ███  ███ 
-- █████████  █████████  ███      ███████  
-- ███   ███  ███   ███  ███      ███  ███ 
-- ██     ██  ███   ███  ███████  ███   ███


function slash.walk(path, opt) 
    opt = opt or ({recursive = true})
    opt.files = opt.files or (array())
    
    local dir = ffi.C.opendir(path)
    if (dir == nil) then 
        error("Failed to open directory: " .. path)
    end
    
    while true do 
        local entry = ffi.C.readdir(dir)
        if (entry ~= nil) then 
            local name = ffi.string(entry.d_name)
            if ((name ~= ".") and (name ~= "..")) then 
                local typ = "???"
                if (entry.d_type == 4) then typ = "dir"
                elseif (entry.d_type == 8) then typ = "file"
                elseif (entry.d_type == 10) then typ = "link"
                end
                
                local apth = slash.absolute(path .. "/" .. name)
                local info = {["name"] = name, ["type"] = typ, ["path"] = apth}
                opt.files:push(info)
                
                if (opt.recursive and (typ == "dir")) then 
                    slash.walk(apth, opt)
                end
            end
        else 
            break
        end
    end
    
    ffi.C.closedir(dir)
    table.sort(opt.files, function (a, b) 
    return (a.path < b.path)
end)
    return opt.files
end

-- ████████  ███  ███      ████████   ███████
-- ███       ███  ███      ███       ███     
-- ██████    ███  ███      ███████   ███████ 
-- ███       ███  ███      ███            ███
-- ███       ███  ███████  ████████  ███████ 


function slash.files(path, ext) 
    local files = slash.walk(path)
    files = files:map(function (info) 
    return info.path
end)
    if ext then 
        
        function fext(f) 
    return (slash.ext(f) == ext)
        end
        files = files:filter(fext)
    end
    
    return files
end


function slash.exists(path) 
    return slash.stat(path)
end

function slash.isDir(path) 
                   local s = slash.stat(path) ; if (s and (s.type == "dir")) then 
    return s
                                                 end
end

function slash.isFile(path) 
                   local s = slash.stat(path) ; if (s and (s.type == "file")) then 
    return s
                                                 end
end

function slash.isLink(path) 
                   local s = slash.stat(path) ; if (s and (s.type == "link")) then 
    return s
                                                 end
end

function slash.dirExists(path) 
    return slash.isDir(path)
end

function slash.fileExists(path) 
    return slash.isFile(path)
end

function slash.samePath(p1, p2) 
    return (slash.untilde(p1) == slash.untilde(p2))
end


function slash.readText(path) 
    local file = io.open(path, "r")
    if not file then return end
    local text = file:read("*a")
    file:close()
    if text:find("\x00") then return end
    return text
end


function slash.writeText(path, text) 
    local file = io.open(path, "w")
    if not file then return end
    local content = file:write(text)
    file:close()
    return true
end

return slash