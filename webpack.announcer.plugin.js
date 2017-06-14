/* webpack.announcer.plugin.js */
const exec = require('child_process').exec;
const Speaker = require('Speaker')
const lame = require('lame');
const getTTS = require('./getTTS')
const fs = require('fs')

//const voice = 'Agnes';
//const message = 'done';
//const doneSound = `say -v ${voice} "${message}"`; // MacOS.
//const doneSound = `echo ${message} | ptts`;  // windows.

function AnnouncerPlugin(options) {
   // customize.
}

AnnouncerPlugin.prototype.apply = (compiler) => {
    compiler.plugin('done', () => {
        //exec(doneSound);
        getTTS({text:'陈皮尔超胖的',spd:6,lan:'zh'},function(f){
          var stream = fs.createReadStream('ninja.mp3')
          var decoder = new lame.Decoder()
          stream.pipe(decoder).on('format', function(format) {
              var speaker = new Speaker(format)
              this.pipe(speaker)
          })
        })
    });
};
module.exports = AnnouncerPlugin;
