--[[
    ██     ██   ███████   ████████    ███████   ███████  ████████   
    ███   ███  ███   ███  ███   ███  ███       ███       ███   ███  
    █████████  █████████  ████████   ███████   ███       ███████    
    ███ █ ███  ███   ███  ███             ███  ███       ███   ███  
    ███   ███  ███   ███  ███        ███████    ███████  ███   ███  

    scrollable source map to the right of the fileeditor
--]]

 = require ""


local mapscr = class("mapscr", mapview)
    mapscr.onLinesChanged = diff(method () 
        if ((#diff.del == 0) == #diff.chg) then 
            reload().init()
        else 
            if (#diff.chg and ((#diff.del == 0) == #diff.ins)) then 
                for cli in diff.chg do 
                    @updateLine cli
                end
            else 
                minLine = #@state.s.lines
                minLine = min minLine if #diff.ins then diff.ins[0] end
                minLine = min minLine if #diff.del then diff.del[0] end
                for cli in diff.chg do 
                    if (cli >= minLine) then break end
                    @updateLine cli
                end
                
                @updateFromLine minLine
            end
        end
    end)
    
    mapscr.onMouse = event(method () 
        super event
        
        if (event.type == 'press') then 
                if @hover then 
                    @doDrag = true
                    post.emit 'pointer' 'grabbing'
                    return @scrollToPixel event.pixel
                end
        elseif (event.type == 'drag') then 
                if @doDrag then 
                    post.emit 'pointer' 'grab'
                    return @scrollToPixel event.pixel
                end
                
                @hover = false
        elseif (event.type == 'release') then 
                if @doDrag then 
                    delete @doDrag
                    post.emit 'pointer' if @hover then 'pointer' end
                    return true
                end
        end
        
        @hover
    end)
    
    mapscr.scrollToPixel = pixel(method () 
        view = @state.s.view.asMutable()
        
        li = (@topLine + int(((pixel[1] - @mapY) / @pixelsPerRow)))
        
        view[1] = li
        view[1] = view[1] - 5 -- offset so that clicking inside a header scrolls it into view
        
        maxY = (#@state.s.lines - @cells.rows)
        view[1] = min maxY if (maxY > 0) then view[1] end
        view[1] = max 0 view[1]
        
        mc = @state.mainCursor()
        
        if view then eql end @state.s.view
        
            if (li ~= mc[1]) then 
                @state.setCursors array(array(mc[0], (li + 5))) main:0 adjust:false
                return redraw:true
            end
            
            return
        
        @state.setView view
        @state.setCursors array(array(mc[0], (li + 5))) main:0 adjust:false
        
        drawKnob().init()
        redraw:true
    end)


function mapscr:init(@editor) 
        mapview.init(self, self.editor.state)
        
        self.state.on('view.changed', self.drawKnob)
        
        self.pointerType = 'pointer'
        
        self.knobId = (self.imgId + 0xeeee)
        
        self.topLine = 0 -- index of first visible line
        self.botLine = 0 -- index of last visible line
        self.knobHeight = 0 -- height of the knob in pixels
        self.mapWidth = 0 -- width of the map in pixels
        self.mapHeight = 0 -- height of the map in pixels
        self.linesInMap = 0 -- number of lines that fit into map
        
        self:setColor('bg', theme.editor.mapscr)
        self:setColor('highlight', theme.highlight.map)
        self:setColor('selection', theme.selection.map)
        self:setColor('fullysel', theme.selection.mapfully)
        
        self.screen.t.on('preResize', self.clearImages)
        
        post.on('greet.show', self.hide)
        post.on('greet.hide', self.show)
        post.on('popup.hide', self.show)
        post.on('popup.show', method (name) 
            if (name in array('differ', 'searcher')) then self:hide() end
            if (name in array('finder')) then 
    return self:show()
                    end
        end)
        
        self.editor.state.on('lines.changed', self.onLinesChanged)
        
        self:calcView()
        return self
    end

-- ███      ███  ███   ███  ████████   ███████         ███████  ███   ███   ███████   ███   ███   ███████   ████████  ███████  
-- ███      ███  ████  ███  ███       ███             ███       ███   ███  ███   ███  ████  ███  ███        ███       ███   ███
-- ███      ███  ███ █ ███  ███████   ███████         ███       █████████  █████████  ███ █ ███  ███  ████  ███████   ███   ███
-- ███      ███  ███  ████  ███            ███        ███       ███   ███  ███   ███  ███  ████  ███   ███  ███       ███   ███
-- ███████  ███  ███   ███  ████████  ███████          ███████  ███   ███  ███   ███  ███   ███   ███████   ████████  ███████  


method mapscr:getSegls() 
    return self.state.segls
    end

method mapscr:getSyntax() 
    return self.state.syntax
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  

-- 00000000   00000000   0000000  000  0000000  00000000  
-- 000   000  000       000       000     000   000       
-- 0000000    0000000   0000000   000    000    0000000   
-- 000   000  000            000  000   000     000       
-- 000   000  00000000  0000000   000  0000000  00000000  


method mapscr:onResize() 
        self.csz = self.cells.screen.t.cellsz
        
        if empty(self.csz) then return end
        
        self:calcView()
        self.redraw = true
        return self.redraw
    end

--  0000000   0000000  00000000    0000000   000      000      000000000   0000000   
-- 000       000       000   000  000   000  000      000         000     000   000  
-- 0000000   000       0000000    000   000  000      000         000     000   000  
--      000  000       000   000  000   000  000      000         000     000   000  
-- 0000000    0000000  000   000   0000000   0000000  0000000     000      0000000   

--  ███████   ███████   ███       ███████  ███   ███  ███  ████████  ███   ███
-- ███       ███   ███  ███      ███       ███   ███  ███  ███       ███ █ ███
-- ███       █████████  ███      ███        ███ ███   ███  ███████   █████████
-- ███       ███   ███  ███      ███          ███     ███  ███       ███   ███
--  ███████  ███   ███  ███████   ███████      █      ███  ████████  ██     ██


function mapscr:calcView() 
        self.mapX = (self.cells.x * self.csz[0])
        self.mapY = (self.cells.y * self.csz[1])
        
        self.mapHeight = (self.cells.rows * self.csz[1])
        self.mapWidth = (self.cells.cols * self.csz[0])
        
        self.mapBot = ((self.mapY + self.mapHeight) - self.pixelsPerRow)
        
        self.linesInMap = int((self.mapHeight / self.pixelsPerRow))
        self.knobHeight = (self.state.cells.rows * self.pixelsPerRow)
        
        local editorLinesHeight = (#self.state.s.lines * self.pixelsPerRow)
        if ((editorLinesHeight > self.mapHeight) and (self.state.s.view[1] > 0)) then 
            local maxOffset = (#self.state.s.lines - self.linesInMap)
            local viewFactor = (self.state.s.view[1] / (#self.state.s.lines - self.cells.rows))
            self.topLine = int((viewFactor * maxOffset))
        else 
            self.topLine = 0
        end
        
        self.botLine = min((#self.state.s.lines - 1), (self.topLine + self.linesInMap))
        return self.botLine
    end


function mapscr:lineOffset(y) 
    return ((y - self.topLine) * self.pixelsPerRow)
    end


function mapscr:pixelPos(pos) 
       return array((self.mapX + (pos[0] * self.pixelsPerCol)), (self.mapY + self:lineOffset(pos[1])))
    end


method mapscr:maxLinesToLoad() 
    return 2000
    end

--[[
    ███████    ████████    ███████   ███   ███
    ███   ███  ███   ███  ███   ███  ███ █ ███
    ███   ███  ███████    █████████  █████████
    ███   ███  ███   ███  ███   ███  ███   ███
    ███████    ███   ███  ███   ███  ██     ██
    --]]


method mapscr:draw() 
        if (self:hidden() or self:collapsed()) then return end
        
        super()
        
        if self.csz then 
            self:drawCursors()
            return self:drawHighlights()
        end
    end

-- ███  ██     ██   ███████    ███████   ████████   ███████
-- ███  ███   ███  ███   ███  ███        ███       ███     
-- ███  █████████  █████████  ███  ████  ███████   ███████ 
-- ███  ███ █ ███  ███   ███  ███   ███  ███            ███
-- ███  ███   ███  ███   ███   ███████   ████████  ███████ 


method mapscr:drawImages() 
        local t = self.cells.screen.t
        
        if empty(((t.pixels or self:hidden()) or self:collapsed())) then return end
        
        for y in iter(self.topLine, self.botLine) do 
            local id = self.images[y]
            t.placeLineImage(id, self.cells.x, self.cells.y, self:lineOffset(y), self.pixelsPerRow)
        end
        
        if self.topLine then 
            t.hideImagesInRange(self.images[0], self.images[(self.topLine - 1)])
        end
        
        if (self.botLine < #self.images) then 
            t.hideImagesInRange(self.images[self.botLine], self.images[-1])
        end
        
        return self:drawKnob()
    end

-- ███   ███  ███   ███   ███████   ███████  
-- ███  ███   ████  ███  ███   ███  ███   ███
-- ███████    ███ █ ███  ███   ███  ███████  
-- ███  ███   ███  ████  ███   ███  ███   ███
-- ███   ███  ███   ███   ███████   ███████  


method mapscr:drawKnob() 
        self:calcView()
        
        if empty(((self.csz or self:hidden()) or self:collapsed())) then return end
        
        local ky = self:lineOffset(self.state.s.view[1])
        
        return self.cells.screen.t.placeImageOverlay(self.knobId, self.cells.x, self.cells.y, ky, self.mapWidth, self.knobHeight)
    end


method mapscr:hide() 
        if self:hidden() then return end
        
        self.cells.screen.t.hideImageOverlay(self.knobId)
        
        return super()
    end

--  ███████  ███   ███  ████████    ███████   ███████   ████████    ███████
-- ███       ███   ███  ███   ███  ███       ███   ███  ███   ███  ███     
-- ███       ███   ███  ███████    ███████   ███   ███  ███████    ███████ 
-- ███       ███   ███  ███   ███       ███  ███   ███  ███   ███       ███
--  ███████   ███████   ███   ███  ███████    ███████   ███   ███  ███████ 


method mapscr:drawCursors() 
        for pos, idx in self.state.s.cursors do 
            array(sx, sy) = self:pixelPos(pos)
            
            if ((sy < self.mapY) or (sy >= self.mapBot)) then continue end
            if ((sx < self.mapX) or (sx >= (self.mapX + self.mapWidth))) then continue end
            
            if (idx == self.state.s.main) then 
                local fg = theme.cursor.main
                local sw = (self.pixelsPerCol * 2)
                sx = sx - (int((self.pixelsPerCol / 2)))
            else 
                local fg = theme.cursor.multi
                local sw = self.pixelsPerCol
            end
            
            squares.place(sx, sy, sw, self.pixelsPerRow, fg)
            
            if (idx == self.state.s.main) then 
                squares.place((((self.cells.x * self.csz[0]) + self.mapWidth) - (self.pixelsPerCol * 4)), sy, (self.pixelsPerCol * 4), self.pixelsPerRow, fg, 2002)
            end
        end
    end

-- 000   000  000   0000000   000   000  000      000   0000000   000   000  000000000   0000000  
-- 000   000  000  000        000   000  000      000  000        000   000     000     000       
-- 000000000  000  000  0000  000000000  000      000  000  0000  000000000     000     0000000   
-- 000   000  000  000   000  000   000  000      000  000   000  000   000     000          000  
-- 000   000  000   0000000   000   000  0000000  000   0000000   000   000     000     0000000   


method mapscr:drawHighlights() 
        local mc = self.state.mainCursor()
        
        local xoff = (self.mapX + self.mapWidth)
        local selw = (self.pixelsPerCol * 16)
        local hlw = (self.pixelsPerCol * 8)
        
        for li in belt.lineIndicesForRanges(self.state.s.selections) do 
            local sy = (self.mapY + self:lineOffset(li))
            if ((sy < self.mapY) or (sy >= self.mapBot)) then continue end
            
            if self.state.isSpanSelectedLine(li) then 
                local clr = self.color.selection
            else 
                local clr = self.color.fullysel
            end
            
            squares.place((xoff - selw), sy, selw, self.pixelsPerRow, clr, 2000)
        end
        
        for li in belt.lineIndicesForSpans(self.state.s.highlights) do 
            local sy = (self.mapY + self:lineOffset(li))
            if ((sy < self.mapY) or (sy >= self.mapBot)) then continue end
            
            squares.place((xoff - hlw), sy, hlw, self.pixelsPerRow, self.color.highlight, 2001)
        end
    end

return mapscr