--[[
0000000    000  00000000   000000000  00000000   00000000  00000000
000   000  000  000   000     000     000   000  000       000     
000   000  000  0000000       000     0000000    0000000   0000000 
000   000  000  000   000     000     000   000  000       000     
0000000    000  000   000     000     000   000  00000000  00000000
--]]

-- import rgxs from './quicky.json' with { type: "json" }

diritem = require "view.colmns.diritem"
choices = require "view.menu.choices"


local dirtree = class("dirtree", choices)
    


function dirtree:init(name, features) 
        choices.init(self, name, features)
        
        -- @state.syntax.setRgxs rgxs
        
        post:on('session.merge', self.onSessionMerge)
        post:on('file.change', self.onFileChange)
        post:on('git.status', self.onGitStatus)
        
        self.frontRoundOffset = 0
        return self
    end

--  ███████   ███  █████████         ███████  █████████   ███████   █████████  ███   ███   ███████
-- ███        ███     ███           ███          ███     ███   ███     ███     ███   ███  ███     
-- ███  ████  ███     ███           ███████      ███     █████████     ███     ███   ███  ███████ 
-- ███   ███  ███     ███                ███     ███     ███   ███     ███     ███   ███       ███
--  ███████   ███     ███           ███████      ███     ███   ███     ███      ███████   ███████ 


function dirtree:tilde(item) 
    item.tilde = kstr.lpad(((item.depth * 2) + 1)) .. diritem.symbolName(item)
    return item.tilde
    end


function dirtree:onGitStatus(status) 
        -- todo: handle added files
        
        -- log 'dirtree.onGitStatus' status
        
        for _, item in ipairs(self.items) do 
            if (item.type == 'dir') then 
                local foundChange = false
                
                if status.dirs:has(item.path) then 
                    for _, file in ipairs(status.files) do 
                        if file.startsWith(item.path) then 
                            item.modified = true
                            self:tilde(item)
                            local redraw = true
                            foundChange = true
                            break
                        end
                    end
                end
                
                if (item.modified and not foundChange) then 
                    item.modified = nil
                    self:tilde(item)
                    local redraw = true
                end
            else 
                if status.changed:has(item.path) then 
                    item.modified = true
                    self:tilde(item)
                    local redraw = true
                end
                
                if status.added:has(item.path) then 
                    item.added = true
                    self:tilde(item)
                    local redraw = true
                end
                
                if ((item.modified and not status.changed:has(item.path)) or (item.added and not status.added:has(item.path))) then 
                    item.modified = nil
                    self:tilde(item)
                    local redraw = true
                end
            end
        end
        
        if redraw then 
            self:set(self.items, self:currentIndex())
            return post.emit('redraw')
        end
    end

-- ████████  ███  ███      ████████         ███████  ███   ███   ███████   ███   ███   ███████   ████████
-- ███       ███  ███      ███             ███       ███   ███  ███   ███  ████  ███  ███        ███     
-- ██████    ███  ███      ███████         ███       █████████  █████████  ███ █ ███  ███  ████  ███████ 
-- ███       ███  ███      ███             ███       ███   ███  ███   ███  ███  ████  ███   ███  ███     
-- ███       ███  ███████  ████████         ███████  ███   ███  ███   ███  ███   ███   ███████   ████████


function dirtree:onFileChange(info) 
        if kstr.startWith(info.path, self.currentRoot) then 
            if (info.change == 'rename') then 
                for _, item in ipairs(self.items) do 
                    if (item.path == info.path) then 
                        return
                    end
                end
                
                self:setRoot(self.currentRoot, {redraw = true, index = self.currentIndex()})
            end
            
            if array('remove', 'deleted'):has(info.change) then 
                for _, item in ipairs(self.items) do 
                    if (item.path == info.path) then 
                        self:setRoot(self.currentRoot, {redraw = true, index = self.currentIndex()})
                        return
                    end
                end
            end
        end
    end

-- 00000000    0000000    0000000   000000000  
-- 000   000  000   000  000   000     000     
-- 0000000    000   000  000   000     000     
-- 000   000  000   000  000   000     000     
-- 000   000   0000000    0000000      000     


function dirtree:setRoot(path, opt) 
        opt = opt or ({})
        
        local dir = slash.untilde(path)
        
        local items = self:dirItems(dir, 'dirtree.setRoot')
        
        self.currentRoot = dir
        
        if empty(items) then return end
        
        for _, item in ipairs(items) do 
            item.depth = 0
            self:tilde(item)
        end
        
        -- items∙sort((a b) -> @weight(a) - @weight(b))
        
        -- log 'setRoot' opt
        
        self:set(items, (opt.index or 0))
        
        self:restoreSessionState(opt)
        
        if opt.redraw then 
            return post:emit('redraw')
        end
    end

-- 00000000   00000000   0000000  000000000   0000000   00000000   00000000  
-- 000   000  000       000          000     000   000  000   000  000       
-- 0000000    0000000   0000000      000     000   000  0000000    0000000   
-- 000   000  000            000     000     000   000  000   000  000       
-- 000   000  00000000  0000000      000      0000000   000   000  00000000  


function dirtree:restoreSessionState(opt) 
        opt = opt or ({})
        opt.redraw = true
        
        local state = ked_session:get(self.name, {})
        
        if empty(state.open) then return end
        
        for key, value in pairs(state.open) do 
            if kstr.startsWith(key, self.currentRoot) then 
                self:openDir(self:itemForPath(key), opt)
            end
        end
    end

--  0000000  000000000   0000000   000000000  00000000  
-- 000          000     000   000     000     000       
-- 0000000      000     000000000     000     0000000   
--      000     000     000   000     000     000       
-- 0000000      000     000   000     000     00000000  


function dirtree:onSessionMerge(recent) 
    return self:setState(recent[self.name])
    end


function dirtree:setState(state) 
        if empty(state) then return end
        
        return ked_session.set(self.name, state)
    end

--  0000000    0000000  000000000  000   0000000   000   000  
-- 000   000  000          000     000  000   000  0000  000  
-- 000000000  000          000     000  000   000  000 0 000  
-- 000   000  000          000     000  000   000  000  0000  
-- 000   000   0000000     000     000   0000000   000   000  


function dirtree:emitAction(action, choice, event) 
        if (action == 'hover') then 
            self:grabFocus()
            if ((event.alt or event.cmd) and (choice.type == 'file')) then 
                post.emit('quicky', choice.path)
            end
            
            return
        end
        
        if (action == 'cmd+delete') then 
            if (choice.type == 'file') then 
                post.emit('file.trash', choice.path)
            end
            
            return
        end
        
        if (choice.type == 'dir') then 
                if (action == 'click') or (action == 'space') then 
                        if ((action == 'click') and event.mods) then return post.emit('dircol.root', choice.path) end
                        
                        if not choice.open then self:openDir(choice, {redraw = true})
                        else self:closeDir(choice)
                        end
                        
                        return
                elseif (action == 'right') then 
                        if not choice.open then self:openDir(choice, {redraw = true})
                        else self:selectNextKeepOffset()
                        end
                        
                        return
                elseif (action == 'left') then 
                        if choice.open then self:closeDir(choice, {redraw = true})
                        else self:selectPrevKeepOffset()
                        end
                        
                        return
                elseif (action == 'delete') or (action == 'esc') then 
                        if not choice.open then self:selectOpenSiblingAboveOrParent() end
                        if choice.open then self:closeDir(choice, {redraw = true}) end
                        return
                elseif (action == 'doubleclick') or (action == 'return') then return post.emit('dircol.root', choice.path)
                end
        elseif (choice.type == 'file') then 
                if (action == 'left') then return self:selectPrevKeepOffset()
                elseif (action == 'right') then return self:selectNextKeepOffset()
                elseif (action == 'delete') or (action == 'esc') then return self:selectParent()
                elseif (action == 'drag') or (action == 'space') then return post.emit('quicky', choice.path)
                elseif (action == 'click') or (action == 'return') then return post.emit('file.open', choice.path)
                end
        end
        
        return choices.emitAction(self, action, choice, event)
    end

--  0000000   00000000   00000000  000   000  0000000    000  00000000   
-- 000   000  000   000  000       0000  000  000   000  000  000   000  
-- 000   000  00000000   0000000   000 0 000  000   000  000  0000000    
-- 000   000  000        000       000  0000  000   000  000  000   000  
--  0000000   000        00000000  000   000  0000000    000  000   000  


function dirtree:openDir(dirItem, opt, ○) 
        if empty(dirItem) then return end
        if dirItem.open then return end
        
        opt = opt or ({})
        
        dirItem.open = true
        
        local items = ○(self.dirItems, dirItem.path, 'dirtree.openDir')
        
        dirItem.tilde = dirItem.tilde.replace(icons.dir_close, icons.dir_open)
        
        local state = ked_session.get(self.name, {})
        
        local depth = (dirItem.depth + 1)
        for _, item in ipairs(items) do 
            item.depth = depth
            self:tilde(item)
            if ((item.type == 'dir') and state.open[item.path]) then 
                if empty((opt.select and empty), opt.index) then 
                    opt.select = dirItem
                end
                
                opt.redraw = true
                self:openDir(item, opt)
            end
        end
        
        items.sort(function (a, b) 
    return (self:weight(a) - self:weight(b))
end)
        
        local index = self.items.indexOf(dirItem)
        
        kutil.insert(self.items, (index + 1), items)
        
        if opt.index then 
            index = opt.index
        elseif opt.select then 
            index = self.items.indexOf(opt.select)
        end
        
        self:set(self.items, index)
        
        ked_session.set("" .. tostring(self.name) .. "▸open▸" .. tostring(dirItem.path) .. "", '✔')
        
        git.status(dirItem.path)
        
        if opt.redraw then 
            post.emit('redraw')
        end
        
        return self
    end

--  0000000  000       0000000    0000000  00000000  0000000    000  00000000   
-- 000       000      000   000  000       000       000   000  000  000   000  
-- 000       000      000   000  0000000   0000000   000   000  000  0000000    
-- 000       000      000   000       000  000       000   000  000  000   000  
--  0000000  0000000   0000000   0000000   00000000  0000000    000  000   000  


function dirtree:closeDir(dirItem, opt) 
        if empty(dirItem) then return end
        
        opt = opt or ({})
        
        dirItem.open = false
        
        dirItem.tilde = dirItem.tilde.replace(icons.dir_open, icons.dir_close)
        
        local index = self.items.indexOf(dirItem)
        
        local numChildren = 0
        while ((((index + numChildren) + 1) < #self.items) and self.items[((index + numChildren) + 1)].path.startsWith(dirItem.path)) do 
            numChildren = numChildren + 1
        end
        
        kutil.replace(self.items, (index + 1), numChildren, array())
        
        self:set(self.items, index)
        
        ked_session.del("" .. tostring(self.name) .. "▸open▸" .. tostring(dirItem.path) .. "")
        
        if opt.redraw then 
            post.emit('redraw')
        end
        
        return self
    end

-- 000  000000000  00000000  00     00   0000000  
-- 000     000     000       000   000  000       
-- 000     000     0000000   000000000  0000000   
-- 000     000     000       000 0 000       000  
-- 000     000     00000000  000   000  0000000   


function dirtree:dirItems(dir, info) 
        return slash.walk(dir, {recursive = false})
    end

--  0000000  00000000  000000000  
-- 000       000          000     
-- 0000000   0000000      000     
--      000  000          000     
-- 0000000   00000000     000     


function dirtree:set(items, index) 
        index = index or 0
        
        local oldTop = self.state.s.view[2]
        choices.set(self, items, 'tilde')
        self.state:setView(array(1, oldTop))
        self.state:selectLine(index)
        return self.state:setMainCursor(1, index)
    end

--  0000000  00000000  000      00000000   0000000  000000000  
-- 000       000       000      000       000          000     
-- 0000000   0000000   000      0000000   000          000     
--      000  000       000      000       000          000     
-- 0000000   00000000  0000000  00000000   0000000     000     


function dirtree:selectPrevKeepOffset() 
        self:selectPrev()
        if (self:current().type == 'file') then 
            post:emit('quicky', self:current().path)
        end
        
        return self.state:setView(array(0, (self.state.s.view[1] - 1)))
    end


function dirtree:selectNextKeepOffset() 
        if ((self:current().type == 'file') and (ked_session.get('editor▸file') ~= self:current().path)) then 
            post:emit('quicky', self:current().path)
            return
        end
        
        self:selectNext()
        if (self:current().type == 'file') then 
            post:emit('quicky', self:current().path)
        end
        
        return self.state:setView(array(0, (self.state.s.view[1] + 1)))
    end


function dirtree:selectOpenSiblingAboveOrParent() 
        local index = self.fuzzied.indexOf(self:current())
        index = index - 1
        while (((index > 0) and (self.fuzzied[index].depth >= self:current().depth)) and not self.fuzzied[index].open) do 
            index = index - 1
        end
        
        self.state.selectLine(index)
        return self.state.setMainCursor(0, index)
    end


function dirtree:selectParent() 
        local index = self.fuzzied.indexOf(self:current())
        index = index - 1
        while ((index > 0) and (self.fuzzied[index].depth >= self:current().depth)) do 
            index = index - 1
        end
        
        self.state.selectLine(index)
        return self.state.setMainCursor(0, index)
    end


function dirtree:drawSelections() 
        local li = self:indexOfOpenFile()
        if li then 
            local bg = theme.gutter.bg
            local y = (li - self.state.s.view[1])
            if ((y < self.cells.rows) and (li < #self.state.s.lines)) then 
                local xs = kseg.headCount(self.state.s.lines[li], ' ')
                self.cells.set(((xs - 1) - self.state.s.view[0]), y, '', bg, self.color.bg)
                for x = xs, self.cells.cols-1 do 
                    self.cells.set_bg((x - self.state.s.view[0]), y, bg)
                end
            end
        end
        
        return choices.drawSelections(self)
    end


function dirtree:indexOfOpenFile() 
        local currentFile = ked_session.get('editor▸file')
        
        if empty(currentFile) then return end
        
        for item, idx in self.fuzzied do 
            if (item.path == currentFile) then return idx end
        end
    end


function dirtree:itemForPath(p) 
        for item, idx in self.items do 
            if slash.samePath(item.path, p) then return item end
        end
    end


function dirtree:itemIndexForPath(p) 
        for item, idx in self.items do 
            if slash.samePath(item.path, p) then return idx end
        end
    end

-- 000   000  00000000  000   0000000   000   000  000000000  
-- 000 0 000  000       000  000        000   000     000     
-- 000000000  0000000   000  000  0000  000000000     000     
-- 000   000  000       000  000   000  000   000     000     
-- 00     00  00000000  000   0000000   000   000     000     


function dirtree:weight(item) 
        local p = slash.parse(item.path)
        
        local w = 0
        if (item.type == 'file') then 
            w = w + 10000
        end
        
        -- w += kstr.weight(p.file)
        return w
    end

return dirtree