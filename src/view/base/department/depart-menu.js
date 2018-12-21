/**
 * Created by wuchuguang on 17-1-17.
 */
let findKey = (child) =>{
    if(!child){
        return false;
    }
    if(child.dataset && child.dataset.key){
        return child.dataset.key;
    }else{
        return findKey(child.parentNode);
    }
};
import  {url_depart_status,url_depart_check,url_depart_del,url_depart_edit} from "../../../api/department"
const operates = [
    {name:'查看', api:url_depart_check, parent:true, action(Class){
        this.info(Class)
    }},
    {name:'修改', api:url_depart_edit, parent:true, action(Class){
        this.setting(Class)
    }},
    {name:'删除', api:url_depart_del, parent:false, action(Class,act){
        !act.parent&&!Class.child_ids.length&& this.delete2(Class)
    }},
];
export default {
    components:{
        uiTable:require('../../../components/ui-table.vue').default
    },
    data(){
        return {
        }
    },
    props:{
        tree:{
            required:true,
            type:Object
        },
        close:{
            default(){
                return false;
            }
        }
    },
    filters:{
        filterLeader(val){
            if(val){
                return val.map(row=>{
                    return `${row.name}(${row.job})`
                }).join(',');
            }
        }
    },
    methods:{
        setting(ClassID){
            this.$emit('setting', ClassID);
        },
        info(ClassID){
            this.$emit('info', ClassID);
        },
        delete2(ClassID){
            this.$emit('delete2', ClassID);
        },
        after(ClassID){
            this.$emit('after', ClassID);
        },
        change_status(ClassID){
            ClassID.status=!ClassID.status;
            this.$emit('change-status', ClassID);
        },
        get_type(){},
        drag(el, param, target){
          // let target = document.elementFromPoint(event.pageX,event.pageY);
            let key = findKey(target);
            let node = null;
            if(key && (node = this.tree[key])){
                let current = this.tree[param];
                //判断是否拖动到子集或者孙子集中
                if(this.tree[param].child_ids&&
                    (this.tree[param].child_ids.indexOf(parseInt(key))!==-1||(this.tree[parseInt(key)].parents&&this.tree[parseInt(key)].parents.indexOf(param)!==-1))){
                    return ;
                }
                if(node.pid === current.pid){
                    let targetParent = this.tree[current.pid] || this.tree;
                    let currentIndex= targetParent.child_ids.indexOfFun(id=>id === param);
                    targetParent.child_ids.splice(currentIndex, 1);
                    let parentIndex= targetParent.child_ids.indexOfFun(id=>id === parseInt(key));
                    targetParent.child_ids.splice(parentIndex+1, 0, param);
                    this.$emit('change-nodes', current.pid);
                }else{
                    let currentNode = this.tree[current.pid] || this.tree;
                    let currentIndex= currentNode.child_ids.indexOfFun(id=>id === param);
                    currentNode.child_ids.splice(currentIndex, 1);

                    //-----^-----^--------
                    let parentNode = this.tree[node.pid] || this.tree;
                    let parentIndex= parentNode.child_ids.indexOfFun(id=>id === parseInt(key));
                    parentNode.child_ids.splice(parentIndex, 0, param);
                    current.pid = node.pid;//修正新的pid
                    this.$emit('change-nodes', current.pid, node.pid);
                }
            }
        }
    },
    render(h){
        let childs = [];
        let gen_menu = (Menu, layout) => {
            let i = '';
            let switchs="";
            let getType="";
            const isSwitch=this.$hasPermission(url_depart_status);
            let add='';
            const isAdd=this.$hasPermission(url_depart_edit);
            let pchilds = Menu.child_ids || [];
            if(pchilds.length > 0) {
                if (Menu.show === undefined) {
                    this.$set(Menu, 'show', !this.close);
                }
                if (Menu.show) {
                    i = <i class="el-icon-caret-bottom" on-click={
                        ()=> {Menu.show = false;}}></i>
                } else {
                    i = <i class="el-icon-caret-right" on-click={
                        ()=> {Menu.show = true;}}></i>
                }
            }
            const parent = Menu.depth <1;
            const permissions = operates.filter(operate=>{
                return this.$hasPermission(operate.api)
            });
            let classOperates = permissions.map((permission,index)=>{
                    let className=['operate'];
                !permission.parent&&Menu.child_ids.length&&(className.push('disabled'));
                let act=this.$createElement('span',{
                    class:className,
                    on:{click:()=>{permission.action.call(this,Menu,permission);}}
                },permission.name);
                if(index!==permissions.length-1){
                    let span=<span>{act}&nbsp;|&nbsp;</span>
                    return  span
                }else {
                    return act
                }
            });
            if(isSwitch){
                switchs=(menu)=>{
                   return  this.$createElement('ElSwitch',{props:{onColor:'#20a0ff',offColor:'#C0CCDA',onText:"启用",offText:'停用',value:!!menu.status},on:{input:(val)=>{
                       this.change_status(menu)
                   }}})
                }
            }
            getType = (type)=>{
                switch(type){
                    case 1:
                        return '组';
                    case 2:
                        return '部门';
                    case 3:
                        return '子公司';
                    case 4:
                        return '分部'
                }
            }
            if(isAdd){
                add=<i class="plus fr mr-sm" on-click={()=>{this.after(Menu.id)}} title="点击添加子部门"></i>;
            }
            let name=Menu.leader_name.map(row=>{
                return `${row.name}(${row.job})`
            }).join(',');

            let classNode = (<tr data-key={Menu.id} key={Menu.id} v-drag={
                {func:this.drag, params:Menu.id}
            }>
                <td width="35px">{Menu.id}</td>
                <td style={{textAlign:'left',paddingLeft:`${layout*25}px`}} class="drag-public">
                    {i}<span class="ml-sm">{Menu.name}</span>
                    {add}
                </td>
                <td>{Menu.code}</td>
                <td>{getType(Menu.type)}</td>
                <td>{name}</td>
                <td>{Menu.remark}</td>
                <td>
                    {switchs(Menu)}
                </td>
                <td>
                    {classOperates}
                </td>
            </tr>);
            childs.push(classNode);
            Menu.show && gen_menus(pchilds, layout+1);
        };
        let gen_menus = (MenuIds, layout) => {
            MenuIds.map(MenuID =>{
                let Menu = this.tree[MenuID];
                gen_menu(Menu, layout);
            })
        };
        gen_menus(this.tree.child_ids || [], 0);
        let span=(<span></span>);
        return (
        <ui-table body-height={10} heads={[{label:'ID',width:5},{label:'部门名称',width:26},{label:'部门代码',width:10},{label:'部门类型',width:6},{label:'部门负责人',width:13},{label:'描述',width:15},{label:'状态',width:10},{label:'菜单操作',width:15}]}>
            <tbody>
            {childs}
            </tbody>
        </ui-table>
        )
    }
};
