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

-- use ../../kxk      ▪ post
-- use ../view/base   ◆ scroll view
-- use ../view/editor ◆ gutter mapview
-- use ./tool         ◆ belt
-- use                ◆ state draw complete mode
draw = require "edit.draw"
state = require "edit.state"
mode = require "edit.mode"
scroll = require "view.base.scroll"
gutter = require "view.editor.gutter"


local editor = class("editor", draw)
    


function editor:init(screen, name, features) 
        draw.init(self, screen, name, features)
        
        self.screen = screen
        self.name = name
        self.focusable = true
        
        self.state = state(self.cells, self.name)
        post:on('focus', self.onFocus, self)
        
        complete = require "edit.complete"
        
        if self.feats.scrllr then self.scroll = scroll(self.screen, self.state, 'right') end
        if self.feats.scroll then self.scroll = scroll(self.screen, self.state, 'left') end
        if self.feats.mapview then self.mapscr = mapview(self.screen, self.state) end
        if self.feats.gutter then self.gutter = gutter(self) end
        if self.feats.complete then self.complete = complete(self) end
        
        mode.autoStartForEditor(self)
        
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
                local mw = math.min(12, math.floor((w / 10)))
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
        -- super event
        
        local ret = self.gutter.onMouse(event) ; if ret.redraw then return ret end
        local ret = self.mapscr.onMouse(event) ; if ret.redraw then return ret end
        local ret = self.scroll.onMouse(event) ; if ret.redraw then return ret end
        local ret = self.complete.onMouse(event) ; if ret.redraw then return ret end
        
        return false
    end

-- 000   000  000   000  00000000  00000000  000      
-- 000 0 000  000   000  000       000       000      
-- 000000000  000000000  0000000   0000000   000      
-- 000   000  000   000  000       000       000      
-- 00     00  000   000  00000000  00000000  0000000  


function editor:onWheel(event) 
        if (event.cell[1] >= (self.cells.y + self.cells.rows)) then return end
        
        local inside = self.cells.isInsideEvent(event)
        inside = (inside or self.scroll.cells.isInsideEvent(event))
        inside = (inside or self.gutter.cells.isInsideEvent(event))
        inside = (inside or self.mapscr.cells.isInsideEvent(event))
        
        if not inside then return end
        
        if self.complete then 
            local res = self.complete.onWheel(event)
            if res then 
                return res
            end
        end
        
        local steps = 1 -- should be 4 if not using a mouse pad -> config
        if event.shift then steps = steps * 2 end
        if event.ctrl then steps = steps * 2 end
        if event.alt then steps = steps * 2 end
        
        if (event.dir == 'up') or (event.dir == 'down') or (event.dir == 'left') or (event.dir == 'right') then self.state.scrollView(event.dir, steps)
        end
        
        return {redraw = true}
    end

--  0000000  000   000  00000000    0000000   0000000   00000000   
-- 000       000   000  000   000  000       000   000  000   000  
-- 000       000   000  0000000    0000000   000   000  0000000    
-- 000       000   000  000   000       000  000   000  000   000  
--  0000000   0000000   000   000  0000000    0000000   000   000  


function editor:isCursorInEmpty(cursor) 
        cursor = cursor or (self.state.mainCursor())
        
        return belt.isLinesPosOutside(self.state.s.lines, cursor)
    end


function editor:isCursorVisible(cursor) 
        cursor = cursor or (self.state:mainCursor())
        
        local v = self.state.s.view
        
        return (((v[0] <= cursor[0]) < (v[0] + self.cells.cols)) and ((v[1] <= cursor[1]) < (v[1] + self.cells.rows)))
    end

-- 00000000   0000000    0000000  000   000   0000000  
-- 000       000   000  000       000   000  000       
-- 000000    000   000  000       000   000  0000000   
-- 000       000   000  000       000   000       000  
-- 000        0000000    0000000   0000000   0000000   


function editor:grabFocus() 
        if self:hidden() then self:show() end
        post:emit('focus', self.name)
        return self:redraw()
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


function editor:redraw() 
    return post:emit('redraw')
    end

-- 000   000  00000000  000   000  
-- 000  000   000        000 000   
-- 0000000    0000000     00000    
-- 000  000   000          000     
-- 000   000  00000000     000     


function editor:onKey(key, event) 
        if not self:hasFocus() then return end
        
        if self.complete then 
            if (self.complete.handleKey(key, event) ~= 'unhandled') then return true end
        end
        
        if (self.state.handleKey(key, event) ~= 'unhandled') then 
            self.complete.hide()
            return true
        end
        
        if valid(event.char) then 
            self.state.insert(event.char)
            self.complete.complete()
            return true
        else 
            local splt = kstr.split(key, "+")
            if not array('shift', 'ctrl', 'alt', 'cmd'):has(splt[#splt]) then 
                return print("editor.onKey? |" .. key .. "|", event)
            end
        end
    end

return editor