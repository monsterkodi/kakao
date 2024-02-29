var toExport = {}
// monsterkodi/kode 0.256.0

var _k_

var f2, t, __dirname, __filename, _197_21_, _198_21_, _199_21_, _26_29_, _27_30_, _28_38_, _41_34_, _42_33_, _46_32_, _47_33_, _57_26_, _58_27_, _62_27_, _63_25_

import fs from '../../js/lib/kxk/fs.js'
import slash from '../../js/lib/kxk/slash.js'
__filename = import.meta.filename
__dirname = import.meta.dirname
toExport["fs"] = function ()
{
    section("exists", function ()
    {
        compare(((fs.exists(__dirname) != null)),true)
        compare(((fs.exists(__filename) != null)),true)
        compare(((fs.exists(__filename + 'foo') != null)),false)
        section("async", function ()
        {
            fs.exists(__filename,function (stat)
            {
                return compare(((stat != null)),true)
            })
            section("not", function ()
            {
                fs.exists(__filename + 'foo',function (stat)
                {
                    return compare(((stat != null)),false)
                })
            })
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
    section("write", function ()
    {
        section("callback", function ()
        {
            f2 = slash.path(__dirname,'test.txt')
            console.log(f2)
            fs.write(f2,"hello world").then(function (p)
            {
                console.log(p,f2)
                return compare(p,f2)
            })
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
