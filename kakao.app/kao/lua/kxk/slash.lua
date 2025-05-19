--  ███████  ███       ███████    ███████  ███   ███
-- ███       ███      ███   ███  ███       ███   ███
-- ███████   ███      █████████  ███████   █████████
--      ███  ███      ███   ███       ███  ███   ███
-- ███████   ███████  ███   ███  ███████   ███   ███

ffi = require "ffi"
array = require "./array"

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


function slash.cwd() return process.cwd()
end


function slash.normalize(path) 
    local p = path
    local swallow = 0xffff
    for i = #p, 1 do 
        if (i >= swallow) then 
            p = p.remove(i)
            if (i == swallow) then 
                if ((p[1] == '/') and (path[1] ~= '/')) then 
                    p = p.remove(1)
                end
                
                return slash.normalize(p)
            end
        else 
            if (p[i] == '\\') then 
                p[i] = '/'
            end
            
            if ((i < #p) and (p[i] == '/')) then 
                if (i < (#p - 1)) then 
                    if ((p[(i + 1)] == '.') and (p[(i + 2)] == '/')) then 
                        p = p.remove((i + 1))
                        p = p.remove((i + 2))
                    end
                    
                    if ((((p[(i + 1)] == '.') and (p[(i + 2)] == '.')) and (i > 0)) and (p[(i - 1)] ~= '.')) then 
                        p = p.remove(i)
                        p = p.remove(i)
                        p = p.remove(i)
                        swallow = (i - 1)
                        while ((swallow > 0) and (p[swallow] ~= '/')) do 
                            swallow = swallow - 1
                        end
                    end
                end
                
                if (p[(i + 1)] == '/') then 
                    p = p.remove((i + 1))
                end
            end
        end
    end
    
    if ((#p >= 4) and (string.sub(p, 1, 4) == "./..")) then 
        p = p.remove(0)
        p = p.remove(0)
    end
    
    if ((#p > 1) and (p[#p] == '/')) then 
        string.sub(p, 2)
        -- elif p.len > 1 and p[0] == '/' and path[0] notin {'/' '\\'}
    elseif ((((#p > 1) and (p[0] == '/')) and (path[0] ~= '/')) and (path[0] ~= '\\')) then 
        string.sub(p, 3)
    end
    
    return p
end


function slash.path(...) 
    
    function slsh(s) return string.gsub(s, "\\", "/")
    end
    
    function mpty(s) return (#s > 0)
    end
    
    return slash.normalize(table.concat(array.map(array.filter({...}, mpty), slsh), "/"))
end


function slash.walk(path) 
    local dir = ffi.C.opendir(path)
    if (dir == nil) then 
        error("Failed to open directory: " .. ffi.string(ffi.C.strerror(ffi.errno())))
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
                
                local info = {["name"] = name, ["type"] = typ, ["path"] = slash.path(path .. "/" .. name)}
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