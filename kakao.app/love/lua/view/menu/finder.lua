--[[
    ████████  ███  ███   ███  ███████    ████████  ████████   
    ███       ███  ████  ███  ███   ███  ███       ███   ███  
    ██████    ███  ███ █ ███  ███   ███  ███████   ███████    
    ███       ███  ███  ████  ███   ███  ███       ███   ███  
    ███       ███  ███   ███  ███████    ████████  ███   ███  

    searches and highlights in the current fileeditor file 
--]]

kxk = require "../../../kxk"
theme = require "../../theme"
tool = require "../../edit/tool"
 = require ""


local finder = class("finder", inputchoice)
    


function finder:init(@screen, @editor, name) 
        name = name or 'finder'
        
        self.state = self.editor.state discard procCall init(inputchoice(self), self.screen, name, array('gutter', 'scroll'))
        
        self.autoHideInput = false
        
        post.on('finder.show', if (self.name == 'finder') then self.show end)
        
        self:setColor('bg', theme.finder.bg)
        self:setColor('frame', theme.finder.frame)
        
        self.choices.state.skipAdjustViewForMainCursor = true
        self.choices.state.syntax.setExt('kode')
        self.choices.gutter.lineno = self.lineno
        -- revert gutter highlight color to default fg color since all lines are highlighted
        self.choices.gutter.setColor('highlight', theme.gutter.fg)
        self.choices.gutter.setColor('bg_fully_selected', theme.finder.bg)
        return self
    end

-- ███      ███  ███   ███  ████████  ███   ███   ███████ 
-- ███      ███  ████  ███  ███       ████  ███  ███   ███
-- ███      ███  ███ █ ███  ███████   ███ █ ███  ███   ███
-- ███      ███  ███  ████  ███       ███  ████  ███   ███
-- ███████  ███  ███   ███  ████████  ███   ███   ███████ 


function finder:lineno(y) 
        local pad = (self.choices.gutter.cells.cols - 1)
        if ((0 <= y) < #self.choices.fuzzied) then 
            if (self.choices.fuzzied[y].type == 'file') then 
                if self.choices.fuzzied[y].line then 
                    return (lpad(pad, self.choices.fuzzied[y].line) + ' ')
                else 
                    return (lpad(pad, '●') + ' ')
                end
            end
            
            if is(self.choices.fuzzied[y].row, num) then 
                return (lpad(pad, (self.choices.fuzzied[y].row + 1)) + ' ')
            end
        end
        
        return lpad((pad + 1))
    end

--  ███████   ████████   ████████    ███████   ███   ███   ███████   ████████
-- ███   ███  ███   ███  ███   ███  ███   ███  ████  ███  ███        ███     
-- █████████  ███████    ███████    █████████  ███ █ ███  ███  ████  ███████ 
-- ███   ███  ███   ███  ███   ███  ███   ███  ███  ████  ███   ███  ███     
-- ███   ███  ███   ███  ███   ███  ███   ███  ███   ███   ███████   ████████


function finder:arrangeRect() 
        return array(int(((self.editor.cells.x - self.editor.gutter.cells.cols) - 1)), int(self.editor.cells.y), int(((self.editor.cells.cols + self.editor.gutter.cells.cols) + 1)), int((self.editor.cells.rows - 3)))
    end


function finder:arrange() 
        array(x, y, w, h) = self:arrangeRect()
        
        local cs = min((h - 1), self.choices.numFiltered())
        
        self.input.layout((x + 2), (y + 1), (w - 4), 1)
        self.choices.layout((x + 1), (y + 3), (w - 2), cs)
        return self.cells.layout(x, y, w, (cs + 4))
    end

--  0000000  000   000   0000000   000   000  
-- 000       000   000  000   000  000 0 000  
-- 0000000   000000000  000   000  000000000  
--      000  000   000  000   000  000   000  
-- 0000000   000   000   0000000   00     00  


function finder:show(text) 
        -- log "finder.show #{@name} #{text}"
        
        if empty(text) then 
            local cursorLine = self.state.mainCursor()[1]
        end
        
        text = self:searchText(text)
        
        -- log g4("#{r6 'finder.show'} #{m5 @name} '#{text}'")
        
        if empty(text) then 
            self.choices.clear()
            self.input.show()
            return super()
        end
        
        self.state.highlightText(text)
        
        self.choices.clearEmpty()
        
        local front = belt.frontmostSpans(self.state.s.highlights)
        for span in front do 
            if ((#self.choices.items > 1) and (self.choices.items[-1].row ~= (span[1] - 1))) then 
                self.choices.add(line:'')
            end
            
            self.choices.add
            
                ext:'kode'
                (line:' ' + kseg.str(self.state.s.lines[span[1]]))
                row:span[1]
                col:span[2]
        end
        
        self.choices.state.highlightText(text)
        
        if cursorLine then 
            self.choices.select (kutil.findIndex(self.choices.items(l), function () (l.row == cursorLine) end) or 0)
        else 
            self.choices.selectFirst()
        end
        
        --inputFocus = @input.hasFocus()
        self.input.show()
        super() -- this might set focus to choices
        self.input.grabFocus() return -- but in finder and searcher input should always be focused
    end

--  0000000  00000000   0000000   00000000    0000000  000   000        000000000  00000000  000   000  000000000  
-- 000       000       000   000  000   000  000       000   000           000     000        000 000      000     
-- 0000000   0000000   000000000  0000000    000       000000000           000     0000000     00000       000     
--      000  000       000   000  000   000  000       000   000           000     000        000 000      000     
-- 0000000   00000000  000   000  000   000   0000000  000   000           000     00000000  000   000     000     


function finder:searchText(text) 
        -- log "finder.searchText #{@name} #{text}"
        
        if empty(text) then 
            -- log "finder.searchText #{@name} take text of selection or word at cursor"
            text = self.state.textOfSelectionOrWordAtCursor()
        end
        
        text = text or ''
        
        if (text ~= self.input.current()) then 
            self.input.set(text)
            self.input.selectAll()
            self.input.state.moveCursors('eol')
        end
        
        return text
    end

--  0000000   00000000   00000000   000      000   000  
-- 000   000  000   000  000   000  000       000 000   
-- 000000000  00000000   00000000   000        00000    
-- 000   000  000        000        000         000     
-- 000   000  000        000        0000000     000     


function finder:apply(choice) 
        if valid(choice) then 
            post.emit('goto.line', choice.row, choice.col)
        end
        
        post.emit('focus', 'editor')
        -- log "#{@name} applyChoice -> hide"
        self:hide()
        return redraw:true
    end


function finder:applyChoice(choice) 
    return self:apply(choice)
    end

--  ███████  ███   ███   ███████   ███   ███████  ████████   ███████         ███████    ███████  █████████  ███   ███████   ███   ███
-- ███       ███   ███  ███   ███  ███  ███       ███       ███             ███   ███  ███          ███     ███  ███   ███  ████  ███
-- ███       █████████  ███   ███  ███  ███       ███████   ███████         █████████  ███          ███     ███  ███   ███  ███ █ ███
-- ███       ███   ███  ███   ███  ███  ███       ███            ███        ███   ███  ███          ███     ███  ███   ███  ███  ████
--  ███████  ███   ███   ███████   ███   ███████  ████████  ███████         ███   ███   ███████     ███     ███   ███████   ███   ███


function finder:onChoicesAction(action, choice) 
        -- log "finder.onChoicesAction #{action}"
        
        if (action == 'delete') then 
                self.input.state.delete('back')
                self.input.grabFocus()
                return
        elseif (action == 'left') then 
                self.input.grabFocus()
                return true
        end return discard procCall init(inputchoice(self), action, choice)
    end

-- ███  ███   ███  ████████   ███   ███  █████████         ███████    ███████  █████████  ███   ███████   ███   ███
-- ███  ████  ███  ███   ███  ███   ███     ███           ███   ███  ███          ███     ███  ███   ███  ████  ███
-- ███  ███ █ ███  ████████   ███   ███     ███           █████████  ███          ███     ███  ███   ███  ███ █ ███
-- ███  ███  ████  ███        ███   ███     ███           ███   ███  ███          ███     ███  ███   ███  ███  ████
-- ███  ███   ███  ███         ███████      ███           ███   ███   ███████     ███     ███   ███████   ███   ███


function finder:onInputAction(action, text) 
        if (action == 'submit') then return self:apply(self.choices.current())
        elseif (action == 'change') then 
                if valid(text) then 
                    return self:show(text)
                else 
                    return self.choices.clear()
                end
        end return discard procCall init(inputchoice(self), action, text)
    end

export finder