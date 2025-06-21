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

syntax = require "util.syntax"


local state = class("state", events)
    


function state:init(cells, name) 
        self.cells = cells
        self.name = name .. '.state'
        
        self.allowedModes = {}
        
        self.syntax = syntax(self.name .. '.syntax')
        self.hasFocus = false
        
        self:clearSingle()
        return self
    end


function state:__tostring() 
    return self.name
    end


function state:handleKey(key, event) 
        if ('unhandled' ~= mode.handleKey(self, key, event)) then return end
        
        if (key == 'up') then return self:moveCursors('up')
        elseif (key == 'down') then return self:moveCursors('down')
        elseif (key == 'left') then return self:moveCursors('left')
        elseif (key == 'right') then return self:moveCursors('right')
        elseif (key == 'ctrl+alt+up') then return self:singleCursorPage('up')
        elseif (key == 'ctrl+alt+down') then return self:singleCursorPage('down')
        elseif (key == 'shift+ctrl+alt+up') then return self:moveCursors('up', {count = 16})
        elseif (key == 'shift+ctrl+alt+down') then return self:moveCursors('down', {count = 16})
        elseif (key == 'cmd+left') or (key == 'ctrl+left') then return self:moveCursors(array('bos', 'ind_bol'))
        elseif (key == 'cmd+right') or (key == 'ctrl+right') then return self:moveCursors(array('eos', 'ind_eol'))
        elseif (key == 'alt+left') then return self:moveCursors('left', {jump = array('ws', 'word', 'empty', 'punct')})
        elseif (key == 'alt+right') then return self:moveCursors('right', {jump = array('ws', 'word', 'empty', 'punct')})
        elseif (key == 'shift+alt+right') then return self:moveCursorsAndSelect('right', {jump = array('ws', 'word', 'empty', 'punct')})
        elseif (key == 'shift+alt+left') then return self:moveCursorsAndSelect('left', {jump = array('ws', 'word', 'empty', 'punct')})
        elseif (key == 'shift+up') then return self:moveCursorsAndSelect('up')
        elseif (key == 'shift+down') then return self:moveCursorsAndSelect('down')
        elseif (key == 'shift+left') then return self:moveCursorsAndSelect('left')
        elseif (key == 'shift+right') then return self:moveCursorsAndSelect('right')
        elseif (key == 'shift+cmd+right') then return self:moveCursorsAndSelect('ind_eol')
        elseif (key == 'shift+cmd+left') then return self:moveCursorsAndSelect('ind_bol')
        elseif (key == 'shift+ctrl+h') then return self:moveCursorsAndSelect('bof')
        elseif (key == 'shift+ctrl+j') then return self:moveCursorsAndSelect('eof')
        elseif (key == 'shift+alt+cmd+up') then return self:moveMainCursorInDirection('up', {keep = true}) ; -- 'paint' cursors
        elseif (key == 'shift+alt+cmd+down') then return self:moveMainCursorInDirection('down', {keep = true}) ; -- 'paint' cursors
        elseif (key == 'shift+alt+cmd+left') then return self:moveMainCursorInDirection('left', {keep = true}) ; -- 'paint' cursors
        elseif (key == 'shift+alt+cmd+right') then return self:moveMainCursorInDirection('right', {keep = true}) ; -- 'paint' cursors
        elseif (key == 'alt+up') then return self:moveSelectionOrCursorLines('up')
        elseif (key == 'alt+down') then return self:moveSelectionOrCursorLines('down')
        elseif (key == 'shift+alt+up') then return self:cloneSelectionAndCursorLines('up')
        elseif (key == 'shift+alt+down') then return self:cloneSelectionAndCursorLines('down')
        elseif (key == 'cmd+up') or (key == 'ctrl+up') then return self:expandCursors('up')
        elseif (key == 'cmd+down') or (key == 'ctrl+down') then return self:expandCursors('down')
        elseif (key == 'shift+cmd+up') or (key == 'shift+ctrl+up') then return self:contractCursors('up')
        elseif (key == 'shift+cmd+down') or (key == 'shift+ctrl+down') then return self:contractCursors('down')
        elseif (key == 'pageup') then return self:singleCursorPage('up')
        elseif (key == 'pagedown') then return self:singleCursorPage('down')
        elseif (key == 'home') then return self:singleCursorAtIndentOrStartOfLine()
        elseif (key == 'end') then return self:singleCursorAtEndOfLine()
        elseif (key == 'ctrl+h') then return self:setMainCursor(1, 1)
        elseif (key == 'ctrl+j') then return self:setMainCursor(self.s.lines[self.s.lines:len()]:len(), self.s.lines:len())
        elseif (key == 'alt+d') then return self:delete('next', true)
        elseif (key == 'shift+ctrl+k') or (key == 'entf') then return self:delete('next')
        elseif (key == 'ctrl+k') then return self:delete('eol')
        elseif (key == 'delete') then return self:delete('back')
        elseif (key == 'ctrl+delete') then return self:delete('back', true)
        elseif (key == 'cmd+delete') then return self:delete('back', true)
        elseif (key == 'shift+tab') then return self:deindentSelectedOrCursorLines()
        elseif (key == 'tab') then return self:insert('\t')
        elseif (key == 'alt+x') or (key == 'cmd+x') or (key == 'ctrl+x') then return self:cut()
        elseif (key == 'alt+c') or (key == 'cmd+c') or (key == 'ctrl+c') then return self:copy()
        elseif (key == 'alt+v') or (key == 'cmd+v') or (key == 'ctrl+v') then return self:paste()
        elseif (key == 'cmd+z') or (key == 'ctrl+z') then return self:undo()
        elseif (key == 'shift+cmd+z') or (key == 'cmd+y') or (key == 'ctrl+y') then return self:redo()
        elseif (key == 'cmd+a') or (key == 'ctrl+a') then return self:selectAllLines()
        elseif (key == 'cmd+j') or (key == 'ctrl+j') then return self:joinLines()
        elseif (key == 'cmd+l') or (key == 'ctrl+l') then return self:selectMoreLines()
        elseif (key == 'shift+cmd+l') or (key == 'shift+ctrl+l') then return self:selectLessLines()
        elseif (key == 'cmd+e') or (key == 'ctrl+e') then return self:highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight()
        elseif (key == 'cmd+d') or (key == 'ctrl+d') then return self:selectWordAtCursor_highlightSelection_addNextHighlightToSelection()
        elseif (key == 'cmd+g') or (key == 'ctrl+g') then return self:selectWordAtCursor_highlightSelection_selectNextHighlight()
        elseif (key == 'shift+cmd+e') or (key == 'shift+ctrl+e') then return self:highlightWordAtCursor_deselectCursorHighlight_moveCursorToPrevHighlight()
        elseif (key == 'shift+cmd+d') or (key == 'shift+ctrl+d') then return self:selectWordAtCursor_highlightSelection_addPrevHighlightToSelection()
        elseif (key == 'shift+cmd+g') or (key == 'shift+ctrl+g') then return self:selectWordAtCursor_highlightSelection_selectPrevHighlight()
        elseif (key == 'alt+y') then return self:toggleMode('unype')
        elseif (key == 'alt+r') then return self:toggleMode('record')
        elseif (key == 'alt+u') then return self:toggleMode('uniko')
        elseif (key == 'alt+;') then return self:toggleMode('vimple')
        elseif (key == 'alt+3') then return self:toggleMode('salter')
        elseif (key == 'cmd+3') or (key == 'ctrl+3') then return self:insertAsciiHeaderForSelectionOrWordAtCursor()
        elseif (key == 'alt+cmd+d') or (key == 'alt+ctrl+d') then return self:selectWordAtCursor_highlightSelection_selectAllHighlights()
        elseif (key == 'cmd+/') or (key == 'ctrl+/') then return self:toggleCommentAtSelectionOrCursorLines()
        elseif (key == 'alt+cmd+/') or (key == 'ctrl+alt+/') then return self:toggleCommentTypeAtSelectionOrCursorLines()
        elseif (key == 'esc') then return self:clearCursorsHighlightsAndSelections()
        end
        
        return 'unhandled'
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
        self.s = self.s:set(item, arg)
        self:swapState()
        return self
    end


function state:setSelections(selections) 
        local sels = belt.mergeLineRanges(self.s.lines, selections)
        return self:set("selections", sels)
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
        
        if empty(cursors) then 
            print("empty cursors?", cursors)
            cursors = array(array(1, 1))
        end
        
        if is(main, "table") then main = belt.indexOfPosInPositions(main, cursors) end
        if (is(main, "number") and (main < 0)) then main = ((cursors:len() + main) - 1) end
        
        local mc = self:mainCursor()
        
        if (main and (main > 0)) then 
            mc = cursors[clamp(1, cursors:len(), main)]
        end
        
        cursors = belt.normalizePositions(cursors, self.s.lines:len())
        
        self.s = self.s:set('cursors', cursors)
        
        main = -1
        for idx, cur in ipairs(cursors) do 
            if cur:eql(mc) then 
                main = idx
                break
            end
        end
        
        if (main < 1) then main = self.s.main end
        main = clamp(1, self.s.cursors:len(), main)
        
        self.s = self.s:set('main', main)
        
        self:adjustViewForMainCursor(opt)
        
        self:swapState()
        
        mode.cursorsSet(self)
        self:emit('cursorsSet')
        -- log 'cursorsSet' @s.cursors, @s.main
        return self
    end


function state:textOfSelectionOrWordAtCursor() 
        if self.s.selections:len() then 
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
        -- write ◌y "state.setLines lines " ◌c " " (lines.class or "nil")  ◌b " " lines.len or lines∙len() ◌m " lines " array.str(lines)
        local segls = kseg.segls(lines)
        -- write ◌y "state.setLines segls " ◌m segls
        return self:setSegls(segls)
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
        if (valid(lines) and not is(lines[1], "string")) then 
            error("" .. tostring(self.name) .. ".loadLines - first line not a string? " .. tostring(type(lines[1])) .. "")
        end
        
        return self:loadSegls(kseg.segls(lines))
    end


function state:loadSegls(segls) 
        self:clearEmpty()
        return self:setSegls(segls)
    end

-- clearSingle: -> @clearSegls [[]]

function state:clearSingle() 
    return self:clearSegls(kseg.segls(""))
    end

function state:clearEmpty() 
    return self:clearSegls(array())
    end

function state:clearSegls(segls) 
        self.segls = segls
        
        self.s = immutable({
            lines = self.segls, 
            selections = array(), 
            highlights = array(), 
            cursors = array(array(1, 1)), 
            main = 1, 
            view = array(1, 1)
            })
        
        self.syntax:clear()
        
        self.h = array()
        self.r = array()
        return self.r
    end


function state:addLine(line, ext) 
        local segl = kseg(line)
        self.syntax.addSegl(segl, ext)
        self.segls = self.segls or (array())
        self.segls:push(segl)
        
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
         -- oldLines = @s.lines
         
         -- write "--- changeLinesSegls #{@s.class} #{@s}"
         -- write ◌m "--> " @segls
         
         self.s = self.s:set('lines', self.segls)
         
         -- write "<-> changeLinesSegls #{@s}"
         
         -- @s.lines = @segls
         --         
         -- if oldLines != @s.lines
         --    diff = belt.diffLines oldLines @s.lines            
         return --    @emit 'lines.changed' diff
    end


function state:linesInView() 
    return self.s.lines:slice(self.s.view[1], (self.s.view[1] + self.cells.rows))
    end


function state:clearLines() 
        self:setSegls(array(array()))
        return self:setMainCursor(1, 1)
    end


function state:isValidLineIndex(li) 
    return ((1 <= li) and (li <= self.s.lines:len()))
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
        self.r:push(self.h:pop())
        self.s = self.h[#self.h]
        return self.syntax:setSegls(self.s.lines)
    end


function state:redo() 
        if empty(self.r) then return end
        self.h:push(self.r:pop())
        self.s = self.h[#self.h]
        return self.syntax.setSegls(self.s.lines)
    end


function state:begin() 
    self.beginIndex = #self.h
    return self.beginIndex
    end


function state:ende() 
        if valid(self.beginIndex) then 
            self.h:splice(self.beginIndex, ((#self.h - self.beginIndex) - 1))
            self.beginIndex = nil
        end
        
        return self
    end


function state:pushState() 
        self.h:push(self.s)
        return self
    end


function state:swapState() 
        self.h:pop()
        return self:pushState()
    end


function state:isDirty() 
    return (#self.h > 1)
    end

function state:hasRedo() 
    return (#self.r > 0)
    end


function state:gutterWidth() 
    return max(4, (2 + ceil(math.log10((self.s.lines:len() + 1)))))
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
        local text = self:textOfSelectionOrCursorLines()
        if (text and (#text > 0)) then 
            print("COPY", text)
            love.system.setClipboardText(text)
        end
        
        --switch os.platform()
        --        
        --    'darwin'
        --        
        --        prcs = child_process.spawn 'pbcopy'
        --        prcs.stdin.write @textOfSelectionOrCursorLines()
        --        prcs.stdin.close()
        --        
        --    'linux'
        --        
        --        prcs = child_process.spawn("xsel", {"-i", "--clipboard"})
        --        prcs.stdin.write @textOfSelectionOrCursorLines()
        --        prcs.stdin.close()
        --        
        --    'win32'
        --        
        --        prcs = child_process.spawn "#{slash.cwd()}/../../bin/utf8clip.exe"
        --        prcs.stdin.write @textOfSelectionOrCursorLines()
        --        prcs.stdin.close()
        
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
        self:insert(love.system.getClipboardText())
        
        --switch os.platform()
        --        
        --    'darwin'
        --        
        --        @insert child_process.execSync('pbpaste').toString("utf8")
        --        
        --    'linux'
        --        
        --        text = child_process.execSync('xsel -o --clipboard')
        --        
        --        log 'paste\n' noon(text.toString("utf8"))
        --        
        --        @insert text.toString("utf8")
        --        
        --    'win32'
        --        
        return --        @insert child_process.execSync("#{slash.cwd()}/../../bin/utf8clip.exe").toString("utf8")
    end

--  0000000   0000000  00000000    0000000   000      000          000   000  000  00000000  000   000  
-- 000       000       000   000  000   000  000      000          000   000  000  000       000 0 000  
-- 0000000   000       0000000    000   000  000      000           000 000   000  0000000   000000000  
--      000  000       000   000  000   000  000      000             000     000  000       000   000  
-- 0000000    0000000  000   000   0000000   0000000  0000000          0      000  00000000  00     00  


function state:scrollView(dir, steps) 
        steps = steps or 1
        
        local sx = 1
        local sy = 1
        
        if (dir == 'left') then sx = -1
        elseif (dir == 'right') then sx = 1
        elseif (dir == 'up') then sy = -steps
        elseif (dir == 'down') then sy = steps
        end
        
        local view = self.s.view:arr()
        
        view[1] = view[1] + sx
        view[2] = view[2] + sy
        
        view[2] = clamp(1, max(1, (self.s.lines:len() - self.cells.rows)), view[2])
        
        local maxOffsetX = max(1, ((self.maxLineWidth - self.cells.cols) + 2))
        maxOffsetX = max(maxOffsetX, ((self:mainCursor()[1] - self.cells.cols) + 2))
        view[1] = clamp(1, maxOffsetX, view[1])
        
        if view:eql(self.s.view) then return end
        
        print("SETVIEW SCROLLVIEW", view)
        return self:setView(view)
    end

--  0000000   0000000          000  000   000   0000000  000000000       000   000  000  00000000  000   000  
-- 000   000  000   000        000  000   000  000          000          000   000  000  000       000 0 000  
-- 000000000  000   000        000  000   000  0000000      000           000 000   000  0000000   000000000  
-- 000   000  000   000  000   000  000   000       000     000             000     000  000       000   000  
-- 000   000  0000000     0000000    0000000   0000000      000              0      000  00000000  00     00  


function state:adjustViewForMainCursor(opt) 
        opt = opt or ({})
        
        if ((self.cells.cols < 1) or (self.cells.rows < 1)) then return end
        
        if (opt.adjust == false) then return end
        
        local mc = self:mainCursor()
        local x = mc[1]
        local y = mc[2]
        
        local view = self.s.view:arr()
        
        local topBotDelta = 7
        local topDelta = 7
        local botDelta = max(topDelta, floor((self.cells.rows / 2)))
        
        if (opt.adjust == 'topDelta') then 
            view[2] = (y - topDelta)
        elseif ((opt.adjust == 'topBotDeltaGrow') and opt.mc) then 
            local dtt = (y - view[2])
            local dtb = (((y - view[2]) - self.cells.rows) - 1)
            if (dtt < 0) then 
                view[2] = (y - topDelta)
            elseif (dtb > 0) then 
                view[2] = (y - (self.cells.rows - botDelta))
            else 
                local dir = (y - opt.mc[2])
                if (((dtt < topDelta) and (dir < 0)) or ((-dtb < botDelta) and (dir > 0))) then 
                    view[2] = view[2] + dir
                end
            end
        else 
            if (opt.adjust ~= 'topBotDelta') then 
                topBotDelta = 0
            end
            
            if (y >= (((view[2] + self.cells.rows) - 1) - topBotDelta)) then 
                view[2] = (((y - self.cells.rows) + 1) + topBotDelta)
            elseif (y < (view[2] + topBotDelta)) then 
                view[2] = (y - topBotDelta)
            end
        end
        
        if ((view[2] > 1) and (self.s.lines:len() <= self.cells.rows)) then 
            view[2] = 1
        end
        
        if not self.skipAdjustViewForMainCursor then 
            view[1] = math.max(1, ((x - self.cells.cols) + 2)) -- adding one for wide graphemes
        end
        
        if view:eql(self.s.view) then return end
        
        return self:setView(view)
    end


function state:initView() 
        local view = self.s.view:arr()
        
        view[2] = clamp(1, max(1, ((self.s.lines:len() - self.cells.rows) + 1)), view[2])
        view[1] = max(1, (view[1] or 1))
        
        return self:setView(view)
    end


function state:setView(view) 
        if ((self.s.view[1] == view[1]) and (self.s.view[2] == view[2])) then return end
        
        self:set('view', view)
        self:emit('view.changed', self.s.view)
        return self
    end


function state:rangeForVisibleLines() 
        return array(self.s.view[1], self.s.view[2], ((self.s.view[1] + self.cells.cols) - 1), ((self.s.view[2] + self.cells.rows) - 1))
    end


function state:setMain(m) 
        local mc = self:mainCursor()
        self.s = self.s:set('main', clamp(1, self.s.cursors:len(), m))
        return self:adjustViewForMainCursor({adjust = 'topBotDeltaGrow', mc = mc})
    end


function state:mainCursor() 
        if ((self.s.main < 1) or (self.s.main > self.s.cursors:len())) then 
            write("\x1b[0m\x1b[31m", "wrong mainCursor! ", "\x1b[0m\x1b[35m", " main ", self.s.main, "\x1b[0m\x1b[34m", " cursors ", self.s.cursors:len())
            return array(1, 1)
        end
        
        local mc = self.s.cursors[self.s.main]:mut()
        if not mc then 
            write("\x1b[0m\x1b[31m", "no mainCursor!")
            -- error "no mainCursor!"
            return array(1, 1)
        end
        
        return mc
    end

--  ███████  ████████  █████████
-- ███       ███          ███   
-- ███████   ███████      ███   
--      ███  ███          ███   
-- ███████   ████████     ███   


function state:setMainCursor(x, y) 
        local x, y = belt.pos(x, y)
        y = clamp(1, self.s.lines:len(), y)
        x = max(1, x)
        return self:setCursors(array(array(x, y)))
    end

-- ██     ██   ███████   ███   ███  ████████
-- ███   ███  ███   ███  ███   ███  ███     
-- █████████  ███   ███   ███ ███   ███████ 
-- ███ █ ███  ███   ███     ███     ███     
-- ███   ███   ███████       █      ████████


function state:moveMainCursorInDirection(dir, opt) 
        opt = opt or ({})
        
        local mc = belt.positionInDirection(self:mainCursor(), dir)
        
        if opt.keep then 
            return self:addCursor(mc)
        else 
            return self:moveMainCursor(mc)
        end
    end


function state:moveMainCursor(x, y) 
        local x, y = belt.pos(x, y)
        
        y = clamp(1, self.s.lines:len(), y)
        x = max(1, x)
        
        local mainCursor = self:mainCursor()
        
        if (mainCursor == array(x, y)) then return end
        
        local cursors = self:allCursors()
        
        cursors:splice(belt.indexOfPosInPositions(mainCursor, cursors), 1)
        
        local main = belt.indexOfPosInPositions(array(x, y), cursors)
        if (main < 1) then 
            cursors:push(array(x, y))
            main = #cursors
        end
        
        return self:setCursors(cursors, {main = main})
    end

-- ████████   ███████    ███    
-- ███       ███   ███   ███    
-- ███████   ███   ███   ███    
-- ███       ███   ███   ███    
-- ████████   ███████    ███████


function state:singleCursorAtEndOfLine() 
        local rng = belt.lineRangeAtPos(self.s.lines, self:mainCursor())
        local mc = belt.endOfRange(rng)
        
        self:deselect()
        return self:setCursors(array(mc))
    end

-- ███  ███   ███  ███████            ███████     ███████   ███      
-- ███  ████  ███  ███   ███          ███   ███  ███   ███  ███      
-- ███  ███ █ ███  ███   ███          ███████    ███   ███  ███      
-- ███  ███  ████  ███   ███          ███   ███  ███   ███  ███      
-- ███  ███   ███  ███████    ██████  ███████     ███████   ███████  


function state:singleCursorAtIndentOrStartOfLine() 
        local lines = self.s.lines
        local mc = self:mainCursor()
        
        local rng = belt.lineRangeAtPos(lines, mc)
        local ind = belt.lineIndentAtPos(lines, mc)
        
        if (ind < mc[1]) then 
            mc[1] = ind
        else 
            mc = belt.startOfRange(rng)
        end
        
        self:deselect()
        return self:setCursors(array(mc))
    end

-- ████████    ███████    ███████   ████████
-- ███   ███  ███   ███  ███        ███     
-- ████████   █████████  ███  ████  ███████ 
-- ███        ███   ███  ███   ███  ███     
-- ███        ███   ███   ███████   ████████


function state:singleCursorPage(dir) 
        local mc = self:mainCursor()
        
        if (dir == 'up') then mc[2] = mc[2] - (self.cells.rows)
        elseif (dir == 'down') then mc[2] = mc[2] + (self.cells.rows)
        end
        
        self:deselect()
        return self:setCursors(array(mc))
    end


function state:wordAtCursor() 
    return belt.wordAtPos(self.s.lines, self:mainCursor())
    end

function state:chunkBeforeCursor() 
    return belt.chunkBeforePos(self.s.lines, self:mainCursor())
    end

function state:chunkAfterCursor() 
    return belt.chunkAfterPos(self.s.lines, self:mainCursor())
    end

--  0000000  00000000  000      00000000   0000000  000000000  
-- 000       000       000      000       000          000     
-- 0000000   0000000   000      0000000   000          000     
--      000  000       000      000       000          000     
-- 0000000   00000000  0000000  00000000   0000000     000     


function state:setMainCursorAndSelect(x, y) 
        self:setSelections(belt.extendLineRangesFromPositionToPosition, self.s.lines, self:allSelections(), self:mainCursor(), array(x, y))
        return self:setCursors(array(array(x, y)), {adjust = 'topBotDelta'})
    end

--  0000000   000      000      
-- 000   000  000      000      
-- 000000000  000      000      
-- 000   000  000      000      
-- 000   000  0000000  0000000  


function state:allCursors() 
        return self.s.cursors:arr()
    end

-- 00000000  000   000  00000000    0000000   000   000  0000000    
-- 000        000 000   000   000  000   000  0000  000  000   000  
-- 0000000     00000    00000000   000000000  000 0 000  000   000  
-- 000        000 000   000        000   000  000  0000  000   000  
-- 00000000  000   000  000        000   000  000   000  0000000    


function state:expandCursors(dir) 
        local cursors = self:allCursors()
        local dy = (function () 
    if (dir == 'up') then 
    return -1 else 
    return 1
             end
end)()
        
        local newCursors = array()
        for _, c in ipairs(cursors) do 
            newCursors:push(c)
            newCursors:push(array(c[1], (c[2] + dy)))
        end
        
        local mc = belt.traversePositionsInDirection(newCursors, self:mainCursor(), dir)
        
        return self:setCursors(newCursors, {main = mc, adjust = 'topBotDelta'})
    end


function state:contractCursors(dir) 
        local cursors = self:allCursors()
        local newCursors = array()
        for ci, c in ipairs(cursors) do 
            local nbup = belt.positionsContain(cursors, belt.positionInDirection(c, 'down'))
            local nbdn = belt.positionsContain(cursors, belt.positionInDirection(c, 'up'))
            local solo = not (nbup or nbdn)
            local add = (function () 
    if (dir == 'up') then 
    return (nbup or solo)
                  elseif (dir == 'down') then 
    return (nbdn or solo)
                  end
end)()
            
            if add then 
                newCursors:push(c)
            end
        end
        
        return self:setCursors(newCursors)
    end

--  0000000   0000000    0000000    
-- 000   000  000   000  000   000  
-- 000000000  000   000  000   000  
-- 000   000  000   000  000   000  
-- 000   000  0000000    0000000    


function state:addCursor(x, y) 
        local pos = array(x, y)
        local cursors = self:allCursors()
        cursors:push(pos)
        return self:setCursors(cursors, {main = -1})
    end


function state:addCursors(cursors) 
        return self:setCursors(self:allCursors().concat(cursors))
    end


function state:delCursorsInRange(rng) 
        local outside = belt.positionsOutsideRange(self:allCursors(), rng)
        outside:push(belt.endOfRange(rng))
        return self:setCursors(outside, {main = -1})
    end

-- 00     00   0000000   000   000  00000000  
-- 000   000  000   000  000   000  000       
-- 000000000  000   000   000 000   0000000   
-- 000 0 000  000   000     000     000       
-- 000   000   0000000       0      00000000  


function state:moveCursors(dir, opt) 
        if is(dir, array) then 
            if (dir[1] == 'bos') then 
                    if self:moveCursorsToStartOfSelections() then return end
                    dir = dir:slice(2)
            elseif (dir[1] == 'eos') then 
                    if self:moveCursorsToEndOfSelections() then return end
                    dir = dir:slice(2)
            end
            
            dir = dir[1]
        end
        
        opt = opt or ({})
        opt.count = opt.count or 1
        opt.jumpWords = opt.jumpWords or false
        
        if (self.s.highlights:len() > 0) then 
            self:deselect()
        end
        
        local cursors = self:allCursors()
        local lines = self.s.lines
        for ci, c in ipairs(cursors) do 
            local line = lines[c[2]]
            
            if (dir == 'left') or (dir == 'right') then c[1] = c[1] + (belt.numCharsFromPosToWordOrPunctInDirection(lines, c, dir, opt))
            elseif (dir == 'up') then c[2] = c[2] - (opt.count)
            elseif (dir == 'down') then c[2] = c[2] + (opt.count)
            elseif (dir == 'eol') then c[1] = (kseg.width(self.s.lines[c[2]]) + 1)
            elseif (dir == 'bol') then c[1] = 1
            elseif (dir == 'bof') then c[1] = 1 ; c[2] = 1
            elseif (dir == 'eof') then c[2] = (self.s.lines:len() - 1) ; c[1] = (kseg.width(line) + 1)
            elseif (dir == 'ind') then c[1] = belt.numIndent(line)
            elseif (dir == 'ind_eol') then local ind = belt.numIndent(line) ; c[1] = (function () 
    if (c[1] <= ind) then 
    return (ind + 1) else 
    return (kseg.width(line) + 1)
                                                                  end
end)()
            elseif (dir == 'ind_bol') then local ind = belt.numIndent(line) ; c[1] = (function () 
    if (c[1] > (ind + 1)) then 
    return (ind + 1) else 
    return 1
                                                                  end
end)()
            end
        end
        
        local main = self.s.main
        local adjust = (opt.adjust or 'topBotDelta')
        
        if (dir == 'up') or (dir == 'down') or (dir == 'left') or (dir == 'right') then 
                main = belt.indexOfExtremePositionInDirection(cursors, dir, main)
                adjust = 'topBotDeltaGrow'
        end
        
        self:setCursors(cursors, {main = main, adjust = adjust})
        
        return true
    end


function state:moveCursorsToStartOfSelections() 
        local selections = self:allSelections()
        
        if empty(selections) then return end
        
        local rngs = belt.splitLineRanges(self.s.lines, selections, false)
        self:setCursors(belt.startPositionsOfRanges(rngs))
        
        return true
    end


function state:moveCursorsToEndOfSelections() 
        local selections = self:allSelections()
        
        if empty(selections) then return end
        
        local rngs = belt.splitLineRanges(self.s.lines, selections, false)
        self:setCursors(belt.endPositionsOfRanges(rngs))
        
        return true
    end


function state:moveCursorsToEndOfLines() 
        local cursors = self:allCursors()
        
        for _, cur in ipairs(cursors) do 
            cur[1] = belt.lineRangeAtPos(self.s.lines, cur)[3]
        end
        
        self:setCursors(cursors)
        
        return true
    end


function state:isAnyCursorInLine(y) 
        for _, c in ipairs(self.s.cursors) do 
            if (c[2] == y) then return true end
        end
    end

--  0000000  000   000  000   000  000   000   0000000  0000000    00000000  00000000   0000000   00000000   00000000  
-- 000       000   000  0000  000  000  000   000       000   000  000       000       000   000  000   000  000       
-- 000       000000000  000 0 000  0000000    0000000   0000000    0000000   000000    000   000  0000000    0000000   
-- 000       000   000  000  0000  000  000        000  000   000  000       000       000   000  000   000  000       
--  0000000  000   000  000   000  000   000  0000000   0000000    00000000  000        0000000   000   000  00000000  


function state:chunksBeforeCursors() 
    return array.map(self.s.cursors, function (c) 
    return belt.chunkBeforePos(self.s.lines, c)
end)
    end

--  0000000  00000000  000      00000000   0000000  000000000  
-- 000       000       000      000       000          000     
-- 0000000   0000000   000      0000000   000          000     
--      000  000       000      000       000          000     
-- 0000000   00000000  0000000  00000000   0000000     000     


function state:moveCursorsAndSelect(dir, opt) 
        local selections, cursors = belt.extendLineRangesByMovingPositionsInDirection(self.s.lines, self.s.selections, self.s.cursors, dir, opt)
        self:setSelections(selections)
        return self:setCursors(cursors, {adjust = 'topBotDelta'})
    end


function state:select(from, to) 
        -- log "SELECT" from
        -- log "TO    " to
        
        local selections = array()
        
        self:setMainCursor(to[1], to[2])
        
        if ((from[2] > to[2]) or ((from[2] == to[2]) and (from[1] > to[1]))) then 
            local from, to = to, from
        end
        
        to[2] = clamp(1, self.s.lines:len(), to[2])
        from[2] = clamp(1, self.s.lines:len(), from[2])
        
        to[1] = clamp(1, (self.s.lines[to[2]]:len() + 1), to[1])
        from[1] = clamp(1, (self.s.lines[from[2]]:len() + 1), from[1])
        
        selections:push(array(from[1], from[2], to[1], to[2]))
        
        return self:setSelections(selections)
    end


function state:allSelections() 
    return self.s.selections:arr()
    end

function state:allHighlights() 
    return self.s.highlights:arr()
    end

-- 000   000  000   0000000   000   000  000      000   0000000   000   000  000000000  
-- 000   000  000  000        000   000  000      000  000        000   000     000     
-- 000000000  000  000  0000  000000000  000      000  000  0000  000000000     000     
-- 000   000  000  000   000  000   000  000      000  000   000  000   000     000     
-- 000   000  000   0000000   000   000  0000000  000   0000000   000   000     000     


function state:selectWordAtCursor_highlightSelection_selectAllHighlights() 
        -- alt+cmd+d alt+ctrl+d
        if valid(self.s.highlights) then 
            local pos = self:mainCursor()
            if (self.s.selections:len() < self.s.highlights:len()) then 
                self:selectAllHighlights()
            else 
                self:addNextHighlightToSelection()
            end
            
            return
        end
        
        self:selectWordAtCursor_highlightSelection()
        return self:selectAllHighlights()
    end


function state:highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight() 
        -- cmd+e ctrl+e
        if valid(self.s.highlights) then 
            if not self:deselectCursorHighlight() then 
                self:moveCursorToNextHighlight()
            end
            
            return
        end
        
        self:selectWordAtCursor_highlightSelection()
        return self:deselectCursorHighlight()
    end


function state:selectWordAtCursor_highlightSelection_addNextHighlightToSelection() 
        -- cmd+d ctrl+d
        if valid(self.s.highlights) then return self:addCurrentOrNextHighlightToSelection() end
        
        return self:selectWordAtCursor_highlightSelection()
    end


function state:selectWordAtCursor_highlightSelection_selectNextHighlight() 
        -- cmd+g ctrl+g
        if valid(self.s.highlights) then 
            self:clearCursors()
            self:selectNextHighlight()
        end
        
        return self:selectWordAtCursor_highlightSelection()
    end


function state:highlightWordAtCursor_deselectCursorHighlight_moveCursorToPrevHighlight() 
        -- shift+cmd+e shift+ctrl+e
        if valid(self.s.highlights) then 
            if not self:deselectCursorHighlight() then 
                self:moveCursorToPrevHighlight()
            end
            
            return
        end
        
        self:selectWordAtCursor_highlightSelection()
        return self:deselectCursorHighlight()
    end


function state:selectWordAtCursor_highlightSelection_addPrevHighlightToSelection() 
        -- shift+cmd+d shift+ctrl+d
        if valid(self.s.highlights) then return self:addCurrentOrPrevHighlightToSelection() end
        
        return self:selectWordAtCursor_highlightSelection()
    end


function state:selectWordAtCursor_highlightSelection_selectPrevHighlight() 
        -- shift+cmd+g shift+ctrl+g
        if valid(self.s.highlights) then 
            self:clearCursors()
            self:selectPrevHighlight()
        end
        
        return self:selectWordAtCursor_highlightSelection()
    end


function state:selectWordAtCursor_highlightSelection() 
        if empty(self.s.selections) then 
            self:selectWord(self:mainCursor())
        end
        
        return self:highlightSelection()
    end


function state:highlightSelection() 
        if empty(self.s.selections) then return end
        
        local spans = array()
        for ri, rng in ipairs(self:allSelections()) do 
            if (rng[2] == rng[4]) then 
                local text = belt.textForLineRange(self.s.lines, rng)
                spans = spans + (belt.lineSpansForText(self.s.lines, text))
            end
        end
        
        return self:setHighlights(spans)
    end


function state:highlightText(text) 
        if empty(text) then return end
        
        return self:setHighlights(belt.lineSpansForText(self.s.lines, text))
    end


function state:deselectCursorHighlight() 
        if empty(self.s.highlights) then return end
        if empty(self.s.selections) then return end
        local prev = belt.prevSpanBeforePos(self.s.highlights, self:mainCursor())
        if prev then 
            return self:deselectSpan(prev)
        end
    end


function state:selectAllHighlights() 
        if empty(self.s.highlights) then return end
        
        local selections = array()
        local cursors = array()
        for si, span in ipairs(self.s.highlights) do 
            selections:push(belt.rangeForSpan(span))
            cursors:push(belt.endOfSpan(span))
        end
        
        self:addCursors(cursors)
        return self:setSelections(selections)
    end


function state:selectNextHighlight() 
        if empty(self.s.highlights) then return end
        local next = belt.nextSpanAfterPos(self.s.highlights, self:mainCursor())
        if next then 
            self:selectSpan(next)
            return self:setMainCursor(belt.endOfSpan(next))
        end
    end


function state:selectPrevHighlight() 
        if empty(self.s.highlights) then return end
        
        local pos = self:mainCursor()
        local prev = belt.prevSpanBeforePos(self.s.highlights, pos)
        if prev then 
            if (belt.endOfSpan(prev) == pos) then 
                prev = belt.prevSpanBeforePos(self.s.highlights, belt.startOfSpan(prev))
            end
            
            if prev then 
                self:selectSpan(prev)
                return self:setMainCursor(belt.endOfSpan(prev))
            end
        end
    end


function state:addCurrentOrNextHighlightToSelection() 
        local prev = belt.prevSpanBeforePos(self.s.highlights, self:mainCursor())
        if prev then 
            if not belt.rangesContainSpan(self.s.selections, prev) then 
                self:addSpanToSelection(prev)
                self:addCursor(belt.endOfSpan(prev))
                return
            end
        end
        
        return self:addNextHighlightToSelection()
    end


function state:addCurrentOrPrevHighlightToSelection() 
        local prev = belt.prevSpanBeforePos(self.s.highlights, self:mainCursor())
        if prev then 
            if not belt.rangesContainSpan(self.s.selections, prev) then 
                self:addSpanToSelection(prev)
                self:addCursor(belt.endOfSpan(prev))
                return
            end
        end
        
        return self:addPrevHighlightToSelection()
    end


function state:addNextHighlightToSelection() 
        if empty(self.s.highlights) then return end
        local next = belt.nextSpanAfterPos(self.s.highlights, self:mainCursor())
        if next then 
            self:addSpanToSelection(next)
            return self:addCursor(belt.endOfSpan(next))
        end
    end


function state:addPrevHighlightToSelection() 
        if empty(self.s.highlights) then return end
        
        local pos = self:mainCursor()
        local prev = belt.prevSpanBeforePos(self.s.highlights, pos)
        if prev then 
            if (belt.endOfSpan(prev) == pos) then 
                prev = belt.prevSpanBeforePos(self.s.highlights, belt.startOfSpan(prev))
            end
            
            if prev then 
                self:addSpanToSelection(prev)
                return self:addCursor(belt.endOfSpan(prev))
            end
        end
    end


function state:moveCursorToNextHighlight(pos) 
        if empty(self.s.highlights) then return end
        
        pos = pos or (self:mainCursor())
        local next = belt.nextSpanAfterPos(self.s.highlights, pos)
        if next then 
            return self:moveMainCursor(belt.endOfSpan(next))
        end
    end


function state:moveCursorToPrevHighlight(pos) 
        if empty(self.s.highlights) then return end
        
        pos = pos or (self:mainCursor())
        local prev = belt.prevSpanBeforePos(self.s.highlights, pos)
        if prev then 
            if (belt.endOfSpan(prev) == pos) then 
                prev = belt.prevSpanBeforePos(self.s.highlights, belt.startOfSpan(prev))
            end
            
            if prev then 
                return self:moveMainCursor(belt.endOfSpan(prev))
            end
        end
    end


function state:selectSpan(span) 
        return self:setSelections(array(belt.rangeForSpan(span)))
    end


function state:deselectSpan(span) 
        local rng = belt.rangeForSpan(span)
        
        local selections = self:allSelections()
        for index, selection in ipairs(selections) do 
            if belt.isSameRange(selection, rng) then 
                selections:splice(index, 1)
                self:setSelections(selections)
                return true
            end
        end
        
        return false
    end


function state:addRangeToSelectionWithMainCursorAtEnd(rng) 
        self:addRangeToSelection(rng)
        return self:delCursorsInRange(rng)
    end


function state:addRangeToSelection(rng) 
        local selections = self:allSelections()
        
        selections:push(rng)
        
        return self:setSelections(selections)
    end


function state:addSpanToSelection(span) 
    return self:addRangeToSelection(belt.rangeForSpan(span))
    end

--  0000000  000   000  000   000  000   000  000   000  
-- 000       000   000  000   000  0000  000  000  000   
-- 000       000000000  000   000  000 0 000  0000000    
-- 000       000   000  000   000  000  0000  000  000   
--  0000000  000   000   0000000   000   000  000   000  


function state:selectChunk(x, y) 
        local rng = belt.rangeOfClosestChunkToPos(self.s.lines, array(x, y))
        if rng then 
            self:addRangeToSelectionWithMainCursorAtEnd(rng)
        end
        
        return self
    end

-- 000   000   0000000   00000000   0000000    
-- 000 0 000  000   000  000   000  000   000  
-- 000000000  000   000  0000000    000   000  
-- 000   000  000   000  000   000  000   000  
-- 00     00   0000000   000   000  0000000    


function state:selectWord(x, y) 
        local rng = belt.rangeOfClosestWordToPos(self.s.lines, array(x, y))
        if rng then 
            self:addRangeToSelectionWithMainCursorAtEnd(rng)
        end
        
        return self
    end

-- 000      000  000   000  00000000  
-- 000      000  0000  000  000       
-- 000      000  000 0 000  0000000   
-- 000      000  000  0000  000       
-- 0000000  000  000   000  00000000  


function state:selectLine(y) 
        y = y or (self:mainCursor()[2])
        if ((1 <= y) and (y <= (self.s.lines:len() + 1))) then 
            self:select(array(1, y), array((self.s.lines[y]:len() + 1), y))
        end
        
        return self
    end


function state:selectPrevLine(y) 
        y = y or (self:mainCursor()[2])
        return self:selectLine((y - 1))
    end


function state:selectNextLine(y) 
        y = y or (self:mainCursor()[2])
        return self:selectLine((y + 1))
    end


function state:selectCursorLines() 
        local selections = belt.lineRangesForPositions(self.s.lines, self.s.cursors)
        
        assert((selections:len() == self.s.cursors:len()))
        
        return self:setSelections(selections)
    end


function state:selectAllLines() 
        local allsel = array(array(1, 1, (kseg.width(self.s.lines[self.s.lines:len()]) + 1), self.s.lines:len()))
        if allsel:eql(self.s.selections) then 
            return self:deselect()
        else 
            return self:setSelections(allsel)
        end
    end

-- 00     00   0000000   00000000   00000000  
-- 000   000  000   000  000   000  000       
-- 000000000  000   000  0000000    0000000   
-- 000 0 000  000   000  000   000  000       
-- 000   000   0000000   000   000  00000000  


function state:selectMoreLines() 
        local cursors, selections = belt.addLinesBelowPositionsToRanges(self.s.lines, self.s.cursors, self.s.selections)
        
        self:setSelections(selections)
        return self:setCursors(cursors, {main = -1})
    end

-- 000      00000000   0000000   0000000  
-- 000      000       000       000       
-- 000      0000000   0000000   0000000   
-- 000      000            000       000  
-- 0000000  00000000  0000000   0000000   


function state:selectLessLines() 
        local cursors, selections = belt.removeLinesAtPositionsFromRanges(self.s.lines, self.s.cursors, self.s.selections)
        
        self:setSelections(selections)
        return self:setCursors(cursors, {main = -1})
    end

-- 000000000  00000000  000   000  000000000  
--    000     000        000 000      000     
--    000     0000000     00000       000     
--    000     000        000 000      000     
--    000     00000000  000   000     000     


function state:textOfSelection() 
    return belt.textForLineRanges(self.s.lines, self.s.selections)
    end

function state:selectedText() 
    return belt.textForLineRanges(self.s.lines, self.s.selections)
    end


function state:selectionsOrCursorLineRanges() 
        if (self.s.selections:len() > 0) then 
            return self.s.selections
        else 
            return belt.lineRangesForPositions(self.s.lines, self.s.cursors, true)
        end
    end


function state:textOfSelectionOrCursorLines() 
        return belt.textForLineRanges(self.s.lines, self:selectionsOrCursorLineRanges())
    end


function state:isSingleLineSelected() 
        return ((self.s.selections:len() == 1) and (self.s.selections[1][2] == self.s.selections[1][4]))
    end


function state:isSelectedLine(y) 
        for si, selection in ipairs(self.s.selections) do 
            if not ((selection[4] == y) and (selection[3] == 0)) then 
                if ((selection[2] <= y) and (y <= selection[4])) then 
                    return true
                end
            end
        end
        
        return false
    end


function state:isFullySelectedLine(y) 
        for si, selection in ipairs(self.s.selections) do 
            if ((selection[2] <= y) and (y <= selection[4])) then 
                return belt.isFullLineRange(self.s.lines, selection)
            end
        end
        
        return false
    end


function state:isPartiallySelectedLine(y) 
        for si, selection in ipairs(self.s.selections) do 
            if ((selection[2] <= y) and (y <= selection[4])) then 
                return not belt.isFullLineRange(self.s.lines, selection)
            end
        end
        
        return false
    end


function state:isSpanSelectedLine(y) 
        for si, selection in ipairs(self.s.selections) do 
            if ((selection[2] <= y) and (y <= selection[4])) then 
                local span = belt.isSpanLineRange(self.s.lines, selection)
                if span then 
                    return true
                end
            end
            
            if (selection[2] > y) then return false end
        end
        
        return false
    end


function state:isHighlightedLine(y) 
        for hi, highlight in ipairs(self.s.highlights) do 
            if (highlight[2] == y) then return true end
        end
        
        return false
    end

-- 0000000    00000000   0000000  00000000  000      00000000   0000000  000000000  
-- 000   000  000       000       000       000      000       000          000     
-- 000   000  0000000   0000000   0000000   000      0000000   000          000     
-- 000   000  000            000  000       000      000       000          000     
-- 0000000    00000000  0000000   00000000  0000000  00000000   0000000     000     


function state:deselect() 
        if valid(self.s.selections) then 
            return self:setSelections(array())
        end
    end


function state:clearHighlights() 
        if valid(self.s.highlights) then 
            return self:setHighlights(array())
        end
    end


function state:clearCursors() 
        if (self.s.cursors:len() > 1) then 
            return self:setCursors(array(self:mainCursor()))
        end
    end


function state:clearCursorsHighlightsAndSelections() 
        if ((self.s.cursors:len() > 1) or valid(self.s.selections)) then self:pushState() end
        self:clearCursors()
        self:clearHighlights()
        return self:deselect()
    end

-- █████████  ████████  ███   ███  █████████
--    ███     ███        ███ ███      ███   
--    ███     ███████     █████       ███   
--    ███     ███        ███ ███      ███   
--    ███     ████████  ███   ███     ███   


function state:insert(text) 
        text = mode.insert(self, text)
        
        if valid(self.s.selections) then 
            if (text == '\t') then return self:indentSelectedLines() end
            self:deleteSelection()
        end
        
        local lines, cursors = belt.insertTextAtPositions(self.s.lines, text, self.s.cursors)
        
        self:clearHighlights()
        
        self:setLines(lines)
        self:setCursors(cursors)
        return mode.postInsert(self)
    end

-- ███   ███  ████████   ███████   ███████    ████████  ████████ 
-- ███   ███  ███       ███   ███  ███   ███  ███       ███   ███
-- █████████  ███████   █████████  ███   ███  ███████   ███████  
-- ███   ███  ███       ███   ███  ███   ███  ███       ███   ███
-- ███   ███  ████████  ███   ███  ███████    ████████  ███   ███


function state:insertAsciiHeaderForSelectionOrWordAtCursor() 
        local lines, cursors, selections = belt.insertAsciiHeaderForPositionsAndRanges(self.s.lines, self.s.cursors, self.s.selections)
        
        self:clearHighlights()
        self:setLines(lines)
        self:setSelections(selections)
        return self:setCursors(cursors)
    end

--  ███████  ███   ███  ████████   ████████    ███████   ███   ███  ███   ███  ███████  
-- ███       ███   ███  ███   ███  ███   ███  ███   ███  ███   ███  ████  ███  ███   ███
-- ███████   ███   ███  ███████    ███████    ███   ███  ███   ███  ███ █ ███  ███   ███
--      ███  ███   ███  ███   ███  ███   ███  ███   ███  ███   ███  ███  ████  ███   ███
-- ███████    ███████   ███   ███  ███   ███   ███████    ███████   ███   ███  ███████  


function state:surroundSelection(trigger, pair) 
        local lines, posl = belt.insertSurroundAtRanges(self.s.lines, self.s.selections, trigger, pair)
        self:setLines(lines)
        self:setSelections(array())
        return self:setCursors(posl)
    end

-- 000      000  000   000  00000000   0000000  
-- 000      000  0000  000  000       000       
-- 000      000  000 0 000  0000000   0000000   
-- 000      000  000  0000  000            000  
-- 0000000  000  000   000  00000000  0000000   


function state:joinLines() 
        self:moveCursorsToEndOfLines()
        
        local idxs = belt.lineIndicesForPositions(self.s.cursors)
        local rngs = belt.rangesForJoiningLines(self.s.lines, idxs)
        
        return self:deleteRanges(rngs, self:allCursors())
    end

-- ██     ██   ███████   ███   ███  ████████
-- ███   ███  ███   ███  ███   ███  ███     
-- █████████  ███   ███   ███ ███   ███████ 
-- ███ █ ███  ███   ███     ███     ███     
-- ███   ███   ███████       █      ████████


function state:moveSelectionOrCursorLines(dir) 
        local indices = belt.lineIndicesForRangesOrPositions(self.s.selections, self.s.cursors)
        local lines, selections, cursors = belt.moveLineRangesAndPositionsAtIndicesInDirection(self.s.lines, self.s.selections, self.s.cursors, indices, dir)
        
        self:setLines(lines)
        self:setSelections(selections)
        return self:setCursors(cursors)
    end

--  ███████  ███       ███████   ███   ███  ████████
-- ███       ███      ███   ███  ████  ███  ███     
-- ███       ███      ███   ███  ███ █ ███  ███████ 
-- ███       ███      ███   ███  ███  ████  ███     
--  ███████  ███████   ███████   ███   ███  ████████


function state:cloneSelectionAndCursorLines(dir) 
        local blocks = belt.blockRangesForRangesAndPositions(self.s.lines, self.s.selections, self.s.cursors)
        
        local lines, selections, cursors = belt.cloneLineBlockRangesAndMoveRangesAndPositionsInDirection(self.s.lines, blocks, self.s.selections, self.s.cursors, dir)
        
        self:setLines(lines)
        self:setSelections(selections)
        return self:setCursors(cursors)
    end

--  ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████
-- ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███   
-- ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███   
-- ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███   
--  ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███   


function state:toggleCommentAtSelectionOrCursorLines() 
        local indices = belt.lineIndicesForRangesOrPositions(self.s.selections, self.s.cursors)
        
        local lines, selections, cursors = belt.toggleCommentsInLineRangesAtIndices(self.s.lines, self.s.selections, self.s.cursors, indices)
        
        self:setLines(lines)
        self:setSelections(selections)
        return self:setCursors(cursors)
    end


function state:toggleCommentTypeAtSelectionOrCursorLines() 
        local indices = belt.lineIndicesForRangesOrPositions(self.s.selections, self.s.cursors)
        
        local lines, selections, cursors = belt.toggleCommentTypesInLineRangesAtIndices(self.s.lines, self.s.selections, self.s.cursors, indices)
        
        self:setLines(lines)
        self:setSelections(selections)
        return self:setCursors(cursors)
    end

--  0000000  00000000  000      00000000   0000000  000000000  00000000  0000000    
-- 000       000       000      000       000          000     000       000   000  
-- 0000000   0000000   000      0000000   000          000     0000000   000   000  
--      000  000       000      000       000          000     000       000   000  
-- 0000000   00000000  0000000  00000000   0000000     000     00000000  0000000    


function state:indentSelectedLines() 
        if empty(self.s.selections) then return end
        
        local indices = belt.lineIndicesForRangesOrPositions(self.s.selections, self.s.cursors)
        
        local lines, selections, cursors = belt.indentLineRangesAndPositionsAtIndices(self.s.lines, self.s.selections, self.s.cursors, indices)
        
        self:setLines(lines)
        self:setSelections(selections)
        return self:setCursors(cursors)
    end

-- 0000000    00000000  000  000   000  0000000    00000000  000   000  000000000  
-- 000   000  000       000  0000  000  000   000  000       0000  000     000     
-- 000   000  0000000   000  000 0 000  000   000  0000000   000 0 000     000     
-- 000   000  000       000  000  0000  000   000  000       000  0000     000     
-- 0000000    00000000  000  000   000  0000000    00000000  000   000     000     


function state:deindentSelectedOrCursorLines() 
        local indices = belt.lineIndicesForRangesOrPositions(self.s.selections, self.s.cursors)
        
        local lines, selections, cursors = belt.deindentLineRangesAndPositionsAtIndices(self.s.lines, self.s.selections, self.s.cursors, indices)
        
        self:setLines(lines)
        self:setSelections(selections)
        return self:setCursors(cursors)
    end

-- 0000000    00000000  000      00000000  000000000  00000000  
-- 000   000  000       000      000          000     000       
-- 000   000  0000000   000      0000000      000     0000000   
-- 000   000  000       000      000          000     000       
-- 0000000    00000000  0000000  00000000     000     00000000  


function state:delete(typ, jump) 
        if (array('back', 'next'):has(typ) and valid(self.s.selections)) then return self:deleteSelection() end
        
        local lines = self.s.lines:arr()
        
        local cursors = self:allCursors()
        
        if (((cursors:len() == 1) and array('back', 'next'):has(typ)) and belt.isLinesPosOutside(lines, cursors[1])) then 
            return self:setMainCursor((kseg.width(lines[cursors[1][2]]) + 1), cursors[1][2])
        end
        
        local minBeforeWs = Infinity
        if (typ == 'back') then 
            for _, cursor in ipairs(cursors) do 
                local rng = belt.rangeOfWhitespaceLeftToPos(lines, cursor)
                minBeforeWs = min(minBeforeWs, (rng[3] - rng[1]))
            end
        end
        
        for ci in iter(#cursors, 1) do 
            local cursor = cursors[ci]
            
            local x = cursor[1]
            local y = cursor[2]
            
            local line = lines[y]
            
            local remove = 1
            local dc = 1
            
            if (typ == 'eol') then line = line:slice(1, x)
            elseif (typ == 'back') then 
                    if (x == 1) then 
                        if (cursors:len() == 1) then 
                            if (y <= 1) then return end
                            y = y - 1
                            x = (kseg.width(lines[y]) + 1)
                            remove = 2
                            line = (lines[y] + line)
                            cursor[1] = x
                            cursor[2] = y
                        end
                    else 
                        if jump then 
                            local rng = belt.rangeOfWordOrWhitespaceLeftToPos(lines, cursor)
                            if rng then 
                                dc = (rng[3] - rng[1])
                            end
                        else 
                            if (minBeforeWs > 1) then 
                                dc = ((x - 1) % 4)
                                if (dc == 0) then 
                                    dc = 4
                                end
                                
                                dc = min(minBeforeWs, dc)
                            end
                        end
                        
                        if (x <= (kseg.width(line) + 1)) then 
                            -- segi = kseg.indexAtWidth line x
                            local segi = kseg.segiAtWidth(line, x)
                            line = (line:slice(1, ((segi - dc) - 1)) + line:slice(segi))
                        end
                    end
            elseif (typ == 'next') then 
                    if (x == kseg.width(lines[y])) then 
                        if (#cursors == 1) then 
                            if (y > #lines) then return end
                            x = kseg.width(lines[y])
                            remove = 2
                            line = (line + lines[(y + 1)])
                            cursor[1] = x
                            cursor[2] = y
                        end
                    else 
                        if jump then 
                            local rng = belt.rangeOfWordOrWhitespaceRightToPos(lines, cursor)
                            if rng then 
                                dc = (rng[3] - rng[1])
                                line = (line:slice(1, x) + line:slice((x + dc)))
                            end
                        else 
                            dc = 1
                            line = (line:slice(1, x) + line:slice((x + dc)))
                        end
                        
                        cursor[1] = cursor[1] + dc
                    end
            end
            
            belt.moveCursorsInSameLineBy(cursors, cursor, -dc)
            
            lines:splice(y, remove, line)
        end
        
        self:clearHighlights()
        self:setLines(lines)
        return self:setCursors(cursors)
    end

--  0000000  00000000  000      00000000   0000000  000000000  000   0000000   000   000  
-- 000       000       000      000       000          000     000  000   000  0000  000  
-- 0000000   0000000   000      0000000   000          000     000  000   000  000 0 000  
--      000  000       000      000       000          000     000  000   000  000  0000  
-- 0000000   00000000  0000000  00000000   0000000     000     000   0000000   000   000  


function state:deleteSelection() 
        if mode.deleteSelection(self) then return end
        
        return self:deleteRanges(self:allSelections(), self:allCursors())
    end


function state:deleteRanges(rngs, posl) 
        if empty(rngs) then return end
        
        posl = posl or (self:allCursors())
        
        if not self.beginIndex then self:pushState() end
        
        local lines, cursors = belt.deleteLineRangesAndAdjustPositions(self.s.lines, rngs, posl)
        
        self:deselect()
        self:clearHighlights()
        self:setLines(lines)
        return self:setCursors(cursors)
    end

return state