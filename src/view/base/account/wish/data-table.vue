<template>
    <el-row class="p-wish-table">
        <el-table
                v-resize="{height:41}"
                :data="wishData.list"
                v-loading="loading"
                highlight-current-row
                @sort-change="sort_change"
                @selection-change="selectionChange"
                element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column property="code" sortable
                             label="简称" align="center"
                             width="150"></el-table-column>
            <el-table-column label="wish账户" sortable
                             inline-template>
                <div>
                    <ui-tip :content="row.account_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="密钥有效期">
                <ui-tip :content="row.expiry_time | filterRegisterTime" :width="98" v-copy></ui-tip>
            </el-table-column>
            <!--<el-table-column width="90" inline-template label="销售员">-->
                <!--<ui-tip :content="row.seller_name" :width="98" v-copy></ui-tip>-->
            <!--</el-table-column>-->
            <!--<el-table-column width="90" inline-template label="客服">-->
                <!--<ui-tip :content="row.customer_name" :width="98" v-copy></ui-tip>-->
            <!--</el-table-column>-->
            <el-table-column label="销售员" inline-template>
                <div class="accout-display">
                   <span v-for="(item,sellerIndex) in row.seller" :class="parseInt(item.on_job)!==1?'loseStatus':''" :key="item.customer_id">
                       {{item.seller_name}}{{sellerIndex<(row.seller.length-1)?',':''}}
                   </span>
                </div>
            </el-table-column>
            <el-table-column label="客服" inline-template>
                <div class="accout-display">
                   <span v-for="(item,customerIndex) in  row.customer" :class="parseInt(item.on_job)!==1?'loseStatus':''" :key="item.customer_id">
                       {{item.customer_name}}{{customerIndex<(row.customer.length-1)?',':''}}
                   </span>
                </div>
            </el-table-column>
            <el-table-column inline-template label="注册日期">
                <ui-tip :content="row.register_time | filterRegisterTime" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column inline-template label="交接日期">
                <ui-tip :content="row.fulfill_time | filterTime" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column label="数据同步" align="center" inline-template>
                <div >
                    <span class="succeed-download-order"
                          v-if="row.is_invalid && row.download_order>0"
                          :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                    <span class="default-download-order" v-else title="抓取Wish订单功能已关闭"></span>
                    <span class="succeed-sync-delivery"
                          v-if="row.is_invalid && row.sync_delivery>0"
                          :title="`发货状态${row.sync_delivery}分钟同步一次`"></span>
                    <span class="default-sync-delivery"
                          v-else title="同步发货状态到Wish功能已关闭"></span>
                    <span class="succeed-download-listing"
                          :title="`远程刊登数据${row.download_listing}分钟抓取一次`"
                          v-if="row.is_invalid && row.download_listing>0"></span>
                    <span class="default-download-listing"
                          title="抓取远程刊登数据未开启"
                          v-else></span>
                    <span class="succeed-sync-health"
                          :title="`健康数据${row.download_health/60}小时同步一次`"
                          v-if="row.is_invalid && row.download_health>0"></span>
                    <span class="default-sync-health"
                          title="同步健康数据功能未开启"
                          v-else></span>
                </div>
            </el-table-column>
            <el-table-column  label="wish状态" align="center"  inline-template>
                <div :class="row.wish_enabled===1?'sucStatus':'loseStatus'">
                    {{row.wish_enabled|filterStatus}}</div>
            </el-table-column>
            <el-table-column width="100" label="系统状态" inline-template>
                <span>{{row.status | filterStatu}}</span>
            </el-table-column>
            <el-table-column width="100" inline-template label="账号状态">
                <ui-tip :content="row.site_status_str" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column label="操作" width="120" inline-template>
                <trends-select class="inline"
                               :selects="selects(row)"
                               @trigger="trigger(row,$event)"
                               type="primary">
                </trends-select>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page='wishData.page'
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size='wishData.pageSize'
                layout="total, sizes, prev, pager, next, jumper"
                :total='wishData.total'>
        </el-pagination>
        <look-log v-model="logVisible" :log-data="logData" :title="titleName"></look-log>
    </el-row>
</template>
<style lang="stylus">
    .p-wish-table{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        .sucStatus{
            color:#339907
        }
        .loseStatus{
            color:#ff0000;
        }
        .accout-display{
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
    }
</style>
<script>
    import  authorize from './authorize.vue'
    import  edit from './edit.vue'
    import {api_refresh_token,api_account_log,
        url_wish_check,url_wish_update,url_wish_client,url_refresh_token,url_account_log} from '@/api/wish';
    import {url_add_member} from '@/api/aliexpress';
    export default{
        permission: {
            url_wish_check,
            url_wish_update,
            url_wish_client,
            url_refresh_token,
            url_add_member,
            url_account_log
        },
        data(){
            return{
                logData:[],
                logVisible:false,
                titleName:''
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        methods:{
            selects(row){
                let is_authorization = row.is_authorization ? '已授权' : '未授权';
                let buttons = [
                    {label:'查看',value:0, apis:'url_wish_check'},
                    {label:'编辑',value:1, apis:'url_wish_update'},
                    {label:is_authorization,value:2, apis:'url_wish_client'},
                    {label:'更新token',value:3, apis:'url_refresh_token'},
                    {label:'账号负责人',value:4, apis:'url_add_member'},
                    {label:'日志',value:5, apis:'url_account_log'}
                ];
                return buttons.filter(item => {
                    return this.$hasPermission(item.apis);
                });
            },
            trigger(row,val){
                switch (val.value){
                    case 0:
                        this.$emit('look-over',row);
                        break;
                    case 1:
                        this.$emit('edit',row);
                        break;
                    case 2:
                        this.$emit('author',row);
                        break;
                    case 3:
                        this.update_token(row);
                        break;
                    case 4:
                        this.$emit('add-member',row);
                        break;
                    case 5:
                        this.look_log(row);
                        break;
                }
            },
            //    日志
            look_log(row){
                this.$http(api_account_log,row.id).then(res=>{
                    this.titleName = `账号简称：${row.code} 的操作日志`;
                    this.logData = res;
                    this.logVisible = true;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            size_change(val){
                this.$emit('size-change',val);
            },
            current_change(val){
                this.$emit('current-change',val);
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            update_token(row){
                this.$http(api_refresh_token,row.id).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
        },
        filters:{
            filterStatus(value){
                return parseInt(value) ? '有效' : '失效'
            },
            filterAuthor(val){
                return parseInt(val) ? '已授权' : '授权'
            },
            filterPercent(value){
                return value+"%"
            },
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            },
            filterRegisterTime(val){
                return datef('YYYY-MM-dd',val);
            },
            filterStatu(val){
                return parseInt(val) ? '已启用':'已停用'
            }
        },
        props:{
            wishData:{
                required:true,
                type:Object
            },
            loading:{
                required:true,
                type:Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components:{
            authorize, edit,
            userManage:require('../user-manage.vue').default,
            addMember:require('../smt/add-member.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
            lookLog:require('../look-log.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
        }
    }
</script>
