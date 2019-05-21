<template>
<page>
    <search :search-data="searchData"
            ref="search"
            :clears="clears"
            :buttons="buttons"
            @change-button="change_button"
            :account-list="accountList"
            @search="search()"></search>
    <div class="mt-xs mb-xs ml-sm">
        <permission tag="ElButton"
                    size="mini"
                    class="inline"
                    @click.native="batchTurn"
                    type="primary ml-xxs"
                    :route="apis.url_account_performance_sync_batch">
            批量同步
        </permission>
    </div>
    <el-table
            v-loading="isLoading"
            size="mini"
            v-resize="{height:41}"
            element-loading-text="玩命加载中..."
            class="scroll-bar"
            :data="table"
            @select-all="select_all"
            @select="selectRow"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope" >
                    <span @click="account_listing(scope.row)" class="color-blue">详情></span>
                </template>
            </el-table-column>
            <el-table-column
                prop="account_code"
                label="账号简称">
            </el-table-column>
            <el-table-column
                label="站点对应卖家等级"
                width="400">
                <el-table-column
                    inline-template
                    label="Global"
                    width="100">
                    <div :class="classObject2(row.global_txt)">{{row.global_txt}}</div>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="US"
                    width="100">
                    <div :class="classObject2(row.us_txt)">{{row.us_txt}}</div>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="UK/IE"
                    width="100">
                    <div :class="classObject2(row.uk_ie_txt)">{{row.uk_ie_txt}}</div>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="DE/CH/AT"
                    width="100">
                    <div :class="classObject2(row.de_ch_at_txt)">{{row.de_ch_at_txt}}</div>
                </el-table-column>
            </el-table-column>
            <el-table-column
                label="综合表现">
                <template slot-scope="scope">
                    <span :class="classObject(scope.row.long_term_status_txt)">
                        {{scope.row.long_term_status_txt}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="非货运表现">
                <template slot-scope="scope">
                    <span  :class="classObject(scope.row.non_shipping_status_txt)">
                        {{scope.row.non_shipping_status_txt}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="货运表现">
                <template slot-scope="scope">
                    <span :class="classObject(scope.row.shipping_status_txt)">
                        {{scope.row.shipping_status_txt}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="SpeedPAK物流标准">
                <template slot-scope="scope">
                    <span :class="classObject(scope.row.account_status_txt)">
                        {{scope.row.account_status_txt}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="海外仓标准">
                <template slot-scope="scope">
                    <span :class="classObject(scope.row.warehouse_status_txt)">
                        {{scope.row.warehouse_status_txt}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="商业计划追踪和评估">
                <template slot-scope="scope">
                    <span :class="classObject(scope.row.pgc_tracking_status_txt)">
                        {{scope.row.pgc_tracking_status_txt}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="物流-美国>$5">
                <template slot-scope="scope">
                        <span :class="classObject(scope.row.e_packet_status_txt)">
                            {{scope.row.e_packet_status_txt}}
                        </span>
                </template>
            </el-table-column>
            <el-table-column
                label="最后更新时间">
                <template slot-scope="scope">
                    <times :time="scope.row.update_time"></times>
                </template>
            </el-table-column>
        </el-table>
    <el-pagination
        class="page-fixed"
        @size-change="size_change"
        @current-change="current_change"
        :current-page="page"
        :page-sizes="[20, 50, 100, 200,500]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
    </el-pagination>
</page>
</template>

<script>
    import {
        api_get_account,
        api_account_performance,
        api_account_performance_sync_batch,
    } from '@/api/ebay-kandeng-public-module';
    import {
        url_account_performance_sync_batch,
    } from '@/api/ebay-kandeng-public-module';
    export default {
        permission: {
            url_account_performance_sync_batch
        },
        name: "index",
        data(){
            return{
                isLoading:false,
                checkAll:false,
                table:[],
                firstLoading:true,
                accountList:[],
                searchData:{
                    accountIds:[],
                    status:'',
                },
                clears:{
                    accountIds:[],
                    status:'',
                },
                pageSize:50,
                page:1,
                count:0,
                selectIds:[],
                buttons: [{label: "全部", value: ""},{label: "正常", value: 1},{label: "危险", value: 2},],
            }
        },
        mounted(){
            this.getList()
        },
        computed:{
        },
        methods:{
            classObject(data){
                return {
                    'color-green': data!=="--"&&data==='正常',
                    'color-red': data!=="--"&&(data!=='正常'&&data!=='超标'),
                    'color-yellow':data!=="--"&&data==='超标'
                }
            },
            classObject2(text){
                return {
                    'color-green':text!=='--'&&(text==='TopRated'||text==='AboveStandard'),
                    'color-red': text!=="--"&&text==='BelowStandard',
                    'color-yellow':text!=="--"&&text==='Standard'
                }
            },
            select_all(selection){
                this.selectIds=selection
            },
            selectRow(selection,row){
                this.selectIds=selection

            },
            batchTurn(){//批量同步账号
                if(this.selectIds.length<=0){
                    this.$message({
                        type:"warning",
                        message: this.$t('ebay-list.pleaseSelect')
                    });
                    return;
                }else {
                    let Ids = this.selectIds.map(res=> res.account_id).join(',');
                    this.$http(api_account_performance_sync_batch,{accountIds:Ids}).then(res=>{
                        this.$message({
                            type:"success",
                            message: res.message||res
                        });
                    }).catch(code=>{
                        this.$message({
                            type:"warning",
                            message:  code.message||code
                        });
                    })
                }
            },
            current_change(page){
                this.page = page;
                this.init();
            },
            size_change(size){
                this.pageSize = size;
                this.init();
            },
            account_listing(row){
                let pramas={
                    account_id:row.account_id
                }
                this.$open(`/account-listing?id=${row.id}`,pramas)
            },
            head_check(){},
            change_button(val, item){
                this.searchData.status=val;
                this.init()
            },
            getList(){
                this.$http(api_get_account,{}).then(res=>{
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        };
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },

            search(){
                this.init();
            },
            init(){
                this.isLoading=true;
                let data = window.clone(this.searchData);
                console.log(data,'data')
                data.accountIds=data.accountIds.join(',');
                data.page=this.page;
                data.pageSize=this.pageSize;
                this.loading=true;
                this.$http(api_account_performance,data).then(res=>{
                    this.isLoading=false;
                    if(res.data instanceof Array){
                        res.data.forEach(row => {
                            row.isCheck = false;
                            row.heighLight = false;
                        });
                        this.table = res.data;
                        this.count = res.count;
                    }else {
                        this.table = [];
                        this.count = 0;
                    }
                    this.loading=false;
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        components:{
            labelItem:require("@/components/label-item.vue").default,
            labelButton: require('@/components/label-buttons.vue').default,
            search:require('./search.vue').default,
        }
    }
</script>

<style lang="stylus">
    .color-blue{
        color #33b2fc;
        cursor pointer
    }
    .input-no-margin {
        .el-select__input {
            width: 196px !important;
            margin-left: 4px !important;
        }
    }
    /*.color-red{
        color:red;
    }
    .color-green{
        color:green;
    }
    .color-yellow{
        color:#FF9900;
    }*/
    .self-width .el-select__tags{
        height: 30px!important;
        width: 268px
        overflow-y: auto;
        >span{
            white-space: inherit;
        }
    }
</style>
