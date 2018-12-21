<template>
    <page class="p-product-index">
        <div>
            <search-data :search-data="searchData"
                         @change-status="change_status"
                         :type="type"
                         @search="search"></search-data>
            <el-button type="primary"
                       size="mini"
                       class="ml-sm mt-sm mb-sm"
                       @click.native="add_template">添加产品模板</el-button>
            <table-data :table-data="tableData"
                        :loading="loading"
                        :first-loading="firstLoading"
                        :type="type"
                        @size-change="size_change"
                        @current-change="current_change"
                        @edit="edit"
                        @delete-data="delete_data"></table-data>
            <add-edit-form
                    @submit="submit"
                    :title="addEditTitle"
                    v-model="dialog"
                    :form="form"
                    :type="type"></add-edit-form>
        </div>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_product_list,api_edit_amazon_template,api_amazon_template_del} from '../../../../api/product-category-api';
    export default {
        data() {
            return {
                addEditTitle:'',
                searchData:{
                    site:'',
                    name:'',
                    create_id:'',
                },
                form:{
                    name:"",
                    type:this.type,
                    site:'',
                    default:0,//0是，1否
                    status:false,
                    detail:[]
                },
                status:"",
                dialog:false,
                loading:false,
                firstLoading: true,
                type:2,//类别，2产品，1分类
                tableData:{
                    lists:[],
                    page:1,
                    pageSize:50,
                    total:0,
                }
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            submit(val){
                let index = this.tableData.lists.findIndex(row=>row.id===val.data.id);
                val.data.status = !!val.data.status;
                if(index>-1){
                    this.tableData.lists.splice(index,1,val.data);
                }else{
                    this.tableData.lists.unshift(val.data);
                }
            },
            add_template(){
                this.dialog = true;
                this.addEditTitle = '添加产品模板';
                this.form = {
                        name:"",
                        class_name:'product',
                        type:this.type,
                        site:'',
                        default:0,//0是，1否
                        status:false,
                        detail:[]
                };
            },
            search(){
                this.init();
            },
            size_change(val){
                this.tableData.pageSize = val;
                this.init();
            },
            current_change(val){
                this.tableData.page = val;
                this.init();
            },
            init(){
                this.loading=true;
                let params = clone(this.searchData);
                params.status = this.status;
                params.page = this.tableData.page;
                params.pageSize = this.tableData.pageSize;
                this.$http(api_product_list,params).then(res=>{
                    this.tableData.lists = res.list;
                    this.tableData.lists.forEach(row=>{
                        row.status = row.status?true:false
                    });
                    this.tableData.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.loading=false;
                    this.firstLoading = false;
                    console.log(code,'code');
                })
            },
            change_status(val){
                this.status = val;
                this.init();
            },
            edit(row){
                this.$http(api_edit_amazon_template,row.id).then(res=>{
                    this.dialog = true;
                    this.addEditTitle = `编辑：${this.form.name}`;
                    if(res.data){
                        res.data.status = res.data.status?true:false;
                        res.data.detail.forEach(row=>{
                            row.required = row.required?true:false;
                            row.sku = row.sku?true:false;
                            this.$set(row,'number',1);
                            this.$set(row,'isTurn',false);
                        });
                        this.form = res.data;
                    }else{
                        console.log('暂无编辑数据');
                    }
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            delete_data(row){
                this.$confirm(`您将要删除 ${row.name} 数据, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_amazon_template_del,{ids:row.id}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        let index = this.tableData.lists.findIndex(items=>items.id===row.id);
                        if(index>-1){
                            this.tableData.lists.splice(index,1);
                            this.tableData.total = this.tableData.lists.length;
                        }
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message||code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
        components: {
            tableData:require('./table-data.vue').default,
            searchData:require('./search-data.vue').default,
            addEditForm:require('./add-edit-form.vue').default,
        }
    }
</script>