var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var index_utils

import kxk from "../../kxk.js"
let matchr = kxk.matchr


index_utils = (function ()
{
    function index_utils ()
    {}

    index_utils["requireRegExp"] = /^\s*([\w\{\}]+)\s+=\s+require\s+[\'\"]([\.\/\w]+)[\'\"]/
    index_utils["includeRegExp"] = /^#include\s+[\"\<]([\.\/\w]+)[\"\>]/
    index_utils["methodRegExp"] = /^\s+([\@]?\w+|@)\s*\:\s*(\(?.*\)?)?\s*○?[=-]\>/
    index_utils["funcRegExp"] = /^\s*([\w\.]+)\s*[\:\=][^\(\)\'\"]*(\(.*\))?\s*○?[=-]\>/
    index_utils["postRegExp"] = /^\s*post\.on\s+[\'\"](\w+)[\'\"]\s*\,?\s*(\(.*\))?\s*[=-]\>/
    index_utils["testRegExp"] = /^\s*(▸\s+.+)/
    index_utils["splitRegExp"] = new RegExp("[^\\w\\d\\_]+",'g')
    index_utils["classRegExp"] = /^(\s*\S+\s*=)?\s*(class|function)\s+(\w+)/
    index_utils["classNameInLine"] = function (line)
    {
        var m

        m = line.match(this.classRegExp)
        return (m != null ? m[3] : undefined)
    }

    index_utils["methodNameInLine"] = function (line)
    {
        var m, rgs

        m = line.match(this.methodRegExp)
        if ((m != null))
        {
            rgs = matchr.ranges(this.methodRegExp,line)
            if (rgs[0].start > 11)
            {
                return null
            }
        }
        return (m != null ? m[1] : undefined)
    }

    index_utils["funcNameInLine"] = function (line)
    {
        var m, rgs

        if (m = line.match(this.funcRegExp))
        {
            rgs = matchr.ranges(this.funcRegExp,line)
            if (rgs[0].start > 7)
            {
                return null
            }
        }
        return (m != null ? m[1] : undefined)
    }

    index_utils["postNameInLine"] = function (line)
    {
        var m, rgs

        if (m = line.match(this.postRegExp))
        {
            rgs = matchr.ranges(this.postRegExp,line)
        }
        return (m != null ? m[1] : undefined)
    }

    index_utils["testWord"] = function (word)
    {
        if (word.length < 3)
        {
            return false
        }
        else if (_k_.in(word[0],['-',"#"]))
        {
            return false
        }
        else if (word[word.length - 1] === '-')
        {
            return false
        }
        else if (word[0] === '_' && word.length < 4)
        {
            return false
        }
        else if (/^[0\_\-\@\#]+$/.test(word))
        {
            return false
        }
        else if (/\d/.test(word))
        {
            return false
        }
        else
        {
            return true
        }
    }

    return index_utils
})()

export default index_utils;