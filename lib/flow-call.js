
//The calls within this module will use the flow state
// that is current, unless called .flow directly with your
// own arguments. The rest will assume the current state.

var   exec = require('./utils/exec')
    , state = require('./flow-state')


module.exports = {

    flow: function(args) {
        var pre_args = ['run','flow'];
        return exec('haxelib', pre_args.concat(args));
    },

    info: function() {
        return this.flow([
            '--project', state.project_path,
            'info'
        ]);
    },

    hxml: function() {
        return this.flow([
            '--project', state.project_path,
            'info', '--hxml'
        ]);
    },

} //module.exports
