var _k_

var Bundle


Bundle = (function ()
{
    function Bundle ()
    {}

    Bundle["path"] = window.bundlePath
    Bundle["app"] = function (p)
    {
        return Bundle.path + '/' + p
    }

    Bundle["js"] = function (p)
    {
        return Bundle.path + '/js/' + p
    }

    Bundle["mac"] = function (p)
    {
        return Bundle.path + '/Contents/MacOS/' + p
    }

    Bundle["res"] = function (p)
    {
        return Bundle.path + '/Contents/Resources/' + p
    }

    Bundle["img"] = function (p)
    {
        return Bundle.path + '/Contents/Resources/img/' + p
    }

    return Bundle
})()

export default Bundle;