--  ███████  ███       ███████    ███████  ███   ███
-- ███       ███      ███   ███  ███       ███   ███
-- ███████   ███      █████████  ███████   █████████
--      ███  ███      ███   ███       ███  ███   ███
-- ███████   ███████  ███   ███  ███████   ███   ███

ffi = require "ffi"

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


function slash.list(path) 
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
                -- log entry.d_type name
                -- entry.d_type
                -- 4  dir
                -- 8  file
                -- 10 symlink
                table.insert(files, name)
            end
        else 
            break
        end
    end
    
    ffi.C.closedir(dir)
    table.sort(files)
    return files
end

return slash