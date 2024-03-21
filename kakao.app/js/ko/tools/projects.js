var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var files, numFiles

import post from "../../kxk/post.js"

files = {}
numFiles = 0
class Projects
{
    static refresh ()
    {
        return files = {}
    }

    static onIndexed (info)
    {
        if (!_k_.empty(info.files))
        {
            console.log('project indexed',info)
            files[info.dir] = info.files
            return numFiles += info.files.length
        }
    }

    static files (file)
    {
        var dir, list

        if (_k_.empty(file))
        {
            return []
        }
        if ((files[file] != null))
        {
            return files[file]
        }
        for (dir in files)
        {
            list = files[dir]
            if (file.startsWith(dir))
            {
                console.log('fallback index',file,dir,list)
                return list
            }
        }
        console.log(`no project files for file ${file}`,Object.keys(files))
        return []
    }
}

post.on('projectIndexed',Projects.onIndexed)
export default Projects;