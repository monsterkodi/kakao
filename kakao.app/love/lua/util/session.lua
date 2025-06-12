--[[
     0000000  00000000   0000000   0000000  000   0000000   000   000    
    000       000       000       000       000  000   000  0000  000    
    0000000   0000000   0000000   0000000   000  000   000  000 0 000    
         000  000            000       000  000  000   000  000  0000    
    0000000   00000000  0000000   0000000   000   0000000   000   000    

    key value store with delayed saving to disk  
    
    is coupled to the process: doesn't care about other instances
    
    stores 
    
        - main cursor position and view offset per file
        - recent file history
--]]

-- use ../../kxk ◆ noon events slash post nfs sds
-- use ../../kxk/util ▪ isEqual defaults sessionId
-- use ◆ frecent


local session = class("session", events)
    


function session:init(opt) 
        self.name = util.sessionId()
        
        opt = opt or ({})
        
        self.timeout = (opt.timeout or 1000)
        
        self.sep = (opt.separator or '▸')
        
        self.dir = slash.absolute("~/.config/ked/sessions/")
        print('session/dir' .. self.dir)
        self.file = slash.path(self.dir, "" .. tostring(self.name) .. ".noon")
        
        -- if not opt.fresh
        --     @loadAndMerge()
        --     @cleanSessions()
        return self
    end


function session:keypath(key) 
    return key.split(self.sep)
    end

--  0000000   00000000  000000000
-- 000        000          000   
-- 000  0000  0000000      000   
-- 000   000  000          000   
--  0000000   00000000     000   


function session:get(key, value) 
        if not key.split then return value end
        return clone(sds.get, self.data, self:keypath(key), value)
    end

--  0000000  00000000  000000000  
-- 000       000          000     
-- 0000000   0000000      000     
--      000  000          000     
-- 0000000   00000000     000     


function session:set(key, value) 
        if is(not key, "string") then return end
        if (self:get(key) == value) then return end
        if (self:get(key) == value) then return end
        if empty(value) then return self:del(key) end
        
        self.data = self.data or ({})
        -- sds∙set @data @keypath(key) value
        return self:delayedSave()
    end


function session:del(key) 
        if not self.data then return end
        -- sds∙del @data @keypath(key)
        return self:delayedSave()
    end


function session:delayedSave() 
        -- clearTimeout @timer
        return -- @timer = setTimeout (-> @save()) @timeout
    end


function session:clear() 
        self.data = {}
        
        return -- clearTimeout @timer
    end


function session:recentFiles() 
    return dict.keys(self:get('files▸recent', {}))
    end

-- 000       0000000    0000000   0000000    
-- 000      000   000  000   000  000   000  
-- 000      000   000  000000000  000   000  
-- 000      000   000  000   000  000   000  
-- 0000000   0000000   000   000  0000000    


function session:reload() 
    return self:load()
    end


function session:load() 
        self.data = noon.load(self.file)
        return -- error "session -- can't load '#{@file}':" err
    end

--  0000000   0000000   000   000  00000000
-- 000       000   000  000   000  000     
-- 0000000   000000000   000 000   0000000 
--      000  000   000     000     000     
-- 0000000   000   000      0      00000000


function session:save() 
        if not self.file then return end
        if empty(self.data) then return end
        
        -- clearTimeout @timer
        -- @timer = null
        
        local text = noon.stringify(self.data, {indent = 4, maxalign = 8}) .. '\n'
        
        local result = nfs.write(self.file, text)
        if result.error then 
            return print('session.save failed!', self:file(result))
        end
    end

-- 00     00  00000000  00000000    0000000   00000000        00000000   00000000   0000000  00000000  000   000  000000000  
-- 000   000  000       000   000  000        000             000   000  000       000       000       0000  000     000     
-- 000000000  0000000   0000000    000  0000  0000000         0000000    0000000   000       0000000   000 0 000     000     
-- 000 0 000  000       000   000  000   000  000             000   000  000       000       000       000  0000     000     
-- 000   000  00000000  000   000   0000000   00000000        000   000  00000000   0000000  00000000  000   000     000     


function session:loadAndMerge() 
        local file = self:newestSessionFile()
        
        if valid(file) then 
            local recent = noon.read(file)
            
            post.emit('session.merge', recent)
            
            self:set('files', recent.files) -- probably should actually merge here instead of overriding!
            self:set('editor', recent.editor)
        end
        
        return self:emit('loaded')
    end

-- 00000000  000  000      00000000   0000000  
-- 000       000  000      000       000       
-- 000000    000  000      0000000   0000000   
-- 000       000  000      000            000  
-- 000       000  0000000  00000000  0000000   


function session:newestSessionFile() 
        local files = self:listSessions()
        return files[-1]
    end


function session:listSessions() 
        local files = nfs.list(self.dir)
        return files.filter(function (f) 
    return f.path
end)
    end


function session:cleanSessions() 
        local maxFiles = 100
        local files = self:listSessions()
        for i = 1, ((#files - maxFiles) + 1)-1 do 
            nfs.remove(files[i])
        end
    end

return session