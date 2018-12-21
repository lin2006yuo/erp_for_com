<template>
    <page  class="p-index-classify">
        <div class="ml-sm mb-xs mt-xs">
            <permission tag="ElButton"  size="mini" @click.native="add"  type="primary" :route="apis.url_add">添加</permission>
            <permission req-key="saveSorts" tag="request-button" :disabled="changeNodes.length <= 0" @click="save" :route="apis.url_sorts">保存排序</permission>
        </div>
        <classify-list>
            <gen-tree2 :tree="tree"
                       @set-attr="set_attr"
                       @set-quilty="set_quilty"
                       @setting="setting"
                       @info="info"
                       @delete2="delete2"
                       @after="after"
                       @sort="sort_change"
                       @light="light"
                       class="gen-tree"
                       v-loading="loading"
                       element-loading-text="玩命加载中..."
            ></gen-tree2>
        </classify-list>
        <edit-form @refresh="refresh_init"
                   :title-data="titleData"
                   :edit="edit"
                   :form="form"
                   v-model="showDialog"
                   :tree="tree2"></edit-form>
        <edit-dialog v-model="showAttr" :def="def" :attr-id="attrID" :title="title"></edit-dialog>
    </page>
</template>
<style lang="stylus">
    .p-index-classify{
    .c-ui-table{
        .template.secTable{
           tr:active{
               cursor: pointer;
           }
        }
    }
    .gen-tree{
    .test-algin{
        text-align: right;
        width: 280px;
            }
        }
    }
</style>
<script>

    import attributeSet from './attribute-set.vue';
    import classifyList from './classify-list.vue';
    import genTree from './gen-tree.vue';
    import genTree2 from './gen-tree2';
    import {api_get_categories,url_add,url_sorts} from '../../../api/categories';
    import {api_add, api_sorts, api_delete, api_edit, api_get_channel_categories, api_get_channel_platform, api_get_channel_classify} from '../../../api/categories';
    export default{
        permission: {
            url_add,
            url_sorts
        },
        page:{
            devinfo:{
                frontEnd:'吴楚光;张兵根',
                backEnd:'翟斌',
                createTime:'2016-10-27',
                updateTime:'2017-9-26'
            },
            beforeClose(){
                if(this.changeNodes.length <= 0){
                    return true;
                }else{
                    return this.$confirm(`检测到有数据更改但未保存，此操作将会丢失已更改的最新数据，仍然进行此操作吗?`, '提示', {
                        confirmButtonText: '继续离开',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code => {
                        return false
                    })
                }
            }
        },
        refresh(){
        	this.init();
        },
        data(){
            return{
                showDialog:false,
                tree:{},
                tree2:{},
                open:false,
                changeNodes:[],
                form:{},
                attrID:0,
                def:'',
                showAttr:false,
                title:'',
                edit:false,
                titleData:"",
                loading:true
            }
        },
        created(){
            this.init();
        },
        methods:{
            init(){
                this.loading = true;
                this.$http(api_get_categories).then(res=>{
                    this.tree = res;
                    this.tree2 =window.clone(res) ;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                }).catch(code=>{

                });
            },
            set_attr(id){
                if(this.tree[id].child_ids.length > 0){
                    this.$message({
                        type:'error',
                        message:'父分类无法带属性'
                    });
                    return;
                }
                this.def = 'attr';
                this.showAttr = true;
                this.attrID = id;
                this.title = this.tree[id].title;
            },
            set_quilty(id){
                if(this.tree[id].child_ids.length > 0){
                    this.$message({
                        type:'error',
                        message:'父分类无法带质检'
                    });
                    return;
                }
                this.def = 'quality';
                this.showAttr = true;
                this.attrID = id;
                this.title = this.tree[id].title;
            },
            info(id){
                if(this.form.index !== id){
                    this.$http(api_edit, id).then(res=>{
                        this.form = {
                            title:res.title,
                            pid:res.pid,
                            ch_customs_title:res.ch_customs_title || "",
                            en_customs_title:res.en_customs_title || "",
                            index:res.id || "",
                            platform:res.platform || [],
                            status:res.status || 1,
                            keywords:res.keywords || "",
                            description:res.description,
                            code:res.code,
                            purchaser_id:res.purchaser_id
                        };
                        this.titleData = `查看分类：${res.title} 信息`;
                    });

                }
                this.edit = false;
                this.showDialog = true;

            },
            setting(id){
                if(this.form.index !== id){
                    this.$http(api_edit, id).then(res=>{
                        this.form = {
                            title:res.title,
                            pid:res.pid,
                            ch_customs_title:res.ch_customs_title || "",
                            en_customs_title:res.en_customs_title || "",
                            index:res.id || "",
                            platform:res.platform || [],
                            status:res.status || 1,
                            keywords:res.keywords || "",
                            description:res.description,
                            code:res.code,
                            purchaser_id:res.purchaser_id
                        };
                        this.titleData = `修改分类：${this.form.title} 信息`
                    });
                }
                this.edit = true;
                this.showDialog = true;
            },
            delete2(id){
                let node = this.tree[id];
                if(node.child_ids.length > 0){
                    this.$message({
                        type:'error',
                        message:"请先删除所有子分类"
                    });
                    return;
                }
                this.$confirm(`您将删除  ${node.title} ，  确认此操作吗`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete, id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        let parent = this.tree[node.pid] || this.tree;
                        if(parent){
                            let cindex = parent.child_ids.indexOfFun(data => data === id);
                            parent.child_ids.splice(cindex, 1);
                        }
                        this.$delete(this.tree, id);
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })

                }).catch(() => {
                });
            },
            light(id){
                for(let i in this.tree){
                    if(i!=="child_ids"){
                        this.$set(this.tree[i],"heighLight",false)
                    }
                }
                this.tree[id].heighLight=true;
            },
            add_classify(){
                console.log('add_classify');
            },
            save(){
                let sorts = [];
                this.changeNodes.forEach(pid=>{
                    this.tree[pid].child_ids.forEach((row,sort)=>{
                        sorts.push({id:row, pid:pid, sort:sort});
                    });
                });
                this.$http(api_sorts, sorts).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message
                    });
                    this.changeNodes = [];
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('saveSorts',false)
                    },300);
                });
            },
            add(){
                this.form = {
                    title:'',
                    pid:0,
                    ch_customs_title:"",
                    en_customs_title:"",
                    index:0,
                    platform:[],
                    status:1,
                    keywords:"",
                    description:"",
                    code:"",
                    purchaser_id:''
                };
                this.showDialog = true;
                this.edit = true;
                this.titleData = `添加分类信息`
            },
            last(last){
                console.log(last);
            },
            refresh_init(data){
                if(data.index<=0){
                    this.init();
                }else {
                    if(this.tree[data.index].pid===data.pid){
                        this.tree[data.index].title=data.title;
                    }else {
                        this.init();
                    }
                }
            },
            after(ClassID){
                this.form = {
                    title:'',
                    pid:ClassID,
                    ch_customs_title:"",
                    en_customs_title:"",
                    index:0,
                    platform:[],
                    status:1,
                    keywords:"",
                    description:"",
                    code:"",
                }
                this.showDialog = true;
                this.edit = true;
            },
            sort_change(){
                let pids = arguments;
                for(let i=0; i<pids.length; i++){
                    let pid = pids[i];
                    if(this.changeNodes.indexOfFun(opid=>opid === pid) < 0){
                        this.changeNodes.push(pid);
                    }
                }
            }
        },
        computed:{
            child_ids(){
                return this.tree.child_ids || [];
            }
        },
        components:{
            classifyList,
            genTree,
            genTree2,
            attributeSet,
            editForm:require('./edit-form.vue').default,
            editDialog:require('./edit-dialog.vue').default,
        },
    }
</script>
