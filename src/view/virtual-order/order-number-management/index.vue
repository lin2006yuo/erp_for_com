<template>
    <page>
        <search-module @init-data="init_data"></search-module>
        <div class="mt-xs mb-xs">
            <el-button @click="add" type="primary" class="ml-sm" size="mini">添加</el-button>
            <el-button type="primary" class="ml-sm" size="mini" @click.native="showImport=true">批量导入</el-button>
            <request-button :request="delete_select"
                       :disabled="canDelete"
                       class="ml-sm">批量删除
            </request-button>
        </div>
        <table-module :search-data="searchData"
                      :newOrder="newOrder"
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
        <import-excel v-model="showImport" @files-update="init_data(this.searchData)" :export-api="export_transfer_template" :import-api="import_transfer" :select-list="checkData"></import-excel>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_order, api_delete_orders,api_post_virtual_hold_import_transfer,api_get_import_template} from '../../../api/order-number-management'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-10-11',
                updateTime:'2017-10-13'
            },
        },
        refresh(){
            this.$refs.table_module.init();
        },
        data(){
            return {
                export_transfer_template: api_get_import_template,
                import_transfer: api_post_virtual_hold_import_transfer,
                searchData:{},
                tableData:[],
                visible:false,
                action:{},
                editData:{
                    channel_id:'',
                    account_id:'',
                    order_number:''
                },
                checkData:[],
                newOrder:{},
                showImport: false
            }
        },
        mounted(){},
        methods: {
            refresh(){
                this.$refs.table_module.init();
            },
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            add(){
                this.action = {title:'添加账号资料', value:'add'};
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
                this.editData.channel_id = '';
                this.visible = true;
            },
            newData(data){
                this.newOrder = data;
            },
            edit(row){
                this.action = {title:`编辑虚拟订单号`, value:'edit'};
                this.$http(api_get_order, row.id).then(res=>{
                    this.$set(res, 'creator', row.creator);
                    if(res.order_number) res.order_number = JSON.parse(res.order_number).join('\n');
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
                    return this.$http(api_delete_orders, {ids:ids}).then(res=>{
                        this.$refs.table_module.delete_orders();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({
                            type: 'error',
                            message: '删除失败!'
                        });
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
        },
        computed: {
            canDelete(){
                if(this.checkData.length){
                    return false;
                } else {
                    return true;
                }
            }
        },
        watch: {

        },
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addEdit:require('./add-edit.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
            importExcel: require('./import-excel.vue').default,
        },
    }
</script>
