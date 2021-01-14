/*用于处理一些兼容性问题*/
(function(){
    if(!String.prototype.startsWith){
        String.prototype.startsWith = function(subStr){
            _subStr = typeof subStr === "string" ? subStr : String(subStr);
            _str = this.valueOf();
            var len = _subStr.length;
            var i = 0;
            var res = true
            for(i = 0; i < len; i++){
                if(_subStr[i] != _str[i]){
                    res = false;
                    break;
                }
            }
            return res;
        }
    }
})();

