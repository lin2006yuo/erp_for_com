<template>
    <page class="p-export-manage">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-select v-sf.searchChooese v-model="searchData.searchChooese" class="inline s-width-default">
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input class="inline width-sm" v-model="searchData.snText" v-sf.file_name></el-input>
            <label-item label="生成状态：" class="ml-xs">
                <el-select  class="width-xs" v-model="searchData.status" v-sf.status>
                    <el-option v-for="item in status_list"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="添加时间：" class="ml-xs">
                <el-date-picker
                        v-sf.time_start
                        v-model="searchData.time_start"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-sf.time_end
                        v-model="searchData.time_end"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
            <el-table :data="tableData"
                      class="mt-xs"
                      v-resize="{height:41}"
                      v-loading="loading"
                      element-loading-text="玩命加载中">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{ emptyText }}
                </div>
                <el-table-column label="编号" inline-template width="80">
                    <div>
                        <ui-tip :content="row.id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="任务名称" inline-template>
                    <div>
                        <ui-tip :content="row.export_file_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="添加时间" inline-template width="200">
                    <div>
                        <ui-tip :content="row.apply_time | timeFilter" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="生成状态" inline-template width="100">
                    <div>
                        <ui-tip :content="row.status_text" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="生成时间" inline-template width="200">
                    <div>
                        <ui-tip :content="row.exported_time | timeFilter" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="生成人" inline-template width="120">
                    <div>
                        <ui-tip :content="row.applicant_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="操作" inline-template width="120">
                    <div>
                        <a :href="`${host}${row.download_url}`" :class="{exportColor:row.status !== 1, operateColor: row.status === 1}" download @click="is_download(row, $event)">下载报表</a>
                        <permission tag="span" :route="apis.url_delete_export">&nbsp;|&nbsp;</permission>
                        <permission tag="span" :route="apis.url_delete_export" class="operate" @click="remove(row)">删除</permission>
                    </div>
                </el-table-column>
            </el-table>

        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .p-export-manage {
        .exportColor{
            color: #C0CCDA;
        }
        .operateColor{
            color: #69f;
        }
        .operateColor:visited {
            color: #551a8b;
        }
        .operateColor:active {
            color: #551a8b;
        }
    }
</style>
<script>
    import {api_get_export,api_delete_export,url_delete_export} from '@/api/export-manage'
    export default {
        permission:{
            url_delete_export
        },
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘炼森',
                createTime:'2017-8-15',
                updateTime:'2017-8-28'
            }
        },
        refresh(){
            this.search();
        },
        data(){
            return {
                firstLoading: true,
                loading:false,
                host:'',
                goods: [
                    {value: 'file_name', label: '任务名称'},
                    {value: 'export_files_id', label: '编号'},
                ],
                searchData:{
                    searchChooese:'file_name',
                    snText:'',
                    status:'',
                    time_start:'',
                    time_end:'',
                    page:1,
                    pageSize:20
                },

                clears:{
                    searchChooese:'file_name',
                    status:'',
                    time_start:'',
                    time_end:'',
                    page:1,
                    pageSize:20
                },
                tableData:[],
                total:0,
                status_list:[
                    {label:'全部', value:''},
                    {label:'未生成', value:0},
                    {label:'已生成', value:1},
                    {label:'生成失败', value:2}
                ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.time_end){
                            return time.getTime() > this.searchData.time_end;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.time_start){
                            return time.getTime() < this.searchData.time_start;
                        }else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted(){
            this.host = config.apiHost;
            this.init();
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            }
        },
        methods: {
            init(){
                this.loading = true;
                //处理年月日 YYYY-MM-dd
                let data=clone(this.searchData);
                if(this.searchData.time_start){
                    data.time_start=datef('YYYY-MM-dd', this.searchData.time_start.getTime()/1000);
                }else {
                    data.time_start='';
                }
                if(this.searchData.time_end){
                    data.time_end=datef('YYYY-MM-dd', this.searchData.time_end.getTime()/1000);
                }else {
                    data.time_end='';
                };
                data.file_name = this.searchData.searchChooese === 'file_name' ? data.snText : "";
                data.export_files_id = this.searchData.searchChooese === 'export_files_id' ? data.snText : "";
                delete data.searchChooese;
                delete data.snText;
                data.file_name.trim();
                data.export_files_id.trim();
                this.$http(api_get_export, data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            search(){
                this.init();
            },
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.init();
            },
            remove(row){
                this.$confirm('您将删除此信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_export,row.id).then(res=>{
                        this.$message({message:res.message||res, type:'success'});
                        let index = this.tableData.indexOfFun(data=>data.id===row.id)
                        this.tableData.splice(index,1);
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }).catch(code=>{
                    this.$message({
                        type:'info',
                        message:"已取消删除"
                    })
                })
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            is_download(row, e){
                if(row.status !== 1){
                      return e.preventDefault()
                }
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        watch: {},
        props: {},
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            searchCard:require('../../../components/search-card.vue').default
        },
    }
</script>
