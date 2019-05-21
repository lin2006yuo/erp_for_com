import QRCodeImpl from "qr.js/lib/QRCode";
import ErrorCorrectLevel from "qr.js/lib/ErrorCorrectLevel";

/**
 * Created by RondaFul on 2017/7/20.
 */
const head = "<html> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/> <title></title><style> *{margin: 0;padding: 0}img{border: none}.right-table{ width: 100%;border-left:1px solid #d3dce6;border-top:1px solid #d3dce6;font-size: 10px;}td{text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:26px; }</style></head><body style='margin: 0'><div>";
const bottom = "</div></body></html>";
export const print = function (bool, flag, start) {
    let dips = getDPI();
    let height = (parseFloat(292) * (dips.y / 25.4)).toFixed(4);//TODO:此处计算有误，结果为undefined，打印机修好后再改过来测
    let width = (parseFloat(205) * (dips.x / 25.4)).toFixed(4);
    this.printContent = '';
    let barsrc = barCode(this.printData.number, true);
    let back = '<div style="position: relative;margin:0 auto;page-break-before:always;' + `height:${height}px;` + `width:${width}px;` + 'padding:10px">';
    let dashed = '<div style="position: relative;margin:0 auto;page-break-before:always;border:1px dashed red;' + `height:${height}px;` + `width:${width}px;` + 'padding:10px">';
    let firstTable =
        `<h1 style="text-align: center">仓库发货拣货单</h1>
        <div style="overflow: hidden">
            <div style="float: left; width: 60%;">
                <div>
                    <span style="display: inline-block;">出库仓库：${this.printData.out_warehouse_name || ''}</span>
                    <span style="margin-left: 10px;display: inline-block;">入库仓库：${this.printData.in_warehouse_name || ''}</span>
                </div>
                <div>
                    <span style="inline-block;">SKU品种数：${this.printData.sku_type || ''}</span>
                    <span style="margin-left: 10px;display: inline-block;">商品数量：${this.printData.sku_quantity || ''}</span>
                </div>
            </div>
            <div style="float: right; width: 40%">
                <img src="` + barsrc + `" alt="">
            </div>
        </div>
        <div style="font-size: 14px;">
            <span style="display: inline-block;">打单时间：${this.printData.print_time}</span>
            <span style="margin-left: 10px;display: inline-block;">打单员：${this.printData.print || ''}</span>
        </div>`;
    let tablelist = '';
    let tablehead = `<tr>
        <td></td>
        <td>货位</td>
        <td>数量</td>
        <td>SKU/SKU别名</td>
        <td>品名</td>
        </tr>`;
    let tablebody = '';
    for (let i = 0; i < this.print_list.length; i++) {
        let maxHeight = '32px';
        let item = `<tr>    
                        <td>` + (start + i + 1) + `</td>
                        <td width="110" style="font-weight: bold; font-size:18px">${this.print_list[i].warehouse_cargo}</td>
                        <td width="50">${this.print_list[i].quantity}</td>
                        <td width="120">` + sku_alias(this.print_list[i]) + `</td>
                        <td width="500"><span style="display: inline-block;max-height: ${maxHeight}; overflow: hidden;text-overflow: ellipsis;line-height:16px">${this.print_list[i].name}</span></td>
                     </tr>`;
        tablebody += item;
    }
    let prints = '';
    tablelist = '<table class="right-table">' + tablehead + tablebody + '</table>';
    prints = firstTable + tablelist;
    let body = back + prints + `<p style="position: absolute;left:0;right:0;bottom: 5px;margin: 0 auto;text-align: center">-第${this.print_number}页-</p></div>`;
    if (bool) {
        this.print_html += body;
        this.printContent = head + this.print_html + bottom;
        if (flag) {
            let websocket_print = () => {
                console.log(`xxxxxx:`, this.printer,);
                let data = {
                    route: 'print-single-doc-html',
                    id: `${this.printData.id}-${Date.now()}`,
                    type: 'doc-flow',
                    width: 210,
                    height: 297,
                    margin: {
                        top: 5,
                    },
                    content: this.printContent,
                    mark_id: this.print_number,
                    print_name: JSON.parse(this.printer).name,
                    direction: 'vertical',
                }
                local_websocket.sendRequest(data, (res) => {
                    if(res.status === 1) {
                        this.$message({type: 'success', message: '打印成功'});
                    } else if(res.status === 0) {
                        this.$message({type: 'error', message: '打印失败'});
                    }
                })
            };
            if(local_websocket && local_websocket.IsOpen) {
                websocket_print();
            } else {
                localWebSocket({
                    open: () => {
                        local_websocket.connected();
                        websocket_print();
                    },
                    error: () => {
                        local_websocket.closed();
                        let data = {
                            Type: 'html',
                            Token: this.token,
                            Width: 210,
                            Height: 297,
                            Top: 5,
                            PrintName: this.printer,
                            NumberList: this.print_number,
                            content: this.printContent
                        };
                        this.$printer(this.printer, data);
                    }
                })
            }
        }
    }
};
export const barCode = function getBarCode(value, bool) {
    let bar = document.createElement("img");
    JsBarcode(bar, value, {displayValue: bool, fontSize: 16, height: 30, textAlign: "left"});
    return bar.src
};

function sku_alias(print) {
    let alias = print.alias;
    // let sku = `${print.sku}`;
    let skuEl = alias[0] ? `<div style="height: 32px;">${print.sku}<div style="line-height: 16px">${alias[0]}</div></div>` : `<div style="height: 32px; line-height: 32px;">${print.sku}</div>`;
    /*if (alias.length === 0) {
        aliasEl = `<div style="line-height: 16px">--</div>`;
    } else {
        for (let i = 0, len = alias.length; i < len; i++) {
            aliasEl += `<div style="line-height: 16px">${alias[i]}</div>`;
        }
    }*/
    return skuEl;
}


function getQrCode(value) {
    let qr = document.createElement("canvas");
    const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel['L']);
    qrcode.addData(value);
    qrcode.make();
    const canvas = qr;
    const ctx = canvas.getContext('2d');
    const cells = qrcode.modules;
    const tileW = 80 / cells.length;
    const tileH = 80 / cells.length;
    const scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
    canvas.height = canvas.width = 80 * scale;
    ctx.scale(scale, scale);
    cells.forEach((row, rdx) => {
        row.forEach((cell, cdx) => {
            ctx.fillStyle = cell ? '#000000' : '#FFFFFF';
            const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
            const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
            ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h)
        })
    });
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
}
