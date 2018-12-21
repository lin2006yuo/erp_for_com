/**
 * Created by wuchuguang on 17-1-17.
 */
/**
 * Created by wuchuguang on 17-1-10.
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
import {url_setting,url_delete} from "../../../api/menu"
const operates = [
    {name:'查看', api:url_setting, parent:true, action(Class){
        this.info(Class.id)
    }},
    {name:'修改', api:url_setting, parent:true, action(Class){
        this.setting(Class.id)
    }},
    {name:'删除', api:url_delete, parent:true, action(Class){
        this.delete2(Class.id)
    }},
];
import {api_change_status} from '../../../api/menu';
export default {
    components:{
        uiTable:require('../../../components/ui-table.vue').default,
        uiTip:require('../../../components/ui-tip.vue').default
    },
    data(){
        return {}
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
        after(ClassID, title){
            this.$emit('after', ClassID, title);
        },
        changeStatus(menu, status){
            const operate = status ? '启用' : '停用';
            this.$confirm(`您确定${operate}  [${menu.title}]  菜单吗？`, '启停提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(api_change_status, {id:menu.id, status:status?1:0}).then(res=>{
                    menu.status = status?1:0;
                    this.$message(res.message);
                }).catch(code=>{
                    this.$message({type:'error',message:code.message});
                })
            }).catch(() => {
            });
        },
        drag(el, param, target){
          //  let target = document.elementFromPoint(event.pageX,event.pageY);
            let key = findKey(target);
            let node = null;
            if(key && (node = this.tree[key])){
                let current = this.tree[param];
                //判断是否拖动到子集或者孙子集中
                if(this.tree[param].child_ids&&(this.tree[param].child_ids.indexOf(parseInt(key))!==-1||(this.tree[parseInt(key)].parents&&this.tree[parseInt(key)].parents.indexOf(param)!==-1))){
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
            const switcher = (Menu) =>{
                return this.$createElement('ElSwitch', {
                props:{onColor:'#20a0ff',offColor:'#C0CCDA',onText:"启用",offText:'停用',value:!!Menu.status},on:{
                    input:(val) =>{
                        this.changeStatus(Menu, val)
                    }
                    }
                });
            };
            let i = '';
            const add=this.$hasPermission(url_setting);
            let pchilds = Menu.child_ids || [];
            const permissions = operates.filter(operate=>{
                return this.$hasPermission(operate.api)
            });
            let classOperates = permissions.map((permission,index)=>{
                let act=this.$createElement('span',{
                    class:['operate'],
                    on:{click:()=>{permission.action.call(this,Menu);}}
                },permission.name);
                if(index!==permissions.length-1){
                    let span = <span>{act}&nbsp;|&nbsp;</span>;
                    return span
                }else {
                    return act
                }
            });

            if(pchilds.length > 0){
                if(Menu.show === undefined){
                    this.$set(Menu, 'show', !this.close);
                }
                if(Menu.show){
                    i = <i class="el-icon-caret-bottom" title="收起菜单" on-click={
                            ()=>{Menu.show=false;}
                        }>
                    </i>
                }else{
                    i = <i class="el-icon-caret-right" title="展开菜单" on-click={
                            ()=>{Menu.show=true;}
                        }>
                    </i>
                }
            }
            let isAdd='';
            if(add){
                isAdd=<i class="el-icon-plus fr mr-sm"
                         on-click={()=>{this.after(Menu.id, Menu.title)}}
                         title="点击添加子菜单">
                </i>
            }
            let classNode = (<tr data-key={Menu.id} key={Menu.id} v-drag={
                {func:this.drag, params:Menu.id}
            }>
                <td>{Menu.id}</td>
                <td style={{textAlign:'left',paddingLeft:`${layout*25}px`}}>
                    {i}<span class="ml-sm">{Menu.title}</span>
                    {isAdd}
                </td>
                <td>
                    {switcher(Menu)}
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
        return (
        <ui-table body-height={10} heads={[{label:'ID',width:10},{label:'菜单名称',width:60},{label:'状态',width:10},{label:'菜单操作',width:19}]}>
            <tbody>
            {childs}
            </tbody>
        </ui-table>
        )
    }
};
