var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var file, files, test

import test_linediff from "./test_linediff.js"

import test_slash from "./test_slash.js"

import test_util from "./test_util.js"

import test_kstr from "./test_kstr.js"

import test_pug from "./test_pug.js"

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
if (1)
{
    files = await fs.list(slash.path(import.meta.dirname,'../kode/test'))
    var list = _k_.list(files)
    for (var _28_13_ = 0; _28_13_ < list.length; _28_13_++)
    {
        file = list[_28_13_]
        test = await import(file.path)
        tester.test(test.default)
    }
}
tester.test(test_slash)
tester.test(test_util)
tester.test(test_fs)
tester.test(test_linediff)
tester.test(test_kstr)
tester.test(test_pug)
tester.summarize()