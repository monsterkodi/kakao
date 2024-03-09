var toExport = {}
// monsterkodi/kode 0.256.0

var _k_

var home, __dirname, __filename

import slash from "../kxk/slash.js"

__filename = import.meta.filename
__dirname = import.meta.dirname
toExport["kslash"] = function ()
{
    section("normalize", function ()
    {
        compare(slash.normalize('xyz'),'xyz')
        compare(slash.normalize('x/y/z'),'x/y/z')
        compare(slash.normalize('x\\y/z\\'),'x/y/z/')
        compare(slash.normalize('\\x\\y/z'),'/x/y/z')
        compare(slash.normalize('..\\x\\y/z'),'../x/y/z')
        compare(slash.normalize('./x\\y/z'),'./x/y/z')
        compare(slash.normalize('x/./z'),'x/z')
        compare(slash.normalize('x/../z'),'z')
        compare(slash.normalize('./x/y/z/../../a'),'./x/a')
        compare(slash.normalize('../up'),'../up')
        compare(slash.normalize('//'),'/')
        compare(slash.normalize('//././////././'),'/')
        compare(slash.normalize('./x/../../z'),'../z')
        compare(slash.normalize('./x/../../../y'),'../../y')
    })
    section("path", function ()
    {
        compare(slash.path(''),'')
        compare(slash.path(null),'')
        compare(slash.path(undefined),'')
        compare(slash.path('a','b','c'),'a/b/c')
        compare(slash.path('','','void','',''),'void')
        compare(slash.path('','','oops','','alla'),'oops/alla')
        compare(slash.path('C:\\FOO','.\\BAR','that\\sucks'),'C:/FOO/BAR/that/sucks')
        compare(slash.path('~'),slash.home())
        compare(slash.path('/'),'/')
        compare(slash.path('./'),'./')
        compare(slash.path('../'),'../')
        compare(slash.path('.././'),'../')
        compare(slash.path('./relative'),'./relative')
        compare(slash.path('../parent'),'../parent')
        compare(slash.path('.././././'),'../')
        compare(slash.path('//'),'/')
        compare(slash.path('C:/'),'C:/')
        compare(slash.path('C://'),'C:/')
        compare(slash.path('C:'),'C:/')
        compare(slash.path('C:\\'),'C:/')
        compare(slash.path('C:/some/path/on.c'),'C:/some/path/on.c')
        compare(slash.path("C:\\"),"C:/")
        compare(slash.path("C:/"),"C:/")
        compare(slash.path("C://"),"C:/")
        compare(slash.path("C:"),"C:/")
        compare(slash.path("C:\\Back\\Slash\\Crap"),"C:/Back/Slash/Crap")
        compare(slash.path("C:\\Back\\Slash\\Crap\\..\\..\\To\\The\\..\\Future"),"C:/Back/To/Future")
    })
    section("removeDrive", function ()
    {
        compare(slash.removeDrive('/some/path'),'/some/path')
        compare(slash.removeDrive('c:/some/path'),'/some/path')
        compare(slash.removeDrive('c:\\some\\path'),'/some/path')
        compare(slash.removeDrive('c:/'),'/')
        compare(slash.removeDrive('c:\\'),'/')
        compare(slash.removeDrive('c:'),'/')
        compare(slash.removeDrive('/'),'/')
    })
    section("isRoot", function ()
    {
        compare(slash.isRoot('C:/'),true)
        compare(slash.isRoot('D:'),true)
        compare(slash.isRoot('/'),true)
        compare(slash.isRoot('/a'),false)
        compare(slash.isRoot('c:/a'),false)
        compare(slash.isRoot('C:\\a'),false)
    })
    section("parse", function ()
    {
        compare(slash.parse('/a/b/c.txt'),{dir:'/a/b',file:'c.txt',name:'c',ext:'txt'})
        compare(slash.parse('/a/b/c'),{dir:'/a/b',file:'c',name:'c',ext:''})
        compare(slash.parse('/a/b/c/'),{dir:'/a/b',file:'c',name:'c',ext:''})
        compare(slash.parse('/a'),{dir:'/',file:'a',name:'a',ext:''})
        if (slash.win())
        {
            compare(slash.parse('c:').root,'c:/')
            compare(slash.parse('c:').dir,'c:/')
        }
    })
    section("dir", function ()
    {
        compare(slash.dir('/some/path/file.txt'),'/some/path')
        compare(slash.dir('/some/dir/'),'/some')
        compare(slash.dir('/some/dir'),'/some')
        compare(slash.dir('some/dir/'),'some')
        compare(slash.dir('some/dir'),'some')
        compare(slash.dir('/some/'),'/')
        compare(slash.dir('/some'),'/')
        compare(slash.dir('./rel'),'.')
        compare(slash.dir('./rel/ative'),'./rel')
        compare(slash.dir('../..'),'..')
        compare(slash.dir('.'),'')
        compare(slash.dir('..'),'')
        compare(slash.dir('./'),'')
        compare(slash.dir('../'),'')
        compare(slash.dir('~'),slash.dir(slash.home()))
        compare(slash.dir('~/'),slash.dir(slash.home()))
        if (slash.win())
        {
            compare(slash.dir('C:/'),'')
            compare(slash.dir('C:/'),'')
            compare(slash.dir('C:/Back'),'C:/')
            compare(slash.dir('D:\\Back'),'D:/')
        }
    })
    section("pathlist", function ()
    {
        slash.logErrors = false
        compare(slash.pathlist(''),[])
        slash.logErrors = true
        compare(slash.pathlist('/some/path.txt'),['/','/some','/some/path.txt'])
        compare(slash.pathlist('/'),['/'])
        compare(slash.pathlist('.'),['.'])
        compare(slash.pathlist('/c/Slash'),['/','/c','/c/Slash'])
        compare(slash.pathlist('\\d\\Slash'),['/','/d','/d/Slash'])
        compare(slash.pathlist('~'),slash.pathlist(slash.home()))
        if (slash.win())
        {
            compare(slash.pathlist('C:\\Back\\Slash\\'),['C:/','C:/Back','C:/Back/Slash'])
            compare(slash.pathlist('C:/Slash'),['C:/','C:/Slash'])
        }
    })
    section("name", function ()
    {
        compare(slash.name('/some/path.txt'),'path')
    })
    section("file", function ()
    {
        compare(slash.file('/some/path.txt'),'path.txt')
    })
    section("ext", function ()
    {
        compare(slash.ext('./none'),'')
        compare(slash.ext('./some.ext'),'ext')
        compare(slash.ext('./some.more.ext'),'ext')
    })
    section("removeExt", function ()
    {
        compare(slash.removeExt('./none'),'./none')
        compare(slash.removeExt('./some.ext'),'./some')
        compare(slash.removeExt('./some.more.ext'),'./some.more')
        compare(slash.removeExt('../none'),'../none')
        compare(slash.removeExt('../some.ext'),'../some')
        compare(slash.removeExt('../some.more.ext'),'../some.more')
        compare(slash.removeExt('none'),'none')
        compare(slash.removeExt('some.ext'),'some')
        compare(slash.removeExt('some.more.ext'),'some.more')
    })
    section("splitExt", function ()
    {
        compare(slash.splitExt('./none'),['./none',''])
        compare(slash.splitExt('./some.ext'),['./some','ext'])
        compare(slash.splitExt('./some.more.ext'),['./some.more','ext'])
        compare(slash.splitExt('/none'),['/none',''])
        compare(slash.splitExt('/some.ext'),['/some','ext'])
        compare(slash.splitExt('/some.more.ext'),['/some.more','ext'])
        compare(slash.splitExt('none'),['none',''])
        compare(slash.splitExt('some.ext'),['some','ext'])
        compare(slash.splitExt('some.more.ext'),['some.more','ext'])
    })
    section("swapExt", function ()
    {
        compare(slash.swapExt('./some','new'),'./some.new')
        compare(slash.swapExt('./some.ext','new'),'./some.new')
        compare(slash.swapExt('./some.more.ext','new'),'./some.more.new')
        compare(slash.swapExt('/some','new'),'/some.new')
        compare(slash.swapExt('/some.ext','new'),'/some.new')
        compare(slash.swapExt('/some.more.ext','new'),'/some.more.new')
        compare(slash.swapExt('some','new'),'some.new')
        compare(slash.swapExt('some.ext','new'),'some.new')
        compare(slash.swapExt('some.more.ext','new'),'some.more.new')
    })
    section("home", function ()
    {
        if (slash.win())
        {
            home = slash.path(process.env['HOMEDRIVE'] + process.env['HOMEPATH'])
        }
        else
        {
            home = process.env['HOME']
        }
        compare(slash.home(),home)
        compare(slash.tilde(home),'~')
        compare(slash.tilde(home + '/sub'),'~/sub')
        compare(slash.untilde('~/sub'),home + '/sub')
    })
    section("unenv", function ()
    {
        compare(slash.unenv('C:/$Recycle.bin'),'C:/$Recycle.bin')
        compare(slash.unenv('$HOME/test'),slash.path(process.env['HOME']) + '/test')
    })
    section("unslash", function ()
    {
        if (!slash.win())
        {
            compare(slash.unslash('/c/test'),'/c/test')
        }
        else
        {
            compare(slash.unslash('/c/test'),'C:\\test')
        }
    })
    section("relative", function ()
    {
        compare(slash.relative('\\test\\some\\path.txt','\\test\\some\\other\\path'),'../../path.txt')
        compare(slash.relative('/Users/kodi/s/konrad/app/js/coffee.js','/Users/kodi/s/konrad'),'app/js/coffee.js')
        compare(slash.relative('/some/path/on.c','/path/on.d'),'../../some/path/on.c')
        compare(slash.relative('\\some\\path\\on.c','\\path\\on.d'),'../../some/path/on.c')
        compare(slash.relative('\\some\\path','/some/path'),'.')
        compare(slash.relative('/Users/kodi/s/kakao/kakao.app/js/bin/kode/returner.js','/Users/kodi/s/kakao/kakao.app/js/bin/kode/test'),'../returner.js')
        if (slash.win())
        {
            compare(slash.relative('C:\\test\\some\\path.txt','C:\\test\\some\\other\\path'),'../../path.txt')
            compare(slash.relative('C:/Users/kodi/s/konrad/app/js/coffee.js','C:/Users/kodi/s/konrad'),'app/js/coffee.js')
            compare(slash.relative('C:\\some\\path','C:/some/path'),'.')
            compare(slash.relative('C:/some/path/on.c','D:/path/on.d'),'C:/some/path/on.c')
            compare(slash.relative('C:\\some\\path\\on.c','D:\\path\\on.d'),'C:/some/path/on.c')
        }
    })
    section("split", function ()
    {
        compare(slash.split('/c/users/home/'),['c','users','home'])
        compare(slash.split("d/users/home"),['d','users','home'])
        compare(slash.split("c:/some/path"),['c:','some','path'])
        compare(slash.split('d:\\some\\path\\'),['d:','some','path'])
    })
    section("splitDrive", function ()
    {
        compare(slash.splitDrive('/some/path'),['/some/path',''])
        compare(slash.splitDrive('c:/some/path'),['/some/path','c'])
        compare(slash.splitDrive('c:\\some\\path'),['/some/path','c'])
        compare(slash.splitDrive('c:\\'),['/','c'])
        compare(slash.splitDrive('c:'),['/','c'])
    })
    section("splitFileLine", function ()
    {
        compare(slash.splitFileLine('/some/path'),['/some/path',1,0])
        compare(slash.splitFileLine('/some/path:123'),['/some/path',123,0])
        compare(slash.splitFileLine('/some/path:123:15'),['/some/path',123,15])
        compare(slash.splitFileLine('c:/some/path:123'),['c:/some/path',123,0])
        compare(slash.splitFileLine('c:/some/path:123:15'),['c:/some/path',123,15])
    })
    section("splitFilePos", function ()
    {
        compare(slash.splitFilePos('/some/path'),['/some/path',[0,0]])
        compare(slash.splitFilePos('/some/path:123'),['/some/path',[0,122]])
        compare(slash.splitFilePos('/some/path:123:15'),['/some/path',[15,122]])
        compare(slash.splitFilePos('c:/some/path:123'),['c:/some/path',[0,122]])
        compare(slash.splitFilePos('c:/some/path:123:15'),['c:/some/path',[15,122]])
    })
    section("joinFilePos", function ()
    {
        compare(slash.joinFilePos('/some/path',[0,0]),'/some/path')
        compare(slash.joinFilePos('/some/path',[1,0]),'/some/path:1:1')
        compare(slash.joinFilePos('/some/path',[0,1]),'/some/path:2')
        compare(slash.joinFilePos('/some/path',[1,1]),'/some/path:2:1')
        compare(slash.joinFilePos('/some/path',[0,4]),'/some/path:5')
        compare(slash.joinFilePos('/some/path',[1,5]),'/some/path:6:1')
        compare(slash.joinFilePos('/some/path:23:45',[1,5]),'/some/path:6:1')
        compare(slash.joinFilePos('/some/path:23',[1,5]),'/some/path:6:1')
        compare(slash.joinFilePos('/some/path'),'/some/path')
        compare(slash.joinFilePos('/some/path',[]),'/some/path')
    })
    section("joinFileLine", function ()
    {
        compare(slash.joinFileLine('/some/path',1),'/some/path:1')
        compare(slash.joinFileLine('/some/path',4,0),'/some/path:4')
        compare(slash.joinFileLine('/some/path',5,1),'/some/path:5:1')
        compare(slash.joinFileLine('/some/path:23:45',5,1),'/some/path:5:1')
        compare(slash.joinFileLine('/some/path:23',5,1),'/some/path:5:1')
        compare(slash.joinFileLine('/some/path'),'/some/path')
        compare(slash.joinFileLine('/some/path',0),'/some/path')
    })
    section("isRelative", function ()
    {
        compare(slash.isRelative(__dirname),false)
        compare(slash.isRelative('.'),true)
        compare(slash.isRelative('..'),true)
        compare(slash.isRelative('.././bla../../fark'),true)
        compare(slash.isRelative('..\\blafark'),true)
        if (slash.win())
        {
            compare(slash.isRelative('C:\\blafark'),false)
            compare(slash.isRelative('C:\\'),false)
            compare(slash.isRelative('C:/'),false)
            compare(slash.isRelative('C:'),false)
        }
    })
    section("sanitize", function ()
    {
        compare((slash.sanitize('a.b\n')),'a.b')
        compare((slash.sanitize('\n\n c . d  \n\n\n')),' c . d  ')
    })
}
toExport["kslash"]._section_ = true
toExport._test_ = true
export default toExport
