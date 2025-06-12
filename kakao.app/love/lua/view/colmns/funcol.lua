--[[
00000000  000   000  000   000   0000000   0000000   000    
000       000   000  0000  000  000       000   000  000    
000000    000   000  000 0 000  000       000   000  000    
000       000   000  000  0000  000       000   000  000    
000        0000000   000   000   0000000   0000000   0000000
--]]

funtree = require "view.colmns.funtree"


local funcol = class("funcol", view)
    


function funcol:init(editor, features) 
        self.editor = editor
        
        view.init(self, 'funcol', features)
        
        self.isVisible = false
        self.active = false
        
        self.pointerType = 'pointer'
        
        self.knob = knob("" .. tostring(self.name) .. "_knob")
        self.funtree = funtree(self.editor, "" .. tostring(self.name) .. "_funtree", array('scrllr'))
        
        self.knob.frameSide = 'left'
        
        self.funtree:setColor('bg', theme.funtree.bg)
        self.funtree:setColor('empty', self.funtree.color.bg)
        self.funtree:setColor('cursor_main', self.funtree.color.bg)
        self.funtree:setColor('cursor_empty', self.funtree.color.bg)
        self.funtree.scroll:setColor('bg', self.funtree.color.bg)
        
        self.knob:setColor('bg', self.funtree.color.bg)
        
        post:on('funcol.resize', self.onFuncolResize)
        post:on('funcol.toggle', self.onFuncolToggle)
        post:on('session.merge', self.onSessionMerge)
        return self
    end


function funcol:onSessionMerge(recent) 
        if empty(recent.funcol) then return end
        
        if recent.funcol.active then 
            self.active = true
            self:show()
        end
        
        return ked_session:set('funcol', recent.funcol)
    end

-- ███       ███████   ███   ███   ███████   ███   ███  █████████
-- ███      ███   ███   ███ ███   ███   ███  ███   ███     ███   
-- ███      █████████    █████    ███   ███  ███   ███     ███   
-- ███      ███   ███     ███     ███   ███  ███   ███     ███   
-- ███████  ███   ███     ███      ███████    ███████      ███   


function funcol:layout(x, y, w, h) 
        self.funtree:layout(x, y, w, h)
        self.knob:layout(x, y, 1, h)
        
        view.layout(self, x, y, w, h)
        return self
    end

-- ███████    ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███ █ ███
-- ███   ███  ███████    █████████  █████████
-- ███   ███  ███   ███  ███   ███  ███   ███
-- ███████    ███   ███  ███   ███  ██     ██


function funcol:draw() 
        if ((self:hidden() or self:collapsed()) or not self.active) then return end
        
        self.cells:fill_rect(0, 1, -1, -1, ' ', nil, theme.funtree.bg)
        self.cells:fill_rect(0, 0, -1, 0, ' ', nil, theme.gutter.bg)
        
        self.funtree:draw()
        self.knob:draw()
        
        view.draw(self)
        return self
    end

--  ███████   ███████   ███   ███  █████████  ████████  ███   ███  █████████
-- ███       ███   ███  ████  ███     ███     ███        ███ ███      ███   
-- ███       ███   ███  ███ █ ███     ███     ███████     █████       ███   
-- ███       ███   ███  ███  ████     ███     ███        ███ ███      ███   
--  ███████   ███████   ███   ███     ███     ████████  ███   ███     ███   


function funcol:onContext(event) 
        if not self.hover then return end
        
        return print("funcol.onContext: " .. tostring(self.hover) .. "", event)
    end

-- █████████   ███████    ███████    ███████   ███      ████████
--    ███     ███   ███  ███        ███        ███      ███     
--    ███     ███   ███  ███  ████  ███  ████  ███      ███████ 
--    ███     ███   ███  ███   ███  ███   ███  ███      ███     
--    ███      ███████    ███████    ███████   ███████  ████████


function funcol:onFuncolResize() 
    self.knob.doDrag = true
    return self.knob.doDrag
    end

function funcol:onFuncolToggle() 
        if not (self:visible() and self:collapsed()) then self:toggle() end
        self.active = self:visible()
        ked_session:set('funcol▸active', self.active)
        local cols = max(16, int((self.cells.screen.cols / 6)))
        return -- post.emit 'view.size' @name 'left' (@hidden() ? -@cells.cols : cols-@cells.cols)
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function funcol:onMouse(event) 
        if ((self:hidden() or self:collapsed()) or not self.active) then return end
        
        if view.onMouse(self, event) then return true end
        if self.knob:onMouse(event) then return true end
        if self.funtree:onMouse(event) then 
    return true
        end
    end

-- 000   000  000   000  00000000  00000000  000      
-- 000 0 000  000   000  000       000       000      
-- 000000000  000000000  0000000   0000000   000      
-- 000   000  000   000  000       000       000      
-- 00     00  000   000  00000000  00000000  0000000  


function funcol:onWheel(event) 
        if ((self:hidden() or self:collapsed()) or not self.active) then return end
        return self.funtree:onWheel(event)
    end

-- 000   000  00000000  000   000  
-- 000  000   000        000 000   
-- 0000000    0000000     00000    
-- 000  000   000          000     
-- 000   000  00000000     000     


function funcol:onKey(key, event) 
        if not self.funtree:hasFocus() then return end
        
        return self.funtree:onKey(key, event)
    end

return funcol