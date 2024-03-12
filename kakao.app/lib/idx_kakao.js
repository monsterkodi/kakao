
import _stylus from 'stylus'
import _pug    from 'pug'

let stylus = (s) => { return _stylus.render(s) }
let pug    = (s) => { return _pug.render(s, { pretty: true }) } 

export default { stylus, pug }

