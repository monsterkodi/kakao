--[[
    ██     ██   ███████   ███████    ████████
    ███   ███  ███   ███  ███   ███  ███     
    █████████  ███   ███  ███   ███  ███████ 
    ███ █ ███  ███   ███  ███   ███  ███     
    ███   ███   ███████   ███████    ████████

    stores modes per editor state
    
    modes handle input and text insertion:

    brckts   insert and highlight matching surround 
    replex   replaces certain input strings with others
    salter   ascii-headers
    unype    unicode type writer
--]]

unype = require "edit.mode.unype"
brckts = require "edit.mode.brckts"
replex = require "edit.mode.replex"
salter = require "edit.mode.salter"
filepos = require "edit.mode.filepos"


local mode = class("mode")
    mode.static.active = {}
    mode.static.modes = {
        brckts = brckts, 
        filepos = filepos, 
        replex = replex, 
        salter = salter, 
        unype = unype
        }

-- maps editor state names to active mode instances


function mode.static.names() 
        local n = array()
        for k, v in pairs(mode.modes) do 
            n:push(k)
        end
        
        return n
    end

--  0000000   000   000  000000000   0000000    0000000  000000000   0000000   00000000   000000000  
-- 000   000  000   000     000     000   000  000          000     000   000  000   000     000     
-- 000000000  000   000     000     000   000  0000000      000     000000000  0000000       000     
-- 000   000  000   000     000     000   000       000     000     000   000  000   000     000     
-- 000   000   0000000      000      0000000   0000000      000     000   000  000   000     000     


function mode.static.autoStartForEditor(editor) 
        for _, name in ipairs(mode.names()) do 
            if (editor.feats[name] and mode.modes[name].autoStart) then 
                mode.start(editor.state, name)
            end
        end
    end

--  ███████  █████████   ███████   ████████   █████████
-- ███          ███     ███   ███  ███   ███     ███   
-- ███████      ███     █████████  ███████       ███   
--      ███     ███     ███   ███  ███   ███     ███   
-- ███████      ███     ███   ███  ███   ███     ███   


function mode.static.start(state, name) 
        if mode.isActive(state, name) then return end
        
        mode.active[state.name] = mode.active[state.name] or (array())
        return mode.active[state.name]:push(mode.modes[name](state))
    end


function mode.static.stop(state, name) 
        local m = mode.get(state, name)
        
        mode.active[state.name].splice(mode.active[state.name].indexOf(m), 1)
        
        if is(m.stop, function () end) then 
    return m.stop()
                 end
    end


function mode.static.toggle(state, name) 
        if mode.isActive(state, name) then 
            return mode.stop(state, name)
        else 
            return mode.start(state, name)
        end
    end

--  ███████    ███████  █████████  ███  ███   ███  ████████
-- ███   ███  ███          ███     ███  ███   ███  ███     
-- █████████  ███          ███     ███   ███ ███   ███████ 
-- ███   ███  ███          ███     ███     ███     ███     
-- ███   ███   ███████     ███     ███      █      ████████


function mode.static.isActive(state, name) 
    return valid(mode.get(state, name))
    end


function mode.static.get(state, name) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if (m.name == name) then return m end
            end
        end
    end


function mode.static.insert(state, text) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.insert, "function") then 
                    text = m.insert(text)
                end
            end
        end
        
        return text
    end


function mode.static.postInsert(state) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.postInsert, "function") then 
                    m.postInsert()
                end
            end
        end
    end


function mode.static.deleteSelection(state) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.deleteSelection, "function") then 
                    if m.deleteSelection() then return true end
                end
            end
        end
        
        return false
    end


function mode.static.handleKey(state, key, event) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.handleKey, "function") then 
                    if (m.handleKey(m, key, event) ~= 'unhandled') then return end
                end
            end
        end
        
        return 'unhandled'
    end


function mode.static.cursorsSet(state, editor) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.cursorsSet, "function") then 
                    m:cursorsSet(editor)
                end
            end
        end
        
        if not mode.isActive(state, 'salter') then 
            if mode.modes['salter'] then 
                return mode.modes['salter']:checkCursorsSet(state)
            end
        end
    end


function mode.static.themeColor(state, colorName, defaultColor) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.themeColor, "function") then 
                    return m.themeColor(colorName, defaultColor)
                end
            end
        end
        
        return defaultColor
    end


function mode.static.preDrawLines(state, lines) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.preDrawLines, "function") then 
                    lines = m.preDrawLines(lines)
                end
            end
        end
        
        return lines
    end


function mode.static.postDraw(state) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.postDraw, "function") then 
                    m.postDraw()
                end
            end
        end
    end


function mode.static.fileLoaded(state, file, row, col, view) 
        if mode.active[state.name] then 
            for m in mode.active[state.name]:each() do 
                if is(m.fileLoaded, "function") then 
                    m.fileLoaded(file, row, col, view)
                end
            end
        end
        
        return nil
    end

-- ███   ███  ███  ██     ██  ████████   ███      ████████
-- ███   ███  ███  ███   ███  ███   ███  ███      ███     
--  ███ ███   ███  █████████  ████████   ███      ███████ 
--    ███     ███  ███ █ ███  ███        ███      ███     
--     █      ███  ███   ███  ███        ███████  ████████

-- class vimple
--     
--     @: state -> @state = state; @name = 'vimple'

-- ███   ███  ███   ███  ███  ███   ███   ███████ 
-- ███   ███  ████  ███  ███  ███  ███   ███   ███
-- ███   ███  ███ █ ███  ███  ███████    ███   ███
-- ███   ███  ███  ████  ███  ███  ███   ███   ███
--  ███████   ███   ███  ███  ███   ███   ███████ 

-- class uniko
-- 
--     @: state -> @state = state; @name = 'uniko'

-- 00000000   00000000   0000000   0000000   00000000   0000000    
-- 000   000  000       000       000   000  000   000  000   000  
-- 0000000    0000000   000       000   000  0000000    000   000  
-- 000   000  000       000       000   000  000   000  000   000  
-- 000   000  00000000   0000000   0000000   000   000  0000000    

-- class record
-- 
--     @: state -> @state = state; @name = 'record'

-- mode.loadModules()

return mode