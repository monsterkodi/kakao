var toExport = {}
// monsterkodi/kakao 0.1.0

var _k_

var __filename

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

__filename = import.meta.filename
toExport["use"] = function ()
{
    compare(kc('use blark'),'import blark from "blark"\n')
    compare(kc('use flubb',__filename),'import flubb from "flubb"\n')
    compare(kc('use ./loops',__filename),'import loops from "./loops.js"\n')
    compare(kc('use ../returner',__filename),'import returner from "../returner.js"\n')
    compare(kc('use ./kode/kode',__filename),'import kode from "./kode/kode.js"\n')
    compare(kc('use ./loops'),'import loops from "./loops.js"\n')
    compare(kc('use ../returner'),'import returner from "../returner.js"\n')
    compare(kc('use ./kode/kode'),'import kode from "./kode/kode.js"\n')
    compare(kc('use ./noon'),'import noon from "./noon.js"\n')
    compare(kc('use mod1 mod2'),`import mod1 from "mod1"
import mod2 from "mod2"\n`)
    compare(kc('use mod3 mod4',__filename),`import mod3 from "mod3"
import mod4 from "mod4"\n`)
    compare(kc(`use mod5
use ./mod6
use mod7`),`import mod5 from "mod5"\n
import mod6 from "./mod6.js"\n
import mod7 from "mod7"\n`)
    section("items", function ()
    {
        compare(kc('use ./kxk ▪ slash noon'),`import kxk from "./kxk.js"
let slash = kxk.slash
let noon = kxk.noon
`)
        compare(kc('use ./lib_ko ▪ moment immutable fuzzy pbytes '),`import lib_ko from "./lib_ko.js"
let moment = lib_ko.moment
let immutable = lib_ko.immutable
let fuzzy = lib_ko.fuzzy
let pbytes = lib_ko.pbytes
`)
    })
}
toExport["use"]._section_ = true
toExport._test_ = true
export default toExport
