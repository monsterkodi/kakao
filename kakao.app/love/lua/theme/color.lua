--[[
     ███████   ███████   ███       ███████   ████████   
    ███       ███   ███  ███      ███   ███  ███   ███  
    ███       ███   ███  ███      ███   ███  ███████    
    ███       ███   ███  ███      ███   ███  ███   ███  
     ███████   ███████   ███████   ███████   ███   ███  
--]]

kstr = require "kxk.kstr"
belt = require "edit.tool.belt"


local color = class("color")
    color.static.readabilityCache = {}

--@ansi256: [
--    '#000000' '#800000' '#008000' '#808000'
--    '#000080' '#800080' '#008080' '#c0c0c0'
--    '#808080' '#ff0000' '#00ff00' '#ffff00'
--    '#0000ff' '#ff00ff' '#00ffff' '#ffffff'
--    '#000000' '#00005f' '#000087' '#0000af' '#0000d7' '#0000ff'
--    '#005f00' '#005f5f' '#005f87' '#005faf' '#005fd7' '#005fff'
--    '#008700' '#00875f' '#008787' '#0087af' '#0087d7' '#0087ff'
--    '#00af00' '#00af5f' '#00af87' '#00afaf' '#00afd7' '#00afff'
--    '#00d700' '#00d75f' '#00d787' '#00d7af' '#00d7d7' '#00d7ff'
--    '#00ff00' '#00ff5f' '#00ff87' '#00ffaf' '#00ffd7' '#00ffff'
--    '#5f0000' '#5f005f' '#5f0087' '#5f00af' '#5f00d7' '#5f00ff'
--    '#5f5f00' '#5f5f5f' '#5f5f87' '#5f5faf' '#5f5fd7' '#5f5fff'
--    '#5f8700' '#5f875f' '#5f8787' '#5f87af' '#5f87d7' '#5f87ff'
--    '#5faf00' '#5faf5f' '#5faf87' '#5fafaf' '#5fafd7' '#5fafff'
--    '#5fd700' '#5fd75f' '#5fd787' '#5fd7af' '#5fd7d7' '#5fd7ff'
--    '#5fff00' '#5fff5f' '#5fff87' '#5fffaf' '#5fffd7' '#5fffff'
--    '#870000' '#87005f' '#870087' '#8700af' '#8700d7' '#8700ff'
--    '#875f00' '#875f5f' '#875f87' '#875faf' '#875fd7' '#875fff'
--    '#878700' '#87875f' '#878787' '#8787af' '#8787d7' '#8787ff'
--    '#87af00' '#87af5f' '#87af87' '#87afaf' '#87afd7' '#87afff'
--    '#87d700' '#87d75f' '#87d787' '#87d7af' '#87d7d7' '#87d7ff'
--    '#87ff00' '#87ff5f' '#87ff87' '#87ffaf' '#87ffd7' '#87ffff'
--    '#af0000' '#af005f' '#af0087' '#af00af' '#af00d7' '#af00ff'
--    '#af5f00' '#af5f5f' '#af5f87' '#af5faf' '#af5fd7' '#af5fff'
--    '#af8700' '#af875f' '#af8787' '#af87af' '#af87d7' '#af87ff'
--    '#afaf00' '#afaf5f' '#afaf87' '#afafaf' '#afafd7' '#afafff'
--    '#afd700' '#afd75f' '#afd787' '#afd7af' '#afd7d7' '#afd7ff'
--    '#afff00' '#afff5f' '#afff87' '#afffaf' '#afffd7' '#afffff'
--    '#d70000' '#d7005f' '#d70087' '#d700af' '#d700d7' '#d700ff'
--    '#d75f00' '#d75f5f' '#d75f87' '#d75faf' '#d75fd7' '#d75fff'
--    '#d78700' '#d7875f' '#d78787' '#d787af' '#d787d7' '#d787ff'
--    '#d7af00' '#d7af5f' '#d7af87' '#d7afaf' '#d7afd7' '#d7afff'
--    '#d7d700' '#d7d75f' '#d7d787' '#d7d7af' '#d7d7d7' '#d7d7ff'
--    '#d7ff00' '#d7ff5f' '#d7ff87' '#d7ffaf' '#d7ffd7' '#d7ffff'
--    '#ff0000' '#ff005f' '#ff0087' '#ff00af' '#ff00d7' '#ff00ff'
--    '#ff5f00' '#ff5f5f' '#ff5f87' '#ff5faf' '#ff5fd7' '#ff5fff'
--    '#ff8700' '#ff875f' '#ff8787' '#ff87af' '#ff87d7' '#ff87ff'
--    '#ffaf00' '#ffaf5f' '#ffaf87' '#ffafaf' '#ffafd7' '#ffafff'
--    '#ffd700' '#ffd75f' '#ffd787' '#ffd7af' '#ffd7d7' '#ffd7ff'
--    '#ffff00' '#ffff5f' '#ffff87' '#ffffaf' '#ffffd7' '#ffffff'
--    '#080808' '#121212' '#1c1c1c' '#262626' '#303030' '#3a3a3a'
--    '#444444' '#4e4e4e' '#585858' '#606060' '#666666' '#767676'
--    '#808080' '#8a8a8a' '#949494' '#9e9e9e' '#a8a8a8' '#b2b2b2'
--    '#bcbcbc' '#c6c6c6' '#d0d0d0' '#dadada' '#e4e4e4' '#eeeeee'
--    ]


function color.static.hex(c) 
    if is(c, array) then 
    return kstr.hexColor(c) else 
    return c
                  end
    end

function color.static.values(c) 
        if is(c, "string") then 
            return kstr.hexColor(c)
        end
        
        return c
    end

-- ███████     ███████   ████████   ███   ███  ████████  ███   ███
-- ███   ███  ███   ███  ███   ███  ███  ███   ███       ████  ███
-- ███   ███  █████████  ███████    ███████    ███████   ███ █ ███
-- ███   ███  ███   ███  ███   ███  ███  ███   ███       ███  ████
-- ███████    ███   ███  ███   ███  ███   ███  ████████  ███   ███


function color.static.darken(c, f) 
        f = f or 0.5
        
        if empty(c) then return array(0, 0, 0) end
        return c:map(function (v) 
    return clamp(0, 255, int((f * v)))
end)
    end

-- ███████    ████████   ███   ███████   ███   ███  █████████  ████████  ███   ███
-- ███   ███  ███   ███  ███  ███        ███   ███     ███     ███       ████  ███
-- ███████    ███████    ███  ███  ████  █████████     ███     ███████   ███ █ ███
-- ███   ███  ███   ███  ███  ███   ███  ███   ███     ███     ███       ███  ████
-- ███████    ███   ███  ███   ███████   ███   ███     ███     ████████  ███   ███


function color.static.brighten(c, f) 
        f = f or 0.5
        
        if empty(c) then return array(255, 255, 255) end
        return c:map(function (v) 
    return clamp(0, 255, int(((1 + f) * v)))
end)
    end

-- ███   ███  ███  ███████    ████████    ███████   ███   ███  █████████
-- ███   ███  ███  ███   ███  ███   ███  ███   ███  ████  ███     ███   
--  ███ ███   ███  ███████    ███████    █████████  ███ █ ███     ███   
--    ███     ███  ███   ███  ███   ███  ███   ███  ███  ████     ███   
--     █      ███  ███████    ███   ███  ███   ███  ███   ███     ███   


function color.static.vibrant(c, f) 
        f = f or 0.5
        
        if empty(c) then return array(128, 128, 128) end
        local w = (((c[0] + c[1]) + c[2]) / 3)
        if (((c[0] * c[1]) * c[2]) == 0) then w = w * 2 end
        return array(min(255, int(((c[0] * f) + (w * (1 - f))))), min(255, int(((c[1] * f) + (w * (1 - f))))), min(255, int(((c[2] * f) + (w * (1 - f))))))
    end


function color.static.saturate(c, s, l) 
        s = s or 1.0
        l = l or 1.0
        
        local hsl = color.rgbToHsl(c)
        hsl[1] = hsl[1] * s
        hsl[2] = hsl[2] * l
        return color.hslToRgb(hsl)
    end

-- ███   ███   ███████  ███    
-- ███   ███  ███       ███    
-- █████████  ███████   ███    
-- ███   ███       ███  ███    
-- ███   ███  ███████   ███████


function color.static.rgbToHsl(c) 
        local r, g, b = unpack(c)
        
        r = r / 255
        g = g / 255
        b = b / 255
        
        local vmax = max(r, g, b)
        local vmin = min(r, g, b)
        local delta = (vmax - vmin)
        
        local h = 0
        local s = 0
        local l = ((vmax + vmin) / 2)
        
        if (delta ~= 0) then 
            s = 0
            if (l > 0.5) then s = (delta / ((2 - vmax) - vmin))
            else s = (delta / (vmax + vmin))
            end
            
            if (vmax == r) then 
                    local a = 0
                    if (g < b) then a = 6 end
                    h = (((g - b) / delta) + a)
            elseif (vmax == g) then h = (((b - r) / delta) + 2)
            elseif (vmax == b) then h = (((r - g) / delta) + 4)
            end
            
            h = h / 6
        end
        
        return (h * 360), (s * 100), (l * 100)
    end


function color.static.hslToRgb(c) 
        local h, s, l = unpack(c)
        
        h = h / 360
        s = s / 100
        l = l / 100
        
        local r = 0
        local g = 0
        local b = 0
        
        if (s == 0) then 
            r = l
            g = l
            b = l
        else 
            
            function hue2rgb(p, q, t) 
                if (t < 0) then t = t + 1 end
                if (t > 1) then t = t - 1 end
                if (t < (1 / 6)) then return (p + (((q - p) * 6) * t)) end
                if (t < (1 / 2)) then return q end
                if (t < (2 / 3)) then return (p + (((q - p) * ((2 / 3) - t)) * 6)) end
                return p
            end
            
            local q = 0
            if (l < 0.5) then q = (l * (1 + s))
            else q = ((l + s) - (l * s))
            end
            
            local p = ((2 * l) - q)
            
            r = hue2rgb(p, q, (h + (1 / 3)))
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, (h - (1 / 3)))
        end
        
        return round((r * 255)), round((g * 255)), round((b * 255))
    end

--  ███████   ███   ███   ███████  ███        ████████    ███████   ███████  
-- ███   ███  ████  ███  ███       ███        ███   ███  ███        ███   ███
-- █████████  ███ █ ███  ███████   ███        ███████    ███  ████  ███████  
-- ███   ███  ███  ████       ███  ███        ███   ███  ███   ███  ███   ███
-- ███   ███  ███   ███  ███████   ███        ███   ███   ███████   ███████  


function color.static.bg_rgb(c) 
        if empty(c) then return '\x1b[49m' end
        return "\x1b[48;2;" .. tostring(c[0]) .. ";" .. tostring(c[1]) .. ";" .. tostring(c[2]) .. "m"
    end


function color.static.fg_rgb(c) 
        if empty(c) then return '\x1b[39m' end
        return "\x1b[38;2;" .. tostring(c[0]) .. ";" .. tostring(c[1]) .. ";" .. tostring(c[2]) .. "m"
    end


function color.static.ul_rgb(c) 
        -- underline color
        if empty(c) then return '\x1b[59m' end
        return "\x1b[58;2;" .. tostring(c[0]) .. ";" .. tostring(c[1]) .. ";" .. tostring(c[2]) .. "m"
    end

-- ████████    ███████   ███   ███  ███████     ███████   ██     ██
-- ███   ███  ███   ███  ████  ███  ███   ███  ███   ███  ███   ███
-- ███████    █████████  ███ █ ███  ███   ███  ███   ███  █████████
-- ███   ███  ███   ███  ███  ████  ███   ███  ███   ███  ███ █ ███
-- ███   ███  ███   ███  ███   ███  ███████     ███████   ███   ███


function color.static.randomBackgroundColors(lines, bg, fg) 
        local resl = array()
        for line in lines do 
            local rl = ''
            rl = rl + (color.fg_rgb(fg))
            for char, idx in line do 
                local clr = ''
                if (char == ' ') then 
                    clr = (function () 
    if (idx and (line[(idx - 1)] ~= ' ')) then 
    return '\x1b[49m'
                                     end
end)()
                else 
                    clr = color.bg_rgb(color.darken(bg, (0.75 + (math.random() * 0.25))))
                end
                
                rl = rl + ((clr + char))
            end
            
            resl.push((rl + '\x1b[49m'))
        end
        
        return resl
    end

--  ███████  ████████  ███      ███          ███      ███  ███   ███  ████████   ███████  
-- ███       ███       ███      ███          ███      ███  ████  ███  ███       ███       
-- ███       ███████   ███      ███          ███      ███  ███ █ ███  ███████   ███████   
-- ███       ███       ███      ███          ███      ███  ███  ████  ███            ███  
--  ███████  ████████  ███████  ███████      ███████  ███  ███   ███  ████████  ███████   


function color.static.linesForCells(cells) 
        local lines = array()
        for ri, row in ipairs(cells) do 
            local line = ''
            for idx, cell in ipairs(row) do 
                line = line .. (color.bg_rgb(cell.bg))
                line = line .. (color.fg_rgb(cell.fg))
                line = line .. (cell.char)
            end
            
            lines:push(line .. '\x1b[49m')
        end
        
        return lines
    end

--  0000000   000       0000000   000   000  
-- 000        000      000   000  000 0 000  
-- 000  0000  000      000   000  000000000  
-- 000   000  000      000   000  000   000  
--  0000000   0000000   0000000   00     00  


function color.static.glowEffect(cells, strength) 
        strength = strength or 0.5
        
        for y, row in ipairs(cells) do 
            local cl = #cells
            local rl = #row
            for x, cell in ipairs(row) do 
                local sumr = 0
                local sumg = 0
                local sumb = 0
                for xo in iter(-6, 6) do 
                    for yo in iter(-3, 3) do 
                        if (((((x + xo) >= 1) and ((x + xo) <= rl)) and ((y + yo) >= 1)) and ((y + yo) <= cl)) then 
                            local nc = cells[(y + yo)][(x + xo)]
                            local df = (1 - (sqrt(((xo * xo) + (yo * yo))) / 6))
                            sumr = sumr + ((nc.fg[1] * df))
                            sumg = sumg + ((nc.fg[2] * df))
                            sumb = sumb + ((nc.fg[3] * df))
                        end
                    end
                end
                
                local scl = ((strength * 0.014) * util.randRange(0.98, 1.02))
                cell.bg = {
                           min(255, (scl * sumr)), 
                           min(255, (scl * sumg)), 
                           min(255, (scl * sumb))
                           }
            end
        end
        
        return cells
    end

-- ███   ███   ███████   ████████   ███   ███████   █████████  ████████
-- ███   ███  ███   ███  ███   ███  ███  ███   ███     ███     ███     
--  ███ ███   █████████  ███████    ███  █████████     ███     ███████ 
--    ███     ███   ███  ███   ███  ███  ███   ███     ███     ███     
--     █      ███   ███  ███   ███  ███  ███   ███     ███     ████████


function color.static.variateCellsColor(cells, typ, amount) 
        for cell in cells:each() do 
            local clr = cell.cell[typ]
            local f = (1 + util.randRange(-(amount / 2), (amount / 2)))
            cell.cell[typ] = clr:map(function (v) 
    return int(clamp(0, 255, (v * f)))
end)
        end
    end

-- 0000000    000  00     00  
-- 000   000  000  000   000  
-- 000   000  000  000000000  
-- 000   000  000  000 0 000  
-- 0000000    000  000   000  


function color.static.dimCellsColor(cells, typ, amount) 
        for cell in cells:each() do 
            local clr = cell.cell[typ]
            cell.cell[typ] = clr:map(function (v) 
    return int(clamp(0, 255, (v * amount)))
end)
        end
    end

-- ███      ███   ███  ██     ██  ███  ███   ███   ███████   ███   ███   ███████  ████████
-- ███      ███   ███  ███   ███  ███  ████  ███  ███   ███  ████  ███  ███       ███     
-- ███      ███   ███  █████████  ███  ███ █ ███  █████████  ███ █ ███  ███       ███████ 
-- ███      ███   ███  ███ █ ███  ███  ███  ████  ███   ███  ███  ████  ███       ███     
-- ███████   ███████   ███   ███  ███  ███   ███  ███   ███  ███   ███   ███████  ████████


function color.static.luminance(c) 
        print("luminance", type(c), c)
        local r, g, b = unpack(c)
        
        r = (r / 255)
        g = (g / 255)
        b = (b / 255)
        
        if (r <= 0.03928) then r = (r / 12.92) else r = math.pow(((r + 0.055) / 1.055), 2.4) end
        if (g <= 0.03928) then g = (g / 12.92) else g = math.pow(((g + 0.055) / 1.055), 2.4) end
        if (b <= 0.03928) then b = (b / 12.92) else b = math.pow(((b + 0.055) / 1.055), 2.4) end
        
        return (((0.2126 * r) + (0.7152 * g)) + (0.0722 * b))
    end

--  ███████   ███████   ███   ███  █████████  ████████    ███████    ███████  █████████
-- ███       ███   ███  ████  ███     ███     ███   ███  ███   ███  ███          ███   
-- ███       ███   ███  ███ █ ███     ███     ███████    █████████  ███████      ███   
-- ███       ███   ███  ███  ████     ███     ███   ███  ███   ███       ███     ███   
--  ███████   ███████   ███   ███     ███     ███   ███  ███   ███  ███████      ███   


function color.static.adjustForBackground(fg, bg) 
        color.readabilityCache[bg] = color.readabilityCache[bg] or ({})
        
        local clr = color.readabilityCache[bg][fg]
        if clr then 
            return clr
        end
        
        color.readabilityCache[bg][fg] = color.ensureReadability(fg, bg)
        return color.readabilityCache[bg][fg]
    end

-- 00000000   00000000   0000000   0000000     0000000   0000000    000  000      000  000000000  000   000  
-- 000   000  000       000   000  000   000  000   000  000   000  000  000      000     000      000 000   
-- 0000000    0000000   000000000  000   000  000000000  0000000    000  000      000     000       00000    
-- 000   000  000       000   000  000   000  000   000  000   000  000  000      000     000        000     
-- 000   000  00000000  000   000  0000000    000   000  0000000    000  0000000  000     000        000     


function color.static.ensureReadability(fg, bg) 
        if (empty(fg) or not is(fg[1], "number")) then return fg end
        if (empty(bg) or not is(bg[1], "number")) then return fg end
        
        
        function contrastRatio(l1, l2) 
    return ((max(l1, l2) + 0.05) / (min(l1, l2) + 0.05))
        end
        
        local fgLuminance = color.luminance(fg)
        local bgLuminance = color.luminance(bg)
        
        local contrast = contrastRatio(fgLuminance, bgLuminance)
        
        local h, s, l = color.rgbToHsl(fg)
        
        local step = 5
        if (bgLuminance > 0.5) then 
            step = -5
        end
        
        local cnt = 0
        while (cnt < 50) do 
            cnt = cnt + 1
            
            fg = color.hslToRgb(array(h, s, l))
            fgLuminance = color.luminance(fg)
            
            contrast = contrastRatio(fgLuminance, bgLuminance)
            
            if (contrast >= 4.5) then return fg end
            
            l = l + step
            if ((l < 0) or (l > 100)) then 
                step = -step
            end
        end
        
        return fg
    end

-- convert colors to rgb triplets
-- for key,val in pairs color.ansi256
--     color.ansi256[key] = color.values val

return color