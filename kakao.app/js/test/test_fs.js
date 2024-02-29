var toExport = {}
// monsterkodi/kode 0.256.0

var _k_

var f, f2, f3, t, __dirname, __filename, _186_21_, _187_21_, _188_21_, _26_32_, _27_39_, _28_47_, _41_43_, _42_36_, _46_35_, _47_42_, _57_29_, _58_36_, _60_26_, _61_24_

import fs from '../../js/lib/kxk/slash.js'
import slash from '../../js/lib/kxk/fs.js'
__filename = import.meta.filename
__dirname = import.meta.dirname
toExport["fs"] = function ()
{
    section("exists", function ()
    {
        compare(((slash.exists(__dirname) != null)),true)
        compare(((slash.exists(slash.__filename) != null)),true)
        compare(((slash.exists(slash.__filename + 'foo') != null)),false)
        section("async", function ()
        {
            slash.exists(slash.__filename,function (stat)
            {
                return compare(((stat != null)),true)
            })
            section("not", function ()
            {
                slash.exists(slash.__filename + 'foo',function (stat)
                {
                    return compare(((stat != null)),false)
                })
            })
        })
    })
    section("fileExists", function ()
    {
        compare(((slash.fileExists(slash.__filename) != null)),true)
        compare(((slash.fileExists(__dirname) != null)),false)
    })
    section("dirExists", function ()
    {
        compare(((slash.dirExists(__dirname) != null)),true)
        compare(((slash.dirExists(slash.__filename) != null)),false)
    })
    section("pkg", function ()
    {
        compare(((slash.pkg(__dirname) != null)),true)
        compare(((slash.pkg(slash.__filename) != null)),true)
        compare(((slash.pkg('C:\\') != null)),false)
        compare(((slash.pkg('C:') != null)),false)
    })
    section("write", function ()
    {
        f = slash.path(__dirname,'test.txt')
        compare(fs.write(f,'hello'),f)
        compare(fs.read(f),'hello')
        f = slash.path(__dirname,'test.txt','subdir')
        compare(fs.write(f,'hello'),'')
        section("callback", function ()
        {
            f2 = slash.path(__dirname,'test.txt')
            fs.write(f2,"hello world",function (p)
            {
                compare(fs.read(p),'hello world')
                compare(p,f2)
                return fs.remove(p)
            })
            section("fail", function ()
            {
                f3 = slash.path(__dirname,'test.txt','subdir')
                fs.write(f3,"nope",function (p)
                {
                    return compare(p,'')
                })
            })
        })
    })
    section("dirlist", function ()
    {
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
