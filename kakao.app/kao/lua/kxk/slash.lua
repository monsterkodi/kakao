--  ███████  ███       ███████    ███████  ███   ███
-- ███       ███      ███   ███  ███       ███   ███
-- ███████   ███      █████████  ███████   █████████
--      ███  ███      ███   ███       ███  ███   ███
-- ███████   ███████  ███   ███  ███████   ███   ███

ffi = require "ffi"
os = require "os"
array = require "./array"
kstr = require "./kstr"
kseg = require "./kseg"

ffi.cdef([[
    typedef struct DIR DIR;
    struct dirent {
        unsigned long  d_ino;       
        unsigned long  d_seekoff;   
        unsigned short d_reclen;    
        unsigned short d_namlen;    
        unsigned char  d_type;      
        char           d_name[1024];
    };
    DIR *opendir(const char *filename);
    struct dirent *readdir(DIR *dirp);
    int closedir(DIR *dirp);
    const char *strerror(int errnum);
    
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
    
    int stat64(const char *path, struct stat *buf);
    int lstat64(const char *path, struct stat *buf);
]])

local slash = {}


function slash.cwd() 
    return process.cwd()
end


function slash.normalize(path) 
    local p = kseg.segs(path)
    local frst = p[1]
    -- log "START" p.len, frst
    local swallow = 0xffff
    for i in iter(#p, 1) do 
        if (i >= swallow) then 
            table.remove(p, i)
            if ((i == swallow) or (i == 1)) then 
                if ((p[1] == '/') and (frst ~= '/')) then 
                    kseg.shift(p)
                end
                
                return slash.normalize(kseg.str(p))
            end
        else 
            if (p[i] == '\\') then p[i] = '/' end
            if ((i < #p) and (p[i] == '/')) then 
                if (i < (#p - 1)) then 
                    if ((p[(i + 1)] == '.') and (p[(i + 2)] == '/')) then 
                        p = kseg.splice(p, (i + 1), 2)
                    end
                    
                    if ((((p[(i + 1)] == '.') and (p[(i + 2)] == '.')) and (i > 1)) and (p[(i - 1)] ~= '.')) then 
                        p = kseg.splice(p, i, 3)
                        swallow = (i - 1)
                        while ((swallow > 0) and (p[swallow] ~= '/')) do 
                            swallow = swallow - 1
                        end
                    end
                end
                
                if (p[(i + 1)] == '/') then 
                    p = kseg.splice(p, (i + 1), 1)
                end
            end
        end
    end
    
    if ((#p >= 4) and (kseg.str(kseg.sub(p, 1, 4)) == "./..")) then 
        kseg.shift(p)
        kseg.shift(p)
    end
    
    if ((#p > 1) and (p[#p] == '/')) then 
        kseg.pop(p)
    end
    
    if ((((#p > 1) and (p[1] == '/')) and (frst ~= '/')) and (frst ~= '\\')) then 
        kseg.shift(p)
    end
    
    return kseg.str(p)
end


function slash.path(...) 
    
    function slsh(s) 
    return string.gsub(s, "\\", "/")
    end
    
    function mpty(s) 
    return (#s > 0)
    end
    local fpth = table.concat(array.map(array.filter({...}, mpty), slsh), "/")
    return slash.normalize(fpth)
end


function slash.isRelative(path) 
    return ((#path == 0) or (((#path > 0) and (string.sub(path, 1, 1) ~= '/')) and (string.sub(path, 1, 1) ~= '~')))
end


function slash.home() 
    return os.getenv("HOME")
end

function slash.untilde(path) 
    if (path[1] == '~') then 
        return slash.path(slash.home(), kstr.shift(path))
    end
    
    return slash.path(path)
end


function slash.absolute(path, parent) 
    if slash.isRelative(path) then 
        parent = parent or slash.cwd()
        return slash.path(parent, path)
    else 
        return slash.untilde(path)
    end
end


function slash.split(path) 
    return kstr.split(path, "/")
end

function slash.join(...) 
    return table.concat({...}, "/")
end


function slash.parse(path) 
    path = slash.untilde(slash.normalize(path))
    local split = slash.split(path)
    local dir = ""
    local file = array.pop(split)
    dir = slash.join(unpack(split))
    local name = file
    local ext = ""
    
    if (((#dir == 0) and (path ~= ".")) and (path ~= "..")) then 
        if (path[0] == '/') then dir = "/" else dir = "." end
    end
    
    local nmspl = kstr.split(file, ".")
    if (#nmspl > 1) then 
        ext = array.pop(nmspl)
        name = table.concat(nmspl, ".")
    end
    
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


function slash.stat(path) 
    if (ffi.C.stat64(path, sbuf) == 0) then 
        return {
                mode = tonumber(sbuf.st_mode), 
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
                -- modage:     prettyTimeSpan(os.time()-tonumber(sbuf.st_mtime))
                }
    end
end


function slash.walk(path) 
    local dir = ffi.C.opendir(path)
    if (dir == nil) then 
        error("Failed to open directory: " .. path .. " " .. ffi.string(ffi.C.strerror(ffi.errno())))
    end
    
    local files = {}
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
                
                local info = {["name"] = name, ["type"] = typ, ["path"] = slash.absolute(path .. "/" .. name)}
                table.insert(files, info)
            end
        else 
            break
        end
    end
    
    ffi.C.closedir(dir)
    table.sort(files, function (a, b) return (a.path < b.path) end)
    return files
end


function slash.files(path, ext) 
    local files = array.map(slash.walk(path), function (info) return info.path end)
    if ext then 
        
        function fext(f) 
    return (slash.ext(f) == ext)
        end
        files = array.filter(files, fext)
    end
    
    return files
end

return slash