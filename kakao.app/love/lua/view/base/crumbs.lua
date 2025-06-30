--[[
     0000000  00000000   000   000  00     00  0000000     0000000  
    000       000   000  000   000  000   000  000   000  000       
    000       0000000    000   000  000000000  0000000    0000000   
    000       000   000  000   000  000 0 000  000   000       000  
     0000000  000   000   0000000   000   000  0000000    0000000   

    clickable sequence of path segments with half-circles inbetween 
    used in the status, dircol, browse and searcher file headings
--]]

view = require "view.base.view"


local crumbs = class("crumbs", view)
    


function crumbs:init(name) 
        view.init(self, name)
        
        self.pointerType = 'pointer'
        self.rounded = array()
        
        self:setColor('hover', theme.hover.bg)
        self:setColor('bg', theme.crumbs.bg)
        self:setColor('fg', theme.crumbs.fg)
        self:setColor('empty', theme.editor.bg)
        return self
    end


function crumbs:setColor(key, color) 
        if (key == 'empty') then 
                self:setColor('empty_left', color)
                self:setColor('empty_right', color)
        end
        
        return view.setColor(self, key, color)
    end


function crumbs:layout(x, y, w, h) 
        view.layout(self, x, y, w, h)
        
        return self:adjustText()
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function crumbs:draw() 
        if self:hidden() then return end
        if empty(self.rounded) then return end
        
        local colors = array()
        for i in iter(1, #self.split) do 
            if (i == self.hoverIndex) then 
                colors:push(self.color.hover)
            else 
                colors:push(color.darken(self.color.bg, (0.4 + ((0.6 * (i + 1)) / #self.split))))
            end
        end
        
        for x in iter(1, self.rounded:len()) do 
            local si = self:splitIndexAtCol(x)
            local bg = colors[si]
            local ch = self.rounded[x]
            
            if ((ch == '') or (ch == '')) then 
                local fg = bg
                bg = (function () 
    if (si > 1) then 
    return colors[(si - 1)] else 
    return self.color.empty_left
                     end
end)()
                if (x == self.rounded:len()) then 
                    bg = self.color.empty_right
                end
                
                self.cells:set(x, 1, ch, fg, bg)
            else 
                if (si == self.hoverIndex) then 
                    local fg = color.adjustForBackground(self.color.fg, bg)
                elseif (si < (#self.split - 1)) then 
                    local fg = color.darken(self.color.fg, min(1, ((si + 3) / #self.split)))
                else 
                    local fg = color.brighten(self.color.fg)
                end
                
                self.cells:set(x, 1, ch, fg, bg)
            end
        end
        
        return self:render()
    end

--  0000000  00000000   000      000  000000000  000  000   000  0000000    00000000  000   000  
-- 000       000   000  000      000     000     000  0000  000  000   000  000        000 000   
-- 0000000   00000000   000      000     000     000  000 0 000  000   000  0000000     00000    
--      000  000        000      000     000     000  000  0000  000   000  000        000 000   
-- 0000000   000        0000000  000     000     000  000   000  0000000    00000000  000   000  


function crumbs:splitIndexAtCol(col) 
        local sl = 0
        for si = 1, (#self.split + 1)-1 do 
            sl = sl + ((#self.split[si] + 2))
            if (sl >= col) then 
                return si
            end
        end
        
        return #self.split
    end


function crumbs:colsAtSplitIndex(idx) 
        local si = 0
        local ei = 0
        
        print("colsAtSplitIndex " .. tostring(idx) .. "", self.split, type(self.split), #self.split)
        for i in iter(1, idx) do 
            if (i < idx) then 
                si = si + ((#self.split[i] + 2))
            end
            
            ei = ei + ((#self.split[i] + 2))
        end
        
        return array(si, ei)
    end


function crumbs:pathAtSplitIndex(idx) 
        -- log "PATH AT SPLIT INDEX #{idx}" @split
        -- log "PATH AT SPLIT ROOT #{idx}" @root
        local path = slash.path(unpack(self.split:slice(1, idx)))
        -- path = slash.path @root path
        print("PATH AT SPLIT PATH " .. tostring(idx) .. "", path)
        if ((string.sub(path, 1, 1) ~= "~") and (string.sub(path, 1, 1) ~= "/")) then 
            path = '/' .. path
        end
        
        return path
    end

--  0000000   0000000          000  000   000   0000000  000000000  
-- 000   000  000   000        000  000   000  000          000     
-- 000000000  000   000        000  000   000  0000000      000     
-- 000   000  000   000  000   000  000   000       000     000     
-- 000   000  0000000     0000000    0000000   0000000      000     


function crumbs:adjustText() 
        if self:hidden() then return end
        
        self.path = self.path or ''
        
        if (self.path == '') then 
            self.rounded = array()
            return
        end
        
        self.split = slash.split(self.path)
        
        if not self.dotlessRelative then 
            if (kstr.find("~/.", self.split[1]) < 0) then 
                self.split:unshift('/')
            end
        end
        
        self.root = array()
        self.rounded = array('')
        
        while (#self.split > 0) do 
            local s = self.split:shift()
            self.root:push(s)
            self.rounded = self.rounded + (kseg(s))
            self.rounded:push(' ')
        end
        
        self.split = slash.split(self.path)
        self.root = self.root:join('/')
        
        local padding = (function () 
    if self.padLast then 
    return kstr.lpad(((self.cells.cols - 2) - #self.rounded)) else 
    return ''
                  end
end)()
        
        return self.rounded:push('')
    end


function crumbs:set(path) 
        self.cells.rows = 1 -- 𝜏𝖍𝚒𝖘 s⫙ϵ⟅⟅𝖘 ϝ𝚒𝖘𝖍𝛾
        self.path = kstr.trim(path)
        return self:adjustText()
    end


function crumbs:show(path) 
    return self:set(slash.tilde(path))
    end

function crumbs:visible() 
    return (self.cells.rows > 0)
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function crumbs:onMouseLeave(event) 
        if not self.hoverIndex then return end
        local path = self:pathAtSplitIndex(self.hoverIndex)
        local cols = self:colsAtSplitIndex(self.hoverIndex)
        local dict = {index = self.hoverIndex, cols = cols}
        return self:emit('action', 'leave', path, dict)
    end


function crumbs:onMouse(event) 
        view.onMouse(self, event)
        
        if not self.hover then 
            if self.hoverIndex then 
                self.hoverIndex = nil
                return true
            end
            
            return
        end
        
        local col, row = unpack(self:eventPos(event))
        
        if (event.type == 'press') then 
                local si = self:splitIndexAtCol(col)
                if ((1 <= self.hoverIndex) and (self.hoverIndex <= #self.split)) then 
                    local path = self:pathAtSplitIndex(self.hoverIndex)
                    self:emit('action', 'click', path, event)
                end
                
                return true
        elseif (event.type == 'move') then 
                local index = self:splitIndexAtCol(col)
                if (self.hoverIndex ~= index) then 
                    self.hoverIndex = index
                    local cols = self:colsAtSplitIndex(index)
                    local path = self:pathAtSplitIndex(index)
                    local dict = {index = index, cols = cols}
                    self:emit('action', 'enter', path, dict)
                    return true
                end
        end
        
        return self.hover
    end

return crumbs