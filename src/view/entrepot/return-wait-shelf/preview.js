/**
 * Created by RondaFul on 2017/7/20.
 */
const head = "<html> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/> <title></title><style> *{margin: 0;padding: 0}img{border: none}.right-table{ width: 100%;border-left:1px solid #d3dce6;border-top:1px solid #d3dce6;font-size: 10px;}td{text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:26px; }</style></head><body style='margin: 0'><div>";
const bottom = "</div></body></html>";
export const print = function (bool, flag) {
    let dips=getDPI();
    let height=(parseFloat(280)*(dips[1]/25.4)).toFixed(4);
    let width=(parseFloat(200)*(dips[1]/25.4)).toFixed(4);
    let back='<div style="position: relative;margin:0 auto;page-break-before:always;' + `height:${height}px;` + `width:${width}px;` + '">';
    let dashed = '<div style="position: relative;margin:0 auto;page-break-before:always;border:1px dashed red;' + `height:${height}px;` + `width:${width}px;` + '">';
    let tablelist= '';
    let tablehead = `<tr>
        <td>SKU</td>
        <td>名称</td>
        <td>分区</td>
        <td>货位</td>
        </tr>`;
    let tablebody = '';
    for(let i = 0;i < this.print_list.length;i++){
        let item = `<tr>
                        <td width="150">${this.print_list[i].sku}</td>
                        <td width="100">${this.print_list[i].sku_name}</td>
                        <td width="100">${this.print_list[i].warehouse_area_code}</td>
                        <td width="120">${this.print_list[i].warehouse_cargo_code}</td>
                     </tr>`;
        tablebody += item;
    }
    let prints='';
    tablelist = '<table class="right-table">'+ tablehead + tablebody + '</table>';
    prints = tablelist
    let body = back + prints  + `<p style="position: absolute;left:0;right:0;bottom: 10px;margin: 0 auto;text-align: center">-第${this.print_number}页-</p></div>`;
    if (bool) {
        this.print_html += body;
        this.$refs.textarea.innerHTML = head + this.print_html + bottom;

        if(flag){
            this.$refs.numberList.innerHTML = this.print_number;
            this.$refs.printForm.submit();
        }
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
