--[[
     0000000  00000000   000   000  00     00  0000000     0000000  
    000       000   000  000   000  000   000  000   000  000       
    000       0000000    000   000  000000000  0000000    0000000   
    000       000   000  000   000  000 0 000  000   000       000  
     0000000  000   000   0000000   000   000  0000000    0000000   

    clickable sequence of path segments with half-circles inbetween 
    used in the status, dircol, browse and searcher file headings
--]]

-- use ../../../kxk ▪ slash post
-- use ../../theme  ◆ color theme
-- use              ◆ view

view = require "view.base.view"


local crumbs = class("crumbs", view)
    


function crumbs:init(screen, name) 
        view.init(self, screen, name)
        
        self.pointerType = 'pointer'
        self.rounded = ''
        
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
        for i = 0, #self.split-1 do 
            if (i == self.hoverIndex) then 
                colors.push(self.color.hover)
            else 
                colors.push(color.darken(self.color.bg, (0.4 + ((0.6 * (i + 1)) / #self.split))))
            end
        end
        
        for x = 0, #self.rounded-1 do 
            local si = self:splitIndexAtCol(x)
            local bg = colors[si]
            local ch = self.rounded[x]
            
            if ((ch == '') or (ch == '')) then 
                local fg = bg
                bg = (function () 
    if (si > 0) then 
    return colors[(si - 1)] else 
    return self.color.empty_left
                     end
end)()
                if (x == (#self.rounded - 1)) then 
                    bg = self.color.empty_right
                end
                
                self.cells.set(x, 0, ch, fg, bg)
            else 
                if (si == self.hoverIndex) then 
                    local fg = color.adjustForBackground(self.color.fg, bg)
                elseif (si < (#self.split - 1)) then 
                    local fg = color.darken(self.color.fg, math.min(1, ((si + 3) / #self.split)))
                else 
                    local fg = color.brighten(self.color.fg)
                end
                
                self.cells.set(x, 0, ch, fg, bg)
            end
        end
    end

--  0000000  00000000   000      000  000000000  000  000   000  0000000    00000000  000   000  
-- 000       000   000  000      000     000     000  0000  000  000   000  000        000 000   
-- 0000000   00000000   000      000     000     000  000 0 000  000   000  0000000     00000    
--      000  000        000      000     000     000  000  0000  000   000  000        000 000   
-- 0000000   000        0000000  000     000     000  000   000  0000000    00000000  000   000  


function crumbs:splitIndexAtCol(col) 
        local sl = 0
        for si = 0, #self.split-1 do 
            sl = sl + ((#self.split[si] + 2))
            if (sl > col) then 
                return si
            end
        end
        
        return (#self.split - 1)
    end


function crumbs:colsAtSplitIndex(idx) 
        local ei = 0
        
        for i in iter(0, idx) do 
            if (i < idx) then 
                si = si + ((#self.split[i] + 2))
            end
            
            ei = ei + ((#self.split[i] + 2))
        end
        
        return array(si, ei)
    end


function crumbs:pathAtSplitIndex(idx) 
        local path = slash.path(unpack(self.split.slice(1, idx)))
        path = slash.path(self.root, path)
        if ((path[1] ~= "~") and (path[1] ~= "/")) then 
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
            self.rounded = ''
            return
        end
        
        self.split = slash.split(self.path)
        
        if not self.dotlessRelative then 
            if (kstr.find("~/.", self.split[0]) < 0) then 
                self.split.unshift('/')
            end
        end
        
        self.root = array()
        
        self.rounded = self.split.join(' ')
        
        while ((#self.split > 1) and (#self.rounded > (self.cells.cols - 2))) do 
            self.root.push(self.split.shift())
            self.rounded = self.split.join(' ')
        end
        
        self.root = self.root.join('/')
        
        local padding = (function () 
    if self.padLast then 
    return kstr.lpad(((self.cells.cols - 2) - #self.rounded)) else 
    return ''
                  end
end)()
        
        self.rounded = '' .. self.rounded .. padding .. ''
        return self.rounded
    end


function crumbs:set(path) 
        self.cells.rows = 1 -- 𝜏𝖍𝚒𝖘 s⫙ϵ⟅⟅𝖘 ϝ𝚒𝖘𝖍𝛾
        self.path = trim(path)
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
        local index = self.hoverIndex
        return self:emit('action', 'leave', self:pathAtSplitIndex(index), {index = index, cols = self.colsAtSplitIndex(index)})
    end


function crumbs:onMouse(event) 
        local col, row = self:eventPos(event)
        
        -- super event
        
        if not self.hover then 
            if self.hoverIndex then 
                self.hoverIndex = nil
                return true
            end
            
            return
        end
        
        if (event.type == 'press') then 
                local si = self:splitIndexAtCol(col)
                if ((0 <= self.hoverIndex) < #self.split) then 
                    local path = self:pathAtSplitIndex(self.hoverIndex)
                    self:emit('action', 'click', path, event)
                end
                
                return {redraw = true}
        elseif (event.type == 'move') then 
                local index = self:splitIndexAtCol(col)
                if (self.hoverIndex ~= index) then 
                    self.hoverIndex = index
                    self:emit('action', 'enter', self:pathAtSplitIndex(index), {index = index, cols = self.colsAtSplitIndex(index)})
                    return {redraw = true}
                end
        end
        
        return self.hover
    end

return crumbs