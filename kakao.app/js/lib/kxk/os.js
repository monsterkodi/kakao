// monsterkodi/kode 0.252.0

var _k_

var os


os = (function ()
{
    function os ()
    {}

    os["homedir"] = function ()
    {
        return require('os').homedir()
    }

    os["platform"] = 'Darwin'
    os["isMac"] = os.platform === 'Darwin'
    return os
})()

export default os;