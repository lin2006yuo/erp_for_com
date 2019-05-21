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
    let back = '<div style="position: relative;margin:0 auto;page-break-before:always;' + `height:${height}px;` + `width:${width}px;` + 'padding:10px">';
    let dashed = '<div style="position: relative;margin:0 auto;page-break-before:always;border:1px dashed red;' + `height:${height}px;` + `width:${width}px;` + 'padding:10px">';
    let firstTable =
        `<h1 style="text-align: center; margin-top: 15px">采购退货拣货单</h1>
        <div style="overflow: hidden; margin-bottom: 15px">
            <div style="float: left;">
                <div style="margin-top: 15px">
                    <span style="display: inline-block;">退货单号：${this.trendAction.number || ''}</span>
                    <span style="margin-left: 20px;display: inline-block;">采购单号：${this.trendAction.purchase_order_id || ''}</span>
                    <span style="margin-left: 20px;display: inline-block;">SKU品种数：${this.trendAction.sku_type_quantity || ''}</span>
                    <span style="margin-left: 20px;display: inline-block;">SKU总数量：${this.trendAction.sku_quantity || ''}</span>
                </div>
                <div style="margin-top: 15px">
                    <span style="inline-block;">退货收件人：${this.trendAction.recipients || ''}</span>
                    <span style="margin-left: 20px;display: inline-block;">收件人联系电话：${this.trendAction.recipients_phone || ''}</span>
                </div>
                <div style="margin-top: 15px">
                    <span style="inline-block;">退货地址：${this.trendAction.recipients_address || ''}</span>
                </div>
            </div>
        </div>`
    let tablelist = '';
    let tablehead = `<tr>
        <td></td>
        <td>货位</td>
        <td>数量</td>
        <td>SKU</td>
        <td>品名</td>
        </tr>`;
    let tablebody = '';
    for (let i = 0; i < this.print_list.length; i++) {
        let maxHeight = '32px';
        let item = `<tr>    
                        <td width="30">` + (start + i + 1) + `</td>
                        <td width="110" style="font-weight: bold; font-size:18px">${this.print_list[i].code}</td>
                        <td width="50">${this.print_list[i].quantity}</td>
                        <td width="120">${this.print_list[i].sku}</td>
                        <td width="500"><span style="display: inline-block;max-height: ${maxHeight}; overflow: hidden;text-overflow: ellipsis;line-height:16px">${this.print_list[i].spu_name}</span></td>
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
