/**
 * Created by Administrator on 2017/5/24.
 */

export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {         //年
        // console.log(RegExp.$1); // yyyy
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,  //月
        'd+': date.getDate(),       //日
        'h+': date.getHours(),      //时
        'm+': date.getMinutes(),    //分
        's+': date.getSeconds()     //秒
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';  //转化为string
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
//补零
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
