// monsterkodi/kode 0.249.0

var _k_

var Bundle


Bundle = (function ()
{
    function Bundle ()
    {}

    Bundle["path"] = '?'
    Bundle["app"] = function (p)
    {
        return Bundle.path + '/' + p
    }

    Bundle["js"] = function (p)
    {
        return Bundle.path + '/Contents/MacOS/js/' + p
    }

    Bundle["macOS"] = function (p)
    {
        return Bundle.path + '/Contents/MacOS/' + p
    }

    Bundle["resource"] = function (p)
    {
        return Bundle.path + '/Contents/Resources/' + p
    }

    return Bundle
})()

export default Bundle;