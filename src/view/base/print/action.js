/**
 * Created by RondaFul on 2017/7/18.
 */
const head = "<html xmlns='http://www.w3.org/1999/xhtml'> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/> <title></title></head><body>";
const bottom = "</body></html>";
import http from "../../../lib/http"
import QRCodeImpl from 'qr.js/lib/QRCode'
import ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel'
import {api_label_save} from "../../../api/print"

export const font = [
    {label: '宋体', value: "宋体"},
    {label: '黑体', value: "黑体"},
    {label: '微软雅黑', value: "微软雅黑"},
    {label: 'Helvetica', value: "Helvetica"},
];
export const size = [
    {label: '8', value: '8px'},
    {label: '10', value: "10px"},
    {label: '12', value: "12px"},
    {label: '14', value: "14px"},
    {label: '16', value: "16px"},
    {label: '18', value: "18px"},
    {label: '20', value: "20px"},
    {label: '22', value: "22px"},
    {label: '24', value: "24px"},
    {label: '26', value: "26px"},
    {label: '28', value: "28px"},
    {label: '30', value: "30px"},
    {label: '32', value: "32px"},
    {label: '34', value: "34px"},
    {label: '36', value: "36px"},
    {label: '38', value: "38px"},
    {label: '40', value: "40px"},
    {label: '42', value: "42px"},
    {label: '44', value: "44px"},
    {label: '46', value: "46px"},
    {label: '48', value: "48px"},
    {label: '50', value: "50px"},
];

export const weight = [
    {label: '100', value: '100'},
    {label: '200', value: '200'},
    {label: '300', value: '300'},
    {label: '400', value: '400'},
    {label: '500', value: '500'},
    {label: '600', value: '600'},
    {label: '700', value: '700'},
    {label: '800', value: '800'},
    {label: '900', value: '900'},
];

export const style = [
    {
        check: false, class: 'bold', action(item, find) {
            if (find.style.fontWeight && find.style.fontWeight >= 500) {
                this.$set(find.style, 'fontWeight', 300);
                this.fontWeight = 300;
                item.check = false;
            } else {
                this.$set(find.style, 'fontWeight', 600);
                this.fontWeight = 600;
                item.check = true;
            }
        }
    },
    {
        check: false, class: 'italic', action(item, find) {
            if (find.style.fontStyle && find.style.fontStyle === 'italic') {
                this.$set(find.style, 'fontStyle', 'normal')
                item.check = false;
            } else {
                this.$set(find.style, 'fontStyle', 'italic')
                item.check = true;
            }
        }
    },
    {
        check: false, class: 'underline', action(item, find) {
            if (find.style.textDecoration && find.style.textDecoration.match('underline') && find.style.textDecoration.match('underline').length > -1) {
                this.$set(find.style, 'textDecoration', 'none');
                item.check = false;
            } else {
                this.$set(find.style, 'textDecoration', 'underline')
                item.check = true;
            }
        }
    },

];
export const algins = [
    {
        check: false, class: 'alginleft', action(item, find) {
            this.$set(find.style, 'textAlign', 'left');
            this.algins.forEach(row => {
                row.check = false;
            });
            item.check = true
        }
    },
    {
        check: false, class: 'middle', action(item, find) {
            this.$set(find.style, 'textAlign', 'center')
            this.algins.forEach(row => {
                row.check = false;
            });
            item.check = true
        }
    },
    {
        check: false, class: 'alginright', action(item, find) {
            this.$set(find.style, 'textAlign', 'right')
            this.algins.forEach(row => {
                row.check = false;
            });
            item.check = true
        }
    },
]

export const button = [
    // {label:'文本标签',value:1,type:2,action(item){
    //     let data={
    //         id:Date.now()+"",
    //         label:`#2 ${item.label}`,
    //         value:item.value,
    //         type:item.type,
    //         light:false,
    //         style:{
    //             fontFamily:this.fontStyle,
    //             fontSize:this.fontSize,
    //             textAlign: 'center',
    //         }
    //     }
    //     this.templateData.temp_data.push(data)
    // }},
    {
        label: '图片', value: 2, type: 2, action() {
        }
    },
    {
        label: '表格', value: 3, type: 2, action() {
        }
    },
    {
        label: '水平线', value: 4, type: 2, action(item) {
            let data = {
                id: Date.now() + "",
                label: item.label,
                value: item.value,
                type: item.type,
                light: false,
                style: {
                    fontFamily: this.fontStyle,
                    fontSize: this.fontSize,
                    textAlign: 'center',
                    top: '30px',
                    height: '2px',
                    width: '100%'
                }
            }
            this.templateData.temp_data.push(data)
        }
    },
    {
        label: '垂直线', value: 5, type: 2, action(item) {
            let data = {
                id: Date.now() + "",
                label: item.label,
                value: item.value,
                type: item.type,
                light: false,
                style: {
                    fontFamily: this.fontStyle,
                    fontSize: this.fontSize,
                    textAlign: 'center',
                    left: '30px',
                    height: '100%',
                    width: '2px'
                }
            }
            this.templateData.temp_data.push(data)
        }
    },
    {
        label: '虚线', value: 6, type: 2, action(item) {
            let data = {
                id: Date.now() + "",
                label: item.label,
                value: item.value,
                type: item.type,
                light: false,
                style: {
                    fontFamily: this.fontStyle,
                    fontSize: this.fontSize,
                    textAlign: 'center',
                    top: '30px',
                    height: '100%',
                    width: '1px'
                }
            }
            this.templateData.temp_data.push(data)

        }
    },
    {
        label: '删除', action() {
            let find = this.templateData.temp_data.findIndex(row => row.light)
            if (find !== -1) {
                this.templateData.temp_data.splice(find, 1)
            }
        }
    },
];

export const print = function (bool) {
    let children = this.$refs.target.children;
    for (let i = 0; i < children.length; i++) {
        let style = window.getComputedStyle(children[i]);
        let styles = {
            width: style.width,
            height: style.height,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            textDecoration: style.textDecoration,
            fontStyle: style.fontStyle,
            fontSize: style.fontSize,
            textAlign: style.textAlign,
            left: style.left,
            top: style.top,
            '-webkit-transform': style['-webkit-transform']
        };

        if (!!children[i].dataset.key && children[i].dataset.key !== style.fontSize) {
            styles.fontSize = children[i].dataset.key;
        } else {
            console.log('children', !!children[i].dataset.key, style.fontSize);
            styles.fontSize = style.fontSize;
        }
        this.$set(this.templateData.temp_data[i], "style", styles);
        console.log("styles", styles)
    }
    let arr = [];
    let back = '<div style="position: relative;margin:0 auto;' + `height:${(parseInt(this.templateData.size.height) * (72 / 25.4)).toFixed(2)}pt;` + `width:${(parseInt(this.templateData.size.width) * (72 / 25.4)).toFixed(2)}pt;` + '">';
    this.templateData.temp_data.forEach(row => {
        row.light = false;
        let tag;
        let single = `height:${px2pt(row.style.height)}pt;width:${px2pt(row.style.width)}pt;font-family:${row.style.fontFamily};font-weight:${row.style.fontWeight};font-size:${px2pt(row.style.fontSize)}pt;text-align:${row.style.textAlign};left:${px2pt(row.style.left)}pt;top:${px2pt(row.style.top)}pt;white-space: nowrap;font-style:${row.style.fontStyle};text-decoration:${row.style.textDecoration};`
        if (row.type === 1) {
            tag = '<div style="position:absolute ;' + single + '">' + row.label + '</div>';
        } else {
            switch (row.value) {
                case 1:
                    tag = '<div style="position:absolute ;' + single + '">' + row.label + '</div>';
                    break;
                case 7:
                    let barsrc = getBarCode("category")
                    tag = '<img  src="' + barsrc + '" style="position:absolute ;' + single + '">';
                    break;
                case 8:
                    let src = getQrCode("bbbbb")
                    tag = '<img  src="' + src + '" style="position:absolute ;' + single + '">';
                    break;
            }
        }
        arr.push(tag)
    })
    let data = head + back + arr.join('') + '</div>' + bottom
    if (bool) { //打印
        // this.$http(http("POST",'http://localhost:10093/print',{postId:1,content:data})).then(res=>{
        //     console.log(res)
        // }).catch(code=>{console.log(code)})
    } else {
        this.templateData.html = data;
        let postdata = window.clone(this.templateData);
        if (this.templateData.is_default) {
            postdata.is_default = postdata.temp_type;
        } else {
            postdata.is_default = 0;
        }
        postdata.warehouse_id = this.templateData.warehouse_id || 0;
        this.$http(api_label_save, postdata).then(res => {
            this.$message({type: "success", message: res.message || res});
            this.show = false;
            this.$emit("refresh")
        }).catch(code => {
            this.$message({type: "error", message: code.message || code})
        }).finally(() => {
            this.$reqKey('addEditSave', false)
        })
    }
};

function getBarCode(value) {
    let bar = document.createElement("img");
    JsBarcode(bar, value, {displayValue: false, margin: 3});
    return bar.src
}

function getQrCode(value) {
    let qr = document.createElement("canvas");
    const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel['L']);
    qrcode.addData(value)
    qrcode.make();
    const canvas = qr;
    const ctx = canvas.getContext('2d');
    const cells = qrcode.modules
    const tileW = 80 / cells.length
    const tileH = 80 / cells.length
    const scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx)
    canvas.height = canvas.width = 80 * scale
    ctx.scale(scale, scale)
    cells.forEach((row, rdx) => {
        row.forEach((cell, cdx) => {
            ctx.fillStyle = cell ? '#000000' : '#FFFFFF';
            const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW))
            const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH))
            ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h)
        })
    })
    let qrCode = canvas.toDataURL('image/png');
    return qrCode
}

function getBackingStorePixelRatio(ctx) {
    return (
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1
    )
};
