import {api_monthly_target_list} from '@/api/target-configure';
export default{
    props:{
        tableData:{
            required:true,
            type:Array
        },
        searchData:{
            required:true,
            type:Object
        },
    },
    methods:{
        test(rowData){
            if(!this.searchData.date){
                return this.$message({type:'warning',message:'请先选择月份！'});
                rowData.isShow = !rowData.isShow;
            }
            let date = new Date(this.searchData.date);
            let params = {
                department_id:rowData.department_id,
                year:date.getFullYear(),
                monthly:date.getMonth()+1,
                is_pid:1
            };

            this.$http(api_monthly_target_list,params).then(res => {
                res.forEach(item=>{
                    this.$set(item,'depth',rowData.depth+1);
                })
                this.$set(rowData,'child_ids',res)
            }).catch(code => {
                this.$message({type:'error',message:code.message||code})
            })
        },
    },
    components:{
        uiTable:require('@/components/copy-ui-table.vue').default
    },
    render(h){
        let childs = [];
        let get_tr = (rowData)=>{
            let openOrClose = <i class="ml-sm"></i>;
            if(rowData.is_bottom!==2&&rowData.name!=='汇总'){
                if(rowData.isShow===undefined){
                    this.$set(rowData,'isShow',false)
                }
                if(rowData.isShow){
                    openOrClose = <i class="el-icon-minus ml-sm" on-click={
                    ()=> {rowData.isShow = false;}}></i>
                }else{
                    openOrClose = <i class="el-icon-plus ml-sm" on-click={
                    ()=> {
                        rowData.isShow = true;
                        this.test(rowData)
                    }}></i>
                }
            }else if(rowData.name==='汇总'){
                openOrClose = ''
            }
            let childNode = (<tr style={{backgroundColor:rowData.name==='汇总'?'#eff2f7':''}}>
             <td style={{textAlign:'left',paddingLeft:`${rowData.depth*15}px`}}>
                {openOrClose} <span class='ml-sm'>{rowData.name}</span>
            </td>
            <td>{rowData.target_amount}</td>
            <td>{rowData.actual_amount}</td>
            <td>{rowData.rate}%</td>
            <td>{rowData.order_qty_e}</td>
            <td>{rowData.actual_amount_e}</td>
            <td>{rowData.man}</td>
            <td>{rowData.man_e}</td>
            <td>{rowData.accounts}</td>
            <td>{rowData.accounts_e}</td>
            <td>{rowData.local_warehouse_amount}</td>
            <td>{rowData.oversea_warehouse_amount}</td>
            <td>{rowData.fba_warehouse_amount}</td>
            <td>{rowData.fba_warehouse_orders}</td>
            </tr>)
            childs.push(childNode);

            if(rowData.child_ids&&rowData.child_ids.length>0){
                rowData.child_ids.forEach(item=>{
                    rowData.isShow&&get_tr(item)
                })
            }
        };
        this.tableData.forEach(row=>{
            get_tr(row)
        });
        return (
            <ui-table body-height={41}
                heads={[
                    {label:'部门',rowspan:'2',width:'13'},
                    {label:'销售额',colspan:'3',notCount:true},
                    {label:'日均订单数',rowspan:'2',width:'7'},
                    {label:'日均销售额',rowspan:'2',width:'7'},
                    {label:'分析明细',colspan:'6',notCount:true},
                    {label:'FBA销售额',rowspan:'2',width:'7'},
                    {label:'FBA订单数',rowspan:'2',width:'7'},

                    {label:'销售额目标',width:7},
                    {label:'已完成',width:7},
                    {label:'进度',width:7},
                    {label:'部门人数',width:6},
                    {label:'部门人均',width:6},
                    {label:'平台账号数',width:6},
                    {label:'账号平均',width:6},
                    {label:'本地仓销售额',width:7},
                    {label:'海外仓销售额',width:7}
            ]}>
                <tbody>
                    {childs}
                </tbody>
        </ui-table>
    )
    }
}
