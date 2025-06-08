--[[
     ███████  █████████   ███████   █████████  ████████  
    ███          ███     ███   ███     ███     ███       
    ███████      ███     █████████     ███     ███████   
         ███     ███     ███   ███     ███     ███       
    ███████      ███     ███   ███     ███     ████████  

    handles basic text editing for the editor
    wraps text and editor state like cursors and selections 
        in an immutable to simplify undo
    delegates almost all text manipulation to pure functions
        in tool▸belt to simplify testing
--]]

-- use child_process os
-- use ../../kxk ▪ immutable kstr kseg events absMin
-- use ../util   ◆ syntax
-- use ./act     ◆ del insert select join indent multi main
-- use ./tool    ◆ belt
-- use           ◆ keys mode
syntax = require "util.syntax"


local state = class("state", events)
    


function state:init(cells, name) 
        self.cells = cells
        
        self.name = name .. '.state'
        
        self.allowedModes = {}
        
        -- for act in [del insert select join indent multi main]
        --     for k v in pairs act
        --         @[k] = v.bind @
        
        -- @handleKey = keys.bind @
        
        self.syntax = syntax(self.name .. '.syntax')
        self.hasFocus = false
        
        self:clearSingle()
        return self
    end


function state:toggleMode(name) 
    if self.allowedModes[name] then 
    return mode.toggle(self, name)
                                            end
    end

function state:startMode(name) 
    if self.allowedModes[name] then 
    return mode.start(self, name)
                                           end
    end

function state:stopMode(name) 
    if self.allowedModes[name] then 
    return mode.stop(self, name)
                                          end
    end


function state:owner() 
        if kstr.endsWith(self.name, '.state') then 
            return string.sub(self.name, 1, -6)
        else 
            return self.name
        end
    end


function state:clearHistory() 
        self.h = array(self.s) -- undo states (history)
        self.r = array() return -- redo states
    end

--  0000000  00000000  000000000
-- 000       000          000
-- 0000000   0000000      000
--      000  000          000
-- 0000000   00000000     000


function state:set(item, arg) 
        -- @s = @s.set item arg
        self.s[item] = arg
        self:swapState()
        return self
    end


function state:setSelections(selections) 
    return self:set('selections', belt.mergeLineRanges(self.s.lines, selections))
    end

function state:setHighlights(highlights) 
    return self:set('highlights', belt.normalizeSpans(highlights))
    end

--  0000000  000   000  00000000    0000000   0000000   00000000    0000000
-- 000       000   000  000   000  000       000   000  000   000  000
-- 000       000   000  0000000    0000000   000   000  0000000    0000000
-- 000       000   000  000   000       000  000   000  000   000       000
--  0000000   0000000   000   000  0000000    0000000   000   000  0000000


function state:setCursors(cursors, opt) 
        opt = opt or ({})
        opt.mc = opt.mc or (self:mainCursor())
        
        local main = opt.main
        
        if is(main, arr) then main = belt.indexOfPosInPositions(main, cursors) end
        if (is(main, num) and (main < 0)) then main = (#cursors + main) end
        
        local mainCursor = self:mainCursor()
        if main then 
            mainCursor = cursors[clamp(0, (#cursors - 1), main)]
            -- mainCursor = copy cursors[clamp 0 cursors.length-1 main]
        end
        
        cursors = belt.normalizePositions(cursors, (#self.s.lines - 1))
        
        self.s = self.s.set('cursors', cursors)
        
        main = -1
        for cur, idx in cursors do 
            if cur(eql, mainCursor) then 
                main = idx
                break
            end
        end
        
        if (main < 0) then main = self.s.main end
        main = clamp(0, (#self.s.cursors - 1), main)
        
        self.s = self.s.set('main', main)
        
        self:adjustViewForMainCursor(opt)
        
        self:swapState()
        
        mode.cursorsSet(self)
        self:emit('cursorsSet')
        return self
    end


function state:textOfSelectionOrWordAtCursor() 
        if #self.s.selections then 
            return self:textOfSelection()
        else 
            return self:wordAtCursor()
        end
    end

-- 000      000  000   000  00000000   0000000
-- 000      000  0000  000  000       000
-- 000      000  000 0 000  0000000   0000000
-- 000      000  000  0000  000            000
-- 0000000  000  000   000  00000000  0000000


function state:setLines(lines) 
        if empty(lines) then lines = array('') end
        
        return self:setSegls(kseg.segls(lines))
    end


function state:setSegls(segls) 
        self.segls = segls
        
        if empty(self.segls) then self.segls = array(array()) end
        
        self.syntax:setSegls(self.segls)
        
        self:changeLinesSegls()
        
        self.r = array()
        
        self.maxLineWidth = belt.widthOfLines(self.s.lines)
        
        return self:pushState()
    end


function state:loadLines(lines) 
        if valid((lines and is(not lines[0], str))) then error("" .. self.name .. ".loadLines - first line not a string?", lines[0]) end
        
        return self:loadSegls(kseg.segls(lines))
    end


function state:loadSegls(segls) 
        self:clearEmpty()
        return self:setSegls(segls)
    end


function state:clearSingle() 
    return self:clearSegls(array(array()))
    end

function state:clearEmpty() 
    return self:clearSegls(array())
    end

function state:clearSegls(segls) 
        self.segls = segls
        
        -- @s = immutable {
        self.s = {
            lines = self.segls, 
            selections = array(), 
            highlights = array(), 
            cursors = array(array(0, 0)), 
            main = 0, 
            view = array(0, 0)
            }
        
        self.syntax:clear()
        
        self.h = array()
        self.r = array()
        return self.r
    end


function state:addLine(line, ext) 
        local segl = kseg(line)
        self.syntax.addSegl(segl, ext)
        self.segls = self.segls or (array())
        self.segls.push(segl)
        
        return self:changeLinesSegls()
    end


function state:appendLines(lines, ext) 
        local segls = kseg.segls(lines)
        self.syntax.appendSegls(segls, ext)
        self.segls = self.segls or (array())
        self.segls = self.segls.concat(segls)
        
        return self:changeLinesSegls()
    end

--  ███████  ███   ███   ███████   ███   ███   ███████   ████████        ███      ███  ███   ███  ████████   ███████
-- ███       ███   ███  ███   ███  ████  ███  ███        ███             ███      ███  ████  ███  ███       ███     
-- ███       █████████  █████████  ███ █ ███  ███  ████  ███████         ███      ███  ███ █ ███  ███████   ███████ 
-- ███       ███   ███  ███   ███  ███  ████  ███   ███  ███             ███      ███  ███  ████  ███            ███
--  ███████  ███   ███  ███   ███  ███   ███   ███████   ████████        ███████  ███  ███   ███  ████████  ███████ 


function state:changeLinesSegls() 
         --oldLines = @s.lines
         --         
         --@s = @s.set 'lines' @segls
         --         
         --if oldLines != @s.lines
         --    diff = belt.diffLines oldLines @s.lines            
         return --    @emit 'lines.changed' diff
    end


function state:linesInView() 
    return self.s.lines:slice(self.s.view[1], (self.s.view[1] + self.cells.rows))
    end


function state:clearLines() 
        self:setSegls(array(array()))
        return self:setMainCursor(0, 0)
    end


function state:isValidLineIndex(li) 
    return ((0 <= li) < #self.s.lines)
    end

function state:isInvalidLineIndex(li) 
    return not self:isValidLineIndex(li)
    end

-- 000   000  000   000  0000000     0000000
-- 000   000  0000  000  000   000  000   000
-- 000   000  000 0 000  000   000  000   000
-- 000   000  000  0000  000   000  000   000
--  0000000   000   000  0000000     0000000


function state:undo() 
        if (#self.h <= 1) then return end
        self.r.push(self.h.pop())
        self.s = self.h[-1]
        return self.syntax.setSegls(self.s.lines)
    end


function state:redo() 
        if empty(self.r) then return end
        self.h.push(self.r.pop())
        self.s = self.h[-1]
        return self.syntax.setSegls(self.s.lines)
    end


function state:begin() 
    self.beginIndex = #self.h
    return self.beginIndex
    end


function state:ende() 
        if valid(self.beginIndex) then 
            self.h.splice(self.beginIndex, ((#self.h - self.beginIndex) - 1))
            self.beginIndex = nil
            -- delete @beginIndex
        end
        
        return self
    end


function state:pushState() 
               self.h:push(self.s) ; return self
    end

function state:swapState() 
               self.h:pop() ; return self:pushState()
    end


function state:isDirty() 
    return (#self.h > 1)
    end

function state:hasRedo() 
    return (#self.r > 0)
    end


function state:gutterWidth() 
    return math.max(4, (2 + math.ceil(math.log10((#self.s.lines + 1)))))
    end

--  0000000  000   000  000000000
-- 000       000   000     000
-- 000       000   000     000
-- 000       000   000     000
--  0000000   0000000      000


function state:cut() 
        self:copy({deselect = false})
        if empty(self.s.selections) then 
            self:selectCursorLines()
        end
        
        return self:deleteSelection()
    end

--  0000000   0000000   00000000   000   000
-- 000       000   000  000   000   000 000
-- 000       000   000  00000000     00000
-- 000       000   000  000           000
--  0000000   0000000   000           000


function state:copy(opt) 
        opt = opt or ({})
        
        if (os.platform() == 'darwin') then 
                
                proc = child_process.spawn 'pbcopy'
                proc.stdin.write(self:textOfSelectionOrCursorLines())
                proc.stdin.close()
        elseif (os.platform() == 'linux') then 
                
                proc = child_process.spawn("xsel", {"-i", "--clipboard"})
                proc.stdin.write(self:textOfSelectionOrCursorLines())
                proc.stdin.close()
        elseif (os.platform() == 'win32') then 
                
                proc = child_process.spawn "#{slash.cwd()}/../../bin/utf8clip.exe"
                proc.stdin.write(self:textOfSelectionOrCursorLines())
                proc.stdin.close()
        end
        
        if (opt.deselect ~= false) then 
    return self:deselect()
                    end
    end

-- 00000000    0000000    0000000  000000000  00000000
-- 000   000  000   000  000          000     000
-- 00000000   000000000  0000000      000     0000000
-- 000        000   000       000     000     000
-- 000        000   000  0000000      000     00000000


function state:paste() 
        if (os.platform() == 'darwin') then 
                return self:insert(child_process.execSync('pbpaste').toString("utf8"))
        elseif (os.platform() == 'linux') then 
                local text = child_process.execSync('xsel -o --clipboard')
                
                print('paste\n', noon(text.toString("utf8")))
                
                return self:insert(text.toString("utf8"))
        elseif (os.platform() == 'win32') then 
                return self:insert(child_process.execSync("" .. slash.cwd() .. "/../../bin/utf8clip.exe").toString("utf8"))
        end
    end

--  0000000   0000000  00000000    0000000   000      000          000   000  000  00000000  000   000  
-- 000       000       000   000  000   000  000      000          000   000  000  000       000 0 000  
-- 0000000   000       0000000    000   000  000      000           000 000   000  0000000   000000000  
--      000  000       000   000  000   000  000      000             000     000  000       000   000  
-- 0000000    0000000  000   000   0000000   0000000  0000000          0      000  00000000  00     00  


function state:scrollView(dir, steps) 
        steps = steps or 1
        
        local sy = 0
        
        if (dir == 'left') then sx = -1
        elseif (dir == 'right') then sx = 1
        elseif (dir == 'up') then sy = -steps
        elseif (dir == 'down') then sy = steps
        end
        
        local view = self.s.view.asMutable()
        
        view[0] = view[0] + sx
        view[1] = view[1] + sy
        
        view[1] = clamp(0, max(0, (#self.s.lines - self.cells.rows)), view[1])
        
        local maxOffsetX = max(0, ((self.maxLineWidth - self.cells.cols) + 2))
        maxOffsetX = max(maxOffsetX, ((self:mainCursor()[0] - self.cells.cols) + 2))
        view[0] = clamp(0, maxOffsetX, view[0])
        
        if view(eql, self.s.view) then return end
        
        return self:setView(view)
    end

--  0000000   0000000          000  000   000   0000000  000000000       000   000  000  00000000  000   000  
-- 000   000  000   000        000  000   000  000          000          000   000  000  000       000 0 000  
-- 000000000  000   000        000  000   000  0000000      000           000 000   000  0000000   000000000  
-- 000   000  000   000  000   000  000   000       000     000             000     000  000       000   000  
-- 000   000  0000000     0000000    0000000   0000000      000              0      000  00000000  00     00  


function state:adjustViewForMainCursor(opt) 
        opt = opt or ({})
        
        if ((self.cells.cols <= 0) or (self.cells.rows <= 0)) then return end
        
        if (opt.adjust == false) then return end
        
        local x, y = self:mainCursor()
        
        local view = self.s.view.asMutable()
        
        local topBotDelta = 7
        local topDelta = 7
        local botDelta = max(topDelta, int((self.cells.rows / 2)))
        
        if (opt.adjust == 'topDelta') then 
            view[1] = (y - topDelta)
        elseif ((opt.adjust == 'topBotDeltaGrow') and opt.mc) then 
            local dtt = (y - view[1])
            local dtb = (y - (view[1] + self.cells.rows))
            if (dtt < 0) then 
                view[1] = (y - topDelta)
            elseif (dtb > 0) then 
                view[1] = (y - (self.cells.rows - botDelta))
            else 
                local dir = (y - opt.mc[1])
                if (((dtt < topDelta) and (dir < 0)) or ((-dtb < botDelta) and (dir > 0))) then 
                    view[1] = view[1] + dir
                end
            end
        else 
            if (opt.adjust ~= 'topBotDelta') then 
                topBotDelta = 0
            end
            
            if (y >= (((view[1] + self.cells.rows) - 1) - topBotDelta)) then 
                view[1] = (((y - self.cells.rows) + 1) + topBotDelta)
            elseif (y < (view[1] + topBotDelta)) then 
                view[1] = (y - topBotDelta)
            end
        end
        
        if ((view[1] > 0) and (#self.s.lines <= self.cells.rows)) then 
            view[1] = 0
        end
        
        if not self.skipAdjustViewForMainCursor then 
            view[0] = max(0, ((x - self.cells.cols) + 2)) -- adding one for wide graphemes
        end
        
        if view(eql, self.s.view) then return end
        
        return self:setView(view)
    end


function state:initView() 
        -- view = @s.view.asMutable()
        local view = self.s.view
        
        view[1] = clamp(0, math.max(0, (#self.s.lines - self.cells.rows)), view[1])
        view[0] = math.max(0, (view[0] or 0))
        
        return self:setView(view)
    end


function state:setView(view) 
        if (self.s.view == view) then return end
        self:set('view', view)
        self:emit('view.changed', self.s.view)
        return self
    end


function state:rangeForVisibleLines() 
        return array(self.s.view[0], self.s.view[1], ((self.s.view[0] + self.cells.cols) - 1), ((self.s.view[1] + self.cells.rows) - 1))
    end

return state