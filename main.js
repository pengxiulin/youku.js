var jsdom = require('jsdom');
var window = jsdom.jsdom().createWindow();
var $ = require('jquery')(window);
var http = require('http');
var fs = require('fs');

var playBill = [];
var playBillItem = {
    name : "一席",
    url : "http://www.youku.com/show_page/id_z2c9b63e691e611e2b356.html",
    cover : "http://r1.ykimg.com/050E000051C3B7C9670C4A55110D5555"
};
playBill.push(playBillItem);

var sources = {
    path : "source.txt",
    readContent : function(){
        // TODO 从网络文件读取URL地址
        this.contents = playBill;
    },
    contents : playBill
};
var getLink = function(){
    var videoItem = {
        name :"张帆《一个节日的诞生》",
        url : "",
        cover : ""
    };
    return [];
};
var set = [];
var util = {};
util.net = {
    get : function(url,callback){
    }
};
util.youku = {
    getIdByURL : function(url){
        return url.slice(34,-5);
    },
    getListInfo : function(listId){
        // XXX This should be cached!!!
        var playBillItem = {
            name : "一席",
            url : "http://www.youku.com/show_page/id_" + listId + ".html",
            cover : "http://r1.ykimg.com/050E000051C3B7C9670C4A55110D5555",
            latest : "全胜《HAYA的传说》(下)",
            description : "听君一席话，胜读十年书。（Get Inspired） 一席鼓励分享见解、体验和对未来的想象，做有价值的传播。每月会邀请各领域有故事、有智识的讲者在一席的讲台上与大家分享，人文、科技、白日梦。一席现场在北京、上海、香港等城市轮流举办。"
        };
        return playBillItem;
    },
    // 获取所有节目播放地址
    getAllList : function(id){
        var amounts = 125;
        var getContent = function(options){
            var html = '';
            http.get(options, function(res) {
                res.on('data', function(data) {
                    html += data;
                }).on('end',function(){
                    var dom = $(html);
                    dom.find('ul.item label').each(function(){
                        var _self = $(this);
                        var item = {
                            name : _self.next().attr("title"),
                            label : _self.text(),
                            url : _self.next().attr("href")
                        };
                        set[item.label] = item.url;
                    });
                    if(set.length > amounts){
                        var result = '';
                        for(var i = 1;i <= amounts; i++){
                            result += set[i];
                            result += "\n";
                        }
                        fs.writeFileSync(id+'.txt', result);
                        process.exit();
                    }
                });
            });
        }

        for(var start = 1; start < amounts; start = start + 10){
            var path = "/show_episode/id_" + id + ".html?divid=reload_" + start;
            var options = {
                host: 'www.youku.com',
                port: 80,
                path: path
            };
            getContent(options);
        }

    }
};

var youku = util.youku;
youku.getAllList(youku.getIdByURL("http://www.youku.com/show_page/id_z2c9b63e691e611e2b356.html"));
