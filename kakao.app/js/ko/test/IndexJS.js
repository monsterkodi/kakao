var toExport = {}
var _k_

var idx

import IndexJS from "../tools/IndexJS.js"

toExport["IndexJS"] = function ()
{
    section("class", function ()
    {
        idx = new IndexJS
        compare(idx.parse(""),{classes:[],funcs:[],lines:1})
        compare(idx.parse("class Hello"),{classes:[{name:'Hello',line:0,type:'class'}],funcs:[],lines:1})
        compare(idx.parse(`class World
    constructor ()`),{classes:[{name:'World',line:0,type:'class'}],funcs:[{method:'constructor',line:1,class:'World'}],lines:2})
        compare(idx.parse(`class World
    constructor (a,b)`),{classes:[{name:'World',line:0,type:'class'}],funcs:[{method:'constructor',line:1,class:'World'}],lines:2})
        compare(idx.parse(`class World
    fun (a, b)
    {
        if (a)
        {
            for (var i = 0; i < 10; i++)
            {
                b += a
            }
        }
    }`),{classes:[{name:'World',line:0,type:'class'}],funcs:[{method:'fun',line:1,class:'World'}],lines:11})
    })
    section("function", function ()
    {
        idx = new IndexJS
        compare(idx.parse("Git = (function ()"),{classes:[{name:'Git',line:0,type:'function'}],funcs:[],lines:1})
        compare(idx.parse(`Git = (function ()
{
    Git["statusRequests"] = {}
    Git["statusCache"] = {}
    function Git ()`),{classes:[{name:'Git',line:0,type:'function'}],funcs:[{method:'Git',line:4,class:'Git'}],lines:5})
        compare(idx.parse(`Git = (function ()
{
    Git.prototype["onProjectIndexed"] = function (prjPath)
    {
    }

    Git["onFileChanged"] = function (file)
    {`),{classes:[{name:'Git',line:0,type:'function'}],funcs:[{method:'onProjectIndexed',line:2,class:'Git',static:true},{method:'onFileChanged',line:6,class:'Git'}],lines:8})
        compare(idx.parse(`Git = (function ()
{
    Git.prototype["onProjectIndexed"] = async function (prjPath)
    {
    }

    Git["onFileChanged"] = async function (file)
    {`),{classes:[{name:'Git',line:0,type:'function'}],funcs:[{method:'onProjectIndexed',line:2,class:'Git',static:true,async:true},{method:'onFileChanged',line:6,class:'Git',async:true}],lines:8})
    })
}
toExport["IndexJS"]._section_ = true
toExport._test_ = true
export default toExport
