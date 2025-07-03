--[[
    ██     ██   ███████   ████████    ███████   ███████  ████████   
    ███   ███  ███   ███  ███   ███  ███       ███       ███   ███  
    █████████  █████████  ████████   ███████   ███       ███████    
    ███ █ ███  ███   ███  ███             ███  ███       ███   ███  
    ███   ███  ███   ███  ███        ███████    ███████  ███   ███  

    scrollable source map to the right of the fileeditor
--]]

-- use                 ◆ mapview
mapview = require "view.editor.mapview"


local mapscr = class("mapscr", mapview)
    


function mapscr:init(editor) 
        self.editor = editor
        
        mapview.init(self, self.editor.state)
        
        self.state:on('view.changed', self.drawKnob, self)
        
        self.pointerType = 'pointer'
        
        -- @knobId = @imgId+0xeeee
        
        self.topLine = 1 -- index of first visible line
        self.botLine = 0 -- index of last visible line
        self.knobHeight = 0 -- height of the knob in pixels
        self.mapWidth = 0 -- width of the map in pixels
        self.mapHeight = 0 -- height of the map in pixels
        self.linesInMap = 0 -- number of lines that fit into map
        
        self:setColor('bg', theme.editor.mapscr)
        self:setColor('highlight', theme.highlight.map)
        self:setColor('selection', theme.selection.map)
        self:setColor('fullysel', theme.selection.mapfully)
        
        -- @screen.t∙on 'preResize' @clearImages @
        
        post:on('greet.show', self.hide, self)
        post:on('greet.hide', self.show, self)
        post:on('popup.hide', self.show, self)
        post:on('popup.show', self.onPopup, self)
        
        self.editor.state:on('lines.changed', self.onLinesChanged, self)
        
        self:calcView()
        return self
    end


function mapscr:onPopup(name) 
        if array('differ', 'searcher'):has(name) then self:hide() end
        if (name == 'finder') then 
    return self:show()
                end
    end

-- ███      ███  ███   ███  ████████   ███████         ███████  ███   ███   ███████   ███   ███   ███████   ████████  ███████  
-- ███      ███  ████  ███  ███       ███             ███       ███   ███  ███   ███  ████  ███  ███        ███       ███   ███
-- ███      ███  ███ █ ███  ███████   ███████         ███       █████████  █████████  ███ █ ███  ███  ████  ███████   ███   ███
-- ███      ███  ███  ████  ███            ███        ███       ███   ███  ███   ███  ███  ████  ███   ███  ███       ███   ███
-- ███████  ███  ███   ███  ████████  ███████          ███████  ███   ███  ███   ███  ███   ███   ███████   ████████  ███████  


function mapscr:onLinesChanged(diff) 
        if ((diff.del.length == 0) == diff.chg.length) then 
            return self:reload()
        else 
            if (diff.chg.length and ((diff.del.length == 0) == diff.ins.length)) then 
                for _, cli in ipairs(diff.chg) do 
                    self:updateLine(cli)
                end
            else 
                local minLine = self.state.s.lines.length
                if diff.ins.length then 
                    minLine = min(minLine, diff.ins[1])
                end
                
                if diff.del.length then 
                    minLine = min(minLine, diff.del[1])
                end
                
                for _, cli in ipairs(diff.chg) do 
                    if (cli >= minLine) then break end
                    self:updateLine(cli)
                end
                
                return self:updateFromLine(minLine)
            end
        end
    end


function mapscr:getSegls() 
    return self.state.segls
    end

function mapscr:getSyntax() 
    return self.state.syntax
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function mapscr:onMouse(event) 
        mapview.onMouse(self, event)
        
        if (event.type == 'press') then 
                if self.hover then 
                    self.doDrag = true
                    post:emit('pointer', 'grabbing')
                    return self:scrollToPixel(event.pixel)
                end
        elseif (event.type == 'drag') then 
                if self.doDrag then 
                    post:emit('pointer', 'grab')
                    return self:scrollToPixel(event.pixel)
                end
                
                self.hover = false
        elseif (event.type == 'release') then 
                if self.doDrag then 
                    self.doDrag = nil
                    if self.hover then 
                        post:emit('pointer', 'pointer')
                    end
                    
                    return true
                end
        end
        
        return self.hover
    end

-- 00000000   00000000   0000000  000  0000000  00000000  
-- 000   000  000       000       000     000   000       
-- 0000000    0000000   0000000   000    000    0000000   
-- 000   000  000            000  000   000     000       
-- 000   000  00000000  0000000   000  0000000  00000000  


function mapscr:onResize() 
        -- @csz = @cells.screen.t.cellsz
        
        -- ⮐  if empty @csz
        
        self:calcView()
        self.redraw = true
        return self.redraw
    end

--  0000000   0000000  00000000    0000000   000      000      000000000   0000000   
-- 000       000       000   000  000   000  000      000         000     000   000  
-- 0000000   000       0000000    000   000  000      000         000     000   000  
--      000  000       000   000  000   000  000      000         000     000   000  
-- 0000000    0000000  000   000   0000000   0000000  0000000     000      0000000   


function mapscr:scrollToPixel(pixel) 
        local view = self.state.s.view:arr()
        
        local li = (self.topLine + int(((pixel[2] - self.mapY) / self.pixelsPerRow)))
        
        view[2] = li
        view[2] = view[2] - 5 -- offset so that clicking inside a header scrolls it into view
        
        local maxY = (self.state.s.lines:len() - self.cells.rows)
        if (maxY > 0) then 
            view[2] = min(maxY, view[2])
        end
        
        view[2] = max(1, view[2])
        
        local mc = self.state.mainCursor()
        
        if view(eql, self.state.s.view) then 
            if (li ~= mc[2]) then 
                self.state.setCursors(array(array(mc[1], (li + 5))), {main = 1, adjust = false})
                return true
            end
            
            return
        end
        
        self.state.setView(view)
        self.state.setCursors(array(array(mc[1], (li + 5))), {main = 1, adjust = false})
        
        self:drawKnob()
        return true
    end

--  ███████   ███████   ███       ███████  ███   ███  ███  ████████  ███   ███
-- ███       ███   ███  ███      ███       ███   ███  ███  ███       ███ █ ███
-- ███       █████████  ███      ███        ███ ███   ███  ███████   █████████
-- ███       ███   ███  ███      ███          ███     ███  ███       ███   ███
--  ███████  ███   ███  ███████   ███████      █      ███  ████████  ██     ██


function mapscr:calcView() 
        local cw = _G.screen.cw
        local ch = _G.screen.ch
        
        self.mapX = (self.cells.x * cw)
        self.mapY = (self.cells.y * ch)
        
        self.mapHeight = (self.cells.rows * ch)
        self.mapWidth = (self.cells.cols * cw)
        
        self.mapBot = ((self.mapY + self.mapHeight) - self.pixelsPerRow)
        
        self.linesInMap = int((self.mapHeight / self.pixelsPerRow))
        self.knobHeight = (self.state.cells.rows * self.pixelsPerRow)
        
        local editorLinesHeight = (self.state.s.lines:len() * self.pixelsPerRow)
        if ((editorLinesHeight > self.mapHeight) and (self.state.s.view[2] > 0)) then 
            local maxOffset = (self.state.s.lines:len() - self.linesInMap)
            local viewFactor = (self.state.s.view[2] / (self.state.s.lines:len() - self.cells.rows))
            self.topLine = int((viewFactor * maxOffset))
        else 
            self.topLine = 1
        end
        
        self.botLine = min(self.state.s.lines:len(), (self.topLine + self.linesInMap))
        return self.botLine
    end


function mapscr:lineOffset(y) 
    return ((y - self.topLine) * self.pixelsPerRow)
    end


function mapscr:pixelPos(pos) 
    return (self.mapX + (pos[1] * self.pixelsPerCol)), (self.mapY + self:lineOffset(pos[2]))
    end


function mapscr:maxLinesToLoad() 
    return 2000
    end

--[[
    ███████    ████████    ███████   ███   ███
    ███   ███  ███   ███  ███   ███  ███ █ ███
    ███   ███  ███████    █████████  █████████
    ███   ███  ███   ███  ███   ███  ███   ███
    ███████    ███   ███  ███   ███  ██     ██
    --]]


function mapscr:draw() 
        if (self:hidden() or self:collapsed()) then return end
        
        mapview.draw(self)
        
        if self.csz then 
            self:drawCursors()
            self:drawHighlights()
        end
        
        return self:render()
    end

-- ███  ██     ██   ███████    ███████   ████████   ███████
-- ███  ███   ███  ███   ███  ███        ███       ███     
-- ███  █████████  █████████  ███  ████  ███████   ███████ 
-- ███  ███ █ ███  ███   ███  ███   ███  ███            ███
-- ███  ███   ███  ███   ███   ███████   ████████  ███████ 


function mapscr:drawImages() 
        -- t = @cells.screen.t
        
        if (self:hidden() or self:collapsed()) then return end
        
        for y in iter(self.topLine, self.botLine) do 
            print("draw map line " .. tostring(y) .. "")
            -- id = @images[y]
            -- t.placeLineImage id @cells.x @cells.y @lineOffset(y) @pixelsPerRow
        end
        
        -- if @topLine
        --     t.hideImagesInRange @images[1] @images[@topLine-1]
        -- if @botLine < @images.length
        --     t.hideImagesInRange @images[@botLine] @images[-1]
        
        return self:drawKnob()
    end

-- ███   ███  ███   ███   ███████   ███████  
-- ███  ███   ████  ███  ███   ███  ███   ███
-- ███████    ███ █ ███  ███   ███  ███████  
-- ███  ███   ███  ████  ███   ███  ███   ███
-- ███   ███  ███   ███   ███████   ███████  


function mapscr:drawKnob() 
        self:calcView()
        
        if empty(((self.csz or self:hidden()) or self:collapsed())) then return end
        
        local ky = self:lineOffset(self.state.s.view[2])
        
        return -- @cells.screen.t.placeImageOverlay @knobId @cells.x @cells.y ky @mapWidth @knobHeight
    end


function mapscr:hide() 
        if self:hidden() then return end
        
        -- @cells.screen.t.hideImageOverlay @knobId
        
        return mapview.hide(self)
    end

--  ███████  ███   ███  ████████    ███████   ███████   ████████    ███████
-- ███       ███   ███  ███   ███  ███       ███   ███  ███   ███  ███     
-- ███       ███   ███  ███████    ███████   ███   ███  ███████    ███████ 
-- ███       ███   ███  ███   ███       ███  ███   ███  ███   ███       ███
--  ███████   ███████   ███   ███  ███████    ███████   ███   ███  ███████ 


function mapscr:drawCursors() 
        for idx, pos in ipairs(self.state.s.cursors) do 
            local sx, sy = self:pixelPos(pos)
            
            if ((((sy >= self.mapY) and (sy <= self.mapBot)) and (sx >= self.mapX)) and (sx <= (self.mapX + self.mapWidth))) then 
                if (idx == self.state.s.main) then 
                    local fg = theme.cursor.main
                    local sw = (self.pixelsPerCol * 2)
                    sx = sx - (int((self.pixelsPerCol / 2)))
                else 
                    local fg = theme.cursor.multi
                    local sw = self.pixelsPerCol
                end
                
                -- squares.place sx sy sw @pixelsPerRow fg
                
                -- if idx == @state.s.main
                --     squares.place @cells.x*@csz[0]+@mapWidth-@pixelsPerCol*4 sy @pixelsPerCol*4 @pixelsPerRow fg 2002
            end
        end
    end

-- 000   000  000   0000000   000   000  000      000   0000000   000   000  000000000   0000000  
-- 000   000  000  000        000   000  000      000  000        000   000     000     000       
-- 000000000  000  000  0000  000000000  000      000  000  0000  000000000     000     0000000   
-- 000   000  000  000   000  000   000  000      000  000   000  000   000     000          000  
-- 000   000  000   0000000   000   000  0000000  000   0000000   000   000     000     0000000   


function mapscr:drawHighlights() 
        local mc = self.state:mainCursor()
        
        local xoff = (self.mapX + self.mapWidth)
        local selw = (self.pixelsPerCol * 16)
        local hlw = (self.pixelsPerCol * 8)
        local sels = self.state.s.selections:arr()
        for li in belt.lineIndicesForRanges(sels):each() do 
            local sy = (self.mapY + self:lineOffset(li))
            
            if ((sy >= self.mapY) and (sy <= self.mapBot)) then 
                if self.state.isSpanSelectedLine(li) then 
                    local clr = self.color.selection
                else 
                    local clr = self.color.fullysel
                end
                
                -- squares.place xoff-selw sy selw @pixelsPerRow clr 2000
            end
        end
        
        local hils = self.state.s.highlights:arr()
        for li in belt.lineIndicesForSpans(hils):each() do 
            local sy = (self.mapY + self:lineOffset(li))
            if ((sy >= self.mapY) and (sy <= self.mapBot)) then 
                local _ = nil
                -- squares.place xoff-hlw sy hlw @pixelsPerRow @color.highlight 2001
            end
        end
    end

return mapscr