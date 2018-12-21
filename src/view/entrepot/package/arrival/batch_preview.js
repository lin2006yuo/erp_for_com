const head="<html xmlns='http://www.w3.org/1999/xhtml'> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/> <title></title><style> *{margin: 0;padding: 0}img{border: none}</style></head><body style='margin: 0'><div>";
const bottom="</div></body></html>";
import QRCodeImpl from 'qr.js/lib/QRCode'
import ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel'
export const print=function(bool,flag){
    let arr=[];
    this.print_content = '';
    this.print_height = this.templateData.size.height;
    this.print_width = this.templateData.size.width;
    let back='<div style="position: relative;margin:0 auto;page-break-before:always;' +`height:${(parseInt(this.templateData.size.height)*(72/25.4)).toFixed(4)}pt;`+`width:${(parseInt(this.templateData.size.width)*(72/25.4)).toFixed(4)}pt;`+'">';
    let dashed='<div style="position: absolute;margin:auto;page-break-before:always;border:1px dashed red;' +`height:${(parseInt(this.templateData.size.height)*(72/25.4)).toFixed(4)}pt;`+`width:${(parseInt(this.templateData.size.width)*(72/25.4)).toFixed(4)}pt;left:0;right:0;bottom:0;top:0;`+'">';
    let print_goods = [];
    let num = 1;
    console.log('', !!this.templateData.sub_temp);
    if(!!this.templateData.sub_temp){
        num = 1;
        this.printData.guide.forEach((item, index)=>{
            if(!!item){
                if(index !== 2){
                    for(let i = 0; i < item.quantity; i++){
                        print_goods = template(this.templateData, this.printData.print_data, bool);
                        this.print_content += (back+print_goods.join('')+'</div>');
                    }
                    this.print_content = head + this.print_content + bottom;
                }
                if(this.batch_relevance && Number(item.quantity) !== 0){//引导标签1打印两张
                    this.templateData.sub_temp.forEach(row=>{
                        print_goods = template(row, item, bool);
                        this.print_content += head+back+print_goods.join('')+bottom;
                    });
                }
            }
        });
    } else {
        num = 1;
        this.printData.guide.forEach((item, index)=>{
            if(!!item){
                if(index !== 2){
                    for(let i = 0; i < item.quantity; i++){
                        print_goods = template(this.templateData, this.printData.print_data, bool);
                        this.print_content += (back+print_goods.join('')+'</div>');
                    }
                    this.print_content = head+this.print_content+bottom;
                }
            }
        });
    }
    arr = template(this.templateData, this.printData.print_data, bool);
    function template(templateData, printData, bool) {
        let arr = [];
        window.clone(templateData.temp_data).forEach(row=>{
            let tag;
            let single;
            if(bool){
                single=`height:${px2pt(row.style.height)}pt;width:${px2pt(row.style.width)}pt;font-family:${row.style.fontFamily};font-weight:${row.style.fontWeight};font-size:${px2pt(row.style.fontSize)}pt;text-align:${row.style.textAlign};left:${px2pt(get_location(row.style.fontSize, row.style.width, row.style.left))}pt;top:${px2pt(get_location(row.style.fontSize, row.style.height, row.style.top))}pt;white-space: nowrap;-webkit-transform:${row.style['-webkit-transform']}`;
            } else {
                single=`height:${px2pt(row.style.height)}pt;width:${px2pt(row.style.width)}pt;font-family:${row.style.fontFamily};font-weight:${row.style.fontWeight};font-size:${px2pt(row.style.fontSize)}pt;text-align:${row.style.textAlign};left:${px2pt(row.style.left)}pt;top:${px2pt(row.style.top)}pt;white-space: nowrap;-webkit-transform:${row.style['-webkit-transform']}`;
            }
            if(row.type===1){
                if(row.isCombination){
                    let label='';
                    row.value.length&&row.value.forEach(item=>{
                        switch (item.value){
                            case -1:
                            case -2:
                            case -3:
                                label+=`${item.input}`
                                break;
                            default:
                                if(!!printData[item.value]){
                                    if(printData[item.value]){
                                        if(item.checked){
                                            label+=`${item.label}:${printData[item.value]}`
                                        }else {
                                            label+=`${printData[item.value]}`
                                        }
                                    }
                                }
                                break
                        }
                    });
                    console.log('label',label);
                    row.label = label;
                } else {
                    if(row.value === '_sn' && bool){
                        row.label = num;
                        num++;
                    } else {
                        if(!!printData[row.value]){
                            row.label=printData[row.value];
                        } else {
                            row.label=''
                        }
                    }
                }
                tag='<div style="position:absolute ;'+single+'">'+row.label+'</div>';
            }else {
                switch (row.value){
                    //新建文本
                    case 1:
                        tag='<div style="position:absolute ;'+single+'">'+row.label+'</div>';
                        break;
                    //水平线
                    case 4:
                        tag='<div style="position:absolute ;'+single+'border-top:1px solid black;border-bottom:1px solid black;height: 0;"></div>';
                        break;
                    //垂直线
                    case 5:
                        tag='<div style="position:absolute ;'+single+'border-left:1px solid black;border-right:1px solid black;width: 0;"></div>';
                        break;
                    //虚线
                    case 6:
                        tag='<div style="position:absolute ;'+single+'border-top:1px dashed black;height: 0;"></div>';
                        break;
                    //条形码
                    case 7:
                        if(!!printData[row.label]){
                            row.label = printData[row.label];
                        } else {
                            row.label=''
                        }
                        let barsrc=get_bar_code(row.label,!!row.showFont);
                        tag='<img  src="'+ barsrc+'" style="position:absolute ;'+single+'">';
                        break;
                    //二维码
                    case 8:
                        let label='';
                        row.label.length&&row.label.forEach(item=>{
                            switch (item.value){
                                case -1:
                                case -2:
                                case -3:
                                    label+=`${item.input}`;
                                    break;
                                default:
                                    if(!!printData[item.value]){
                                        if(printData[item.value]){
                                            if(item.checked){
                                                label+=`${item.label}:${printData[item.value]}`
                                            }else {
                                                label+=`${printData[item.value]}`
                                            }
                                        }
                                    }
                                    break
                            }
                        })
                        label=utf16to8(label);
                        let src=get_qr_code(label);
                        tag='<img  src="'+ src+'" style="position:absolute ;'+single+'">';
                        break;
                }
            }
            arr.push(tag)
        });
        return arr;
    }
    let footertest="";
    let prints='';
    let body=dashed+arr.join('')+footertest+'</div>';
    this.htmlList.push(arr);//把要预览的页面放到list里，预览的时候v-for循环创建
    // for(let i = 0; i < this.printData.print_num; i++){
    //     this.numberList.push(this.printData.print_data[1].value + '-' + i);
    // }
    if(bool){
        //将要打印的内容拼接起来
        this.print_html += this.print_content;
        //判断传入的参数flag是否为true如果为true就打印，当循环完成时flag才为true
        //因为for循环提交表单的时候只会提交最后一次所以这里需要一个参数flag当循环完成时提交一次表单
        if(flag){
            this.numberList.push('batch-print-label');
            let data = {
                Type:'html',
                Token:this.token,
                Width:this.print_width,
                Height:this.print_height,
                PrintName:this.batch_printer,
                NumberList:this.numberList,
                content:this.print_html
            };
            this.$printer(this.batch_printer, data);
        }
    }
};
function get_bar_code(value,bool) {
    let bar=document.createElement("img");
    JsBarcode(bar, value,{displayValue: bool,fontSize:32,margin:3});
    return bar.src
}
function get_qr_code(value) {
    let qr=document.createElement("canvas");
    const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel['L']);
    qrcode.addData(value);
    qrcode.make();
    const canvas = qr;
    const ctx = canvas.getContext('2d');
    const cells = qrcode.modules;
    const tileW = 80 / cells.length;
    const tileH = 80 / cells.length;
    const scale = (window.devicePixelRatio || 1) / get_backing_store_pixel_ratio(ctx);
    canvas.height = canvas.width = 80 * scale;
    ctx.scale(scale, scale);
    cells.forEach((row, rdx) => {
        row.forEach((cell, cdx) => {
            ctx.fillStyle = cell ? '#000000' :'#FFFFFF';
            const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
            const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
            ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h)
        })
    });
    let qrCode=canvas.toDataURL('image/png');
    return qrCode
}
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}
function get_backing_store_pixel_ratio (ctx) {
    return (
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1
    )
}
//用来计算因为tranform的偏移量
function get_location(fontSize, size, direction) {
    let userAgent = window.navigator.userAgent;
    if(userAgent.indexOf('Chrome') >= 0){
        if(fontSize < 12){
            direction += (fontSize / 12).toFixed(5) * size / 2;
            return direction;
        } else {
            return direction;
        }
    } else {
        return direction;
    }
}
