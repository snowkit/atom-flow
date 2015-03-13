var   log = require('./utils/log')

module.exports = {

    project_path: null,
    target: null,

    flags: {
        debug: false,
        verbose: false,
        build_only: false,
        launch_only: false
    },

    init:function(state) {

        this.project_path = state.project_path;
        this.target = state.target;

        if(state.flags) {
            this.flags.debug = state.flags.debug;
            this.flags.verbose = state.flags.verbose;
            this.flags.build_only = state.flags.build_only;
            this.flags.launch_only = state.flags.launch_only;
        }

        log.debug('state:' + JSON.stringify(this));

    },


} //module.exports
