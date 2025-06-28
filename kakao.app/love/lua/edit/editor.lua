--[[
    ████████  ███████    ███  █████████   ███████   ████████   
    ███       ███   ███  ███     ███     ███   ███  ███   ███  
    ███████   ███   ███  ███     ███     ███   ███  ███████    
    ███       ███   ███  ███     ███     ███   ███  ███   ███  
    ████████  ███████    ███     ███      ███████   ███   ███  

    configurable text editor
    used by fileeditor, input and choices
    basic editing is handled in state
    complex editing is delegated to mode(s)
--]]

draw = require "edit.draw"
state = require "edit.state"
mode = require "edit.mode"
scroll = require "view.base.scroll"
gutter = require "view.editor.gutter"


local editor = class("editor", draw)
    


function editor:init(name, features) 
        draw.init(self, name, features)
        
        self.name = name
        self.focusable = true
        
        self.state = state(self.cells, self.name)
        
        complete = require "edit.complete"
        
        if self.feats.scrllr then self.scroll = scroll(self.state, 'right') end
        if self.feats.scroll then self.scroll = scroll(self.state, 'left') end
        if self.feats.mapview then self.mapscr = mapview(self.state) end
        if self.feats.gutter then self.gutter = gutter(self) end
        if self.feats.complete then self.complete = complete(self) end
        
        mode.autoStartForEditor(self)
        
        post:on('focus', self.onFocus, self)
        post:on('modes.loaded', self.onModesLoaded, self)
        
        self:onModesLoaded()
        return self
    end


function editor:onModesLoaded() 
        for m in mode.names():each() do 
            if self.feats[m] then 
                self.state.allowedModes[m] = true
            end
        end
    end

-- 000       0000000   000   000   0000000   000   000  000000000  
-- 000      000   000   000 000   000   000  000   000     000     
-- 000      000000000    00000    000   000  000   000     000     
-- 000      000   000     000     000   000  000   000     000     
-- 0000000  000   000     000      0000000    0000000      000     


function editor:layout(x, y, w, h) 
        local g = 0
        local m = 0
        local s = 0
        local sl = 0
        local sr = 0
        
        if self.scroll then 
            s = 1
            if self.feats.scrllr then 
                sr = s
                self.scroll:layout(((x + w) - sr), y, s, h)
            else 
                sl = s
                self.scroll:layout(x, y, s, h)
            end
        end
        
        if self.gutter then 
            g = self.state:gutterWidth()
            self.gutter:layout((x + sl), y, g, h)
        end
        
        if self.mapscr then 
            if (self.name == 'editor') then 
                local mw = min(12, floor((w / 10)))
            else 
                local mw = 12
            end
            
            m = (function () 
    if self.mapscr.visible() then 
    return mw else 
    return 0
                end
end)()
            self.mapscr:layout((((x + w) - sr) - m), y, mw, h)
        end
        
        self.cells:layout(((x + sl) + g), y, (((w - s) - g) - m), h)
        
        if self.complete then 
            self.complete:onEditorLayout()
        end
        
        return self.state:initView()
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function editor:onMouse(event) 
        draw.onMouse(self, event)
        
        if (self.gutter and self.gutter:onMouse(event)) then return true end
        if (self.mapscr and self.mapscr:onMouse(event)) then return true end
        if (self.scroll and self.scroll:onMouse(event)) then return true end
        if (self.complete and self.complete:onMouse(event)) then return true end
        
        return false
    end

-- 000   000  000   000  00000000  00000000  000      
-- 000 0 000  000   000  000       000       000      
-- 000000000  000000000  0000000   0000000   000      
-- 000   000  000   000  000       000       000      
-- 00     00  000   000  00000000  00000000  0000000  


function editor:onWheel(event) 
        -- log "EDITOR.ONWHEEL" event
        
        if (event.cell[2] >= (self.cells.y + self.cells.rows)) then return end
        
        local inside = self.cells:isInsideEvent(event)
        inside = (inside or self.scroll.cells:isInsideEvent(event))
        inside = (inside or self.gutter.cells:isInsideEvent(event))
        if self.mapscr then 
            inside = (inside or self.mapscr.cells:isInsideEvent(event))
        end
        
        -- log "EDITOR.ONWHEEL INSIDE" inside
        
        if not inside then return end
        
        if self.complete then 
            local res = self.complete:onWheel(event)
            if res then 
                return res
            end
        end
        
        local steps = 0
        if (event.dir == 'up') or (event.dir == 'down') then steps = event.y
        else steps = event.x
        end
        
        if event.shift then steps = steps * 2 end
        if event.ctrl then steps = steps * 2 end
        if event.alt then steps = steps * 2 end
        
        -- log "EDITOR.ONWHEEL" steps, event.dir
        
        if (event.dir == 'up') or (event.dir == 'down') or (event.dir == 'left') or (event.dir == 'right') then self.state:scrollView(event.dir, steps)
        end
        
        return true
    end

--  0000000  000   000  00000000    0000000   0000000   00000000   
-- 000       000   000  000   000  000       000   000  000   000  
-- 000       000   000  0000000    0000000   000   000  0000000    
-- 000       000   000  000   000       000  000   000  000   000  
--  0000000   0000000   000   000  0000000    0000000   000   000  


function editor:isCursorInEmpty(mc) 
        mc = mc or (self.state:mainCursor())
        
        return belt.isLinesPosOutside(self.state.s.lines, mc)
    end


function editor:isCursorVisible(mc) 
        mc = mc or (self.state:mainCursor())
        
        local v = self.state.s.view
        
        return ((((v[1] <= mc[1]) and (mc[1] <= (v[1] + self.cells.cols))) and (v[2] <= mc[2])) and (mc[2] <= (v[2] + self.cells.rows)))
    end

-- 00000000   0000000    0000000  000   000   0000000  
-- 000       000   000  000       000   000  000       
-- 000000    000   000  000       000   000  0000000   
-- 000       000   000  000       000   000       000  
-- 000        0000000    0000000   0000000   0000000   


function editor:grabFocus() 
        if self:hidden() then self:show() end
        post:emit('focus', self.name)
        return -- @redraw()
    end


function editor:hasFocus() 
        return self.state.hasFocus
    end


function editor:onFocus(name) 
        self.state.hasFocus = (name == self.name)
        return self.state.hasFocus
    end

-- 00000000   00000000  0000000    00000000    0000000   000   000  
-- 000   000  000       000   000  000   000  000   000  000 0 000  
-- 0000000    0000000   000   000  0000000    000000000  000000000  
-- 000   000  000       000   000  000   000  000   000  000   000  
-- 000   000  00000000  0000000    000   000  000   000  00     00  

-- 000   000  00000000  000   000  
-- 000  000   000        000 000   
-- 0000000    0000000     00000    
-- 000  000   000          000     
-- 000   000  00000000     000     


function editor:onKey(key, event) 
        if not self:hasFocus() then return end
        
        if self.complete then 
            if (self.complete:handleKey(key, event) ~= 'unhandled') then return true end
        end
        
        if (self.state:handleKey(key, event) ~= 'unhandled') then 
            self.complete:hide()
            return true
        end
        
        if valid(event.char) then 
            -- log "INSERT #{event.char}"
            self.state:insert(event.char)
            -- log "INSERTED #{event.char}"
            if self.complete then 
                self.complete:complete()
            end
            
            return true
        else 
            local splt = kstr.split(key, "+")
            if not array('shift', 'ctrl', 'alt', 'cmd'):has(splt[#splt]) then 
                return print("editor.onKey? |" .. tostring(key) .. "| " .. tostring(event.char) .. " " .. tostring(valid(event.char)) .. "", event)
            end
        end
    end

return editor