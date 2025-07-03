--[[
    ██     ██   ███████   ████████   ███   ███  ███  ████████  ███   ███  
    ███   ███  ███   ███  ███   ███  ███   ███  ███  ███       ███ █ ███  
    █████████  █████████  ████████    ███ ███   ███  ███████   █████████  
    ███ █ ███  ███   ███  ███           ███     ███  ███       ███   ███  
    ███   ███  ███   ███  ███            █      ███  ████████  ██     ██  

    the base of fileditor's mapscr 
    also used for browse and quicky previews
--]]

view = require "view.base.view"


local mapview = class("mapview", view)
    
         --⮐  if empty @images
         --         
         --if process.env.TERM == 'xterm-kitty'
         --    @cells.screen.t.deleteImagesInRange @images[0] @images[-1]
         --else
         --    for id in @images
         --        @cells.screen.t.deleteImage id
         --         
         --@images = []


function mapview:init(state) 
        self.state = state
        
        view.init(self, self.state:owner() .. '.mapview')
        
        -- @setColor 'bg' theme.quicky.bg
        self:setColor('bg', array(100, 100, 100))
        
        -- @imgId  = kstr.hash(@state.name) & ~0xffff
        self.rowOffset = 0
        self.images = array()
        self.cells.cols = 12
        
        self.csz = array()
        self.pixelsPerRow = 4
        self.pixelsPerCol = 2
        return self
    end

--  0000000  000   000   0000000   000   000  
-- 000       000   000  000   000  000 0 000  
-- 0000000   000000000  000   000  000000000  
--      000  000   000  000   000  000   000  
-- 0000000   000   000   0000000   00     00  


function mapview:reload() 
        -- @createImages()
        return self:drawImages()
    end


function mapview:show() 
        return view.show(self)
    end


function mapview:hide() 
        if self:hidden() then return end
        
        -- @cells.screen.t.hideImagesInRange @images[0] @images[-1]
        
        return view.hide(self)
    end

-- clearImages: ->


function mapview:layout(x, y, w, h) 
        local resized = ((((x ~= self.cells.x) or (y ~= self.cells.y)) or (w ~= self.cells.cols)) or (h ~= self.cells.rows))
        view.layout(self, x, y, w, h)
        
        if self:hidden() then return end
        
        if (self.redraw or resized) then 
            -- @createImages() if @redraw
            -- delete @redraw
            return self:drawImages()
        end
    end


function mapview:getSegls() 
    return self.segls
    end

function mapview:getSyntax() 
    return self.syntax
    end

function mapview:setSyntaxSegls(ext, segls) 
        self.segls = segls
        self.syntax = syntax()
        self.syntax.setExt(ext)
        self.syntax.setSegls(self.segls)
        
        self.redraw = true
        return self.redraw
    end

-- 000  00     00   0000000    0000000   00000000   0000000  
-- 000  000   000  000   000  000        000       000       
-- 000  000000000  000000000  000  0000  0000000   0000000   
-- 000  000 0 000  000   000  000   000  000            000  
-- 000  000   000  000   000   0000000   00000000  0000000   


function mapview:maxLinesToLoad() 
    return (((self.cells.rows - self.rowOffset) * self.csz[1]) / self.pixelsPerRow)
    end


function mapview:createImages() 
        -- t = @cells.screen.t
        -- ⮐  if empty t.cellsz
        
        -- @csz = t.cellsz
        
        -- @clearImages()
        
        -- prof.start @state.name+'.map'
        
        --w = @cells.cols * @csz[0]
        --bytes = w*3
        --        
        --⮐  if bytes <= 0
        --        
        --lines = @getSegls()
        --        
        --data  = Buffer.alloc bytes
        --        
        --maxY  = @maxLinesToLoad()
        --        
        --for line,y in lines
        --    
        --    @imageForLine data line y
        --    id = @imgId+y
        --    @images.push id
        --    t.sendImageData data id w 1
        --    break if y > maxY
        --        
        return -- prof.end @state.name+'.map'
    end

-- ███   ███  ████████   ███████     ███████   █████████  ████████
-- ███   ███  ███   ███  ███   ███  ███   ███     ███     ███     
-- ███   ███  ████████   ███   ███  █████████     ███     ███████ 
-- ███   ███  ███        ███   ███  ███   ███     ███     ███     
--  ███████   ███        ███████    ███   ███     ███     ████████

--lineData: ->
--    
--    w = @cells.cols * @cells.screen.t.cellsz[0]
--    bytes = w*3
--    
--    ⮐  if bytes <= 0
--    
--    Buffer.alloc bytes
--    
--updateLine: y data -> 
--    
--    data ?= @lineData()        
--    ⮐  if empty data
--    id = @imgId+y
--    @imageForLine data @getSegls()[y] y
--    t = @cells.screen.t
--    t.deleteImage id
--    t.sendImageData data id data.length/3 1
--    t.placeLineImage id @cells.x @cells.y+@rowOffset y*@pixelsPerRow @pixelsPerRow
--    
--updateFromLine: y ->
--    
--    if data = @lineData()
--        
--        for li in y...@state.s.lines.length
--            @updateLine li data
--            
--    while @images.length > @state.s.lines.length
--        log 'pooping'
--        @cells.screen.t.deleteImage @images.pop()
--        
--imageForLine: data line y syntax ->
--    
--    charPixels = x rgb ->
--    
--        for xr in 0..@pixelsPerCol
--            data[(x*@pixelsPerCol+xr)*3+0] = rgb[0]
--            data[(x*@pixelsPerCol+xr)*3+1] = rgb[1]
--            data[(x*@pixelsPerCol+xr)*3+2] = rgb[2]
--            
--    w      = data.length / 3
--    maxX   = w/@pixelsPerCol
--    syntax = @getSyntax()
--    
--    for x in 0...line.length
--        
--        break if x > maxX
--                            
--        ch = line[x]
--        
--        if valid ch and ch != ' '
--         
--            f = 0.7
--            if ch in '0█'
--                clss = syntax.getClass x y
--                if 'header' in clss
--                    f = 2.0
--            rgb = syntax.getColor x y
--            rgb = rgb.map (v) -> clamp(0 255 int(f*v))
--             
--            charPixels x rgb
--        else
--            charPixels x @color.bg
--                
--    for x in line.length...maxX
--        charPixels x @color.bg        

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function mapview:drawImages() 
        -- t = @cells.screen.t
        
        -- ⮐  if @hidden() or @collapsed()
        -- ⮐  if empty t.pixels or 
        
        -- @csz = t.cellsz # should have been set in createImages 
        
        -- for id,y in @images
        
            -- t.placeLineImage id @cells.x @cells.y+@rowOffset y*@pixelsPerRow @pixelsPerRow
        return self
    end


function mapview:draw() 
        print("DRAW")
        if (self:hidden() or self:collapsed()) then return end
        
        -- @csz = @cells.screen.t.cellsz
        
        self.cells:fill_rect(1, 1, self.cells.cols, self.cells.rows, ' ', nil, self.color.bg)
        
        return self:drawImages()
    end

return mapview