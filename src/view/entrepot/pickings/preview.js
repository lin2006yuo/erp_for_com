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
                    <span style="display: inline-block;">仓库：${this.printData.warehouse_id || ''}</span>
                    <span style="margin-left: 10px;display: inline-block;">分区：${this.printData.warehouse_area_id || ''}</span>
                    <span style="margin-left: 10px;display: inline-block;">类型：${this.printData.type || ''}</span>
                </div>
                <div>
                    <span style="width:100% ;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">邮寄方式：${this.printData.carrier || ''}${this.printData.shipping ? `>>${this.printData.shipping}` : ''}</span>
                </div>
                <div>
                    <span style="inline-block;">SKU品种数：${this.trendAction.sku_type || ''}</span>
                    <span style="margin-left: 10px;display: inline-block;">包裹总数：${this.printData.package_quantity || ''}</span>
                    <span style="margin-left: 10px;display: inline-block;">面单规格：${this.printData.special_type || ''}</span>
                </div>
            </div>
            <div style="float: right; width: 40%">
                <img src="` + barsrc + `" alt="">
            </div>
        </div>
        <div style="font-size: 14px;">
            <span style="display: inline-block;">建单时间：${datef('YYYY-MM-dd HH:mm', this.printData.create_time)}</span>
            <span style="margin-left: 10px;display: inline-block;">建单人：${this.printData.creator_id || ''}</span>
            <span style="margin-left: 10px;display: inline-block;">打单时间：${datef('YYYY-MM-dd HH:mm', this.printData.printer_time)}</span>
            <span style="margin-left: 10px;display: inline-block;">打单员：${this.printData.printer_id || ''}</span>
        </div>`;
    let tablelist = '';
    let hasNote = this.printData.type === '含备注';
    let tablehead = `<tr>
        <td></td>
        <td>货位</td>
        <td>数量</td>
        <td>SKU/SKU别名</td>
        <td>品名</td>
        ${hasNote ? `<td>备注（编号：数量：备注）</td>` : ``}
        </tr>`;
    let tablebody = '';
    for (let i = 0; i < this.print_list.length; i++) {
        let order_list = this.print_list[i].order_list;
        let note = '';
        let maxHeight = '32px';
        if (order_list.length > 0) {
            for (let j = 0; j < order_list.length; j++) {
                note += `<div style="height: 16px; line-height: 16px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"><span style="font-weight: bold;">${number_code(order_list[j].number)}</span> ：${order_list[j].sku_quantity} ：${order_list[j].note}</div>`
            }
            console.log(order_list.length);
            maxHeight = order_list.length < 2 ? maxHeight : `${16*order_list.length}px`;
        }
        let item = `<tr>    
                        <td>` + (start + i + 1) + `</td>
                        <td width="110" style="font-weight: bold; font-size:18px">${this.print_list[i].warehouse_cargo}</td>
                        <td width="50">${this.print_list[i].quantity}</td>
                        <td width="120">` + sku_alias(this.print_list[i]) + `</td>
                        <td width="${hasNote ? 250 : 500}"><span style="display: inline-block;max-height: ${maxHeight}; overflow: hidden;text-overflow: ellipsis;line-height:16px">${this.print_list[i].name}</span></td>
                        ${hasNote ? `<td width="250">${note}</td>` : ``}
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
            console.log('打印');
            this.$printer(this.printer, data);
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

function number_code(number) {
    let code = [
        '①', '②', '③', '④', '⑤',
        '⑥', '⑦', '⑧', '⑨', '⑩',
        '⑪', '⑫', '⑬', '⑭', '⑮',
        '⑯', '⑰', '⑱', '⑲', '⑳',
        '㉑', '㉒', '㉓', '㉔', '㉕',
        '㉖', '㉗', '㉘', '㉙', '㉚',
        '㉛', '㉜', '㉝', '㉞', '㉟',
        '㊱', '㊲', '㊳', '㊴', '㊵',
        '㊶', '㊷', '㊸', '㊹', '㊺',
        '㊻', '㊼', '㊽', '㊾', '㊿'];
    let num = code[number];
    if (num) {
        return num;
    } else {
        return number;
    }
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
