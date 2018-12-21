import {api_develop_target_user} from '@/api/target-configure';
import {url_update_develop_department,url_add_develop_department,url_develop_add_user,url_develop_update_user} from '@/api/target-configure';
//部门下的操作
const operate = [
    {label:'编辑',api:url_update_develop_department,action(row){
        this.edit(row);
    }},
    {label:'添加分组',api:url_add_develop_department,action(row){
        this.add_group(row)
    }},
];
//组下的操作
const groupOperate1 = [
    {label:'编辑',api:url_update_develop_department,action(row){
        this.edit_group(row);
    }},
    {label:'添加分组',api:url_add_develop_department,action(row){
        this.add_group(row)
    }},
];
const groupOperate2 = [
    {label:'编辑',api:url_update_develop_department,action(row){
        this.edit_group(row);
    }},
    {label:'添加成员',api:url_develop_add_user,action(row){
        this.add_member(row)
    }},
];
//成员下的操作
const memberOperate = [
    {label:'编辑',api:url_develop_update_user,action(row){
        this.edit_member(row);
    }},
];
export default{
    props:{
        tableData:{
            required:true,
            type:Array
        }
    },
    methods:{
        //编辑部门
        edit(row){
            this.$emit('edit',row);
        },
        //编辑组
        edit_group(row){
            this.$emit('edit-group',row);
        },
        //添加组
        add_group(row){
            this.$emit('add-group',row);
        },
        //添加成员
        add_member(row){
            this.$emit('add-member',row);
        },
        //编辑成员
        edit_member(row){
            this.$emit('edit-member',row);
        },
        get_type(val){
            switch(val){
                case 0:
                    return '部门';
                case 1:
                    return '小组';
                case 2:
                    return '成员';
                default:
                    return '--'
            }
        },
        get_status(val){
            switch(val){
                case 0:
                    return '启用';
                case 1:
                    return '停用';
                default:
                    return '';
            }
        },
        test(rowData){
            this.$http(api_develop_target_user,{department_id:rowData.id}).then(res => {
                if(res.length<=0)return;
                if(rowData.child_ids===undefined){
                    this.$set(rowData,'child_ids',[])
                }
                res.forEach(item=>{
                    this.$set(item,'depth',rowData.depth+1)
                })
                rowData.child_ids = res;
            }).catch(code => {
                this.$message({type:'error',message:code.message||code})
            })
        }
    },
    components:{
        uiTable:require('@/components/ui-table.vue').default
    },
    render(h){
        let childs = [];
        let get_tr = (rowData)=>{
            let openOrClose = '';
            let curOperate = [];
            if(rowData.type===0){
                curOperate = operate;
            }else if(rowData.type===1&&!rowData.is_bottom){
                curOperate = groupOperate1;
            }else if(rowData.type===1&&rowData.is_bottom){
                curOperate = groupOperate2;
            }else if(rowData.type===2){
                curOperate = memberOperate;
            }
            curOperate = curOperate.filter(operate=>{
                return this.$hasPermission(operate.api)
            });
            let operateNode = curOperate.map((permission,index)=>{
                let act=this.$createElement('span',{
                    class:'operate',
                    on:{click:()=>{permission.action.call(this,rowData)}}
                },permission.label);

                if(index!==curOperate.length-1){
                    let span = <span>{act}&nbsp;|&nbsp;</span>
                    return  span
                }else {
                    return act
                }
            });
            if((rowData.child_ids&&rowData.child_ids.length>0)||(rowData.is_bottom&&rowData.type!==2)){
                if(rowData.isShow===undefined){
                    this.$set(rowData,'isShow',false)
                }
                if(!rowData.is_bottom){
                    if(rowData.isShow){
                        openOrClose = <i class="el-icon-caret-bottom" on-click={
                        ()=> {rowData.isShow = false;}}></i>
                    }else{
                        openOrClose = <i class="el-icon-caret-right" on-click={
                        ()=> {rowData.isShow = true;}}></i>
                    }
                }else{
                    if(rowData.isShow){
                        openOrClose = <i class="el-icon-minus" on-click={
                        ()=> {rowData.isShow = false;}}></i>
                    }else{
                        openOrClose = <i class="el-icon-plus" on-click={
                        ()=> {
                            rowData.isShow = true;
                            this.test(rowData)
                        }}></i>
                    }
                }
            }
            let childNode = (<tr>
                <td>{rowData.id}</td>
            <td style={{textAlign:'left',paddingLeft:`${rowData.depth*25}px`}}>
            {openOrClose} <span class='ml-sm'>{rowData.name}</span>
            </td>
            <td>开发</td>
            <td>{this.get_type(rowData.type)}</td>
            <td>{rowData.leader_name}</td>
            <td>{rowData.target_amount}</td>
            <td>{this.get_status(rowData.status)}</td>
            <td>{operateNode}</td>
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
            <ui-table body-height={10}
        heads={[{label:'ID',width:5},
        {label:'部门名称',width:26},
        {label:'部门职能',width:10},
        {label:'部门类型',width:6},
        {label:'负责人',width:13},
        {label:'开发目标（个）',width:15},
        {label:'状态',width:10},
        {label:'操作',width:15}]}>
    <tbody>
        {childs}
        </tbody>
        </ui-table>
    )
    }
}
