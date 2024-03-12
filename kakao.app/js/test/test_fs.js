var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var t, __dirname, __filename, _129_21_, _130_21_, _131_21_, _25_29_, _26_30_, _27_38_, _34_34_, _35_33_, _39_32_, _40_33_, _50_26_, _51_27_, _55_27_, _56_25_

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
