
var stylus = require('stylus')
var pug    = require('pug')

module.exports.stylus = (s) => { return stylus.render(s) }
module.exports.pug    = (s) => { return pug.render(s, { pretty: true }) } 

