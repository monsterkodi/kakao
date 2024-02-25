// monsterkodi/kode 0.256.0

var _k_

var os


os = (function ()
{
    function os ()
    {}

    os["homedir"] = function ()
    {
        return '/Users/kodi'
    }

    os["platform"] = 'Darwin'
    os["isMac"] = os.platform === 'Darwin'
    return os
})()

export default os;