var index = {
    config: {
        editor: null
    },
    dom: {},
    init: function(param) {
        this.initParams(param);
        this.initDom();
        this.bindEvent();
    },
    initParams: function(param) {
        param = param = {};
        this.config = $.extend(this.config, param);
    },
    initDom: function() {
        var dom = this.dom;
        dom.import = $('#import');
        dom.importUrl = $('#importUrl');
    },
    bindEvent: function() {
        var dom = this.dom;
        dom.import.click(function() {
            var url = dom.importUrl.val();
            var req = 'http://www.8zcloud.com/api/load-url';
            $.get(req, {
                url: url
            }, function(ret){
                console.log(ret);
            }, 'json');
        });
    }
};
