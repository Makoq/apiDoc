const fs = require("fs");
const path = require("path");

function render(pageName){
    return (req, res, next) => {
        res.locals.pages = [
            {"pageName" : "Home", "url" : "./index"},
            {"pageName" : "Download", "url" : "./download"},
            {"pageName" : "Doc", "url" : "./doc"},
            {"pageName" : "Community", "url" : "./community"},
            {"pageName" : "ContactUs", "url" : "./contactUs"},
        ];
        if(pageName === "doc"){
            next();
        }
        else{
            res.render(pageName, {"pageName" : pageName});
        }
    }
}

//单独渲染doc页面，因为doc页面部分二级菜单需要单独渲染
function renderDoc(pageName){
    return (req, res, next) => {
        let filePath = path.join(__dirname, "../public/doc_file/total.json");
        fs.readFile(filePath, "utf-8", (err, data) => {
            if(err){
                next(err);
                return;
            }
            res.render(pageName, { "pageName": pageName, "menuObj": JSON.parse(data) });
            // fs.readFile(path.join(__dirname, "../public/doc_file/dataService/total.json"), "utf-8", (err, dataService) => {
            //     if(err){
            //         next(err);
            //         return;
            //     }
            //     res.render(pageName, { "pageName": pageName, "apiTypes": JSON.parse(data), "dataService": JSON.parse(dataService) });
            // });
        })
    };
}

exports.render = render;
exports.renderDoc = renderDoc;