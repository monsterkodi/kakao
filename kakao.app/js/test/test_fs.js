var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var f2, t, __dirname, __filename, _133_21_, _134_21_, _135_21_, _24_29_, _25_30_, _26_38_, _33_34_, _34_33_, _38_32_, _39_33_, _49_26_, _50_27_, _54_27_, _55_25_

import fs from "../kxk/fs.js"
import slash from "../kxk/slash.js"

__filename = import.meta.filename
__dirname = import.meta.dirname
toExport["fs"] = function ()
{
    section("exists", function ()
    {
        compare(((fs.exists(__dirname) != null)),true)
        compare(((fs.exists(__filename) != null)),true)
        compare(((fs.exists(__filename + 'foo') != null)),false)
        fs.exists(__filename,function (stat)
        {
            return compare(((stat != null)),true)
        })
        fs.exists(__filename + 'foo',function (stat)
        {
            return compare(((stat != null)),false)
        })
    })
    section("fileExists", function ()
    {
        compare(((fs.fileExists(__filename) != null)),true)
        compare(((fs.fileExists(__dirname) != null)),false)
    })
    section("dirExists", function ()
    {
        compare(((fs.dirExists(__dirname) != null)),true)
        compare(((fs.dirExists(__filename) != null)),false)
    })
    section("pkg", function ()
    {
        compare(((fs.pkg(__dirname) != null)),true)
        compare(((fs.pkg(__filename) != null)),true)
        if (slash.win())
        {
            compare(((fs.pkg('C:\\') != null)),false)
            compare(((fs.pkg('C:') != null)),false)
        }
    })
    section("read", function ()
    {
        fs.read(__dirname + '/../../package.noon',function (text)
        {
            return compare(text,function (a)
            {
                return a.startsWith('name')
            })
        })
        fs.read(__dirname + '/dir/filedoesntexist',function (text)
        {
            return compare(text,'')
        })
    })
    section("write", function ()
    {
        f2 = slash.path(__dirname,'test.txt')
        fs.write(f2,"hello world").then(function (p)
        {
            compare(p,f2)
            return fs.read(p).then(function (r)
            {
                compare(r,'hello world')
                return fs.remove(p)
            })
        })
        fs.write(slash.path(__dirname,'some.dir.that.doesn/t.exist'),'blurk').then(function (p)
        {
            compare(p,slash.path(__dirname,'some.dir.that.doesn/t.exist'))
            return fs.read(p).then(function (r)
            {
                compare(r,'blurk')
                return fs.remove(slash.path(__dirname,'some.dir.that.doesn'))
            })
        })
    })
    section("dirlist", function ()
    {
        process.chdir(__dirname)
        fs.list(__dirname).then(function (items)
        {
            return compare(items.map(function (i)
            {
                return i.path
            }),function (a)
            {
                return _k_.in(slash.path(__filename),a)
            })
        })
    })
    section("tmpfile", function ()
    {
        compare(slash.tmpfile('txt'),function (a)
        {
            return /\.txt$/.test(a)
        })
        compare(slash.tmpfile(),function (a)
        {
            return /[a-f\d]+$/.test(a)
        })
    })
    section("remove", function ()
    {
        t = fs.touch(slash.tmpfile())
        compare(((fs.isFile(t) != null)),true)
        compare(((fs.remove(t) != null)),false)
        compare(((fs.isFile(t) != null)),false)
    })
}
toExport["fs"]._section_ = true
toExport._test_ = true
export default toExport
