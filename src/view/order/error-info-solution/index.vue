<template>
    <page class="c-demand-schedules-index">
        <card-search @search="search" @button-change="button_change" :form="searchData" :clears="clears"></card-search>
        <div class="mt-sm">
            <permission class="ml-sm inline"
                        tag="ElButton"
                        type="primary"
                        size="mini"
                        :route="apis.url_get_packages_error_add"
                        @click="add_package">新增
            </permission>
        </div>
        <table-module class="mt-sm"
                      :loading="loading"
                      :first-loading="firstLoading"
                      @edit="edit"
                      :search-data="searchData"
                      :table-data="tableData"></table-module>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <add-edit v-model="addEditDialog" :title="title" :edit-type="editType" @save="save" :formData="formData"></add-edit>
    </page>
</template>
<style lang="stylus">
    .c-demand-schedules-index{
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: 1px;
        }
    }
</style>
<script>
    import {api_get_packages_error,url_get_packages_error_add} from '@/api/error-info-solution'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'蓝术术',
                createndtime:'2018-10-18',
                updatendtime:'2018-10-19'
            }
        },
        data() {
            return {
                firstLoading:true,
                loading:false,
                searchData:{
                    type:'creator',
                    list_type:1,
                    error_info:'',
                    creator_id:'',
                    updater_id:'',
                    time_type:'create_time',
                    starttime:'',
                    endtime:'',
                    shipping_name:''
                },
                clears:{
                    type:'creator',
                    error_info:'',
                    creator_id:'',
                    updater_id:'',
                    time_type:'create_time',
                    starttime:'',
                    endtime:'',
                    shipping_name:''
                },
                page:1,
                pageSize:20,
                total:0,
                tableData:[],
                addEditDialog:false,
                title:'',
                formData:{},
                editType:'',
                initCount:0
            }
        },
        permission:{
            url_get_packages_error_add
        },
        refresh(){
            this.init();
        },
        mounted(){
            this.init();
        },
        methods:{
            init_params(){
                let data = window.clone(this.searchData);
                if(!!data.starttime){
                    data.starttime = datef('YYYY-MM-dd', this.searchData.starttime.getTime()/1000);
                }else{
                    delete data.starttime;
                }
                if(!!data.endtime){
                    data.endtime = datef('YYYY-MM-dd', this.searchData.endtime.getTime()/1000);
                }else{
                    delete data.endtime;
                }
                if(data.error_info.trim()){
                    data.error_info.trim();
                }else{
                    delete data.error_info;
                }
                if(data.shipping_name.trim()){
                    data.shipping_name.trim();
                }else{
                    delete data.shipping_name;
                }
                data.creator_id===''&&delete data.creator_id;
                data.updater_id===''&&delete data.updater_id;
                data.page = this.page;
                data.pageSize = this.pageSize;
                return data
            },
            init(){
                let data = this.init_params();
                this.loading = true;
                this.$http(api_get_packages_error,data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            button_change(){
                this.initCount++;
                if(this.initCount>1){
                    this.init();
                }
            },
            search(){
                this.init()
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.init()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            add_package(){
                this.title = '新增解决方案';
                this.formData = {
                    list_type:this.searchData.list_type,
                    error_info:'',
                    respon_people:'',
                    shipping_name:'',
                    error_solution:''
                };
                this.editType = 'add';
                this.addEditDialog = true;
            },
            save(type,data){
                if(type==='add'){
                    if(data.list_type===this.searchData.list_type) {
                        this.tableData.unshift(data);
                        this.total += 1;
                    }
                }else {
                    let find = this.tableData.find(row=>row.id===data.id);
                    if(!!find){
                        Object.keys(find).forEach(key=>{
                            find[key] = data[key];
                        });
                    }
                }
            },
            edit(row){
                this.formData = {
                    list_type:row.list_type,
                    error_info:row.providers_error_info,
                    respon_people:row.respon_people,
                    error_solution:row.providers_error_solution,
                    shipping_name:row.list_type===1?row.shipping_name:'',
                    id:row.id
                };
                this.title = '编辑解决方案';
                this.editType = 'edit';
                this.addEditDialog = true;
            }
        },
        components: {
            cardSearch:require('./card-search').default,
            tableModule:require('./table-module').default,
            addEdit:require('./add-edit').default
        }
    }
</script>
