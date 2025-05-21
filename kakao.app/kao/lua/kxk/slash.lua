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
        unsigned long  d_ino;           // Inode number
        unsigned long  d_seekoff;       // Seek offset (optional)
        unsigned short d_reclen;        // Length of this record
        unsigned short d_namlen;        // Length of d_name string
        unsigned char  d_type;          // File type
        char           d_name[1024];    // Filename (null-terminated)
    };
    DIR *opendir(const char *filename);
    struct dirent *readdir(DIR *dirp);
    int closedir(DIR *dirp);
    const char *strerror(int errnum);
]])

local slash = {}


function slash.cwd() 
    return process.cwd()
end


function slash.normalize(path) 
    local p = kseg.segs(path)
    local frst = p[0]
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
    elseif ((((#p > 1) and (p[0] == '/')) and (frst ~= '/')) and (frst ~= '\\')) then 
        p = kseg.slice(p, 3)
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
    print(fpth)
    print(slash.normalize(fpth))
    return slash.normalize(fpth)
end


function slash.isRelative(path) 
    return ((#path == 0) or (((#path > 0) and (path[1] ~= '/')) and (path[1] ~= '~')))
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
                if (entry.d_type == 4) then 
                    typ = "dir"
                elseif (entry.d_type == 8) then 
                    typ = "file"
                elseif (entry.d_type == 10) then 
                    typ = "link"
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


function slash.files(path) 
    return array.map(slash.walk(path), function (info) return info.path end)
end

return slash