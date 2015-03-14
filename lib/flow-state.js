var   log = require('./utils/log')

module.exports = {

    project_path: null,
    target: null,
    system: null,
    is_consumer:false,

    flags: {
        debug: false,
        verbose: false,
        build_only: false,
        launch_only: false
    },

    init:function(state) {

        this.system = this.get_system();
        this.project_path = state.project_path;
        this.target = state.target;
        this.is_consumer = state.is_consumer;

        if(state.flags) {
            this.flags.debug = state.flags.debug;
            this.flags.verbose = state.flags.verbose;
            this.flags.build_only = state.flags.build_only;
            this.flags.launch_only = state.flags.launch_only;
        }

        log.debug('state:' + JSON.stringify(this));

    },

    get_system:function() {
        var s = process.platform;
        switch(s) {
            case 'darwin': return 'mac'; break;
            case 'linux': return 'linux'; break;
            case 'win32': return 'windows'; break;
        }
        return 'unknown';
    },


} //module.exports
