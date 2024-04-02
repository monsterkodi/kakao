var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, file: function () { return import.meta.url.substring(7); }}

var file, files, test

import fs from "../kxk/fs.js"
import slash from "../kxk/slash.js"

import tester from "../kode/tester.js"

if (process.argv.slice(-1)[0] === 'brief')
{
    tester.logSections = false
}
if (process.argv.slice(-1)[0] === 'silent')
{
    tester.logSections = false
    tester.logModules = false
}
if (1)
{
    console.log('kode')
    files = await fs.list(slash.path(_k_.dir(),'../kode/test'))
    var list = _k_.list(files)
    for (var _22_13_ = 0; _22_13_ < list.length; _22_13_++)
    {
        file = list[_22_13_]
        test = await import(file.path)
        tester.test(test.default)
    }
}
if (1)
{
    console.log('kakao')
    files = await fs.list(_k_.dir())
    var list1 = _k_.list(files)
    for (var _29_13_ = 0; _29_13_ < list1.length; _29_13_++)
    {
        file = list1[_29_13_]
        if (file.path === _k_.file())
        {
            continue
        }
        test = await import(file.path)
        tester.test(test.default)
    }
}
if (1)
{
    console.log('kolor')
    file = slash.path(_k_.dir(),'../kolor/test.js')
    test = await import(file)
    tester.test(test.default)
}
tester.summarize()