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
    mapview.layout = x(y, w, h, method () 
        resized = ((((x ~= @cells.x) or (y ~= @cells.y)) or (w ~= @cells.cols)) or (h ~= @cells.rows))
        super x y w h
        
        if hidden().init() then return end
        
        if (@redraw or resized) then 
            if @redraw then createImages().init() end
            delete @redraw
            drawImages().init()
        end
    end)
    
    mapview.setSyntaxSegls = ext(@segls, method () 
        @syntax = new syntax
        @syntax.setExt ext
        @syntax.setSegls @segls
        
        @redraw = true
    end)
    
    mapview.updateLine = y(data, method () 
        data = data or (lineData().init())
        if empty then return end data
        id = (@imgId + y)
        @imageForLine data getSegls().init()[y] y
        t = @cells.screen.t
        t.deleteImage id
        t.sendImageData data id (#data / 3) 1
        t.placeLineImage id @cells.x (@cells.y + @rowOffset) (y * @pixelsPerRow) @pixelsPerRow
    end)
    
    mapview.updateFromLine = y(method () 
        if data = lineData().init() then 
            for li = y, #@state.s.lines-1 do 
                @updateLine li data
            end
        end
        
        while (#@images > #@state.s.lines) do 
            print('pooping')
            @cells.screen.t.deleteImage @images.pop()
        end
    end)
    
    mapview.imageForLine = data(line, y, syntax, method () 
        
        method charPixels(x, rgb) 
            for xr in iter(0, @pixelsPerCol) do 
                data[((((x * @pixelsPerCol) + xr) * 3) + 0)] = rgb[0]
                data[((((x * @pixelsPerCol) + xr) * 3) + 1)] = rgb[1]
                data[((((x * @pixelsPerCol) + xr) * 3) + 2)] = rgb[2]
            end
        end
        
        w = (#data / 3)
        maxX = (w / @pixelsPerCol)
        syntax = getSyntax().init()
        
        for x = 0, #line-1 do 
            if (x > maxX) then break end
            
            ch = line[x]
            
            if valid then (ch and (ch ~= ' '))
            elseif f = 0.7 then 
                if (ch in '0█') then 
                    clss = syntax.getClass x y
                    if ('header' in clss) then 
                        f = 2.0
                    end
                end
                
                rgb = syntax.getColor x y
                function (rgb = rgb.map(v)) clamp(0, 255, int((f * v))) end
                
                charPixels x rgb
            else 
                charPixels x @color.bg
            end
        end
        
        for x = #line, maxX-1 do 
            charPixels x @color.bg
        end
    end)


function mapview:init(@state) 
        view.init(self, (self.state.owner() + '.mapview'))
        
        self:setColor('bg', theme.quicky.bg)
        
        self.imgId = kstr.hash(self.state.name) .. ~0xffff
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


method mapview:reload() 
        self:createImages()
        return self:drawImages()
    end


method mapview:show() 
        return super()
    end


method mapview:hide() 
        if self:hidden() then return end
        
        self.cells.screen.t.hideImagesInRange(self.images[0], self.images[-1])
        
        return super()
    end


method mapview:clearImages() 
        if empty(self.images) then return end
        
        if (process.env.TERM == 'xterm-kitty') then 
            self.cells.screen.t.deleteImagesInRange(self.images[0], self.images[-1])
        else 
            for id in self.images do 
                self.cells.screen.t.deleteImage(id)
            end
        end
        
        self.images = array()
        return self.images
    end


method mapview:getSegls() 
    return self.segls
    end

method mapview:getSyntax() 
    return self.syntax
    end

-- 000  00     00   0000000    0000000   00000000   0000000  
-- 000  000   000  000   000  000        000       000       
-- 000  000000000  000000000  000  0000  0000000   0000000   
-- 000  000 0 000  000   000  000   000  000            000  
-- 000  000   000  000   000   0000000   00000000  0000000   


method mapview:maxLinesToLoad() 
    return (((self.cells.rows - self.rowOffset) * self.csz[1]) / self.pixelsPerRow)
    end


method mapview:createImages() 
        local t = self.cells.screen.t
        if empty(t.cellsz) then return end
        
        self.csz = t.cellsz
        
        self:clearImages()
        
        -- prof.start @state.name+'.map'
        
        local w = (self.cells.cols * self.csz[0])
        local bytes = (w * 3)
        
        if (bytes <= 0) then return end
        
        local lines = self:getSegls()
        
        local data = Buffer.alloc(bytes)
        
        local maxY = self:maxLinesToLoad()
        
        for line, y in lines do 
            self:imageForLine(data, line, y)
            local id = (self.imgId + y)
            self.images.push(id)
            t.sendImageData(data, id, w, 1)
            if (y > maxY) then break end
        end
        
        return -- prof.end @state.name+'.map'
    end

-- ███   ███  ████████   ███████     ███████   █████████  ████████
-- ███   ███  ███   ███  ███   ███  ███   ███     ███     ███     
-- ███   ███  ████████   ███   ███  █████████     ███     ███████ 
-- ███   ███  ███        ███   ███  ███   ███     ███     ███     
--  ███████   ███        ███████    ███   ███     ███     ████████


method mapview:lineData() 
        local w = (self.cells.cols * self.cells.screen.t.cellsz[0])
        local bytes = (w * 3)
        
        if (bytes <= 0) then return end
        
        return Buffer.alloc(bytes)
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


method mapview:drawImages() 
        local t = self.cells.screen.t
        
        if empty(((t.pixels or self:hidden()) or self:collapsed())) then return end
        
        -- @csz = t.cellsz # should have been set in createImages 
        
        for id, y in self.images do 
            t.placeLineImage(id, self.cells.x, (self.cells.y + self.rowOffset), (y * self.pixelsPerRow), self.pixelsPerRow)
        end
        
        return self
    end


method mapview:draw() 
        if (self:hidden() or self:collapsed()) then return end
        
        -- @csz = @cells.screen.t.cellsz
        
        self.cells.fill_rect(0, 0, (self.cells.cols - 1), (self.cells.rows - 1), ' ', null, self.color.bg)
        
        return self:drawImages()
    end

return mapview