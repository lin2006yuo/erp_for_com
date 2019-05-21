<template>
    <page>
        <search-module @init-data="init_data" ref="search_module"></search-module>
        <div class="mt-xs mb-xs">
            <el-button @click="add" type="primary" class="ml-sm" size="mini">添加</el-button>
            <request-button :request="delete_select"
                       :disabled="canDelete"
                       class="ml-sm">批量删除
            </request-button>
        </div>
        <table-module :search-data="searchData"
                      :newBuyer="newBuyer"
                      ref="table_module"
                      @edit="edit"
                      @selectCheck="select">
        </table-module>
        <add-edit :edit-data="editData"
                  v-model="visible"
                  @newData="newData"
                  :searchData="searchData"
                  :action="action">
        </add-edit>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_batch_delete_buyers, api_edit_buyers} from '../../../api/buying-management';
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-11-1',
                updateTime:'2017-11-1'
            },
        },
        refresh(){
            this.$refs.table_module.init();
        },
        data(){
            return {
                searchData:{},
                tableData:[],
                visible:false,
                action:{},
                editData:{
                    channel_id:0,
                    email:'',
                    email_password:'',
                    username:'',
                    password:'',
                    server_id:'',
                    status:0,
                    account:{
                        label:'',
                        value:''
                    },
                    account_create_time:''
                },
                checkData:[],
                newBuyer:{},
            }
        },
        mounted(){},
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            add(){
                this.action = {title:'添加买手', value:'add'};
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
                this.editData.channel_id = 0;
                this.editData.status = 0;
                this.editData.account = {
                    label:'',
                    value:''
                };
                this.visible = true;
            },
            edit(row){
                this.action = {title:`编辑买手信息`, value:'edit'};
                this.$http(api_edit_buyers, row.id).then(res=>{
                    if(res.account_create_time){
                        res.account_create_time= res.account_create_time * 1000;
                    }
                    res.account = {
                        label:res.account.account_creator_name,
                        value:res.account.account_creator
                    };
                    this.editData = res;
                    this.visible = true;
                }).catch(code=>{
                    console.log(code)
                });
            },
            delete_select(){
                let ids = this.checkData;
                return this.$confirm(`您将删除这${ids.length}项,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_batch_delete_buyers, {ids:ids}).then(res=>{
                        this.$refs.table_module.delete_orders();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.checkData = [];
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            select(checkData){
                this.checkData = checkData;
            },
            newData(data){
                this.newBuyer = data;
            },
        },
        computed: {
            canDelete(){
                return this.checkData.length <= 0;
            }
        },
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
            addEdit:require('./add-edit.vue').default
        },
    }
</script>
