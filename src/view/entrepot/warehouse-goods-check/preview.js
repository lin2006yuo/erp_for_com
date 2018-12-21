/**
 * Created by RondaFul on 2017/7/20.
 */
const head = "<html> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/> <title></title><style> *{margin: 0;padding: 0}img{border: none}.right-table{ width: 100%;border-left:1px solid #d3dce6;border-top:1px solid #d3dce6;font-size: 10px;}td{text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:26px; }</style></head><body style='margin: 0'><div>";
const bottom = "</div></body></html>";
export const print = function (bool, flag) {
    let dips=getDPI();
    let height=(parseFloat(280)*(dips.y/25.4)).toFixed(4);
    let width=(parseFloat(200)*(dips.x/25.4)).toFixed(4);
    this.printContent = '';
    let back='<div style="position: relative;margin:0 auto;page-break-before:always;' + `height:${height}px;` + `width:${width}px;` + '">';
    let dashed = '<div style="position: relative;margin:0 auto;page-break-before:always;border:1px dashed red;' + `height:${height}px;` + `width:${width}px;` + '">';
    let firstTable =
        `<table class="right-table" style="margin-bottom:10px;">
            <tr>
                <td width="100">盘点单号</td>
                <td colspan="3">${this.tableData.id}</td>
            </tr>
            <tr>
                <td width="100">盘点类型</td>
                <td width="100">${this.tableData.type_name}</td>
                <td width="100">盘点结果</td>
                <td width="100">${this.tableData.status_name}</td>
            </tr>
            <tr>
                <td width="100">盘点仓库</td>
                <td width="100">${this.tableData.warehouse_code}</td>
                <td width="100">盘点人</td>
                <td width="100">${this.tableData.checker_name || ''}</td>
            </tr>
            <tr>
                <td width="100">创建人</td>
                <td width="100">${this.tableData.creator_name || ''}</td>
                <td width="100">创建时间</td>
                <td width="100">${datef("YYYY-MM-dd HH:mm:ss", this.tableData.create_time)}</td>
            </tr>
            <tr>
                <td width="100">完成人</td>
                <td width="100">${this.tableData.update_name || ''}</td>
                <td width="100">完成时间</td>
                <td width="100">${datef("YYYY-MM-dd HH:mm:ss", this.tableData.update_time)}</td>
            </tr>
       </table>`;
    let tablelist= '';
    let tablehead = `<tr>
        <td>货位</td>
        <td>分区功能</td>
        <td>SKU</td>
        <td>货位库存数量</td>
        <td>盘点数量</td>
        <td>盈亏数量</td>
        <td>盘点结果</td>
        <td>盘点人</td>
        </tr>`;
    let tablebody = '';
    for(let i = 0;i < this.print_list.length;i++){
        let item = `<tr>
                        <td width="150">${this.print_list[i].warehouse_cargo_code}</td>
                        <td width="100">${this.print_list[i].warehouse_area_type}</td>
                        <td width="100">${this.print_list[i].sku}</td>
                        <td width="120">${this.print_list[i].quantity_cargo}</td>
                        <td width="100">${this.print_list[i].quantity_check}</td>
                        <td width="100">${this.print_list[i].quantity_diff}</td>
                        <td width="100">${this.print_list[i].status_name}</td>
                        <td width="100">${this.print_list[i].checker_name || ''}</td>
                     </tr>`;
        tablebody += item;
    }
    let prints='';
    tablelist = '<table class="right-table">'+ tablehead + tablebody + '</table>';
    if(this.print_number === 1){
        prints = firstTable + tablelist;
    } else {
        prints = tablelist;
    }
    let body = back + prints  + `<p style="position: absolute;left:0;right:0;bottom: 10px;margin: 0 auto;text-align: center">-第${this.print_number}页-</p></div>`;
    if (bool) {
        this.print_html += body;
        this.printContent = head + this.print_html + bottom;

        if(flag){
            let data = {
                Type: 'html',
                Token: this.token,
                Width: 210,
                Height: 297,
                Top: 10,
                PrintName: this.printer,
                NumberList: this.print_number,
                content: this.printContent
            };
            // this.$refs.numberList.innerHTML = this.print_number;
            // this.$refs.printForm.submit();
            this.$printer(this.printer, data);
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
