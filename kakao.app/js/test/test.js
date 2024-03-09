// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var file, files, test

import test_slash from "./test_slash.js"

import test_fs from "./test_fs.js"

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
tester.test(test_slash)
tester.test(test_fs)
if (1)
{
    files = await fs.list(slash.path(import.meta.dirname,'../kode/test'))
    var list = _k_.list(files)
    for (var _27_13_ = 0; _27_13_ < list.length; _27_13_++)
    {
        file = list[_27_13_]
        test = await import(file.path)
        tester.test(test.default)
    }
}
tester.summarize()