--[[
 0000000  000   000  000   000  000000000   0000000   000   000
000        000 000   0000  000     000     000   000   000 000 
0000000     00000    000 0 000     000     000000000    00000  
     000     000     000  0000     000     000   000   000 000 
0000000      000     000   000     000     000   000  000   000
--]]

-- use ../../kxk   ◆ matchr kstr kseg
-- use ../../kolor ◆ kulur
-- use ../theme    ◆ theme


local syntax = class("syntax")
    


function syntax:init(name) 
        self.name = name
        self.ext = 'txt'
        self:clear()
        return self
    end


function syntax:clear() 
        self.diss = array()
        self.hash = {}
        self.liha = {}
        return self.liha
    end


function syntax:setExt(ext) 
            self.ext = ext ; self.ansi = false ; return self.ansi
    end


function syntax:setRgxs(rgxs) 
    self.config = matchr.config(rgxs, 'u')
    return self.config
    end


function syntax:setLines(lines) 
    return self:setSegls(kseg.segls(lines))
    end


function syntax:setColors(colors) 
               self.colors = colors ; self.ansi = true ; return self.ansi
    end

--  ███████  ████████   ███████   ███       ███████
-- ███       ███       ███        ███      ███     
-- ███████   ███████   ███  ████  ███      ███████ 
--      ███  ███       ███   ███  ███           ███
-- ███████   ████████   ███████   ███████  ███████ 


function syntax:setSegls(segls) 
        -- if valid @config
        --     @diss = []
        --     for segs in segls
        --         dss = matchr.ranges(@config kseg.str(segs) 'u')
        --         for ds in dss
        --             if ds.clss is arr
        --                 ds.clss = trim ds.clss.map(kstr.trim).join(' ') 
        --         @diss.push dss
        --     # log "#{@name} diss" @diss if @name == "funcol_funtree.state.syntax"
        -- else
        --     ⮐  if @partialUpdate segls
        -- 
        --     @clear()
        --     
        --     @diss = kulur.dissect segls @ext
        --     for segl,idx in segls
        --         hsh = kseg.hash(segl)
        --         @hash[hsh] = @diss[idx]
        return --         @liha[idx] = hsh
    end

-- ███   ███  ████████   ███████     ███████   █████████  ████████
-- ███   ███  ███   ███  ███   ███  ███   ███     ███     ███     
-- ███   ███  ████████   ███   ███  █████████     ███     ███████ 
-- ███   ███  ███        ███   ███  ███   ███     ███     ███     
--  ███████   ███        ███████    ███   ███     ███     ████████


function syntax:partialUpdate(segls) 
        if (#self.diss ~= #segls) then return end
        if empty(self.hash) then return end
        
        local newHash = {}
        
        for segl, idx in ipairs(segls) do 
            local hsh = kseg.hash(segl)
            if self.hash[hsh] then 
                newHash[hsh] = self.hash[hsh]
            else 
                newHash[hsh] = kulur.dissect(array(segl), self.ext)[0]
            end
            
            if (self.liha[idx] ~= hsh) then 
                self.diss.splice(idx, 1, newHash[hsh])
                self.liha[idx] = hsh
            end
        end
        
        self.hash = newHash
        return self.hash
    end


function syntax:addSegl(segl, ext) 
        self.diss = self.diss.concat(kulur.dissect(array(segl), ext))
        return self.diss
    end


function syntax:appendSegls(segls, ext) 
        -- @diss = @diss.concat kulur.dissect(segls ext)
        for _, segl in ipairs(segls) do 
            self:addSegl(segl, ext)
        end
    end

--  ███████  ███       ███████    ███████   ███████
-- ███       ███      ███   ███  ███       ███     
-- ███       ███      █████████  ███████   ███████ 
-- ███       ███      ███   ███       ███       ███
--  ███████  ███████  ███   ███  ███████   ███████ 


function syntax:getClass(x, y) 
        if (self.diss and self.diss[y]) then 
            for dss in self.diss[y] do 
                if ((dss.start <= x) < (dss.start + #dss)) then 
                    return dss.clss
                end
            end
        end
        
        return 'text'
    end

--  ███████   ███████   ███       ███████   ████████ 
-- ███       ███   ███  ███      ███   ███  ███   ███
-- ███       ███   ███  ███      ███   ███  ███████  
-- ███       ███   ███  ███      ███   ███  ███   ███
--  ███████   ███████   ███████   ███████   ███   ███


function syntax:getColor(x, y) 
        if self.ansi then return self:getAnsiColor(x, y) end
        
        if is(x, num) then 
            local clss = self:getClass(x, y)
        else 
            local clss = x
        end
        
        -- if empty theme.syntax[clss] and not clss.endsWith 'italic'
        
            -- log "syntax.getColor - no syntax color for '#{clss}'" # @diss[y] 
        
        return (theme.syntax[clss] or array(155, 155, 155))
    end

--  ███████   ███   ███   ███████  ███
-- ███   ███  ████  ███  ███       ███
-- █████████  ███ █ ███  ███████   ███
-- ███   ███  ███  ████       ███  ███
-- ███   ███  ███   ███  ███████   ███


function syntax:getAnsiColor(x, y) 
        for clr in self.colors[y] do 
            if (clr.x <= x) then 
                if clr.w then 
                    if (x < (clr.x + clr.w)) then 
                        return clr.fg
                    end
                else 
                    return clr.fg
                end
            end
        end
        
        return array(256, 0, 256)
    end

--  ███████  ███   ███   ███████   ████████ 
-- ███       ███   ███  ███   ███  ███   ███
-- ███       █████████  █████████  ███████  
-- ███       ███   ███  ███   ███  ███   ███
--  ███████  ███   ███  ███   ███  ███   ███


function syntax:getChar(x, y, char) 
        local clss = self:getClass(x, y)
        if (kstr.find(clss, 'header') >= 1) then return '█' end
        return char
    end

return syntax