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

export default {
    data(){
        return {}
    },
    components:{
        uiSwitch:require('../../../components/ui-switch').default
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
        after(classID){
            this.$emit('after',classID);
        },
        edit(Class){
            this.$emit('edit', Class);
        },
        look(Class){
            this.$emit('look', Class);
        },
        delete2(ClassID){
            this.$emit('delete2', ClassID);
        },
        drag(el, param, event){
            let target = document.elementFromPoint(event.pageX,event.pageY);
            let key = findKey(target);
            let node = null;
            if(key && (node = this.tree[key])){
                let current = this.tree[param];

                if(node.pid === current.pid){
                    let targetParent = this.tree[current.pid] || this.tree;
                    let currentIndex= targetParent.child_ids.indexOfFun(id=>id === param);
                    targetParent.child_ids.splice(currentIndex, 1);
                    let parentIndex= targetParent.child_ids.indexOfFun(id=>id === parseInt(key));
                    targetParent.child_ids.splice(parentIndex+1, 0, param);

                }else{
                    let currentNode = this.tree[current.pid] || this.tree;
                    let currentIndex= currentNode.child_ids.indexOfFun(id=>id === param);
                    currentNode.child_ids.splice(currentIndex, 1);

                    //-----^-----^--------
                    let parentNode = this.tree[node.pid] || this.tree;
                    let parentIndex= parentNode.child_ids.indexOfFun(id=>id === parseInt(key));
                    parentNode.child_ids.splice(parentIndex, 0, param);
                    current.pid = node.pid;//修正新的pid
                }
            }
        },
        switch_input(Class){
            Class.status = !Class.status;
            this.$emit("switch-input",Class);
        }
    },
    render(h){
        let childs = [];
        let gen_class = (Class, layout) => {
            let i = '';
            let i2 = ''
            let pchild = Class.child_ids || [];
            let showAfter = Class.level;

            if(pchild.length > 0){
                if(Class.show === undefined){this.$set(Class, 'show', !this.close);}
                if(Class.show){
                    i = <i class="el-icon-caret-bottom" on-click={()=>{Class.show=false;}}></i>
                }else{
                    i = <i class="el-icon-caret-right" on-click={()=>{Class.show=true;}}></i>
                }
            }

            if(showAfter === 1 || showAfter === 2){
                i2 = <i class="el-icon-plus pl-xs" style={{paddingLeft:"10px"}} on-click={()=>{this.after(Class)}}></i>
            }else{
                i2 = '';
            }

            let classNode = (<tr data-key={Class.id} key={Class.id} v-drag={{func:this.drag, params:Class.id}}>
                <td>{Class.id}</td>
                <td style={{textAlign:'left',paddingLeft:`${layout*10}px`}}>
                    {i}<span class="ml-sm">{Class.name}</span>{i2}
                    {/*<i class="el-icon-plus pl-xs" style="padding-left:10px" on-click={()=>{this.after(Class)}}></i>*/}
                </td>
                <td>{Class.title}</td>
                <td>
                    {/*<ui-switch*/}
                        {/*key={Class.id}*/}
                        {/*text-off="禁止"*/}
                        {/*text-on="开启"*/}
                        {/*on-input={()=>{this.switch_input(Class)}} value={!!Class.status}>*/}
                    {/*</ui-switch>*/}
                    <el-switch
                        value={!!Class.status}
                        on-change={()=>{this.switch_input(Class)}}>
                    </el-switch>
                </td>
                <td>
                    <span on-click={()=>{this.look(Class)}} class="operate">查看 </span>
                    |
                    <span on-click={()=>{this.edit(Class)}} class="operate"> 编辑 </span>
                    |
                    <span on-click={()=>this.delete2(Class.id)} class="operate"> 删除</span>
                </td>
            </tr>);
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
            <table class="template">
                <tr>
                    <th>ID</th>
                    <th>节点名称</th>
                    <th>节点标题</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                <tbody>
                {childs}
                </tbody>
            </table>
        )
    }
};
