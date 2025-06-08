--[[
    0000000    000  00000000  00000000  00000000  00000000   
    000   000  000  000       000       000       000   000  
    000   000  000  000000    000000    0000000   0000000    
    000   000  000  000       000       000       000   000  
    0000000    000  000       000       00000000  000   000  

    displays git diffs
--]]

kxk = require "../../../kxk"
kxk = require "../../../kxk"
tool = require "../../edit/tool"
index = require "../../index"
util = require "../../util"
base = require "../base"
 = require ""


local differ = class("differ", searcher)
    


function differ:init(@screen, @editor) 
        discard procCall init(searcher(self), self.screen, self.editor, 'differ')
        
        self.symbol = 
            changed:'●'
            added:'✔'
            deleted:'✘'
            renamed:'➜'
        
        self.symbolColors = 
            ['✘'] = array(155, 0, 0)
            ['✔'] = array(0, 200, 0)
            ['●'] = array(50, 50, 50)
            ['➜'] = array(150, 150, 250)
        
        
        function self.choices.gutter.fgcolor(x, y, c) 
            if (y == self.choices.currentIndex()) then 
                return array(255, 255, 0)
            else 
                return self.symbolColors[c]
            end
end
        
        post.on('differ.status', self.status)
        post.on('differ.file', self.file)
        post.on('differ.history', self.history)
        return self
    end


function differ:onFileLoaded(file) 
    
    end

--  0000000  000   000   0000000   000   000  
-- 000       000   000  000   000  000 0 000  
-- 0000000   000000000  000   000  000000000  
--      000  000   000  000   000  000   000  
-- 0000000   000   000   0000000   00     00  


function differ:show() 
        view.prototype.show.call(self)
        
        self.input.grabFocus()
        self.choices.clearEmpty()
        self.sfils = array()
        return redraw:true
    end

-- ███████    ███  ████████  ████████
-- ███   ███  ███  ███       ███     
-- ███   ███  ███  ██████    ██████  
-- ███   ███  ███  ███       ███     
-- ███████    ███  ███       ███     


function differ:diff(diff) 
        local file = diff.file
        local ext = slash.ext(file)
        
        local items = array()
        
        for change in diff.changes do 
            if empty((change.add and empty), change.mod) then 
                continue -- skip when only deleted
            end
            
            local modded = (change.mod or array())
            local added = (change.add or array())
            local modadd = modded.concat(added)
            if empty, modadd.filter(function (m) 
                                   valid ; trim(m.new) end) then 
                continue
            end
            
            items.push(line:'')
            
            for add, li in change.add do 
                if valid(trim, add.new) then 
                    items.push
                    
                        (line:' ' + add.new)
                        path:file
                        ((row:change.line + li) - 1)
                        col:0
                end
            end
            
            for add, li in change.mod do 
                if valid(trim, add.new) then 
                    items.push
                    
                        (line:' ' + add.new)
                        path:file
                        ((row:change.line + li) - 1)
                        col:0
                end
            end
        end
        
        items.push(line:'')
        
        self.choices.append(items, ext)
        self.input.grabFocus()
        return post.emit('redraw')
    end

-- ████████  ███  ███      ████████
-- ███       ███  ███      ███     
-- ██████    ███  ███      ███████ 
-- ███       ███  ███      ███     
-- ███       ███  ███████  ████████


function differ:file(○) 
        local currentFile = ked_session.get('editor▸file')
        local diff = ○(git.diff, currentFile)
        
        if valid(diff) then 
            self:show()
            return self:diff(diff)
        end
    end

--  ███████  █████████   ███████   █████████  ███   ███   ███████
-- ███          ███     ███   ███     ███     ███   ███  ███     
-- ███████      ███     █████████     ███     ███   ███  ███████ 
--      ███     ███     ███   ███     ███     ███   ███       ███
-- ███████      ███     ███   ███     ███      ███████   ███████ 


function differ:status() 
        self:show()
        
        local currentFile = ked_session.get('editor▸file')
        local status = ○(git.status, currentFile)
        
        if empty(status) then return self:hide() end
        if empty(status.gitDir) then return self:hide() end
        
        self.input.set('▸')
        self.input.state.moveCursors('eol')
        
        
        function fileHeader(change, file, status) 
            local symbol = self.symbol[change]
            
            local path = slash.relative(file, status.gitDir)
            
            local sfil = new(searcherfile, self.screen, "" .. self.name .. "_sfil_" .. #self.sfils .. "")
            sfil.lineIndex = #self.choices.items --+1
            sfil.set(path)
            self.sfils.push(sfil)
            
            return self.choices.append(array(line:symbol, type:'file', path:file, row:0, col:0))
        end
        
        
        function noCounterpart(file) 
            local cpt = 
                js:'kode'
                pug:'html'
                css:'styl'
            
            if ext = cpt[slash.ext, file] then 
                local counter = slash.swapExt(file, ext)
                if status.files[counter] then return end
                counter = fileutil.swapLastDir(counter, slash.ext(file), ext)
                if status.files[counter] then return end
            end
            
            return true
        end
        
        for file in status.deleted do 
            fileHeader('deleted', file, status)
        end
        
        for file in status.added do 
            if noCounterpart(file) then 
                fileHeader('added', file, status)
                
                local text = nfs.read(file)
                local lines = belt.linesForText(text)
                function (newl) 
    newl = newl or (lines.map(l))
    
    return new:l
end
                local diff = file:file(changes:array(line:1, add:newl))
                self:diff(diff)
            end
        end
        
        for file in status.changed do 
            if noCounterpart(file) then 
                fileHeader('changed', file, status)
                
                local diff = git.diff(file)
                
                if self:hidden() then 
                    print('hidden?')
                end
                
                self:diff(if valid then diff end, diff)
            end
        end
    end

--  ███████   ███████   ██     ██  ██     ██  ███  █████████
-- ███       ███   ███  ███   ███  ███   ███  ███     ███   
-- ███       ███   ███  █████████  █████████  ███     ███   
-- ███       ███   ███  ███ █ ███  ███ █ ███  ███     ███   
--  ███████   ███████   ███   ███  ███   ███  ███     ███   


function differ:commit(msg) 
        local currentFile = ked_session.get('editor▸file')
        local gitDir = git.dir(currentFile)
        
        if empty(gitDir) then return end
        
        self:hide()
        post.emit('focus', 'editor')
        
        local out = ''
        out = out + (git.exec("add .", cwd:gitDir))
        out = out + (git.exec("commit -m \"" .. msg .. "\"", cwd:gitDir))
        out = out + (git.exec("push -q", cwd:gitDir))
        
        print(r4("differ.commit\n" .. b7, out .. ""))
        
        post.emit('git.commit')
        return post.emit('redraw')
    end

-- ███   ███  ███   ███████  █████████   ███████   ████████   ███   ███
-- ███   ███  ███  ███          ███     ███   ███  ███   ███   ███ ███ 
-- █████████  ███  ███████      ███     ███   ███  ███████      █████  
-- ███   ███  ███       ███     ███     ███   ███  ███   ███     ███   
-- ███   ███  ███  ███████      ███      ███████   ███   ███     ███   


function differ:history() 
        local history = git.history()
        
        if empty(history) then return end
        
        self:show()
        
        local currentFile = ked_session.get('editor▸file')
        local gitDir = git.dir(currentFile)
        
        local items = array()
        for h in history do 
            items.push
            
                (line:' ● ' + h.msg)
                commit:h.commit
            
            for f in h.files do 
                local symbol = (function () 
    if (f.type[0] == 'D') then 
    return self.symbol.deleted
                         elseif (f.type[0] == 'A') then 
    return self.symbol.added
                         elseif (f.type[0] == 'R') then 
    return self.symbol.renamed
                         elseif (f.type[0] == 'M') then 
    return self.symbol.changed
                         else 
    return '◆'
                         end
end)()
                
                items.push
                
                    (((line:'      ' + symbol) + ' ') + f.path)
                    path:slash.path(gitDir, f.path)
                    commit:h.commit
            end
        end
        
        self.choices.append(items)
        return post.emit('redraw')
    end

-- ████████    ███████   █████████   ███████  ███   ███
-- ███   ███  ███   ███     ███     ███       ███   ███
-- ████████   █████████     ███     ███       █████████
-- ███        ███   ███     ███     ███       ███   ███
-- ███        ███   ███     ███      ███████  ███   ███


function differ:patch(rev) 
        local patch = git.patch(rev)
        
        if empty(patch) then return end
        
        -- log "rev #{rev}" patch
        
        local currentFile = ked_session.get('editor▸file')
        local gitDir = git.dir(currentFile)
        
        local items = array()
        
        for p in patch do 
            local file = slash.path(gitDir, p.tgtfile[2..^1])
            
            -- log "file #{file}"
            
            items.push
            
                (line:' ● ' + p.tgtfile[2..^1])
                path:file
            
            if is(p.changes, arr) then 
                for c in p.changes do 
                    for l in c.changedlines do 
                        items.push
                        
                            ((line:l.type + ' ') + l.line)
                            path:file
                    end
                end
            end
        end
        
        self.choices.set(items, 'line')
        return post.emit('redraw')
    end

-- ████████  ██     ██  ███  █████████        ████████  ███  ███      ████████         ███████   ████████   ████████  ███   ███
-- ███       ███   ███  ███     ███           ███       ███  ███      ███             ███   ███  ███   ███  ███       ████  ███
-- ███████   █████████  ███     ███           ██████    ███  ███      ███████         ███   ███  ████████   ███████   ███ █ ███
-- ███       ███ █ ███  ███     ███           ███       ███  ███      ███             ███   ███  ███        ███       ███  ████
-- ████████  ███   ███  ███     ███           ███       ███  ███████  ████████         ███████   ███        ████████  ███   ███


function differ:emitFileOpen(choice) 
        post.emit('file.open', choice.path, choice.row, choice.col)
        
        return self:hide()
    end

--  0000000   00000000   00000000   000      000   000  
-- 000   000  000   000  000   000  000       000 000   
-- 000000000  00000000   00000000   000        00000    
-- 000   000  000        000        000         000     
-- 000   000  000        000        0000000     000     


function differ:apply(choice) 
        if valid(choice) then 
            if choice.path then return self:emitFileOpen(choice) end
            if choice.commit then return self:patch(choice.commit) end
        end
        
        print("differ.apply?", choice) return discard procCall init(searcher(self), choice)
    end

-- ███  ███   ███  ████████   ███   ███  █████████       ███████    ███████  █████████  ███   ███████   ███   ███
-- ███  ████  ███  ███   ███  ███   ███     ███         ███   ███  ███          ███     ███  ███   ███  ████  ███
-- ███  ███ █ ███  ████████   ███   ███     ███         █████████  ███          ███     ███  ███   ███  ███ █ ███
-- ███  ███  ████  ███        ███   ███     ███         ███   ███  ███          ███     ███  ███   ███  ███  ████
-- ███  ███   ███  ███         ███████      ███         ███   ███   ███████     ███     ███   ███████   ███   ███


function differ:onInputAction(action, text) 
        if (action == 'submit') then 
                if valid((text and text.startsWith), '▸') then 
                    self:commit(text[1..^1])
                    return
                end
        end return discard procCall init(searcher(self), action, text)
    end

export differ