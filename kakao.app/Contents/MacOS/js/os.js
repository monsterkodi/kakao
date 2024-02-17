// monsterkodi/kode 0.249.0

var _k_

var os


os = (function ()
{
    function os ()
    {}

    os["platform"] = 'Darwin'
    os["isMac"] = os.platform === 'Darwin'
    return os
})()

export default os;