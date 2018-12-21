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
import {url_save_attributes,url_save_quality,url_update,url_edit,url_delete,url_add} from "../../../api/categories"
const operates = [
    {name:'属性设置', api:url_save_attributes, parent:false,action(Class){
        this.attribute(Class.id)
    }},
    {name:'质检设置', api:url_save_quality, parent:false,action(Class){
        this.quilty(Class.id)
    }},
    {name:'修改', api:url_update, parent:true, action(Class){
        this.setting(Class.id)
    }},
    {name:'查看', api:url_edit, parent:true, action(Class){
        this.info(Class.id)
    }},
    {name:'删除', api:url_delete, parent:true, action(Class){
        this.delete2(Class.id)
    }},
];
export default {
    permission: {
        url_save_attributes,url_save_quality,url_update,url_edit,url_delete,url_add
    },
    components:{
        uiTable:require('../../../components/ui-table.vue').default
    },
    data(){
        return {}
    },
    props:{
        tree:{},
        close:{
            default(){
                return false;
            }
        }
    },
    methods:{
        attribute(classID){
            this.$emit('set-attr', classID);
        },
        quilty(ClassID){
            this.$emit('set-quilty', ClassID);
        },
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
        height_light(ClassID){
            this.$emit('light', ClassID);
        },
        drag(el, param, target){
            let key=findKey(target);
            let node = null;
            if(key && (node = this.tree[key])){
                let current = this.tree[param];
                //判断是否拉到子集或者孙子集中
                if(this.tree[param].child_ids&&(this.tree[param].child_ids.indexOf(parseInt(key))!==-1||(this.tree[parseInt(key)].parents&&this.tree[parseInt(key)].parents.indexOf(param)!==-1))){
                    this.$message({type:"error",message:`拖动的排序无效`});
                        return ;
                }
                //判断是否是同级之间拉动
                if(node.pid!==current.pid){
                    return
                }
                if(node.pid === current.pid){
                    let targetParent = this.tree[current.pid] || this.tree;
                    let currentIndex= targetParent.child_ids.indexOfFun(id=>id === param);
                    targetParent.child_ids.splice(currentIndex, 1);
                    let parentIndex= targetParent.child_ids.indexOfFun(id=>id === parseInt(key));
                    targetParent.child_ids.splice(parentIndex+1, 0, param);
                    this.$emit('sort', node.pid);
                }else{
                    let currentNode = this.tree[current.pid] || this.tree;
                    let currentIndex= currentNode.child_ids.indexOfFun(id=>id === param);
                    currentNode.child_ids.splice(currentIndex, 1);
                    //-----^-----^--------
                    let parentNode = this.tree[node.pid] || this.tree;
                    let parentIndex= parentNode.child_ids.indexOfFun(id=>id === parseInt(key));
                    parentNode.child_ids.splice(parentIndex, 0, param);
                    current.pid = node.pid;//修正新的pid
                    this.$emit('sort', node.pid, current.pid);
                }
            }
        }
    },
    render(h){
        let childs = [];
        let gen_class = (Class, layout) => {
            let i = '';
            const  add=this.$hasPermission(url_add)
            const parent = Class.child_ids.length > 0;
            const permissions = operates.filter(operate=>{
                if(parent && !operate.parent){
                    return false;
                }
                return this.$hasPermission(operate.api)
            });
            let classOperates = permissions.map((permission,index)=>{
                    let act=this.$createElement('span',{
                        class:['operate'],
                        on:{click:()=>{permission.action.call(this,Class);}}
                        },permission.name);
                    if(index!==permissions.length-1){
                        let span=<span>{act}&nbsp;|&nbsp;</span>
                        return  span
                    }else {
                        return act
                    }
            });
                if(Class.show === undefined){
                    this.$set(Class, 'show', !this.close);
                }
                if(Class.show){
                    i = <i class="el-icon-caret-bottom" on-click={
                        ()=>{Class.show=false;}
                    }
                    ></i>
                }else{
                    i = <i class="el-icon-caret-right" on-click={
                        ()=>{Class.show=true;}
                    }></i>
                }
                         let classNode;
                    if(Class.heighLight) {
                        let isAdd=""
                        if(add){
                            isAdd= <i class="plus fr mr-lg" title="点击添加子分类" on-click={()=> {this.after(Class.id)}}></i>
                        }
                        classNode = (
                            <tr on-click={()=>this.height_light(Class.id)} data-key={Class.id} key={Class.id} v-drag={
                            {func: this.drag, params: Class.id}}  class="active-color">
                                <td>{Class.id}</td>
                                <td class="drag-public" style={{textAlign: 'left', paddingLeft: `${layout * 25}px`}}>
                                    {i}<span class="ml-sm">{Class.title}</span>
                                    {isAdd}
                                </td>
                                <td >
                                    {classOperates}
                                </td>
                            </tr>);
                    }else {
                        let isAdd=""
                        if(add){
                            isAdd= <i class="plus fr mr-lg " title="点击添加子分类" on-click={()=> {this.after(Class.id)}}></i>
                        }
                        classNode = (
                            <tr on-click={()=>this.height_light(Class.id)} data-key={Class.id} key={Class.id} v-drag={
                            {func: this.drag, params: Class.id}}>
                                <td>{Class.id}</td>
                                <td class="drag-public" style={{textAlign: 'left', paddingLeft: `${layout * 25}px`}}>
                                    {i}<span class="ml-sm">{Class.title}</span>
                                    {isAdd}
                                </td>
                                <td >
                                    {classOperates}
                                </td>
                            </tr>);
                    }
            childs.push(classNode);
            Class.show && gen_classes(Class.child_ids, layout+1);
        };
        let gen_classes = (Classes, layout) => {
            Classes.map(ClassID =>{
                let Class = this.tree[ClassID];
                gen_class(Class, layout);
            })
        };
        gen_classes(this.tree.child_ids || [], 0);
        return (
            <ui-table body-height={10} heads={[{label:'ID',width:6},{label:'分类名称',width:66},{label:'分类操作',width:24}]}>
                <tbody>
            {childs}
            </tbody>
            </ui-table>
        )
    }
};
