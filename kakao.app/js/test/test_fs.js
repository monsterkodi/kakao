var toExport = {}
// monsterkodi/kode 0.256.0

var _k_

var f2, t, __dirname, __filename, _139_21_, _140_21_, _141_21_, _26_29_, _27_30_, _28_38_, _35_34_, _36_33_, _40_32_, _41_33_, _51_26_, _52_27_, _56_27_, _57_25_

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
    section("write", function ()
    {
        f2 = slash.path(__dirname,'test.txt')
        fs.write(f2,"hello world").then(function (p)
        {
            return compare(p,f2)
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
