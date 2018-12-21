<template>
    <page>
        <card-search :form="form" :clears="clears" @search="search"></card-search>
        <el-button size="mini" type="primary" @click="add" class="mt-xs ml-sm mb-xs">添加</el-button>
        <table-list :loading="loading" :first-time="firstTime" :tableData="tables" @edit="edit" @del="del"></table-list>
        <add-model :title="title" v-model="show" @search="search"></add-model>
        <edit-model :title="title" v-model="edit_show" :form="edit_form" @search="search" ></edit-model>
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
    import {api_channel_node,api_automatic_edit,api_automatic_update,api_delete_action} from '../../../api/platform-automatic-login'
    export default {
        data() {
            return {
                loading: false,
                firstTime: true,
                show:false,
                edit_show:false,
                title:'',
                edit_form:{},
                form:{
                    channel_id:'',
                    channel_site:'',
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
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            edit(val){
                this.$http(api_automatic_edit,val.id).then(res=>{
                    this.title = `编辑`;
                    this.edit_form = res;
                    if(this.edit_form.create_time===this.edit_form.update_time){
                        this.edit_form.updater_id = '-'
                    }
                    this.$nextTick(()=>{
                        this.edit_show = true;
                    })
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
                this.show = true;
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
                    this.tables.page =Number(res.page);
                    this.tables.pageSize = Number(res.pageSize);
                    this.total =res.count
                }).catch(err=>{
                    this.loading =true;
                    console.log(err)
                })
            },
            handle_size_change(val) {
                this.tables.pageSize = val;
                this.init()
            },
            handle_current_change(val) {
                this.tables.page = val;
                this.init()
            },
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default,
            addModel:require('./add-model').default,
            editModel:require('./edit-model').default
        }
    }
</script>

