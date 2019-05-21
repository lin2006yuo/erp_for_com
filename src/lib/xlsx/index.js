import XLSX from 'xlsx';
// 读取本地excel文件
export const readWorkbookFromLocalFile = function (file) {
    return new Promise((succ, fail) =>{
        let reader = new FileReader();
        reader.onload = function(e) {
            let data = e.target.result;
            let workbook = XLSX.read(data, {type: 'binary'});
            succ(workbook);
        };
        reader.readAsBinaryString(file);
    });
};
// 从网络上读取某个excel文件，url必须同域，否则报错
export const readWorkbookFromRemoteFile = function (url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        if(xhr.status === 200) {
            let data = new Uint8Array(xhr.response)
            let workbook = XLSX.read(data, {type: 'array'});
            if(callback) callback(workbook);
        }
    };
    xhr.send();
};

window.readWorkbookFromLocalFile = readWorkbookFromLocalFile;