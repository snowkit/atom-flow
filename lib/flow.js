
        //lib code
var   log  = require('./utils/log')
    , state = require('./flow-state')
    , flow = require('./flow-call')
    , StatusView = require('./flow-status')
        //node built in
    , path = require('path')

module.exports = {

    config: require('./flow-config'),

        //the project info that isn't serialized
    project_hxml: null,
    project_valid: false,
        //reference to completion service
    haxe_plugin: null,
        //internal
    cmds:[],

//Lifecycle

    activate:function(serialized_state) {

        this.init_cmds();
        this.project_valid = false;

        log.init();
        log.debug('flow plugin init');
        state.init(serialized_state);

        this.status = new StatusView(this);

        if(state.project_path && state.is_consumer) {
            this.set_flow_file(state.project_path);
        }

    },

    deactivate:function() {
        log.dispose();
    },

    serialize:function() {
        return state;
    },

//Implementation

    fetch_hxml: function() {

        return new Promise(function(resolve, reject){

            var fetch = flow.hxml();

            fetch.then(function(res) {
                log.success('flow info updated for ' + state.project_path);
                resolve( res.out );
            });

        });

    }, //fetch_hxml

    update_hxml: function() {

        log.debug('begin: updating project hxml');

        var cwd = path.dirname(state.project_path);
        var hxml = this.fetch_hxml();

        hxml.then(function(hxml_string){

            this.project_hxml = hxml_string;

            state.is_consumer = this.haxe_plugin.set_completion_consumer({
                name: 'flow',
                onConsumerLost: this.consumer_lost.bind(this),
                hxml_content: this.project_hxml,
                hxml_cwd: cwd
            });

            log.debug('end: updating project hxml');

        }.bind(this));

    },

    consumer_lost:function() {
        log.debug('flow / lost consumer state to haxe plugin. Re-set a flow project to make it active.');
        state.is_consumer = false;
    },

    invalidate:function(reason) {
        this.project_valid = false;
        log.error(reason);
    },

//Services

    completion_hook: function(haxe_plugin) {
        this.haxe_plugin = haxe_plugin;
    },

//API

    set_flow_file:function( project_path ) {

        if(!project_path) {
            return this.invalidate('flow file set to invalid path (given:`'+file_path+'`)');
        }

        log.debug('set: flow file / ' + project_path);

        state.project_path = project_path;
        this.update_hxml();
        this.status.update_flow_file(state.project_path);

    }, //set_flow_file

    set_target:function( target ) {

        log.debug('set: flow target / ' + target);

        state.target = target;
        this.update_hxml();
        this.status.update_target(state.target);

    }, //set_target

//Commands

    status: function() {
        this.status.show();
    },

    target: function() {
        this.status.show(true);
    },

    set_flow_file_from_treeview: function() {
        var treeview = atom.packages.getLoadedPackage('tree-view')
            treeview = require(treeview.mainModulePath)
        var package_obj = treeview.serialize();
        var file_path = package_obj.selectedPath

        this.set_flow_file( file_path );
    },

//Internal conveniences

    init_cmds:function() {
        this._add_command('set-flow-file', this.set_flow_file_from_treeview.bind(this) );
        this._add_command('status', this.status.bind(this) );
        this._add_command('set-target', this.target.bind(this) );
        this._add_command('toggle-log-view', log.toggle.bind(log) );
    },

    _destroy_commands:function() {
        for(var i = 0; i < this.cmds.length; ++i) {
            atom.commands.remove(this.cmds[i]);
        }
    },

    _add_command:function(name, func) {
        var cmd = atom.commands.add('atom-workspace', 'flow:'+name, func);
        this.cmds.push(cmd);
        return cmd;
    }
} //module.exports
