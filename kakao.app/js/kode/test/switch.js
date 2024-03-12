var toExport = {}
// monsterkodi/kakao 0.1.0

var _k_

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["switch"] = function ()
{
    section("switches", function ()
    {
        compare(kc(`switch a
    when 1 then 2`),`switch (a)
{
    case 1:
        2
        break
}\n`)
        compare(kc(`switch a
    when 11 then 22; 33`),`switch (a)
{
    case 11:
        22
        33
        break
}\n`)
        compare(kc(`switch a
    when 'a'   then i++ ; j = 1 if k == 0`),`switch (a)
{
    case 'a':
        i++
        if (k === 0)
        {
            j = 1
        }
        break
}\n`)
        compare(kc(`switch a
    when 'a'   then i++ ; j = 0 if k == 1
    when 'b'   then l++ ; m = 2 if p == 3`),`switch (a)
{
    case 'a':
        i++
        if (k === 1)
        {
            j = 0
        }
        break
    case 'b':
        l++
        if (p === 3)
        {
            m = 2
        }
        break
}\n`)
        compare(kc(`switch a
    when 'a'   then i++ ; i = 1 if i == 0
    when 'b'   then f++ ; f = 1 if f == 0
    when 'c'
        i++ if f != 'f'`),`switch (a)
{
    case 'a':
        i++
        if (i === 0)
        {
            i = 1
        }
        break
    case 'b':
        f++
        if (f === 0)
        {
            f = 1
        }
        break
    case 'c':
        if (f !== 'f')
        {
            i++
        }
        break
}\n`)
        compare(kc(`switch a
    when 111 222 333 then
    when 'a' 'b' 'c' then`),`switch (a)
{
    case 111:
    case 222:
    case 333:
        break
    case 'a':
    case 'b':
    case 'c':
        break
}\n`)
        compare(kc(`switch a
    when 111 222 333
    when 'a' 'b' 'c'`),`switch (a)
{
    case 111:
    case 222:
    case 333:
        break
    case 'a':
    case 'b':
    case 'c':
        break
}\n`)
        compare(kc(`switch dir 
    'up'   ➜ (si = a) ; x
    'down' ➜ si = b   ; y`),`switch (dir)
{
    case 'up':
        (si = a)
        x
        break
    case 'down':
        si = b
        y
        break
}\n`)
    })
    section("match", function ()
    {
        compare(kc(`switch typeof t 
    when 'string'
        v = 1`),`switch (typeof(t))
{
    case 'string':
        v = 1
        break
}
`)
    })
    section("assign", function ()
    {
        compare(kc(`b = switch c
    when 'c'
        true
    when 'd'
        false`),`b = ((function ()
{
    switch (c)
    {
        case 'c':
            return true

        case 'd':
            return false

    }

}).bind(this))()`)
        compare(kc(`b = switch matches[0][0]
    when 'close'
        c += index+length
        true
    when 'triple' 'double' 'single'
        c += index+length
        false
    else
        log 'unhandled?' matches[0]
        c += index+length
        true`),`b = ((function ()
{
    switch (matches[0][0])
    {
        case 'close':
            c += index + length
            return true

        case 'triple':
        case 'double':
        case 'single':
            c += index + length
            return false

        default:
            console.log('unhandled?',matches[0])
            c += index + length
            return true
    }

}).bind(this))()`)
    })
    section("qmrkop", function ()
    {
        compare(kc(`switch ext ? require('path').extname p
    '.json' ➜ JSON.parse str
            ➜ require('./parse') str`),`switch ((ext != null ? ext : require('path').extname(p)))
{
    case '.json':
        JSON.parse(str)
        break
    default:
        require('./parse')(str)
}
`)
    })
    section("typeof", function ()
    {
        compare(kc(`switch typeof t
    'string' ➜ 1`),`switch (typeof(t))
{
    case 'string':
        1
        break
}
`)
    })
    section("nicer", function ()
    {
        compare(kc(`switch x
    'bla'   ➜ bla
    'hello' ➜ blub
            ➜ fork`),`switch (x)
{
    case 'bla':
        bla
        break
    case 'hello':
        blub
        break
    default:
        fork
}\n`)
        compare(kc(`switch x
    'x' 
    1 2 3
    'bla'   ➜ bla
    'a' 'b'
    'hello' ➜ blub
            ➜ fork`),`switch (x)
{
    case 'x':
    case 1:
    case 2:
    case 3:
    case 'bla':
        bla
        break
    case 'a':
    case 'b':
    case 'hello':
        blub
        break
    default:
        fork
}\n`)
    })
}
toExport["switch"]._section_ = true
toExport._test_ = true
export default toExport
