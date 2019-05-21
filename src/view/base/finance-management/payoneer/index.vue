<template>
    <page class="p-index">
        <card-search :search-data="searchData"
                     :clears="clears"
                     :creator-data="creatorData"
                     @search="init"
                     @change-select="init"></card-search>
        <div class="mt-xs ml-sm">
            <el-button type="primary" size="mini" class="inline" @click.native="add">添加</el-button>
        </div>
        <data-table :table-data="tableData"
                    :loading="loading"
                    @sort-change="sort_change"
                    @look-edit="look_edit"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"></data-table>
        <add-moudel v-model="addTable"
                    :add-data="addData"
                    :title="title"
                    :creator-data="creatorData"
                    @submit="init"></add-moudel>
        <look-moudel v-model="lookPk" :title="title"
                     :look-data="lookData"></look-moudel>
        <edit-moudel v-model="editTable" :title="title"
                     :creator-data="creatorData"
                     @submit="init"
                     :look-data="lookData"></edit-moudel>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_payoneer,api_get_payoneer_edit,api_user_staffs} from '@/api/payoneer';
    export default{
        data(){
            return{
                searchData:{
                    status:'',
                    operator_id:'',
                    snType:'account_name',
                    snText:'',
                },
                clears:{
                    operator_id:'',
                    snType:'account_name',
                    snText:'',
                },
                loading:false,
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50,
                    count:0
                },
                addData:{},
                lookData:{},
                addTable:false,
                title:'',
                lookPk:false,
                creatorData:[],
                editTable:false,
                order_by:'',
                sort:'',
            }
        },
        mounted(){
            this.init();
            this.$http(api_user_staffs).then(res=>{
                this.creatorData=res.map(row=>{
                    return {label:row.realname,value:row.id};
                });
            }).catch(error=>{
                error&&this.$message({type:'error',message:error.message||error})
            });
        },
        methods:{
            init(){
                let data = window.clone(this.searchData);
                this.loading = true;
                this.order_by&&this.$set(data,'order_by',this.order_by);
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.sort&&this.$set(data,'sort',this.sort);
                this.$http(api_get_payoneer,data).then(res=>{
                    res.data.forEach(row=>{
                        row.status = row.status === 1 ? true : false;
                    });
                    this.tableData.data = res.data;
                    this.tableData.count = res.count;
                    this.loading = false;
                }).catch(code=>{
                    console.log(code);
                    this.loading = false;
                });
            },
            add(){
                this.addData = {
                    account_name:'',
                    email_password:'',
                    registered_name:'',
                    company_name:'',
                    belong:'',
                    phone:'',
                    birthday:'',
                    client_code:'',
                    encrypted_data:'',
                    operator_id:'',
                    operator:'',
                };
                this.title='添加Payoneer账户';
                this.addTable = true;
            },
            look_edit(row,string){
                this.$http(api_get_payoneer_edit,row.id).then(row=>{
                    this.title = `${string}：Payoneer账户`;
                    this.lookData={
                        id:row.id,
                        account_name:row.account_name,
                        email_password:row.email_password,
                        registered_name:row.registered_name,
                        company_name:row.company_name,
                        belong:row.belong,
                        phone:row.phone,
                        birthday:row.birthday,
                        client_code:row.client_code,
                        encrypted_data:row.encrypted_data,
                        operator_id:row.operator_id,
                        operator:row.operator
                    };
                    if(string==='查看'){
                        this.lookPk = true;
                    }else {
                        this.editTable = true;
                    }
                })
            },
            sort_change(val){
                if(!val.column||!val.column.label)return;
                switch (val.column.label){
                    case '登陆邮箱':
                        this.order_by='account_name';
                        break;
                    default:
                        this.order_by='';
                }
                this.sort = val.order==='descending'?'desc':'asc';
                this.init();
            },
            handleSizeChange(val) {//------------分页
                this.tableData.page = 1;
                this.tableData.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页
                this.tableData.page = val;
                this.init();
            },
        },
        components:{
            cardSearch: require("./card-search.vue").default,
            dataTable: require("./data-table.vue").default,
            addMoudel: require("./add-moudel.vue").default,
            lookMoudel: require("./look-moudel.vue").default,
            editMoudel: require("./edit-moudel.vue").default,
        }
    }
</script>