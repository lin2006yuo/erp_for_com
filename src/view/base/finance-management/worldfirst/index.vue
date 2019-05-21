<template>
    <page class="p-index">
        <card-search :search-data="searchData"
                     @search="init"
                     :clears="clears"
                     @change-select="init" :creator-data="creatorData"></card-search>
        <div class="mt-xs ml-sm">
            <el-button type="primary" size="mini" class="inline" @click.native="add">添加</el-button>
        </div>
        <data-table :table-data="tableData"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    @look-edit="look_edit"></data-table>
        <add-world v-model="addTable"
                   :add-list="addList"
                   @submit="init"
                   :title="title"
                   :creator-data="creatorData"></add-world>
        <look-world v-model="lookWf" :title="title"
                    :look-data="lookData"></look-world>
        <edit-moudel v-model="editTable" :title="title"
                     :creator-data="creatorData"
                     :look-data="lookData"
                     @submit="init"></edit-moudel>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_worldfirst,api_get_worldfirst_edit,api_user_staffs} from '@/api/worldfirst';
    export default{
        data(){
            return{
                loading:false,
                searchData:{
                    status:'',
                    snType:'wf_account',
                    snText:'',
                    operator_id:''
                },
                clears:{
                    snType:'wf_account',
                    snText:'',
                    operator_id:''
                },
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50,
                    count:0
                },
                isInvalid:'',
                addTable:false,
                editTable:false,
                addList:{},
                title:'',
                lookWf:false,
                lookData:{},
                creatorData:[]
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
            add(){
                this.addList = {
                    ip_name:'',
                    ip_address:'',
                    wf_account:'',
                    wf_password:'',
                    encrypted_answers:'',
                    operator_id:'',
                    belong:'',
                    server_id:'',
                };
                this.addTable = true;
                this.title = '添加WF万里汇账户基本信息';
            },
            init(){
                let data = window.clone(this.searchData);
                this.loading = true;
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.$http(api_get_worldfirst,data).then(res=>{
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
            look_edit(row,string){
                this.$http(api_get_worldfirst_edit,row.id).then(res=>{
                    this.title = `${string}：${row.ip_name} WF万里汇账户基本信息`;
                    this.lookData = {
                        id:res.id,
                        ip_name:res.ip_name,
                        ip_address:res.ip_address,
                        wf_account:res.wf_account,
                        wf_password:res.wf_password,
                        encrypted_answers:res.encrypted_answers,
                        operator_id:res.operator_id,
                        belong:res.belong,
                        operator:res.operator,
                        server_id:res.server_id
                    };
                    if(string==='查看'){
                        this.lookWf = true;
                    }else {
                        this.editTable = true;
                    }
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
            addWorld: require("./add-world.vue").default,
            lookWorld: require("./look-world.vue").default,
            editMoudel: require("./edit-moudel.vue").default,
        }
    }
</script>