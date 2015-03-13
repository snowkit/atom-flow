
module.exports = {
    flow_default_target:{
        title: 'Default build target',
        description: 'Configure the default build target. Blank means the current user platform.',
        type: 'string',
        default: ''
    },

    debug_logging: {
        title:'Debug Logging',
        description: 'Enable to get more in depth logging for debugging problems with the package',
        type: 'boolean',
        default:'false'
    }
    
}
