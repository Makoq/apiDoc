/**
 * Author : Fengyuan(Franklin) Zhang
 * Date : 2020/9/24
 * Description : make up Doc page by JSON file
 */

//! Parse extended file
function parseExtFile(stream){
    if (stream.length == 0 || stream.trim() == ""){
        return [];
    }
    var lines = stream.split("\r\n");
    var chunks = [];
    for(var i = 0; i < lines.length; i++){
        if(lines[i].startsWith("!!")){
            if (chunk){
                chunk.Buffer = chunk.Buffer.substr(0, chunk.Buffer.length - 2);
                chunks.push(chunk);
            }
            var name = lines[i].replace("!! ", "");
            var chunk = {
                Name : name,
                Buffer : ""
            }
        }
        else{
            if (chunk){
                if (lines[i].trim() != ""){
                    chunk["Buffer"] = chunk["Buffer"] + lines[i] + "\r\n";
                }
            }
        }
    }
    if(chunk){
        chunk.Buffer = chunk.Buffer.substr(0, chunk.Buffer.length - 2);
        chunks.push(chunk);
    }
    return chunks;
}

//! Exapmle index
function getExampleCodes(chunks, name){
    for(var i = 0; i < chunks.length; i++){
        if(chunks[i].Name == name){
            return chunks[i].Buffer;
        }
    }
    return "";
}

//! Request total JSON file
$.ajax({
    url : "../doc_file/total.json",
    success : function(totalJson){
        var count = 0;

        //! closure for return callback
        var returnAPIFunc = function(index, type){
            count ++;
            return function(jsData){
                if(type == 1){
                    totalJson[index]["APIJSON"] = jsData;
                }
                else if(type == 2){
                    totalJson[index]["ExtJSON"] = parseExtFile(jsData);
                }
                count --;
                if (count == 0){
                    //! Load doc information
                    for(var i = 0; i < totalJson.length; i++){
                        $("#js-api").append("<h1 href=\"doc_" + totalJson[i].Abbr + "\" class=\"markdown-title\">" + totalJson[i].Title + "</h1><div id=\"doc_" + totalJson[i].Abbr + "\" ></div>");
                        
                        var jsData = totalJson[i].APIJSON;
                        for(var j = 0; j < jsData.length; j++){
                            $("#doc_" + totalJson[i].Abbr).append("<div class=\"markdown\" >"
                            + "<h2 class=\"markdown-h2\"><span class=\"markdown-return\">" + jsData[j].ReturnType + "</span>&nbsp;&nbsp;" + jsData[j].Name + "</h2>"
                            + "<ul>"
                            + "<li>Description : " + jsData[j].Description + " </li>"
                            + "<li>Return : <span class=\"markdown-return\">" + jsData[j].ReturnType + "</span> " + jsData[j].Return + " </li>"
                            + (jsData[j].Params && jsData[j].Params.length > 0?"<li><p>Parameters :</p><ul class=\"markdown-paramList\"> ":"")
                            + jsData[j].Params.map(function(item) {
                                return "<li><span>" + item.Name + "</span>&nbsp;&nbsp;<span>" + item.Type + "</span>&nbsp;&nbsp;<span>" + item.Description + "</span></li>";
                            })
                            + (jsData[j].Params && jsData[j].Params.length > 0?"</li></ul>":"")
                            + (jsData[j].Note?"<li><b>*Note</b> : " + jsData[j].Note + " </li>":"")
                            + (jsData[j].Example?"<li>Example : <pre class=\"markdown-pre\">" + getExampleCodes(totalJson[i].ExtJSON, jsData[j].Example) + " </pre></li>":"")
                            + "</ul>"
                            + "</div>");
                        }
                        $("#js-api").append("<br/>");
                    }
                }
            }
        }
        for(var i = 0; i < totalJson.length; i++){
            $.ajax({
                url : "../doc_file/" + totalJson[i].File,
                success : returnAPIFunc(i, 1)
            });
            $.ajax({
                url : "../doc_file/" + totalJson[i].Ext,
                success : returnAPIFunc(i, 2)
            });
        }
    }
});


// $.ajax({
//     url : "../doc/total.json",
//     success : function(totalJson){
//         for(var index_t = 0; index_t < totalJson.length; index_t++){
//             var mdlfile = totalJson[index_t].File;
//             var extfile = totalJson[index_t].Ext;
//             var abbr = totalJson[index_t].Abbr;
//             var title = totalJson[index_t].Title;
//             totalJson[index_t]["JSON"];
//             $("#js-api").append("<h1 class=\"markdown-title\">" + title + "</h1><div id=\"doc_" + abbr + "\" ></div>");
//             //! Callback
//             var requestFinish = function(index){
//                 return function(data){
//                     var chunks = parseExtFile(data);
//                     //! Request MDL json file
//                     $.ajax({
//                         url : mdlfile,
//                         success : function(jsData){
//                             //! Request MDL json file
//                             var retutnFunction = function(jsData){
//                                 for(var i = 0; i < jsData.length; i++){
//                                     $("#doc_" + abbr).append("<div class=\"markdown\" >"
//                                     + "<h2 class=\"markdown-h2\"><span class=\"markdown-return\">" + jsData[i].ReturnType + "</span>&nbsp;&nbsp;" + jsData[i].Name + "</h2>"
//                                     + "<ul>"
//                                     + "<li>Description : " + jsData[i].Description + " </li>"
//                                     + "<li>Return : <span class=\"markdown-return\">" + jsData[i].ReturnType + "</span> " + jsData[i].Return + " </li>"
//                                     + (jsData[i].Params && jsData[i].Params.length > 0?"<li><p>Parameters :</p><ul class=\"markdown-paramList\"> ":"")
//                                     + jsData[i].Params.map(function(item) {
//                                         return "<li><span>" + item.Name + "</span>&nbsp;&nbsp;<span>" + item.Type + "</span>&nbsp;&nbsp;<span>" + item.Description + "</span></li>";
//                                     })
//                                     + (jsData[i].Params && jsData[i].Params.length > 0?"</li></ul>":"")
//                                     + (jsData[i].Note?"<li><b>*Note</b> : " + jsData[i].Note + " </li>":"")
//                                     + (jsData[i].Example?"<li>Example : <pre class=\"markdown-pre\">" + getExampleCodes(chunks, jsData[i].Example) + " </pre></li>":"")
//                                     + "</ul>"
//                                     + "</div>");
//                                 }
//                             }.bind(this);
//                             $.ajax({
//                                 url : mdlfile,
//                                 success : requestFinish(index_t)
//                             });
//                         }.bind(this)
//                     });
//                 }.bind(this)
//             }
//             //! Request MDL extended file
//             $.ajax({
//                 url : extfile,
//                 success : function(data){
//                     var chunks = parseExtFile(data);
//                     //! Request MDL json file
//                     var retutnFunction = function(jsData){
//                         for(var i = 0; i < jsData.length; i++){
//                             $("#doc_" + abbr).append("<div class=\"markdown\" >"
//                             + "<h2 class=\"markdown-h2\"><span class=\"markdown-return\">" + jsData[i].ReturnType + "</span>&nbsp;&nbsp;" + jsData[i].Name + "</h2>"
//                             + "<ul>"
//                             + "<li>Description : " + jsData[i].Description + " </li>"
//                             + "<li>Return : <span class=\"markdown-return\">" + jsData[i].ReturnType + "</span> " + jsData[i].Return + " </li>"
//                             + (jsData[i].Params && jsData[i].Params.length > 0?"<li><p>Parameters :</p><ul class=\"markdown-paramList\"> ":"")
//                             + jsData[i].Params.map(function(item) {
//                                 return "<li><span>" + item.Name + "</span>&nbsp;&nbsp;<span>" + item.Type + "</span>&nbsp;&nbsp;<span>" + item.Description + "</span></li>";
//                             })
//                             + (jsData[i].Params && jsData[i].Params.length > 0?"</li></ul>":"")
//                             + (jsData[i].Note?"<li><b>*Note</b> : " + jsData[i].Note + " </li>":"")
//                             + (jsData[i].Example?"<li>Example : <pre class=\"markdown-pre\">" + getExampleCodes(chunks, jsData[i].Example) + " </pre></li>":"")
//                             + "</ul>"
//                             + "</div>");
//                         }
//                     }.bind(this);
//                     $.ajax({
//                         url : mdlfile,
//                         success : requestFinish(index_t)
//                     });
//                 }.bind(this)
//             });
//         }
//     }
// });


