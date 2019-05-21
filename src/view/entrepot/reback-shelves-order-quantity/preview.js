const head = "<html> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/> <title></title><style> *{margin: 0;padding: 0}img{border: none}.right-table{ width: 100%;border-left:1px solid #d3dce6;border-top:1px solid #d3dce6;font-size: 10px;}td{text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:26px; }</style></head><body style='margin: 0'><div>";
const bottom = "</div></body></html>";
export const print = function (bool) {
    let dips=getDPI();
    let height=(parseFloat(280)*(dips[1]/25.4)).toFixed(4);
    let width=(parseFloat(200)*(dips[1]/25.4)).toFixed(4);
    let back='<div style="position: relative;margin:0 auto;page-break-before:always;' + `height:${height}px;` + `width:${width}px;` + '">';
    let dashed = '<div style="position: relative;margin:0 auto;page-break-before:always;border:1px dashed red;' + `height:${height}px;` + `width:${width}px;` + '">';
    let tablelist= '';
    let tablehead = `<tr>
        <td>上架编号</td>
        <td>周转篮号</td>
        <td>货位号</td>
        <td>SKU</td>
        <td>数量</td>
        </tr>`;
    let tablebody = '';
    for(let i = 0;i < this.detailData.length;i++){
        let item = `<tr>
                        <td width="150">${this.detailData[i].id}</td>
                        <td width="100">${this.detailData[i].car_number}</td>
                        <td width="100">${this.detailData[i].warehouse_cargo_code}</td>
                        <td width="120">${this.detailData[i].sku}</td>
                        <td width="100">${this.detailData[i].quantity}</td>
                     </tr>`;
        tablebody += item;
    }
    let prints='';
    tablelist = '<table class="right-table">'+ tablehead + tablebody + '</table>';
    prints = tablelist;
    let body = back + prints  + `</div>`;
    if (bool) {
        this.print_html += body;
        this.printContent = head + this.print_html + bottom;
        this.print_number = Date.now();
        let data = {
            Type:'html',
            Token:this.token,
            Width:210,
            Height:297,
            Top:5,
            PrintName:this.printer,
            NumberList:this.print_number,
            content:this.printContent
        };
        console.log('打印');
        this.$printer(this.printer, data);
    }
};

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
//px 转pt
function get_pt(item) {
    let dpi = getDPI();
    let num = parseInt(item);
    return (num * (72 / dpi[1])).toFixed(4);

}
export const getDPI = function () {
    var arrDPI = new Array;
    if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    }
    else {
        var tmpNode = document.createElement("DIV");
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth);
        arrDPI[1] = parseInt(tmpNode.offsetHeight);
        tmpNode.parentNode.removeChild(tmpNode);
    }
    return arrDPI;
}
