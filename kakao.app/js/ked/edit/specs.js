var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var specs, trigger, v, vals


specs = (function ()
{
    function specs ()
    {}

    specs["replex"] = {'~o':'○','~s':'▪','~d':'◆','~>':'▸','~<':'◂','~^':'▴','~v':'▾','~O':'✔','~X':'✘','~c':'●','~S':'■','~B':'█','~r':'⮐ ','~t':'➜'}
    specs["trigger"] = {'~':['○','▸','▾','▴','◂','✔','✘','●','◆','▪','◼','■','█','⮐  ','➜ ','│','─','┬','├','┼','┤','┴','╭','','╰','╮','','╯'],'r':['⮐  '],'t':['➜ ']}
    specs["inserts"] = {}
    return specs
})()

for (trigger in specs.trigger)
{
    vals = specs.trigger[trigger]
    var list = _k_.list(vals)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        v = list[_a_]
        specs.inserts[v] = v
    }
}
export default specs;