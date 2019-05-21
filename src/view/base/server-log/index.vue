<template>
    <page>
        <search-card class="mb-sm" @search="search" @enter='search' :params="searchData" :clears="clears">
            <el-select class="inline s-width-small"
                       v-sf.snType
                       v-model="searchData.snType">
                <el-option v-for="item in conditionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline mr-sm"
                      :placeholder="`请输入${changeLabel}...`"
                      v-model="searchData.snText"
                      v-sf.server
                      @keyup.enter.native="serverEnter($event)"></el-input>
            <label-item label="访问时间：" class="mr-sm">
                <el-date-picker
                        v-model="searchData.date_b"
                        v-sf.date_b
                        type="date"
                        placeholder="选择日期"
                        class="inline date">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_e"
                        v-sf.date_e
                        type="date"
                        placeholder="选择日期"
                        class="inline date">
                </el-date-picker>
            </label-item>
        </search-card>
        <el-table :data="tableData"
                  class="scroll-bar"
                  v-loading="loading"
                  v-resize={height:41}
                  element-loading-text="玩命加载中"
                  highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="ID" inline-template>
                <span>{{row.id}}</span>
            </el-table-column>
            <el-table-column label="用户名" inline-template>
                <div>
                    <ui-tip :content="row.username" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="姓名" inline-template>
                <div>
                    <ui-tip :content="row.realname" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="角色" inline-template>
                <div>
                    <ui-tip :content="row.role" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="平台账号" inline-template>
                <div>
                    <ui-tip :content="row.visit_account_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="服务器名" inline-template>
                <div>
                    <ui-tip :content="row.visit_server_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="访问的IP地址" inline-template>
                <div>
                    <ui-tip :content="row.ip" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="访问时间" inline-template>
                <div>
                    <ui-tip :content="row.visit_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_serverlog} from '../../../api/server-management'
    export default {
    	page:{devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-8-5',
                updateTime:'2017-8-22'
            }},
        refresh(){
            this.init();
        },
        data(){
            return {
                loading: false,
                searchData:{
                    snType:'server',
                    snText:'',
                    date_b: (Date.now() - (6 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    page:1,
                    pageSize:20
                },
                clears:{
                    snType:'server',
                    snText:'',
                    date_b: (Date.now() - (6 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    page:1,
                    pageSize:20
                },
                tableData:[],
                total:0,
                conditionList: [
                    {value: 'server', label: '服务器名'},
                    {value: 'account_code', label: '平台账号'},
                    {value: 'user_name', label: '用户名'}
                ],

                firstLoading:true
            }
        },
        mounted(){
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
                let data=clone(this.searchData);
                //处理年月日 YYYY-MM-dd
                data.date_b=this.searchData.date_b?datef('YYYY-MM-dd', this.searchData.date_b/1000):'';
                data.date_e=this.searchData.date_e?datef('YYYY-MM-dd', this.searchData.date_e/1000):'';
                this.$http(api_get_serverlog, data).then(res=>{
                    this.loading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                    this.firstLoading = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
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
            search(){
                this.init();
            },
            //清空搜索
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.init();
            },
            serverEnter(){
                this.init();
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading?'请查询数据':'暂无数据'
            },
            changeLabel() {
                if (this.searchData.snType === 'server') {
                    return `服务器`;
                } else if(this.searchData.snType === 'account_code'){
                    return `平台账号`;
                } else{
                    return `用户名`;
                }
            }
        },
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            searchCard:require('../../../components/search-card.vue').default
        },
    }
</script>
