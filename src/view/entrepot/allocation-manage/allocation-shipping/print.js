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
    let back = '<div style="position: relative;margin:0 auto;page-break-before:always;' + `height:${height}px;` + `width:${width}px;` + 'padding:10px">';
    let dashed = '<div style="position: relative;margin:0 auto;page-break-before:always;border:1px dashed red;' + `height:${height}px;` + `width:${width}px;` + 'padding:10px">';

    let tablelist = '';
    let tablehead = `<tr>
        <td>调拨单号</td>
        <td>箱子号</td>
        <td>箱唛</td>
        <td>箱子重量(KG)</td>
        <td>箱子体积</td>
        <td>物流渠道</td>
        <td>发货方式</td>
        <td>状态</td>
        <td>操作</td>
        </tr>`;
    let tablebody = '';
    for (let i = 0; i < this.tableData.length; i++) {
        let maxHeight = '32px';
        let item = `<tr>
                        <td width="100">${this.tableData[i].order_code}</td>
                        <td width="50">${this.tableData[i].box_num}</td>
                        <td width="100">${this.tableData[i].shipping_mark || ''}</td>
                        <td width="100">${this.tableData[i].box_weight}</td>
                        <td width="100">${`${this.tableData[i].length}*${this.tableData[i].width}*${this.tableData[i].height}`}</td>
                        <td width="100">${this.tableData[i].shipping_method}</td>
                        <td width="100">${this.tableData[i].shipping_type}</td>
                        <td width="50">${this.tableData[i].box_status === 1 ? '已交接' : '未交接'}</td>
                        <td width="100"></td>    
                     </tr>`;
        tablebody += item;
    }
    let prints = '';
    tablelist = '<table class="right-table">' + tablehead + tablebody + '</table>';
    prints = tablelist;
    let body = back + prints + `<p style="position: absolute;left:0;right:0;bottom: 5px;margin: 0 auto;text-align: center">-第${this.print_number}页-</p></div>`;
    if (bool) {
        this.print_html += body;
        this.printContent = head + this.print_html + bottom;
        if (flag) {
            let websocket_print = () => {
                console.log(`xxxxxx:`, this.printer,);
                let data = {
                    route: 'print-single-doc-html',
                    id: `${Date.now()}`,
                    type: 'doc-flow',
                    width: 210,
                    height: 297,
                    margin: {
                        top: 5,
                    },
                    content: this.printContent,
                    mark_id: Date.now(),
                    print_name: JSON.parse(this.printer).name,
                    direction: 'vertical',
                }
                local_websocket.sendRequest(data, (res) => {
                    if (res.status === 1) {
                        this.$message({type: 'success', message: '打印成功'});
                    } else if (res.status === 0) {
                        this.$message({type: 'error', message: '打印失败'});
                    }
                })
            };
            if (local_websocket && local_websocket.IsOpen) {
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
                            // NumberList: this.print_number,
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
