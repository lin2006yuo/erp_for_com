<template>
    <page>
        <card-search :form="form" :clears="clears" @search="search" @status-select="status_select"></card-search>
        <el-button size="mini" type="primary" @click="add" class="mt-xs ml-sm mb-xs">添加</el-button>
        <table-list :loading="loading"
                    :first-time="firstTime"
                    :tableData="tables"
                    @edit="edit"
                    @del="del"
                    @submit="init"></table-list>
        <edit-model :title="title"
                    :sub="sub"
                    :is-edit="isEdit"
                    v-model="edit_show"
                    :form="edit_form"
                    @search="search" ></edit-model>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="tables.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tables.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>

<style scoped>

</style>
<script>
    import {api_channel_node,api_automatic_edit,api_delete_action,api_get_node} from '@/api/platform-automatic-login'
    export default {
        data() {
            return {
                loading: false,
                firstTime: true,
                show:false,
                edit_show:false,
                title:'',
                edit_form:{
                    channel_id: '',
                    channel_site: "",
                    node_info: [{
                        node:'',
                        node_value:'',
                        parsing_type:0,
                        node_type:0
                    }],
                    relation_module: '',
                    type: "1",
                    verification_node_info: [{
                        node:'',
                        node_value:'',
                        parsing_type:0,
                        node_type:0
                    }],
                    verification_website_url: "",
                    website_url: ""
                },
                isEdit:false,
                form:{
                    channel_id:'',
                    channel_site:'',
                    type:1,
                    relation_module:''
                },
                clears:{
                    channel_id: '',
                    channel_site:''
                },
                tables:{
                    page: 1,
                    pageSize: 50,
                    lists:[]
                },
                total:null,
                sub:[]
            }
        },
        mounted(){
            this.init();
            this.sub_list();
        },
        methods: {
            edit(val){
                this.$http(api_automatic_edit,val.id).then(res=>{
                    this.isEdit = true;
                    this.title = `编辑`;
                    this.edit_form = res;
                    if(this.edit_form.create_time===this.edit_form.update_time){
                        this.edit_form.updater_id = '-'
                    }
                    if(!this.edit_form.node_info||( !!this.edit_form.node_info && !this.edit_form.node_info.length)){
                        this.edit_form.node_info = [{node: "", node_value: "", parsing_type: 0, node_type: 0}];
                    }
                    if(!this.edit_form.verification_node_info||( !!this.edit_form.verification_node_info && !this.edit_form.verification_node_info.length)){
                        this.edit_form.verification_node_info = [{node: "", node_value: "", parsing_type: 0, node_type: 0}];
                    }
                    this.edit_show = true;
                }).catch(err=>{
                    console.log(err)
                })
            },
            del(val){
                let title = `你将删除${val.channel_name}平台自动登录，确认此操作吗？`;
                this.$confirm(`${title}`,'提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.$http(api_delete_action,val.id).then(res=>{
                        this.search();
                        this.$message({
                            type: 'success',
                            message:res.message || res
                        });
                    }).catch(err=>{
                        console.log(err)
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            add(){
                Object.keys(this.edit_form).forEach(key => {
                    this.edit_form[key] = "";
                });
                Object.keys(this.edit_form).forEach(key=>{
                    if(key === 'type'){
                        this.edit_form[key] = '1';
                    }
                    if(key === 'node_info' || key === 'verification_node_info'){
                        this.edit_form[key] = [{
                            node:'',
                            node_value:'',
                            parsing_type:0,
                            node_type:0
                        }];
                    }
                });
                this.isEdit = false;
                this.edit_show = true;
                this.title='添加'
            },
            search() {
                this.init()
            },
            init_params(){
                let data = window.clone(this.form);
                this.tables.page&&(data.page=this.tables.page);
                this.tables.pageSize&&(data.pageSize=this.tables.pageSize);
                return data
            },
            init(){
                this.loading = true;
                let data = this.init_params();
                this.$http(api_channel_node,data).then(res=>{
                    this.loading = false;
                    this.firstTime = false;
                    this.tables.lists = res.data;
                    this.total =res.count
                }).catch(err=>{
                    this.loading =true;
                    console.log(err)
                })
            },
            // 获取节点类型
            sub_list(){
                this.$http(api_get_node).then(res=>{
                    this.sub = res.data.map(row=>{
                        return{
                            label:row.name,
                            value:row.value
                        }
                    });
                });
            },
            handle_size_change(val) {
                this.tables.pageSize = val;
                this.init()
            },
            handle_current_change(val) {
                this.tables.page = val;
                this.init()
            },
            status_select(val){
                this.form.type=val;
                this.init();
            }
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default,
            editModel:require('./edit-model').default
        }
    }
</script>

