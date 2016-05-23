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
        dom.listBtn = $('.menu-left .js-list-btn');
        dom.arrow = $('.js-arrow');
        dom.listItem = $('.list-group-item')
    },
    bindEvent: function() {
        var dom = this.dom;
        dom.listBtn.click(function(){
            $(this).next().slideToggle();
            dom.arrow.toggleClass('reverse');
            return false;
        });
        dom.listItem.click(function(){
            dom.listItem.removeClass('active');
            $(this).addClass('active');
        })
    }
};
