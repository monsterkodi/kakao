var toExport = {}
var _k_

var k

import krzl from "../krzl.js"

toExport["krzl"] = function ()
{
    section("strings", function ()
    {
        k = new krzl(['hello','world'])
        compare(k.filter('✘'),[])
        compare(k.filter('h'),['hello'])
        compare(k.filter('w'),['world'])
        compare(k.filter('l'),['hello','world'])
        compare(k.filter('ll'),['hello'])
        compare(k.filter('o'),['world','hello'])
    })
    section("extract", function ()
    {
        k = new krzl([{key:'hello'},{key:'world',evil:666}])
        k.extract = function (i)
        {
            return i.key
        }
        compare(k.filter('✘'),[])
        compare(k.filter('h'),[{key:'hello'}])
        compare(k.filter('w'),[{key:'world',evil:666}])
        compare(k.filter('l'),[{key:'hello'},{key:'world',evil:666}])
        compare(k.filter('ll'),[{key:'hello'}])
        compare(k.filter('o'),[{key:'world',evil:666},{key:'hello'}])
    })
    section("weight", function ()
    {
        k = new krzl(['bba','aa','a','aba','acccca','aaa','akkaakka'])
        compare(k.filter('a'),['a','aa','aba','aaa','acccca','akkaakka','bba'])
        compare(k.filter('b'),['bba','aba'])
        compare(k.filter('aa'),['aa','aba','aaa','acccca','akkaakka'])
    })
}
toExport["krzl"]._section_ = true
toExport._test_ = true
export default toExport
