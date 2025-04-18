var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

class index_hpp
{
    constructor ()
    {
        this.regions = {character:{open:"'",close:"'"},string:{open:'"',close:'"'},bracketArgs:{open:'(',close:')'},bracketSquare:{open:'[',close:']'},codeBlock:{open:'{',close:'}'},blockComment:{open:'/*',close:'*/'},lineComment:{open:'//',close:null}}
        this.classRegExp = /^\s*(\S+\s+)?(enum|enum\s+class|class|struct)\s+/
        this.methodRegExp = /^([\w\&\*]+)\s+(\w+)\s*\(/
        this.constrRegExp = /^(\~?\w+)\s*\(/
        this.topMethRegExp = /^(\w+)\:\:(\w+)\s*\(/
        this.funcRegExp = /^(\w+)\s+(\w+)\s*\(/
    }

    parseLine (lineIndex, lineText)
    {
        var advance, ch, key, lst, match, p, poppedRegion, region, rest, topRegion, topToken, _182_37_, _182_44_, _182_71_, _68_41_, _73_82_, _73_89_

        if (!_k_.empty(this.currentWord))
        {
            this.lastWord = this.currentWord
        }
        this.currentWord = ''
        if (lst = _k_.last(this.tokenStack))
        {
            if (lst.classType && !lst.name)
            {
                if (this.lastWord.startsWith('>'))
                {
                    this.tokenStack.pop()
                }
                else
                {
                    lst.name = this.lastWord
                }
            }
        }
        p = -1
        rest = lineText
        while (p < lineText.length - 1)
        {
            p += 1
            ch = lineText[p]
            advance = function (n)
            {
                if (n > 1)
                {
                    p += n - 1
                }
                return rest = rest.slice(n)
            }
            if (_k_.in(ch,[' ','\t']))
            {
                if (!_k_.empty(this.currentWord))
                {
                    this.lastWord = this.currentWord
                }
                this.currentWord = ''
            }
            else
            {
                this.currentWord += ch
            }
            topToken = _k_.last(this.tokenStack)
            if ((topToken != null ? topToken.classType : undefined))
            {
                if (!topToken.name)
                {
                    if (rest[0] === ':')
                    {
                        topToken.name = this.lastWord
                    }
                }
                if (!(topToken.codeBlock != null ? topToken.codeBlock.start : undefined))
                {
                    if (_k_.in(rest[0],[';','*','&']))
                    {
                        this.tokenStack.pop()
                    }
                }
            }
            else if ((topToken != null ? topToken.method : undefined))
            {
                if (rest[0] === ';' && topToken.args.end && !((topToken.codeBlock != null ? topToken.codeBlock.start : undefined) != null))
                {
                    this.result.funcs.push(topToken)
                    this.tokenStack.pop()
                }
            }
            if (_k_.empty((this.regionStack)) || _k_.last(this.regionStack).region === 'codeBlock')
            {
                if (_k_.empty((this.tokenStack)) || _k_.last(this.tokenStack).classType)
                {
                    if (p === 0 && (match = lineText.match(this.classRegExp)))
                    {
                        this.tokenStack.push({line:lineIndex,col:p,classType:match[1],depth:this.regionStack.length})
                        advance(match[0].length)
                        this.currentWord = ''
                        continue
                    }
                }
                if (_k_.empty((this.tokenStack)))
                {
                    if (_k_.empty(this.regionStack))
                    {
                        if (match = rest.match(this.topMethRegExp))
                        {
                            this.tokenStack.push({line:lineIndex,col:p,class:match[1],method:match[2],depth:0})
                            if (!(_k_.in(match[1],this.result.classes.map(function (ci)
                                {
                                    return ci.name
                                }))))
                            {
                                this.result.classes.push({line:lineIndex,col:p,name:match[1]})
                            }
                        }
                        else if (match = rest.match(this.funcRegExp))
                        {
                            this.tokenStack.push({line:lineIndex,col:p,method:match[2],name:match[2],depth:0,static:true})
                        }
                    }
                }
                else if (_k_.last(this.tokenStack).classType)
                {
                    if (match = rest.match(this.methodRegExp))
                    {
                        this.tokenStack.push({line:lineIndex,col:p,method:match[2],depth:this.regionStack.length,class:_k_.last(this.tokenStack).name})
                    }
                    else if (match = rest.match(this.constrRegExp))
                    {
                        if (match[1] === _k_.last(this.tokenStack).name || match[1] === '~' + _k_.last(this.tokenStack).name)
                        {
                            this.tokenStack.push({line:lineIndex,col:p,method:match[1],depth:this.regionStack.length,class:_k_.last(this.tokenStack).name})
                        }
                    }
                }
            }
            topRegion = _k_.last(this.regionStack)
            if (_k_.in((topRegion != null ? topRegion.region : undefined),['blockComment','string','character']))
            {
                if (_k_.in(topRegion.region,['string','character']))
                {
                    if (rest.startsWith('\\'))
                    {
                        advance(2)
                        continue
                    }
                }
                if (!rest.startsWith(this.regions[topRegion.region].close))
                {
                    advance(1)
                    continue
                }
            }
            for (key in this.regions)
            {
                region = this.regions[key]
                if (rest.startsWith(region.open) && (!topRegion || region.open !== region.close || topRegion.region !== key))
                {
                    if ((topToken != null) && key === 'codeBlock' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
                    {
                        topToken.codeBlock = {start:{line:lineIndex,col:p}}
                    }
                    if ((topToken != null ? topToken.method : undefined) && !topToken.args && key === 'bracketArgs' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
                    {
                        topToken.args = {start:{line:lineIndex,col:p}}
                    }
                    if (key === 'lineComment')
                    {
                        return
                    }
                    this.regionStack.push({line:lineIndex,col:p,region:key})
                    break
                }
                else if (region.close && rest.startsWith(region.close))
                {
                    poppedRegion = this.regionStack.pop()
                    if ((topToken != null) && key === 'codeBlock' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
                    {
                        topToken.codeBlock.end = {line:lineIndex,col:p}
                        this.tokenStack.pop()
                        if (topToken.classType)
                        {
                            this.result.classes.push(topToken)
                        }
                        else
                        {
                            this.result.funcs.push(topToken)
                        }
                    }
                    if (((topToken != null ? (_182_37_=topToken.args) != null ? _182_37_.start : undefined : undefined) != null) && !(topToken.args.end != null) && key === 'bracketArgs' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
                    {
                        topToken.args.end = {line:lineIndex,col:p}
                    }
                    break
                }
            }
            advance(1)
        }
        return true
    }

    parse (text)
    {
        var ch, lineEnd, lineIndex, lineStart, lineText, p

        this.escapes = 0
        this.regionStack = []
        this.tokenStack = []
        this.lastWord = ''
        this.currentWord = ''
        this.result = {classes:[],funcs:[]}
        lineStart = 0
        lineEnd = 0
        lineIndex = 0
        lineText = ''
        p = -1
        while (p < text.length - 1)
        {
            p += 1
            ch = text[p]
            if (ch === '\n')
            {
                this.parseLine(lineIndex,lineText)
                lineIndex += 1
                lineText = ''
            }
            else
            {
                lineEnd += 1
                lineText += ch
            }
        }
        this.parseLine(lineIndex,lineText)
        return this.result
    }
}

export default index_hpp;