

module.exports = {

    config: require('./flow-config'),
    haxe_plugin: null,
    project_path: null,
    project_hxml: null,

    completion_init: function(haxe_plugin) {
        this.haxe_plugin = haxe_plugin;
    },

    set_flow_file:function( file_path ) {

        // this.haxe_plugin.set_completion_state({
        //     hxml_content: this.project_hxml,
        //     hxml_cwd: this.project_path
        // });

    }, //set_flow_file

} //module.exports
