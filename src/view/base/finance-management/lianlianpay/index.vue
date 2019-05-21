<template>
    <page class="p-index">
        <card-search :search-data="searchData"
                     @search="init"
                     :clears="clears"
                     :creatorData="creatorData"
                     @change-select="init"></card-search>
        <div class="mt-xs ml-sm">
            <el-button type="primary" size="mini" class="inline" @click.native="add">添加</el-button>
        </div>
        <data-table :table-data="tableData" :loading="loading"
                    @search="init"
                    @look-edit="look_edit"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"></data-table>
        <add-moudel v-model="addTable"
                    :creator-data="creatorData"
                    :add-data="addData"
                    @submit="init" :title="title"
                    :sense-disabled="senseDisabled"></add-moudel>
        <edit-moudel  v-model="editTable"
                      :edit-data="editData"
                      :title="title"
                      :creator-data="creatorData"
                      :sense-disabled="senseDisabled"
                      @submit="init"></edit-moudel>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_lianlianpay,api_get_lianlianpay_edit,api_user_staffs} from '@/api/lianlianpay';
    export default{
        data(){
            return{
                loading:false,
                searchData:{
                    status:'',
                    channel_id:'',
                    site_code:'',
                    account_code:'',
                    ip_name:'',
                    operator_id:'',
                },
                clears:{
                    status:'',
                    channel_id:'',
                    site_code:'',
                    account_code:'',
                    ip_name:'',
                    operator_id:'',
                },
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50,
                    count:0
                },
                addTable:false,
                title:'',
                addData: {},
                editData:{},
                senseDisabled:true,
                creatorData:[],
                editTable:false
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
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.$http(api_get_lianlianpay,data).then(res=>{
                    res.data.forEach(row=>{
                        row.status = row.status === 1 ? true : false;
                        this.$set(row,'site_code',row.site_code.length?JSON.parse(row.site_code).join(','):'');
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
                    channel_id:'',
                    site_code:'',
                    account_id:'',
                    ip_address:'',
                    lianlian_account:'',
                    lianlian_name:'',
                    operator_id:'',
                    server_id:''
                };
                this.title = `添加lianlian账户收款信息`;
                this.addTable = true;
                this.senseDisabled = true;
            },
            look_edit(row,string){
                this.$http(api_get_lianlianpay_edit,row.id).then(res=>{
                    this.title = `${string}：${row.account_code} lianlian账户收款`;
                    this.editData = {
                        id:res.id,
                        channel_id:res.channel_id,
                        site_code:res.site_code,
                        account_id:res.account_id,
                        ip_address:res.ip_address,
                        lianlian_account:res.lianlian_account,
                        lianlian_name:res.lianlian_name,
                        operator_id:res.operator_id,
                        server_id:res.server_id,
                        operator:res.operator,
                        account_code:res.account_code,
                        channel:row.channel
                    };
                    if(this.title.includes('查看')){
                        this.senseDisabled = false;
                        this.$set(this.editData,'site_code',this.editData.site_code.length?this.editData.site_code.join(','):'');
                    }else {
                        this.senseDisabled = true;
                    };
                    this.editTable = true;
                }).catch(error=>{
                    error&&this.$message({type:'error',message:error.message||error})
                });

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
            editMoudel: require("./edit-moudel.vue").default,
        }
    }
</script>