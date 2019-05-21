<template>
    <page>
        <search-module :search-data="searchData" @search="init" @channel-remote="channel_remote"></search-module>
        <div class="mt-xs mb-xs">
            <el-button @click="add" type="primary" class="ml-sm" size="mini">添加</el-button>
            <el-button type="primary" class="ml-sm" size="mini" @click.native="showImport=true">批量导入</el-button>
            <request-button :request="delete_select"
                       :disabled="canDelete"
                       class="ml-sm">批量删除
            </request-button>
        </div>
        <table-module :table-data="tableData"
                      :loading="loading"
                      @edit="edit"
                      @select-change="select_change">
        </table-module>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <add-edit :edit-data="editData"
                  :channel-list="channelList"
                  v-model="visible"
                  @update="update">
        </add-edit>
        <import-excel v-model="showImport" @files-update="init" :export-api="export_transfer_template" :import-api="import_transfer" :select-list="checkData.map(row=>row.id)"></import-excel>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_get_order,
        api_delete_orders,
        api_post_virtual_hold_import_transfer,
        api_get_import_template,
        api_order_list
    } from '../../../api/order-number-management'
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
            this.init();
        },
        data(){
            return {
                loading:false,
                export_transfer_template: api_get_import_template,
                import_transfer: api_post_virtual_hold_import_transfer,
                searchData:{
                    channel_id:0,
                    account_id:'',
                    order_number:'',
                    status:''
                },
                channelList:[],
                tableData:[],
                page:1,
                pageSize:20,
                total:0,
                visible:false,
                editData:{
                    title:'',
                    type:'',
                    channel_id:'',
                    account_id:'',
                    order_number:''
                },
                checkData:[],
                showImport: false
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            channel_remote(channelList){
                this.channelList = channelList;
            },
            init(){
                this.loading = true;
                let data = this.get_params();
                this.$http(api_order_list, data).then(res=>{
                    this.loading = false;
                    res.data.forEach(row=>{
                        row.order_number = JSON.parse(row.order_number);
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            get_params(){
                let data = window.clone(this.searchData);
                data.page = this.page;
                data.pageSize = this.pageSize;
                return data
            },
            //分页器
            handle_size_change(val){
                this.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.page = val;
                this.init();
            },
            add(){
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
                this.editData.title = '添加账号资料';
                this.editData.type = 'add';
                this.visible = true;
            },
            update(data, type){
                data.order_number = JSON.parse(data.order_number);
                if(type==='add'){
                    this.tableData.unshift(data);
                    this.total++;
                }else{
                    let find = this.tableData.find(row=>row.id===data.id);
                    if(find){
                        Object.assign(find,data);
                    }
                }
            },
            edit(row){
                this.$http(api_get_order, row.id).then(res=>{
                    this.$set(res, 'creator', row.creator);
                    if(res.order_number) res.order_number = JSON.parse(res.order_number).join('\n');
                    Object.assign(this.editData, res);
                    this.editData.title = '编辑虚拟订单号';
                    this.editData.type = 'edit';
                    this.visible = true;
                }).catch(code=>{
                    console.log(code)
                });
            },
            delete_select(){
                let ids = this.checkData.map(row=>row.id);
                return this.$confirm(`您将删除这${ids.length}项,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_delete_orders, {ids:ids}).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        ids.forEach(id=>{
                            let index = this.tableData.findIndex(row=>row.id===id);
                            if(index>-1){
                                this.tableData.splice(index,1);
                            }
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
            select_change(checkData){
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
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addEdit:require('./add-edit.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
            importExcel: require('./import-excel.vue').default,
        },
    }
</script>
