var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var misc

import kxk from "../../../kxk.js"
let kutil = kxk.kutil
let kseg = kxk.kseg

import belt from "./belt.js"


misc = (function ()
{
    function misc ()
    {}

    misc["prepareWordsForCompletion"] = function (before, turd, words)
    {
        var beforeTurd, end, filtered, push, segl, segls, strs, subw, tc, w

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
                console.log(`■ ${w} ${before} ${turd}`)
                filtered.push(w)
                continue
            }
            var list1 = _k_.list(kseg.words(w))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                subw = list1[_b_]
                if (subw.word.startsWith(turd))
                {
                    console.log(`◆ ${w} ${before}`)
                    filtered.push(subw.word)
                }
                else if (turd.length === 1 && turd === w[subw.index - 1])
                {
                    if (turd !== '.')
                    {
                        console.log(`○ ${w} ${before}`)
                        filtered.push(turd.slice(-1)[0] + subw.word)
                    }
                    else
                    {
                    }
                    if (/\d+\./.test(before) && /\d+/.test(subw.word))
                    {
                        if (w.startsWith(before))
                        {
                            console.log(`✔ ${w} ${before}`)
                            filtered.push(turd.slice(-1)[0] + subw.word)
                        }
                    }
                    else if (!/\d+\./.test(before) && !/\d+/.test(subw.word))
                    {
                        console.log(`▴ ${w} ${before}`)
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
            if (kseg.headCountTurd(s.slice(turd.length)))
            {
                if (!(_k_.in(s[turd.length],'([{')))
                {
                    console.log(`✘ ${kseg.str(s.slice(0, turd.length + 1))} ${before} |${s[turd.length]}|`)
                    segls.push(s.slice(0, turd.length + 1))
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

    return misc
})()

export default misc;