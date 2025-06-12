--[[
    000  000000000  00000000  00     00
    000     000     000       000   000
    000     000     0000000   000000000
    000     000     000       000 0 000
    000     000     00000000  000   000
--]]

-- use ../../theme  ◆ icons
-- use ../../../kxk ▪ slash

icons = require "theme.icons"


local diritem = class("diritem")
    

--  0000000  000   000  00     00  0000000     0000000   000      
-- 000        000 000   000   000  000   000  000   000  000      
-- 0000000     00000    000000000  0000000    000   000  000      
--      000     000     000 0 000  000   000  000   000  000      
-- 0000000      000     000   000  0000000     0000000   0000000  


function diritem.static.symbol(item) 
        if (item.type == 'dir') then 
    if item.open then 
    return icons.dir_open else 
    return icons.dir_close
                    end
        else 
    return (icons[slash.ext(item.path)] or icons.file)
        end
    end


function diritem.static.symbolName(item) 
        local name = ""
        if (slash.ext(item.path) == 'kode') or (slash.ext(item.path) == 'noon') or (slash.ext(item.path) == 'json') or (slash.ext(item.path) == 'pug') or (slash.ext(item.path) == 'styl') or (slash.ext(item.path) == 'html') or (slash.ext(item.path) == 'kim') or (slash.ext(item.path) == 'nim') or (slash.ext(item.path) == 'kua') or (slash.ext(item.path) == 'lua') or (slash.ext(item.path) == 'js') or (slash.ext(item.path) == 'md') then 
                name = slash.name(item.path)
        else 
                name = slash.file(item.path)
        end
        
        -- ✔✚        
        if item.modified then name = name .. ' ✔' end
        if item.added then name = name .. ' ✚' end
        
        -- non-breakable space ▾ that prevents icons from growing in some fonts
        return diritem.symbol(item) .. '\x00A0' .. name
    end

return diritem