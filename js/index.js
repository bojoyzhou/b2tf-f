function html(content) {
    var container = $('<div>')
    content.forEach(function(data) {
        if (data.text) {
            container.append($('<p>').append(data.text))
        } else if (data.img) {
            var img = new Image();
            img.src = data.img;
            container.append(img);
        }
    });
    return container.html();
}
var index = {
    config: {
        editor: null,
        uid: 2
    },
    dom: {},
    init: function(param) {
        this.initParams(param);
        this.initData();
        this.initDom();
        this.bindEvent();
    },
    initParams: function(param) {
        param = param || {};
        this.config = $.extend(this.config, param);
    },
    initData: function() {
        var uid = this.config.uid
        $.get('/api/collectpager', {
            uid: uid
        }, function(ret) {
            if (ret.ret_code !== 0) {
                console.log(ret);
                return;
            }
            var list = [];
            ret.list.forEach(function(item) {
                list.push({
                    title: item.title,
                    summary: $('<div>').append(item.summary).text(),
                    author: item.author,
                    date: item.sendtime,
                    id: item.id
                });
            })
            var fragment = template('posts-item', {
                list: list
            });
            $('#posts-item').parent().append(fragment);
        }, 'json')
    },
    initDom: function() {
        var dom = this.dom;
        dom.import = $('#import');
        dom.importUrl = $('#importUrl');
        dom.posts = $('.js-posts');
    },
    bindEvent: function() {
        var dom = this.dom;
        var editor = this.config.editor;
        var uid = this.config.uid;
        dom.import.click(function() {
            var url = dom.importUrl.val();
            var req = '/api/load-url?url=' + url;
            $.get(req, function(ret) {
                if (ret.ret_code !== 1) {
                    console.log(ret);
                    return;
                }
                editor.execCommand('insertHtml', html(ret.result.content));
            }, 'json');
        });
        dom.posts.on('click', 'li', function() {
            var id = $(this).data('id');
            $.get('http://www.8zcloud.com/api/collectsingle', {
                uid: uid,
                docid: id
            }, function(ret) {
                if (ret.ret_code !== 0) {
                    console.log(ret);
                    return;
                }
                var content = ret.list[0].content;
                editor.execCommand('insertHtml', content);
            }, 'json');
            return false;
        })
    }
};
