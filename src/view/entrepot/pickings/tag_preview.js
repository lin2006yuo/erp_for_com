const head = "<html> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'/> <title></title><style> *{margin: 0;padding: 0}img{border: none}.right-table{ width: 100%;border-left:1px solid #d3dce6;border-top:1px solid #d3dce6;font-size: 10px;}td{text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:26px; }</style></head><body style='margin: 0'><div>";
const bottom = "</div></body></html>";
export const print = function (bool, flag) {
    let dips=getDPI();
    let height=(parseFloat(80)*(dips[1]/25.4)).toFixed(4);
    let width=(parseFloat(80)*(dips[1]/25.4)).toFixed(4);
    let back='<div style="position: relative;margin:0 auto;page-break-before:always;' + `height:${height}px;` + `width:${width}px;` + 'padding:10px">';
    let dashed = '<div style="position: relative;margin:0 auto;page-break-before:always;border:1px dashed red;' + `height:${height}px;` + `width:${width}px;` + 'padding:10px">';
    let tablelist= '';
    let tablehead = `<tr>
        <td>数量</td>
        <td>sku</td>
        <td>名称</td>
        <td>货位</td>
        <td>规格</td>
        <td>备注</td>
        </tr>`;
   let tablebody  = '';
   for(let i = 0;i < this.printHtml.length; i++){
       let item = `<tr>
                        <td>${this.printHtml[i].quantity}</td>
                        <td>${this.printHtml[i].sku}</td>
                        <td width="100">${this.printHtml[i].name}</td>
                        <td>${this.printHtml[i].warehouse_cargo}</td>
                        <td>${this.printHtml[i].attributes}</td>
                        <td>${this.printHtml[i].note}</td>
                     </tr>`;
       tablebody += item;
   }

    tablelist = '<table class="right-table">'+ tablehead + tablebody + '</table>';
    let body = dashed + tablelist  + `</div>`;
    if (bool) {
        this.print_html += body;
        this.typeList += this.connector + 'html';
        this.printContent += this.connector + head + this.print_html + bottom;
        if(flag){
            let data = {
                Type:this.typeList,
                Token:this.token,
                connector:this.connector,
                Width:100,
                Height:100,
                PrintName:this.printer,
                NumberList:this.numberList,
                content:this.printContent,
            };
            console.log('打印');
            this.$printer(this.printer, data);
        }
    }
};

