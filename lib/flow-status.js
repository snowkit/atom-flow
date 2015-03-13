var   views = require('atom-space-pen-views')
    , SelectListView = views.SelectListView
    , extend = require('./utils/extend')


function FlowStatus() {
    FlowStatus.__super__.constructor.apply(this, arguments);

    this.items = [
        { tag:'flow', text:'flow file', desc:'none set' },
        { tag:'target', text:'flow target', desc:'default' },
        { tag:'debug', text:'Toggle debug build', desc:'currently: false' },
        { tag:'verbose', text:'Toggle verbose build', desc:'currently: false' },
        { tag:'build-only', text:'Toggle build only', desc:'currently: false' },
        { tag:'launch-only', text:'Toggle launch only', desc:'currently: false' }
    ];

    this.index_map = {};
    for(var i = 0; i < this.items.length; ++i) {
        this.index_map[this.items[i].tag] = i;
    }

}


extend(FlowStatus, SelectListView);


FlowStatus.prototype.update_flag = function(tag, state) {
    var index = this.index_map[tag];
    var flag = this.items[index];
    flag.desc = 'currently: ' + state;
}

FlowStatus.prototype.update_flow_file = function(filename) {
    var index = this.index_map['flow'];
    var item = this.items[index];
    item.desc = filename;
}

FlowStatus.prototype.update_target = function(targetname) {
    var index = this.index_map['target'];
    var item = this.items[index];
    item.desc = targetname;
}

FlowStatus.prototype.show = function() {

    this.panel = atom.workspace.addModalPanel({item: this});
    this.panel.show();
    this.storeFocusedElement();

    this.setItems(this.items);

    this.focusFilterEditor();

}

FlowStatus.prototype.cancelled = function() {
    this.hide();
}

FlowStatus.prototype.hide = function() {
    this.panel.hide();
}

FlowStatus.prototype.viewForItem = function(item) {

     var res = '<li class="two-lines">';
         res += '<div class="primary-line">'+item.text+'</div>';
         res += '<div class="secondary-line">'+item.desc+'</div>';
         res += '</li>';

     return res;
}

FlowStatus.prototype.confirmed = function(item) {
   console.log(item, "was selected")
   this.cancel();
}


module.exports = FlowStatus;
