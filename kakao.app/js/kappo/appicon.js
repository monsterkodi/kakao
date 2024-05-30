var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }}

class AppIcon
{
    static cache = {}

    static pngPath (opt)
    {
        return slash.path(opt.iconDir,slash.base(opt.appPath) + ".png")
    }

    static get (opt)
    {
        var pngPath

        pngPath = AppIcon.pngPath(opt)
        if (AppIcon.cache[pngPath])
        {
            return opt.cb(pngPath,opt.cbArg)
        }
        else
        {
            return fs.stat(pngPath,function (err, stat)
            {
                if (!(err != null) && stat.isFile())
                {
                    AppIcon.cache[pngPath] = true
                    return opt.cb(pngPath,opt.cbArg)
                }
                else
                {
                    return AppIcon.getIcon(opt)
                }
            })
        }
    }

    static getIcon (opt)
    {
        var appPath, infoPath

        appPath = opt.appPath
        infoPath = slash.join(appPath,'Contents','Info.plist')
        return plist.readFile(infoPath,function (err, obj)
        {
            var icnsPath

            if (!(err != null))
            {
                if ((obj['CFBundleIconFile'] != null))
                {
                    icnsPath = slash.join(slash.dirname(infoPath),'Resources',obj['CFBundleIconFile'])
                    if (!icnsPath.endsWith('.icns'))
                    {
                        icnsPath += ".icns"
                    }
                    return AppIcon.saveIcon(icnsPath,opt)
                }
                else
                {
                    return AppIcon.brokenIcon(opt)
                }
            }
            else
            {
                console.error(`getIcon: ${err}`)
                return AppIcon.brokenIcon(opt)
            }
        })
    }

    static saveIcon (icnsPath, opt)
    {
        var pngPath

        pngPath = AppIcon.pngPath(opt)
        return childp.exec(`/usr/bin/sips -Z ${opt.size} -s format png \"${icnsPath}\" --out \"${pngPath}\"`,function (err)
        {
            if (!(err != null))
            {
                return opt.cb(pngPath,opt.cbArg)
            }
            else
            {
                console.error(`saveIcon: ${err}`)
                return AppIcon.brokenIcon(opt)
            }
        })
    }

    static brokenIcon (opt)
    {
        var brokenPath

        brokenPath = slash.join(_k_.dir(),'..','img','broken.png')
        return opt.cb(brokenPath,opt.cbArg)
    }
}

export default AppIcon;