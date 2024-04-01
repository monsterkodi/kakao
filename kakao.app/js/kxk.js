var _k_

var k, toExport, v

import dom from "./kxk/dom.js"
import elem from "./kxk/elem.js"
import post from "./kxk/post.js"
import drag from "./kxk/drag.js"
import slash from "./kxk/slash.js"
import stash from "./kxk/stash.js"
import store from "./kxk/store.js"
import prefs from "./kxk/prefs.js"
import matchr from "./kxk/matchr.js"
import keyinfo from "./kxk/keyinfo.js"
import tooltip from "./kxk/tooltip.js"
import events from "./kxk/events.js"
import popup from "./kxk/popup.js"
import kstr from "./kxk/kstr.js"
import kpos from "./kxk/kpos.js"
import util from "./kxk/util.js"
import sds from "./kxk/sds.js"
import ffs from "./kxk/ffs.js"
import noon from "./kxk/noon.js"

toExport = {drag:drag,elem:elem,events:events,ffs:ffs,keyinfo:keyinfo,kpos:kpos,kstr:kstr,matchr:matchr,noon:noon,popup:popup,post:post,prefs:prefs,sds:sds,slash:slash,stash:stash,store:store,tooltip:tooltip,util:util,dom:dom,$:dom.$,setStyle:dom.setStyle,getStyle:dom.getStyle,stopEvent:dom.stopEvent,isElement:elem.isElement}
for (k in util)
{
    v = util[k]
    toExport[k] = v
}
export default toExport;