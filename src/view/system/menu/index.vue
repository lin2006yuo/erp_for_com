<template>
    <page>
        <div class="mb-xs ml-sm mt-sm">
            <permission tag="ElButton" @click.native="add_menu" type="primary" size="mini" :route="apis.url_setting">添加菜单</permission>
            <permission tag="request-button" @click="save" :mintime="300" :reqKey="saveSort"
                        v-if="isChange" :route="apis.url_change">保存</permission>
            <permission tag="ElButton" @click.native="cancel" type="warning"
                        v-if="isChange"  size="mini" :route="apis.url_change">取消</permission>
        </div>
            <gen-menu2 :tree="menus"
                       @after="after"
                       @setting="setting"
                       @info="info"
                       @delete2="delete2"
                       @change-nodes="change_nodes"
                       v-loading="loading"
                       element-loading-text="玩命加载中...">
            </gen-menu2>
            <div v-if="menus.length <= 0">
                菜单空空如也
            </div>
        <form-add v-model="dialogVisible" @update="update"  @reflash="init" :form="form" :tree="menus2"></form-add>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import genMenu2 from './gen-menu2';
    import {api_get, api_delete, api_change,url_change,url_setting} from '../../../api/menu';
    export default{
        permission: {
            url_change,url_setting
        },
        page:{},
        refresh(){
        	this.init();
        },
        data(){
            return{
                dialogVisible:false,
                menus:{
                },
                menus2:{},
                deletes:[],
                sorts:[],
                form:{
                    edit:false,
                    dtitle:'',
                    title:'',
                    pid:'',
                    type:0,
                    status:'',
                    paths:'',
                    sort:0,
                    index:0,
                    remark:'',
                    group:0,
                },
                loading:true,
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            update(params){
                this.menus[params.id] = params;
            },
            init(){
                this.loading = true;
                this.$http(api_get).then(res=>{
                    let len = res.length;
                    let obj = {};
                    let chi = {};
                    for(let i= 0; i < len; i++){
                        let node = res[i];
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
                            if(obj[i]){
                                obj[i].child_ids = chi[i]
                            }else{
                                console.log(`not find pid ${i}`);
                                console.log(chi[i]);
                            }
                        }
                        this.loading = false;
                    }
                    this.menus = obj;
                    this.menus2=window.clone(obj);

                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            add_menu(){
                this.form ={
                    dtitle:'添加菜单',
                    title:``,
                    pid:0,
                    id:0,
                    type:1,
                    sort:1,
                    paths:'',
                    remark:'',
                    status:true,
                    group:0,
                };
                this.form.edit = true;
                this.dialogVisible = true;
            },
            save(){
                let sorts = this.sorts.map(pid=>{
                            let menu = this.menus[pid];
                            let child_ids = menu.child_ids || [];
                            return child_ids.map((row, sort)=>{return {id:row,pid:pid,sort:sort}});
                        });
                let deletes = this.deletes;
                this.$http(api_change, {sorts,deletes}).then(res=>{
                    this.sorts = [];
                    this.deletes = [];
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                }).finally(()=>{
                    this.$reqKey('saveSort',false)
                })
            },
            cancel(){
                this.sorts = [];
                this.deletes = [];
                this.init();
            },
            change_nodes(){
                let pids = arguments;
                for(let i = 0; i < pids.length; i++){
                    let pid = pids[i];
                    if(this.sorts.indexOfFun(opid => pid === opid) <= -1){
                        this.sorts.push(pid);
                    }
                }
            },
            delete2(id){
                let menu = this.menus[id];
                this.$confirm(`您将删除  ${menu.title} ， 确认此操作吗`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete, id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        let parent = this.menus[menu.pid] || this.menus;
                        if(parent){
                            let cindex = parent.child_ids.indexOfFun(data => data === id);
                            parent.child_ids.splice(cindex, 1);
                        }
                        this.$delete(this.menus, id);
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })

                }).catch(() => {

                });
            },
            after(index, title) {
                this.form ={
                    dtitle:`${title}添加子菜单`,
                    title:``,
                    pid:index,
                    id:0,
                    type:1,
                    sort:1,
                    paths:'',
                    remark:'',
                    status:true,
                    group:0,
                };
                this.form.edit = true;
                this.dialogVisible = true;
            },
            setting(index){
                this.$set(this.form,"dtitle",'修改菜单')
                if(this.form.id !== index){
                    let current = this.menus[index];
                    this.form ={
                        dtitle:'修改菜单',
                        title:current.title,
                        pid:current.pid,
                        id:index,
                        type:current.type,
                        sort:current.sort,
                        paths:current.paths,
                        remark:current.remark,
                        status:!!current.status,
                        group:current.group,
                    };
                }
                this.form.edit = true;
                this.dialogVisible = true;
            },
            info(index){
                this.$set(this.form,"dtitle",'查看菜单')
                if(this.form.id !== index){
                    let current = this.menus[index];
                    this.form ={
                        dtitle:'查看菜单',
                        title:current.title,
                        pid:current.pid,
                        id:index,
                        type:current.type,
                        sort:current.sort,
                        paths:current.paths,
                        remark:current.remark,
                        status:!!current.status,
                        group:current.group,
                    };
                }
                this.form.edit = false;
                this.dialogVisible = true;
            }
        },
        computed:{
            isChange(){
                return this.deletes.length > 0 || this.sorts.length > 0;
            }
        },
        components:{
            genMenu2,
            formAdd:require('./form-add.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
