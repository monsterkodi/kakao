var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var misc

import kxk from "../../../kxk.js"
let kutil = kxk.kutil
let kseg = kxk.kseg

import pepe from "../../../kxk/pepe.js"

import belt from "./belt.js"


misc = (function ()
{
    function misc ()
    {}

    misc["prepareWordsForCompletion"] = function (before, turd, words)
    {
        var balanced, beforeTurd, end, filtered, fix, fst, idx, lst, p, push, rwd, segl, segls, strs, subw, tc, w, wds

        filtered = []
        var list = _k_.list(words)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            w = list[_a_]
            if (w.startsWith(turd))
            {
                if (w.startsWith('..'))
                {
                    continue
                }
                if (w.startsWith('./'))
                {
                    continue
                }
                if (/\d+\.\d+/.test(w) && !w.startsWith(before))
                {
                    continue
                }
                p = pepe(w)
                if (p.unbalanced || p.mismatch)
                {
                    if (w.endsWith(p.tail) && p.mismatch)
                    {
                        fix = p.mismatch[0].content[0]
                        filtered.push(fix)
                        if (!_k_.empty((wds = kseg.words(fix))))
                        {
                            fst = fix.slice(0, wds[0].index + wds[0].word.length)
                            if (fst !== fix)
                            {
                                filtered.push(fst)
                            }
                        }
                    }
                    else if (p.unbalanced)
                    {
                        fix = p.unbalanced[0].content[0]
                        filtered.push(fix)
                    }
                    else
                    {
                    }
                    continue
                }
                if (0 <= w.indexOf('\n'))
                {
                    w = w.slice(0, typeof w.indexOf('\n') === 'number' ? w.indexOf('\n') : -1)
                }
                if (!_k_.empty((wds = kseg.words(w))))
                {
                    lst = wds[0].index + wds[0].word.length
                    if (lst < w.length - 1)
                    {
                        if (lst > before.length)
                        {
                            fst = w.slice(0, typeof lst === 'number' ? lst+1 : Infinity)
                            p = pepe(fst)
                            if (!p.unbalanced || p.mismatch)
                            {
                                filtered.push(fst)
                                continue
                            }
                            else
                            {
                                balanced = true
                            }
                        }
                        if (!balanced)
                        {
                            continue
                        }
                    }
                }
                filtered.push(w)
                continue
            }
            wds = kseg.words(w)
            var list1 = _k_.list(wds)
            for (idx = 0; idx < list1.length; idx++)
            {
                subw = list1[idx]
                if (subw.word.startsWith(turd))
                {
                    filtered.push(subw.word)
                    if (idx === wds.length - 1 && subw.index + subw.word.length < w.length - 1)
                    {
                        rwd = w.slice(subw.index)
                        p = pepe(rwd)
                        if (!(p.unbalanced || p.mismatch))
                        {
                            filtered.push(rwd)
                        }
                    }
                }
                else if (turd.length === 1 && turd === w[subw.index - 1])
                {
                    if (turd !== '.')
                    {
                        filtered.push(turd.slice(-1)[0] + subw.word)
                    }
                    else
                    {
                    }
                    if (/\d+\./.test(before) && /\d+/.test(subw.word))
                    {
                        if (w.startsWith(before))
                        {
                            filtered.push(turd.slice(-1)[0] + subw.word)
                        }
                    }
                    else if (!/\d+\./.test(before) && !/\d+/.test(subw.word))
                    {
                        filtered.push(turd.slice(-1)[0] + subw.word)
                    }
                }
            }
        }
        words = kutil.uniq(filtered)
        if (_k_.empty(words))
        {
            return []
        }
        segls = []
        push = function (s)
        {
            var ws

            if (kseg.str(s) === turd)
            {
                return
            }
            ws = kseg.words(s)
            ws = ws.filter(function (w)
            {
                return w.index + w.segl.length > turd.length
            })
            if (!_k_.empty(ws[0]))
            {
                if (ws[0].index === 0 && (turd !== ws[0].word && ws[0].word !== s) && ws[0].word.startsWith(turd))
                {
                    segls.push(ws[0].segl)
                }
            }
            return segls.push(s)
        }
        var list2 = _k_.list(kseg.segls(words))
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            segl = list2[_c_]
            tc = kseg.tailCountTurd(segl)
            if (tc === 0 || tc === 1 && segl[0] === segl.slice(-1)[0])
            {
                push(segl)
            }
            else
            {
                end = kseg.str(segl.slice(segl.length - tc))
                if (_k_.in(end,'])}') || _k_.in(end.slice(-1)[0],')]}') && !(_k_.in(end.slice(-2,-1)[0],',')))
                {
                    push(segl)
                }
                else
                {
                    beforeTurd = segl.slice(0, segl.length - tc)
                    if (!_k_.empty(beforeTurd))
                    {
                        push(segl.slice(0, segl.length - tc))
                    }
                }
            }
        }
        strs = segls.map(kseg.str)
        strs.sort()
        return kutil.uniq(strs)
    }

    misc["isCommentLine"] = function (line)
    {
        var trimmed

        trimmed = kseg.trim(line)
        return trimmed[0] === "#"
    }

    misc["indexOfExtremePositionInDirection"] = function (posl, dir, index)
    {
        var ci, cmp, exi, idx, pos, start

        switch (dir)
        {
            case 'left':
            case 'right':
                ci = 0
                break
            case 'up':
            case 'down':
                ci = 1
                break
        }

        switch (dir)
        {
            case 'left':
            case 'up':
                start = Infinity
                cmp = function (a, b)
                {
                    return a > b
                }
                break
            case 'right':
            case 'down':
                start = -Infinity
                cmp = function (a, b)
                {
                    return a < b
                }
                break
        }

        var list = _k_.list(posl)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            if (cmp(start,pos[ci]))
            {
                start = pos[ci]
                exi = idx
            }
        }
        if (!_k_.empty(index) && !_k_.empty(posl[index]))
        {
            if (posl[exi][ci] === posl[index][ci])
            {
                return index
            }
        }
        return exi
    }

    return misc
})()

export default misc;