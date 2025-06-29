--[[
      ████████  ███  ███      ████████  ███   ███  █████████  ███  ███      
      ███       ███  ███      ███       ███   ███     ███     ███  ███      
      ██████    ███  ███      ███████   ███   ███     ███     ███  ███      
      ███       ███  ███      ███       ███   ███     ███     ███  ███      
      ███       ███  ███████  ████████   ███████      ███     ███  ███████  
--]]

-- use ../../kxk ▪ post slash
-- use ../../kxk ◆ nfs salter


local fileutil = class("fileutil")
    fileutil.static.indexFileExtensions = array('kode', 'mm', 'zig', 'cc', 'c', 'h', 'hpp', 'cpp', 'nim', 'kim', 'lua', 'kua')
    fileutil.static.dotFileExtensions = array('bashrc', 'bash_history', 'gitconfig', 'gitignore_global', 'lesshst', 'npmrc', 'nvimrc', 'profile', 'zprofile', 'zsh_history', 'zshrc')
    fileutil.static.sourceFileExtensions = fileutil.indexFileExtensions.concat(fileutil.dotFileExtensions, array('ts', 'js', 'mjs', 'swift', 'styl', 'css', 'pug', 'html', 'md', 'noon', 'json', 'txt', 'log', 'sh', 'fish', 'py', 'frag', 'vert', 'config', 'toml', 'conf', 'gitignore', 'plist'))
    fileutil.static.imageExtensions = array('png', 'jpg', 'jpeg', 'gif', 'tiff', 'pxm', 'icns', 'webp')
    
    fileutil.static.counterparts = -- todo: move this to a config file?
    
        mm = array('h')
        cpp = array('hpp', 'h')
        cc = array('hpp', 'h')
        h = array('cpp', 'c', 'mm')
        hpp = array('cpp', 'c')
        coffee = array('js', 'mjs')
        kode = array('js', 'mjs')
        kim = array('nim')
        nim = array('kim')
        kua = array('lua')
        lua = array('kua')
        js = array('coffee', 'kode')
        mjs = array('coffee', 'kode')
        pug = array('html')
        noon = array('json')
        json = array('noon')
        html = array('pug')
        css = array('styl')
        styl = array('css')

-- move these to some config! 𝖘𝜏⊚𝔭 ⫙⊚⩗𝚒∩𝚐 𝜏𝖍𝚒𝖘 𝕒ɼ𝕒⊚𝓊∩⫐, 𝒹𝕒⫙⫙𝚒𝜏!

--  ███████   ███████   ███   ███  ███   ███  █████████  ████████  ████████ 
-- ███       ███   ███  ███   ███  ████  ███     ███     ███       ███   ███
-- ███       ███   ███  ███   ███  ███ █ ███     ███     ███████   ███████  
-- ███       ███   ███  ███   ███  ███  ████     ███     ███       ███   ███
--  ███████   ███████    ███████   ███   ███     ███     ████████  ███   ███

--  ███████  ███   ███   ███████   ████████ 
-- ███       ███ █ ███  ███   ███  ███   ███
-- ███████   █████████  █████████  ████████ 
--      ███  ███   ███  ███   ███  ███      
-- ███████   ██     ██  ███   ███  ███      


function fileutil.static.swapLastDir(path, from, to) 
        local lastIndex = path.rfind("/" .. tostring(from) .. "/")
        if (lastIndex >= 1) then 
            local newp = kstr.slice(path, 1, lastIndex) .. to .. kstr.slice(path, (lastIndex + #"/" .. tostring(from) .. ""))
            print("swapLastDir", path, newp)
            return newp
        end
        
        return path
    end

-- █████████  ████████    ███████    ███████  ███   ███
--    ███     ███   ███  ███   ███  ███       ███   ███
--    ███     ███████    █████████  ███████   █████████
--    ███     ███   ███  ███   ███       ███  ███   ███
--    ███     ███   ███  ███   ███  ███████   ███   ███


function fileutil.static.trash(path) 
        return nfs.trash(path)
    end

--  ███████  ███       ███████    ███████   ███████
-- ███       ███      ███   ███  ███       ███     
-- ███       ███      █████████  ███████   ███████ 
-- ███       ███      ███   ███       ███       ███
--  ███████  ███████  ███   ███  ███████   ███████ 


function fileutil.static.class(name) 
        local currentDir = slash.dir(ked_session:get('editor▸file'))
        currentDir = currentDir or (process.cwd())
        local file = slash.path(currentDir, "" .. tostring(name) .. ".kode")
        local header = salter(name, prepend:'    ')
        nfs.write(file, [[
###
]] .. tostring(header) .. [[
###

function ]] .. tostring(name) .. [[

    @: ->
    
export ]] .. tostring(name) .. [[

]])
        
        return post:emit('file.open', file, 6, 'eol')
    end

-- ███   ███  ████████  ███   ███        ████████   ███████   ███      ███████    ████████  ████████ 
-- ████  ███  ███       ███ █ ███        ███       ███   ███  ███      ███   ███  ███       ███   ███
-- ███ █ ███  ███████   █████████        ██████    ███   ███  ███      ███   ███  ███████   ███████  
-- ███  ████  ███       ███   ███        ███       ███   ███  ███      ███   ███  ███       ███   ███
-- ███   ███  ████████  ██     ██        ███        ███████   ███████  ███████    ████████  ███   ███


function fileutil.static.newFolder(parent) 
        local dir = slash.path(parent, 'new_folder')
        local res = nfs.mkdir(dir)
        if (res == dir) then 
            return post:emit('redraw')
        end
    end

-- ████████   ████████  ███   ███   ███████   ██     ██  ████████
-- ███   ███  ███       ████  ███  ███   ███  ███   ███  ███     
-- ███████    ███████   ███ █ ███  █████████  █████████  ███████ 
-- ███   ███  ███       ███  ████  ███   ███  ███ █ ███  ███     
-- ███   ███  ████████  ███   ███  ███   ███  ███   ███  ████████


function fileutil.static.rename(oldPath, newPath) 
        if (oldPath == newPath) then return end
        
        local res = nfs.move(oldPath, newPath)
        if (res ~= newPath) then 
            return error("rename failed! " .. tostring(res) .. "")
        end
    end

post.on('file.trash', fileutil.trash)
post.on('file.class', fileutil.class)
post.on('file.rename', fileutil.rename)
post.on('file.new_folder', fileutil.newFolder)

return fileutil