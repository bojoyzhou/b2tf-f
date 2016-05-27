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
        uid: 2,
        img: []
    },
    dom: {},
    init: function(param) {
        this.initParams(param);
        this.initDom();
        this.bindEvent();
    },
    initParams: function(param) {
        param = param || {};
        this.config = $.extend(this.config, param);
    },
    initImport: function() {
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
            var fragment = template('tpl-posts-item', {
                list: list
            });
            $('.js-posts').append(fragment);
        }, 'json')
    },
    initCommon: function(id) {
        var dom = this.dom;
        $.get('/api/pluginpager', {
            stype: id
        }, function(html) {
            $('.js-plugin-body').append(html);
        }, 'html');
    },
    initImage: function() {
        // $.get(api)
    },
    initDom: function() {
        var dom = this.dom;
        dom.document = $(document.body);
        dom.btnImport = $('.js-btn-import');
        dom.btnCommon = $('.js-btn-common');
        dom.btnImage = $('.js-btn-image');
        dom.center = $('.js-center');
        dom.posts = $('.js-posts');
        dom.import = $('#import');
        dom.importUrl = $('#importUrl');
        setTimeout(function() {
            dom.btnImport.trigger('click');
        });
    },
    bindEvent: function() {
        var dom = this.dom;
        var editor = this.config.editor;
        var uid = this.config.uid;
        var that = this;
        dom.document.on('click', '#import', function() {
            var url = $('#importUrl').val();
            var req = '/api/load-url?url=' + url;
            $.get(req, function(ret) {
                if (ret.ret_code !== 1) {
                    console.log(ret);
                    return;
                }
                editor.execCommand('insertHtml', html(ret.result.content));
            }, 'json');
        });
        dom.document.on('click', '.js-posts li', function() {
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
        });
        dom.document.on('click', '.common .RankEditor', function() {
            var fragment = $(this).html();
            editor.execCommand('insertHtml', fragment);
        });
        dom.btnImport.click(function() {
            dom.center.attr('class', 'center js-center');
            dom.center.addClass('index').html('').append(template('tpl-import'));
            that.initImport();
        });
        dom.btnCommon.click(function() {
            dom.center.attr('class', 'center js-center');
            dom.center.addClass('common').html('').append(template('tpl-common'));
            var id = $(this).data('id');
            that.initCommon(id);
        });
        dom.btnImage.click(function() {
            dom.center.attr('class', 'center js-center');
            dom.center.addClass('images').html('').append(template('tpl-images'));
            var id = $(this).data('id');
            that.initImage();
        });
        dom.document.on('click', '.js-img-add', function() {
            $('.images.mask').show();
        });
        $('#img-file').on('change', this.upload());
        $('#r-img-file').on('change', this.upload(function(ret){
            that.config.postImg = ret.data.url;
        }));
        dom.document.on('click', '.images.mask .confirm', function() {
            that.saveImage();
        });
        dom.document.on('click','#complete',function(){
            var content = editor.getContent();
            var img = that.config.postImg;
            var doc = {
                title:$('#doc-title').val(),
                author: $('#doc-author').val(),
                summary: $('#doc-summary').val(),
                img: img,
                content: content
            };
            console.log(doc);
        })
    },
    saveImage: function() {
        var img = this.config.img;
        var uid = this.config.uid;
        var data = {
            uid: uid,
            imgs: img
        };
        $.post('/api/userpicssave', {
            param: JSON.stringify(data)
        }, function(ret) {
            if (ret.ret_code === 0) {
                that.initImage();
            }
        }, 'json')
    },
    upload: function(cb) {
        return function() {
            var elem = $(this);
            var form = new FormData();
            form.append('file', this.files[0]);

            $.ajax({
                url: 'http://imgs.8zcloud.com/getfiles.php?thumb=100_0',
                type: 'POST',
                data: form,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function(ret) {
                    if (cb) {
                        return cb(ret);
                    }
                    elem.parent().before('<div class="img_fluid"><img src="http://imgs.8zcloud.com/' + ret.data.Ext['100_0'] + '" alt=""></div>');
                    that.config.img.push({
                        img: ret.data.url,
                        img_100: ret.data.Ext['100_0']
                    });
                },
                error: function(returndata) {
                    alert(returndata);
                }
            });
        }
    }
};
