--[[
    0000000    000   000  0000000    0000000    000      00000000  
    000   000  000   000  000   000  000   000  000      000       
    0000000    000   000  0000000    0000000    000      0000000   
    000   000  000   000  000   000  000   000  000      000       
    0000000     0000000   0000000    0000000    0000000  00000000  

    displays some clickable text in a rounded 'bubble'
    used by 
        ◆ searcher to display file headings
        ◆ status to display filepos status
--]]

-- use ../../../kxk ▪ slash kseg
-- use ../../theme  ◆ theme 
-- use ../../util   ◆ syntax
-- use ../base      ◆ view

syntax = require "util.syntax"
view = require "view.base.view"


local bubble = class("bubble", view)
    


function bubble:init(screen, name) 
        view.init(self, screen, name)
        
        self.pointerType = 'pointer'
        self.syntax = syntax()
        self.syntax:setExt('noon')
        
        self.rounded = '' -- ''
        
        self:setColor('bg', theme.hover.blur)
        self:setColor('hover', theme.hover.bg)
        self:setColor('empty', theme.editor.bg)
        return self
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function bubble:draw() 
        if self:hidden() then return end
        
        super()
        
        local bg = (function () 
    if self.hover then 
    return self.color.hover else 
    return self.color.bg
             end
end)()
        
        for ch, x in self.rounded do 
            if ((ch == '') or (ch == '')) then 
                self.cells.set(x, 0, ch, bg, self.color.empty)
            else 
                local fg = self.syntax.getColor(x, 0, ch)
                self.cells.set(x, 0, ch, fg, bg)
                if self.hover then 
                    self.cells.adjustContrastForHighlight(x, 0, bg)
                end
            end
        end
    end


function bubble:set(item) 
        self.item = item
        
        if empty(self.item) then 
            self.rounded = ''
            return self.rounded
        else 
            self.syntax.setSegls((self.item.segls or array(kseg(item.tilde))))
            self.rounded = '' .. self.item.tilde .. ''
            return self.rounded
        end
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function bubble:onMouseEnter(event) 
        self:emit('action', 'enter')
        return view.onMouseEnter(self, event)
    end


function bubble:onMouse(event) 
        view.onMouse(self, event)
        
        if (event.type == 'press') then 
                if self.hover then 
                    self:emit('action', 'click', self.item)
                    return {redraw = true}
                end
        end
        
        return self.hover
    end

return bubble