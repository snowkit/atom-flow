
        //lib code
var   log  = require('./utils/log')
    , exec = require('child_process').spawn
        //node built in
    , path = require('path')

module.exports = {

    config: require('./flow-config'),

        //project state that's serialized
    project_path: null,
    project_target: null,
        //the project info that isn't serialized
    project_hxml: null,
    project_valid: false,
        //reference to completion service
    haxe_plugin: null,
        //internal
    cmds:[],

//Lifecycle

    activate:function(state) {

        this.init_cmds();

        this.project_valid = false;
        this.project_target = state.project_target;

        log.init();
        log.debug('flow plugin init');

        if(state.project_path) {
            this.set_flow_file(state.project_path);
        }
    },

    deactivate:function() {
        log.dispose();
    },

    serialize:function() {
        return {
            project_path: this.project_path,
            project_target: this.project_target
        }
    },

//Implementation

    fetch_hxml: function() {

        return new Promise(function(resolve, reject){

            var args = [
                'run', 'flow',
                '--project', this.project_path,
                'info', '--hxml'
            ];

            var output = '';
            var process = exec('haxelib', args);

            process.stdout.on('data', function(data){
                output += data.toString('utf-8');
            });

            process.stdout.on('close', function(code){
                if(code) {
                    log.error('flow info failed with error code' + code);
                    reject();
                } else {
                    log.success('flow info updated for ' + this.project_path);
                    resolve(output);
                }
            }.bind(this));

        }.bind(this)); //promise

    }, //fetch_hxml

    update_hxml: function() {

        log.debug('begin: updating project hxml');

        var cwd = path.dirname(this.project_path);
        var hxml = this.fetch_hxml();

        hxml.then(function(hxml_string){

            this.project_hxml = hxml_string;

            this.haxe_plugin.set_completion_state({
                hxml_content: this.project_hxml,
                hxml_cwd: cwd
            });

            log.debug('end: updating project hxml');

        }.bind(this));

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

        this.project_path = project_path;
        this.update_hxml();

    }, //set_flow_file

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
