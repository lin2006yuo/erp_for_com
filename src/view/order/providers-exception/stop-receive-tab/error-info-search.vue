<template>
    <page class="p-dialog-error-info-search">
        <page-dialog :title="'错误信息解决方案'" v-model="show" size="large" :height="'90%'" @open="open" :close-on-click-modal="true">
            <div class="mb-sm">
                <search-card :params="formData" :clears="clears" @search="search">
                    <label-item label="物流错误信息：">
                        <el-input @keyup.native.enter="search" v-model="formData.error_info" placeholder="可模糊搜索"></el-input>
                    </label-item>
                    <label-item class="ml-sm mr-sm" label="物流渠道：">
                        <el-input @keyup.native.enter="search" v-model="formData.shipping_name" placeholder="可模糊搜索"></el-input>
                    </label-item>
                </search-card>
                <el-table class="mt-sm scroll-bar"
                          border :data="tableData"
                          highlight-current-row
                          v-resize="{height:90}"
                          v-loading="loading"
                          element-loading-text="玩命加载中...">
                    <div slot="empty" class="no-data-reminder">
                        <i></i>
                        {{emptyText}}
                    </div>
                    <el-table-column label="" width="40" inline-template>
                        <div class="p-table-list-td-text" :title="row.id">{{row.id}}</div>
                    </el-table-column>
                    <el-table-column label="错误信息" min-width="120" inline-template>
                        <div class="p-table-list-td-text" :title="row.providers_error_info">{{row.providers_error_info}}</div>
                    </el-table-column>
                    <el-table-column label="解决方案" min-width="200" inline-template>
                        <div class="p-table-list-td-text" :title="row.providers_error_solution">{{row.providers_error_solution}}</div>
                    </el-table-column>
                    <el-table-column label="物流渠道" min-width="80" inline-template>
                        <div class="p-table-list-td-text" :title="row.shipping_name">{{row.shipping_name}}</div>
                    </el-table-column>
                    <el-table-column label="相关负责人" min-width="50" inline-template>
                        <div class="p-table-list-td-text" :title="row.respon_people">{{row.respon_people}}</div>
                    </el-table-column>
                </el-table>
            </div>
            <el-row slot="footer" style="line-height: 27px;" class="dialog-footer">
                <el-pagination
                    class="inline"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
                <el-button size="mini" class="inline ml-xs" @click.native="keep" type="primary">确定</el-button>
                <el-button size="mini" class="inline" @click.native="close">关 闭</el-button>
            </el-row>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-dialog-error-info-search{
        .page-dialog .dialog__body{
            padding: 0px 10px 5px 10px;
            color: #475669;
            font-size: 1.2rem;
            overflow-x: hidden;
            overflow-y: hidden;
            box-sizing: border-box;
            height: 100%;
        }
    }

</style>
<script>
    import {api_get_packages_error} from '@/api/error-info-solution'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'蓝术术',
                createTime:'2018-10-18',
                updateTime:'2018-10-19'
            }
        },
        data() {
            return {
                show: this.value,
                formData:{
                    error_info:'',
                    shipping_name:''
                },
                clears:{},
                tableData:[],
                firstLoading:true,
                loading:false,
                total:0,
                page:1,
                pageSize:50
            }
        },
        methods: {
            open(){
                this.formData.error_info = '';
                this.formData.shipping_name = '';
                this.search();
            },
            search(){
                let data = window.clone(this.formData);
                data.page = this.page;
                data.pageSize = this.pageSize;
                this.loading = true;
                this.$http(api_get_packages_error,this.formData).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.search()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.search();
            },
            close() {
                this.show = false;
            },
            keep(){
                this.show = false;
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'-- --';
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
        },
        props: {
            value: {
                required: true,
                type: Boolean
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            searchCard:require('@/components/search-card').default,
            labelItem:require('@/components/label-item').default
        }
    }
</script>
