var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var k, specs, v, _32_29_


specs = (function ()
{
    function specs ()
    {}

    specs["info"] = {"○":{trigger:'~',id:'o'},"▪":{trigger:'~',id:'s'},"◆":{trigger:'~',id:'d'},"▸":{trigger:'~',id:'>'},"▾":{trigger:'~',id:'v'},"▴":{trigger:'~',id:'^'},"◂":{trigger:'~',id:'<'},"✔":{trigger:'~',id:'O'},"✘":{trigger:'~',id:'X'},"●":{trigger:'~',id:'c'},"■":{trigger:'~',id:'S'},"⮐":{trigger:'r',insert:'⮐  '},"➜":{trigger:'t',insert:'➜ '}}
    specs["trigger"] = {}
    specs["inserts"] = {}
    return specs
})()

for (k in specs.info)
{
    v = specs.info[k]
    if (_k_.empty(v.insert))
    {
        v.insert = k
    }
    specs.trigger[v.trigger] = ((_32_29_=specs.trigger[v.trigger]) != null ? _32_29_ : [])
    specs.trigger[v.trigger].push(v.insert)
    specs.inserts[v.insert] = k
}
export default specs;