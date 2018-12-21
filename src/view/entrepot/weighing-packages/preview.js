/**
 * Created by RondaFul on 2017/7/20.
 */
const head = "<html> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/><title></title><style> *{margin: 0;padding: 0}img{border: none} .right-table{width: 95%;font-size: 12px;border:1px solid #d3dce6;position: absolute;bottom: 30px;left: 0;right: 0;margin: auto;}.right-table td{text-align: center;border-bottom:1px solid #d3dce6;border-right:1px solid #d3dce6;height:33px;}.bottom-none{border-bottom:none !important;}.right-none{border-right: none  !important;}</style></head><body style='margin: 0'><div>";
const bottom = "</div></body></html>";
export const print = function (bool) {
    let dips=getDPI();
    let height=(parseFloat(100)*(dips[1]/25.4)).toFixed(4);
    let width=(parseFloat(100)*(dips[1]/25.4)).toFixed(4);
    let back='<div style="position: relative;margin:0 auto;page-break-before:always;' + `height:${height}px;` + `width:${width}px;` + '">';
    let barsrc = getBarCode(this.printData.code, true);
    let tag = '<img src="' + barsrc + '" style="position:absolute ;top:30px;left:0;right:0;margin: auto;">';
    let shipping = this.printData.shipping_name.split('>>');
    let channel = shipping[0];
    let mailing = shipping[1];
    let footertest =
        `<table class="right-table mt-mini">
            <tr>
                <td colspan='4' class="right-none" style="font-size: 25px;">${channel}</td>
            </tr>
            <tr>
                <td colspan='4' class="right-none" style="font-size: 25px;">${mailing}</td>
            </tr>
            <tr>
                <td width="120">包裹数量</td>
                <td width="120">${this.printData.quantity}</td>
                <td width="120">包裹重量（kg）</td>
                <td width="120" class="right-none">${this.printData.package_weight}</td>
            </tr>
            <tr>
                <td width="120" class="bottom-none">集包人</td>
                <td width="120" class="bottom-none">${this.printData.creator}</td>
                <td width="120" class="bottom-none">包装时间</td>
                <td width="120" class="bottom-none right-none">${datef('YYYY-MM-dd HH:mm:ss',this.printData.packing_time)}</td>
            </tr>
       </table>`;
    let body = back + tag + footertest + '</div>';
    this.html = head + body + bottom;
    if (bool) {
        this.print_content = head + body + bottom;

    }
};
function getBarCode(value, bool) {
    let bar = document.createElement("img");
    JsBarcode(bar, value, {displayValue: bool, fontSize: 22, height:50});
    return bar.src
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