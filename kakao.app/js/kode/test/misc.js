var toExport = {}
// monsterkodi/kakao 0.1.0

var _k_

var kc, ke

import utils from "./utils.js"

kc = utils.kc
ke = utils.ke

toExport["misc"] = function ()
{
    section("this", function ()
    {
        compare(kc('@'),'this')
        compare(kc('@a'),'this.a')
        compare(kc('@a.b'),'this.a.b')
        compare(kc('@a.b()'),'this.a.b()')
        compare(kc('t = @'),'t = this')
        compare(kc('f(1,@)'),'f(1,this)')
        compare(kc('@[1]'),'this[1]')
        compare(kc('@[2]()'),'this[2]()')
        compare(kc('@[3](4)'),'this[3](4)')
        compare(kc('@[5] 6'),'this[5](6)')
        compare(kc('return @ if a'),`if (a)
{
    return this
}`)
        compare(kc("a.on 'b' @c"),"a.on('b',this.c)")
        compare(kc("a.on 'b' @c"),"a.on('b',this.c)")
        compare(kc(`if @
    1`),`if (this)
{
    1
}`)
        compare(kc(`if @ then 1`),`if (this)
{
    1
}`)
        compare(kc(`a @, file`),`a(this,file)`)
        compare(kc(`a = @ == b`),`a = this === b`)
    })
    section("try", function ()
    {
        compare(kc(`try 
    somethg
catch
    blark`),`try
{
    somethg
}
catch (err)
{
    blark
}`)
        compare(kc(`try 
    something
catch err
    error err`),`try
{
    something
}
catch (err)
{
    console.error(err)
}`)
        compare(kc(`try 
    sthelse
catch err
    error err
finally
    cleanup`),`try
{
    sthelse
}
catch (err)
{
    console.error(err)
}
finally
{
    cleanup
}`)
        section("try returns", function ()
        {
            compare(kc(`a = ->
    try
        p
    catch err
       err`),`
a = function ()
{
    try
    {
        return p
    }
    catch (err)
    {
        return err
    }
}`)
        })
        section("if try returns", function ()
        {
            compare(kc(`a = ->
    if 1
        try
            p
        catch err
           err`),`
a = function ()
{
    if (1)
    {
        try
        {
            return p
        }
        catch (err)
        {
            return err
        }
    }
}`)
        })
    })
    section("throw", function ()
    {
        compare(kc("throw 'msg'"),"throw 'msg'")
    })
    section("delete", function ()
    {
        compare(kc("delete a"),"delete a")
        compare(kc("delete @a"),"delete this.a")
        compare(kc("delete a.b"),"delete a.b")
        compare(kc('[delete a, b]'),';[delete a,b]')
        compare(kc('delete a.b.c'),'delete a.b.c')
        compare(kc('[delete a.b, a:b]'),';[delete a.b,{a:b}]')
        compare(kc('delete a.b == false'),'delete a.b === false')
    })
    section("require", function ()
    {
        compare(kc("noon  = require 'noon'"),"noon = require('noon')")
        compare(kc(`slash = require 'kslash'
kstr  = require 'kstr'`),`slash = require('kslash')
kstr = require('kstr')`)
        compare(kc(`if true
    {m,n} = require 'bla'`),`if (true)
{
    m = require('bla').m
    n = require('bla').n

}`)
        compare(kc(`{ empty, noon, valid } = kxk`),`empty = kxk.empty
noon = kxk.noon
valid = kxk.valid
`)
    })
    section("is", function ()
    {
        compare(ke('1 is "number"'),true)
        compare(ke('a = {} is Object'),true)
        compare(ke('a = {} is "object"'),true)
        compare(ke('(->) is "function"'),true)
        compare(ke('[] is "object"'),true)
        compare(ke('[] is Array'),true)
        compare(ke('"" is "string"'),true)
        compare(ke('(new String "") is String'),true)
        compare(ke('(new Number 0) is Number'),true)
        compare(ke(`class A
class B extends A
a = new B
a is B and a is A and a is 'object'`),true)
        compare(ke('"" is String'),false)
        compare(ke('1 is Number'),false)
        compare(kc('log new Object()'),'console.log(new Object())')
        compare(kc("if d is 'function' and not o?"),`if (typeof(d) === 'function' && !(o != null))
{
}`)
        compare(kc("if not a is Array and not a is 'object'"),`if (!(a instanceof Array) && !(typeof(a) === 'object'))
{
}`)
        section("if block", function ()
        {
            compare(kc(`if
    a is Object ➜ 1
    a is Array  ➜ 2`),`if (a instanceof Object)
{
    1
}
else if (a instanceof Array)
{
    2
}`)
            compare(kc(`if
    a is Object 
        1
    a is Array  
        2`),`if (a instanceof Object)
{
    1
}
else if (a instanceof Array)
{
    2
}`)
        })
        section("str", function ()
        {
            compare(ke('a = "" is str'),true)
            compare(ke('a = "abc" is str'),true)
            compare(ke('a = new String() is str'),true)
            compare(ke('a = new String("") is str'),true)
            compare(ke('a = new String("abc") is str'),true)
            compare(ke('"" is str and "a" is str and new String("abc") is str'),true)
            compare(ke('a = 1 is str'),false)
            compare(ke('a = [] is str'),false)
            compare(ke('a = {} is str'),false)
            compare(ke('a = null is str'),false)
            compare(ke('a = undefined is str'),false)
        })
        section("obj", function ()
        {
            compare(ke('a = {} is obj'),true)
            compare(ke('a = {a:1} is obj'),true)
            compare(ke('a = new Object() is obj'),true)
            compare(ke('a = new Object({}) is obj'),true)
            compare(ke('a = new Object({a:1}) is obj'),true)
            compare(ke('{} is obj and new Object() is obj'),true)
            compare(ke('null is obj or new Map() is obj or [] is obj'),false)
            compare(ke('a = 1 is obj'),false)
            compare(ke('a = [] is obj'),false)
            compare(ke('a = "x" is obj'),false)
            compare(ke('a = null is obj'),false)
            compare(ke('a = undefined is obj'),false)
            compare(ke('a = new String() is obj'),false)
            compare(ke('a = new Array() is obj'),false)
            compare(ke('a = new Map() is obj'),false)
            compare(ke('a = new Set() is obj'),false)
        })
        section("arr", function ()
        {
            compare(ke('a = [] is arr'),true)
            compare(ke('a = [1 2] is arr'),true)
            compare(ke('a = new Array() is arr'),true)
            compare(ke('a = new Array([]) is arr'),true)
            compare(ke('a = new Array([1]) is arr'),true)
            compare(ke('[] is arr and new Array() is arr'),true)
            compare(ke('null is arr or new Set() is arr or {} is arr'),false)
            compare(ke('a = 1 is arr'),false)
            compare(ke('a = {} is arr'),false)
            compare(ke('a = "x" is arr'),false)
            compare(ke('a = null is arr'),false)
            compare(ke('a = undefined is arr'),false)
            compare(ke('a = new String() is arr'),false)
            compare(ke('a = new Object() is arr'),false)
            compare(ke('a = new Map() is arr'),false)
            compare(ke('a = new Set() is arr'),false)
        })
        section("func", function ()
        {
            compare(ke('a = ->\na is func'),true)
            compare(ke('a = ()->\na is func'),true)
            compare(ke('a = 1 is func'),false)
            compare(ke('a = {} is func'),false)
            compare(ke('a = "x" is func'),false)
            compare(ke('a = null is func'),false)
            compare(ke('a = undefined is func'),false)
            compare(ke('a = new String() is func'),false)
            compare(ke('a = new Object() is func'),false)
            compare(ke('a = new Array() is func'),false)
            compare(ke('a = new Set() is func'),false)
        })
        section("num", function ()
        {
            compare(ke('a = "-10" is num'),true)
            compare(ke('a = "0" is num'),true)
            compare(ke('a = "5" is num'),true)
            compare(ke('a = -16 is num'),true)
            compare(ke('a = 0 is num'),true)
            compare(ke('a = 32 is num'),true)
            compare(ke('a = "040" is num'),true)
            compare(ke('a = 0144 is num'),true)
            compare(ke('a = "0xFF" is num'),true)
            compare(ke('a = 0xFFF is num'),true)
            compare(ke('a = "-1.6" is num'),true)
            compare(ke('a = "4.536" is num'),true)
            compare(ke('a = -2.6 is num'),true)
            compare(ke('a = 3.1415 is num'),true)
            compare(ke('a = 8e5 is num'),true)
            compare(ke('a = "123e-2" is num'),true)
            compare(ke('a = Infinity is num'),true)
            compare(ke('a = -Infinity is num'),true)
            compare(ke('a = Number.POSITIVE_INFINITY is num'),true)
            compare(ke('a = Number.NEGATIVE_INFINITY is num'),true)
            compare(ke('"0xFF" is num and "-4.536" is num and 42 is num'),true)
            compare(ke('a = "" is num'),false)
            compare(ke('a = "        " is num'),false)
            compare(ke('a = "\t\t" is num'),false)
            compare(ke('a = "abcdefghijklm1234567890" is num'),false)
            compare(ke('a = "xabcdefx" is num'),false)
            compare(ke('a = true is num'),false)
            compare(ke('a = false is num'),false)
            compare(ke('a = "bcfed5.2" is num'),false)
            compare(ke('a = "7.2acdgs" is num'),false)
            compare(ke('a = undefined is num'),false)
            compare(ke('a = null is num'),false)
            compare(ke('a = NaN is num'),false)
            compare(ke('a = (new Date(2009, 1, 1)) is num'),false)
            compare(ke('a = (new Object()) is num'),false)
            compare(ke('a = (->) is num'),false)
        })
    })
    section("in condition", function ()
    {
        compare(kc("a in l"),"_k_.in(a,l)")
        compare(kc("a in 'xyz'"),"_k_.in(a,'xyz')")
        compare(kc("a in [1,2,3]"),"_k_.in(a,[1,2,3])")
        compare(kc("a not in b"),"!(_k_.in(a,b))")
        compare(kc("a not in [3,4]"),"!(_k_.in(a,[3,4]))")
        compare(kc(`if a in l then 1`),`if (_k_.in(a,l))
{
    1
}`)
        compare(kc(`if not a in l then 2`),`if (!(_k_.in(a,l)))
{
    2
}`)
        compare(kc(`if a in l
    2`),`if (_k_.in(a,l))
{
    2
}`)
    })
    section("primes", function ()
    {
        compare(ke(`eratosthenes = (n) ->
    
    prime = [x < 2 and 1 or 0 for x in 0..n]
    
    for i in 0..Math.sqrt n
        
        if prime[i] == 0
            
            l = 2

            while true
                
                break if n < j = i * l++

                prime[j] = 1

    prime = prime each (i,p) -> [i, parseInt p ? 0 : i]
    prime = prime.filter (p) -> p
                
eratosthenes 100`),[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97])
    })
}
toExport["misc"]._section_ = true
toExport._test_ = true
export default toExport
