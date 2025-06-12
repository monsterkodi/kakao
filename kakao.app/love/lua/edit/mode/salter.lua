--  ███████   ███████   ███    █████████  ████████  ████████ 
-- ███       ███   ███  ███       ███     ███       ███   ███
-- ███████   █████████  ███       ███     ███████   ███████  
--      ███  ███   ███  ███       ███     ███       ███   ███
-- ███████   ███   ███  ███████   ███     ████████  ███   ███


local salter = class("salter")
    salter.static.syms = array()


function salter:init(state) 
        self.state = state
        self.name = 'salter'
        
        if empty(salter.syms) then 
            salter.syms = dict.keys(salterFont)
        end
        
        self:start()
        return self
    end

--  0000000  000   000  00000000    0000000   0000000   00000000    0000000  
-- 000       000   000  000   000  000       000   000  000   000  000       
-- 000       000   000  0000000    0000000   000   000  0000000    0000000   
-- 000       000   000  000   000       000  000   000  000   000       000  
--  0000000   0000000   000   000  0000000    0000000   000   000  0000000   


function salter.static.checkCursorsSet(state) 
        if not state.allowedModes then return end
        if not state.allowedModes.salter then return end
        if (#state.s.cursors ~= 1) then return end
        if #state.s.selections then return end
        
        local cursors = belt.findPositionsForSaltInsert(state.s.lines, state:mainCursor())
        if valid(cursors) then 
            mode.start(state, 'salter') return -- cursor moved inside a salted line 
        end
    end

--[[
     0000000   0000000   000    000000000  00000000  00000000   
    000       000   000  000       000     000       000   000  
    0000000   000000000  000       000     0000000   0000000    
         000  000   000  000       000     000       000   000  
    0000000   000   000  0000000   000     00000000  000   000  
    --]]

-- ███      ███  ███   ███  ████████
-- ███      ███  ████  ███  ███     
-- ███      ███  ███ █ ███  ███████ 
-- ███      ███  ███  ████  ███     
-- ███████  ███  ███   ███  ████████


function salter:start() 
        local cursors = self:findCursors()
        
        if valid(cursors) then 
            local mc = self.state.mainCursor()
            self.state.s = self.state.s.set('cursors', cursors)
            for main, pos in ipairs(cursors) do 
                if (pos == mc) then break end
            end
            
            self.state.s = self.state.s.set('main', main)
        end
        
        if ((#self.state.s.cursors == 5) and (#belt.positionColumns(self.state.s.cursors) == 1)) then 
            return true
        else 
            self.state:begin()
            self.state:moveCursors('eol')
            self.state:singleCursorAtIndentOrStartOfLine()
            for i = 0, 5-1 do 
                self.state:insert('# \n')
            end
            
            self.state:moveCursors('right')
            self.state:moveCursors('right')
            self.state:moveCursors('up')
            for i = 0, 4-1 do 
                self.state:expandCursors('up')
            end
            
            return self.state:ende()
        end
    end


function salter:stop() 
        return -- @state.setMainCursor @state.mainCursor()
    end


function salter:findCursors() 
    return belt:findPositionsForSaltInsert(self.state.s.lines, self.state:mainCursor())
    end

function salter:isSaltedLine(y) 
    return belt:isSaltedLine(self.state.s.lines[y])
    end


function salter:cursorsSet() 
        local cursors = self:findCursors()
        
        if valid(cursors) then 
            if self.state.s.cursors(eql, cursors) then 
                return true
            else 
                return self.state:setCursors(cursors)
            end
        else 
            return mode.stop(self.state, 'salter')
        end
    end

-- 0000000    00000000  000      00000000  000000000  00000000  
-- 000   000  000       000      000          000     000       
-- 000   000  0000000   000      0000000      000     0000000   
-- 000   000  000       000      000          000     000       
-- 0000000    00000000  0000000  00000000     000     00000000  


function salter:deleteSelection() 
        local cursors = self.state:allCursors()
        local lineids = belt.lineIndicesForPositions(cursors)
        
        for _, idx in ipairs(lineids) do 
            if not self.state:isFullySelectedLine(idx) then return end
        end
        
        self.state:moveCursors('bol')
        self.state:delete('eol')
        state:setCursors().init(function (idx) 
    return array(0, idx)
end)
        
        self.state:deselect()
        mode.start(self.state, 'salter') -- 𝜏𝖍𝚒𝖘 𝚒𝖘 ϝ𝓊⊂𝛋ϵ𝒹 𝓊𝔭 𝖘⊚⫙ϵ𝖍⊚⟒, 𝔟𝓊𝜏 𝚒𝜏 𝓢ϵξ⫙𝖘 𝜏⊚ ⟒◯ɼ𝛋 ϝ⊚ɼ ∩⊚⟒
        return true
    end

-- ███   ███  ████████  ███   ███
-- ███  ███   ███        ███ ███ 
-- ███████    ███████     █████  
-- ███  ███   ███          ███   
-- ███   ███  ████████     ███   


function salter:handleKey(key, event) 
        if (event.combo == 'up') then 
                if (self.state.s.main > 1) then 
                    self.state:setMain((self.state.s.main - 1))
                    return
                end
                
                if not self:isSaltedLine((self.state:mainCursor()[2] - 1)) then 
                    self.state.s = self.state.s.set('cursors', array(self.state:mainCursor()))
                    self.state.s = self.state.s.set('main', 1)
                    return 'unhandled'
                end
        elseif (event.combo == 'down') then 
                if (self.state.s.main < 5) then 
                    self.state.setMain((self.state.s.main + 1))
                    return
                end
                
                if not self:isSaltedLine((self.state:mainCursor()[2] + 1)) then 
                    self.state.s = self.state.s.set('cursors', array(self.state:mainCursor()))
                    self.state.s = self.state.s.set('main', 1)
                    return 'unhandled'
                end
        end
        
        local char = (function () 
    if valid(event.char) then 
    return event.char else 
    return key
               end
end)()
        
        if salter.hasChar(char) then 
            self.state.insert(salter(char, {char = '█', postfix = '  '}))
            return
        end
        
        return 'unhandled'
    end

--  0000000   0000000   000       0000000   00000000   
-- 000       000   000  000      000   000  000   000  
-- 000       000   000  000      000   000  0000000    
-- 000       000   000  000      000   000  000   000  
--  0000000   0000000   0000000   0000000   000   000  


function salter:themeColor(colorName, defaultColor) 
        if (colorName == 'cursor.multi') then return color.brighten(theme.syntax['comment triple header'], 0.2)
        elseif (colorName == 'cursor.main') then return color.brighten(theme.syntax['comment triple header'], 0.6)
        end
        
        return defaultColor
    end

return salter