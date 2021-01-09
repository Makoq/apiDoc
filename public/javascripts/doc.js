var BASE_URL = "./";
var contentItem = {
    "api" : new ContentItem("#js-api"),
    "examples" : new ContentItem("#js-examples"),
    "serviceContainer": new ContentItem("#js-serviceContainer"),
    "quickStart" : new ContentItem("#js-quickStart")
};
var timer = null;

$(init);

function init(){
    bind();
    //页面加载完毕后，默认选中第一个二级菜单项
    $("#js-menu > ul").first().children(".menu-ul-item").first().click();
}

function bind(){
    var oMenu = $("#js-menu");
    window.onscroll = setMenuPos;
    //一级菜单下有二级菜单，展开或关闭二级菜单
    oMenu.on("click", ".main-menu-p", function(){
        $(this).toggleClass("on");
        $(this).next().slideToggle();
    });
    //一级菜单下没有二级菜单，更新右侧显示
    oMenu.on("click", ".main-menu-p-noSub", function(){
        if($(this).hasClass("selected")){
            return;
        }

        oMenu.find("li.selected, p.selected").removeClass("selected");
        $(this).addClass("selected");
        //更新右侧显示
        contentItem[$(this).attr("data-category")].showLoading();
        contentItem[$(this).attr("data-category")].render();
    });
    //选中一个二级菜单
    oMenu.on("click", ".menu-ul-item", function(){
        if($(this).hasClass("selected")){
            return;
        }

        oMenu.find("li.selected, p.selected").removeClass("selected");
        var oLi = $(this);
        var oP = $(this).parent().prev();
        oLi.addClass("selected");
        oP.addClass("selected");
        //更新右侧显示
        var category = oP.attr("data-category");
        contentItem[category].showLoading();
        if(category == "api"){
            contentItem[category].render(oLi.attr("data-fullTitle"), oLi.attr("data-file"), oLi.attr("data-ext"));
        }
        else{
            contentItem[category].show();
        }
    });
}

function ContentItem(selector, render){
    this.dom = $(selector);
}

ContentItem.prototype.loadingDom = $("#js-loading");

//显示加载层
ContentItem.prototype.showLoading = function(){
    backToTop();
    this.dom.siblings().hide();
    this.loadingDom.show();
}

//显示当前层
ContentItem.prototype.show = function(){
    var _this = this;
    this.loadingDom.fadeOut("fast", function(){
        _this.dom.show();
    });
}

//加载失败
ContentItem.prototype.renderErr = function(xhr, status, error){
    console.log(status, error);
    this.dom.html("<h1 class='caption'>Not found</h1>");
    this.show();
}

//渲染API部分的内容
contentItem.api.render = function(fullTitle, file, ext){
    var _this = this;
    if(file.indexOf("ejs") >= 0){
        $.ajax({
            "type": "get",
            "url": BASE_URL + "doc_file/" + file,
            "success": function(res){
                _this.dom.html(res);
                _this.show();
            },
            "error": function(xhr, status, error){
                _this.renderErr(xhr, stutus, error);
            }
        });
        return;
    }
    $.ajax({
        "type" : "get",
        "url" : BASE_URL + "doc_file/" + file,
        "success" : function(fileData){
            $.ajax({
                "type" : "get",
                "url" : BASE_URL + "doc_file/" + ext,
                "success" : function(extData){
                    var chunk = parseExtFile(extData);
                    var arr = [];
                    arr.push("<h1 class='caption'>" + fullTitle + "</h1>");
                    fileData.forEach(function(item){
                        arr.push("<div class='markdown'>");
                        arr.push("<h2 class='markdown-title'>");
                        arr.push("<span class='markdown-return'>" + item.ReturnType + "</span>&nbsp;&nbsp;&nbsp;");
                        arr.push("<span>" + item.Name + "</span>");
                        arr.push("</h2>");
                        arr.push("<ul>");
                        arr.push("<li>Description : " + item.Description + "</li>");
                        if(item.URL!=undefined){
                            arr.push("<li >URL : <strong style='color:blue'>" + item.URL + "</strong></li>");

                        }

                        if(item.Method!=undefined){
                            arr.push("<li >Method : " + item.Method + "</li>");

                        }
                        if(item.Headers!=undefined){
                            arr.push("<li >Headers : " + item.Headers + "</li>");

                        }

                        if(item.Params.length){
                            arr.push("<li><p>Parameters : </p>");
                            arr.push("<ul class='markdown-paramList'>");
                            item.Params.forEach(function(p){
                                arr.push("<li><span>" + p.Name + "</span>&nbsp;&nbsp;<span>" + p.Type + "</span>&nbsp;&nbsp;<span>" + p.Description + "</span></li>");
                            });
                            arr.push("</ul>");
                        }
                        arr.push("<li>Return : <span class='markdown-return'>" + item.ReturnType + "</span>&nbsp;&nbsp;<span>" + item.Return + "</span></li>");
                        if(item.Note){
                            arr.push("<li><b>*Note : </b><span>" + item.Note + "</span></li>");
                        }
                        if(item.Example){
                            arr.push("<li><span>Example : </span><pre class='markdown-pre'><code>");
                            arr.push(chunk[item.Example]);
                            arr.push("</code></pre>");
                            arr.push("</li>");
                        }
                        if(item.Request){
                            arr.push("<li><span>Request : </span><pre class='markdown-pre'><code>");
                            arr.push(chunk[item.Request]);
                            arr.push("</code></pre>");
                            arr.push("</li>");
                        }
                        if(item.Response){
                            arr.push("<li><span>Response : </span><pre class='markdown-pre'><code>");
                            arr.push(chunk[item.Response]);
                            arr.push("</code></pre>");
                            arr.push("</li>");
                        }
                        arr.push("</ul>");
                        arr.push("</div>");
                    });

                    _this.dom.html(arr.join(""));
                    _this.show();
                },
                "error" : function(xhr, status, error){
                    _this.renderErr(xhr, status, error);
                }
            });
        },
        "error" : function(xhr, status, error){
            _this.renderErr(xhr, status, error);
        }
    });
}

//格式化 extended file
function parseExtFile(stream){
    if (stream.length == 0 || stream.trim() == ""){
        return [];
    }
    
    var name = "";
    var chunk = {};
    var lines = stream.split("\r\n");
    for(var i = 0; i < lines.length; i++){
        if(lines[i] == "" || lines[i].startsWith('#')){
            continue;
        }
        else if(lines[i].startsWith("!!")){
            name = lines[i].replace("!!", "");
            chunk[name] = "";
        }
        else{
            chunk[name] += lines[i] + "\r\n"
        }
    }
    
    return chunk;
}

//渲染examples部分的内容
contentItem.examples.render = function(){

}

//渲染serviceContainer部分的内容
contentItem.serviceContainer.render = function(){
    var _this = this;
    $.ajax({
        "type": "get",
        "url": BASE_URL + "doc_file/serviceContainer/serviceContainer.ejs",
        "success": function(res){
            _this.dom.html(res);
            _this.show();
        },
        "error": function(xhr, status, error){
            _this.renderErr(xhr, status, error);
        }
    });
}

//渲染quickStart部分的内容
contentItem.quickStart.render = function(){
    this.dom.html("<h1 class='caption'>Sorry, this page is under development.</h1>");
    this.show();
}

//设置菜单位置
function setMenuPos(){
    if(timer){
        clearTimeout(timer);
    }

    timer = setTimeout(function(){
        var st = $(document.documentElement).scrollTop();
        var oMenu = $("#js-menu");
        var isTop = oMenu.hasClass("main-menu-top");
        if(st < 80 && isTop){
            oMenu.removeClass("main-menu-top");
        }
        if(st > 80 && !isTop){
            oMenu.addClass("main-menu-top");
        }
    }, 50);
}

//回到顶部
function backToTop(){
    $(document.documentElement).scrollTop(0);
}