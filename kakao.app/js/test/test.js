// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var file, files, test

import test_slash from './test_slash.js'
import test_fs from './test_fs.js'
import tester from '../bin/kode/tester.js'
tester.test(test_slash)
tester.test(test_fs)
import fs from '../lib/kxk/fs.js'
import slash from '../lib/kxk/slash.js'
if (1)
{
    files = await fs.list(slash.path(import.meta.dirname,'../bin/kode/test'))
    var list = _k_.list(files)
    for (var _21_13_ = 0; _21_13_ < list.length; _21_13_++)
    {
        file = list[_21_13_]
        test = await import(file.path)
        tester.test(test.default)
    }
}
tester.summarize()