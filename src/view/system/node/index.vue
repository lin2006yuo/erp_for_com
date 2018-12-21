<template>
    <el-row class="card">
        <el-button type="primary" size="mini" @click.native="add_node">添加节点</el-button>
        <el-button type="primary" size="mini" @click.native="sort_save">保存</el-button>
        <tree :tree="tree" class="mt-xs" @after="after" @edit="edit" @look="look" @delete2="delete2" @switch-input="switch_input"></tree>
        <add-node
                v-model="addDialog"
                :add-form="addForm"
                :select-object="selectObject"
                @change-level="change_level"
                @add-save="add_save"
        ></add-node>
        <edit-lookover
            v-model="editDialog"
            :edit-form="editForm"
            :is-edit="isEdit"
            :select-object="selectObject"
            @edit-save="edit_save"
        ></edit-lookover>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import {api_node_list,api_add_node,api_edit_node,api_look_node,api_update_node,api_delete_node,api_change_status,api_get_type,api_node_sort} from '../../../api/node.js'
    export default{
        data(){
            return{
                msg:'hello vue',
                addDialog:false,
                editDialog:false,
                addForm:{
                    fTitle:"添加节点",
                    level:0,
                    pid:0,
                    name:"",
                    title:"",
                    expression:"",
                    status:0,
                    remark:"",
                },
                editForm:{
                    fTitle:"编辑节点",
                    level:0,
                    pid:0,
                    name:"",
                    title:"",
                    expression:"",
                    status:0,
                    remark:"",
                },
                selectObject:{
                    levelList:[],
                    nodeList:[],
                },
                isEdit:false,
                tree:{},
            }
        },
        created(){
            this.init();

        },
        methods:{
            init(){
                this.$http(api_node_list).then(res=>{
                    let len = res.data.length;
                    let obj = {};
                    let chi = {};
                    for(let i= 0; i < len; i++){
                        let node = res.data[i];
                        obj[node.id] = node;
                        if(chi[node.pid]){
                            chi[node.pid].push(node.id);
                        }else{
                            chi[node.pid] = [node.id];
                        }
                    }
                    obj.child_ids = chi[0];
                    for(let i in chi){
                        if(i > 0 && chi.hasOwnProperty(i)){
                            obj[i].child_ids = chi[i];
                        }
                    }
                    this.tree = obj;
                }).catch(code=>{
                    console.log(code);
                });
            },
            add_node(){
                this.addForm={
                    fTitle:"添加节点",
                    level:0,
                    pid:0,
                    name:"",
                    title:"",
                    expression:"",
                    status:0,
                    remark:"",
                }
                this.addDialog = true;
                this.isEdit = true;
                this.api_get_type({level:0});
            },
//            排序保存
            sort_save(){
                console.log("排序");
            },
//            添加页面保存
            add_save(){
                let params={
                    level:this.addForm.level,
                    pid:this.addForm.pid,
                    name:this.addForm.name,
                    title:this.addForm.title,
                    expression:this.addForm.expression,
                    status:this.addForm.status,
                    remark:this.addForm.remark,
                }
                this.api_add_node(params);
            },
//            编辑页面保存
            edit_save(){
                let params={
                    level:this.editForm.level,
                    pid:this.editForm.pid,
                    name:this.editForm.name,
                    title:this.editForm.title,
                    expression:this.editForm.expression,
                    status:this.editForm.status,
                    remark:this.editForm.remark,
                }
                this.api_update_node(this.editForm.id,params);
            },
//            todo +添加
            after(val){
                this.addForm={
                    fTitle:"添加节点",
                    level:0,
                    pid:0,
                    name:"",
                    title:"",
                    expression:"",
                    status:0,
                    remark:"",
                }
                this.addForm.level=val.level+1;
                this.addForm.pid=val.pid;
                this.api_get_type({level:val.level+1});
                this.addDialog = true;
                this.isEdit = true;
            },
//            编辑
            edit(val){
                this.editDialog = true;
                this.isEdit = true;
                this.api_edit_node(val);
            },
//            查看
            look(val){
                console.log(val);
                this.editDialog = true;
                this.isEdit = false;
                this.api_look_node(val);

            },
//            删除
            delete2(val){
                this.$confirm(`您将删除此此节点，确认此操作吗？`,"提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.api_delete_node(val);
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消操作"
                    })
                });

            },
//            改变节点类型
            change_level(val){
                if(val>=2){
                    let data = {level:val}
                    this.api_get_type(data);
                }else{
                    this.selectObject.nodeList = [];
                }
            },
//           改变状态
            switch_input(val){
                let params = {
                    id:val.id
                }
                params.status = val.status ? 1:0;
                this.$confirm(`此操作将会更改 ${val.name} 节点状态，确认此操作吗？`,"警告",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.api_change_status(params);
                }).catch(() => {
                    this.$message({
                        type:"info",
                        message:"已取消操作",
                    })
                    val.status = !val.status;
                })
            },
//            -------------------------------------------------------  API
            /*添加节点*/
            api_add_node(data){
                this.$http(api_add_node,data).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message || res
                    })
                    this.api_get_type({level:0});
                    this.addDialog = false;
                    this.init();
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                    this.addDialog = true;
                });
            },
            /*查看*/
            api_look_node(val){
              this.$http(api_look_node,val.id).then(res=>{
                    this.api_get_type({level:res.level});
                    this.editForm = res;
                    this.editForm.fTitle = `查看 ${val.name} 节点`;
              }).catch(code=>{
                  console.log(code);
              })
            },
            /*编辑*/
            api_edit_node(val){
                this.$http(api_edit_node,val.id).then(res=>{
                    this.api_get_type({level:res.level});
                    this.editForm=res;
                    this.editForm.fTitle =  `编辑 ${val.name} 节点`;
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*更新*/
            api_update_node(id,data){
                this.$http(api_update_node,id,data).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message || res
                    })
                    this.init();
                    this.editDialog = false;
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message ||code
                    })
                    this.editDialog = true;
                });
            },
            /*获取节点类型*/
            api_get_type(data){
                this.selectObject.nodeList=[];
                this.$http(api_get_type,data).then(res=>{
                    this.selectObject={
                        levelList:res.levelList,
                        nodeList:res.nodeList
                    };
                }).catch(code=>{
                    console.log(code);
                });
            },
            /*删除节点*/
            api_delete_node(id){
                this.$http(api_delete_node,id).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message || res
                    })
                    this.init();
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                })
            },
            /*改变状态*/
            api_change_status(data){
                this.$http(api_change_status,data).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message || res
                    })
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                });
            },
        },
        components:{
            tree:require('./tree.js').default,
            addNode:require('./add-node.vue').default,
            editLookover:require('./edit-lookover.vue').default
        }
    }

</script>
