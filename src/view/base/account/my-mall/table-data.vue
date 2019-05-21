<template>
    <div class="c-table-data">
        <el-table
            class="scroll-bar"
            :data="tableData.list"
            v-loading="load"
            v-resize="{height:41}"
            element-loading-text="玩命加载中..."
            @selection-change="selectionChange"
            @sort-change="sort_change"
            highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column label="简称" prop="code" sortable></el-table-column>
            <el-table-column label="账户名称" prop="account_name" sortable></el-table-column>
            <el-table-column inline-template label="密钥有效期" sortable>
                <ui-tip :content="row.expiry_time | filterRegisterTime" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column width="90" inline-template label="销售员">
                <ui-tip :content="row.seller_name" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column width="90" inline-template label="客服">
                <ui-tip :content="row.customer_name" :width="98" v-copy></ui-tip>
            </el-table-column>
            <!--<el-table-column label="销售员" inline-template>-->
                <!--<div>-->
                   <!--<span v-for="(item,sellerIndex) in row.seller" :class="parseInt(item.on_job)!==1?'loseStatus':''" :key="item.customer_id">-->
                       <!--{{item.seller_name}}{{sellerIndex<(row.seller.length-1)?',':''}}-->
                   <!--</span>-->
                <!--</div>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="客服" inline-template>-->
                <!--<div>-->
                   <!--<span v-for="(item,customerIndex) in  row.customer" :class="parseInt(item.on_job)!==1?'loseStatus':''" :key="item.customer_id">-->
                       <!--{{item.customer_name}}{{customerIndex<(row.customer.length-1)?',':''}}-->
                   <!--</span>-->
                <!--</div>-->
            <!--</el-table-column>-->
            <el-table-column inline-template label="注册日期">
                <ui-tip :content="row.register_time | filterRegisterTime" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column inline-template label="交接日期">
                <ui-tip :content="row.fulfill_time | filterTime" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column label="数据同步" inline-template>
                <div>
                    <span class="succeed-download-order"
                          v-if="row.is_invalid && row.download_order>0"
                          :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                    <span class="default-download-order" v-else title="抓取订单功能已关闭"></span>
                    <span class="succeed-sync-delivery"
                          v-if="row.sync_delivery>0"
                          :title="sync_delivery_fliter(row.sync_delivery)">                             
                    </span>
                    <span class="default-sync-delivery"
                          v-else
                          title="同步发货状态未启用">
                    </span>
                    <span class="succeed-download-listing"
                          :title="`远程刊登数据${row.sync_listing}分钟抓取一次`"
                          v-if="row.is_invalid && row.sync_listing>0"></span>
                    <span class="default-download-listing"
                          title="抓取远程刊登数据未开启" v-else></span>
                </div>
            </el-table-column>
            <el-table-column label="MyMall状态" inline-template>
                <div :class="[row.enabled?'color-success':'red']">{{row.enabled | filterEnabled}}</div>
            </el-table-column>
            <el-table-column width="100" label="系统状态" inline-template>
                <span>{{row.is_invalid | filterStatu}}</span>
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
                @size-change="change_size"
                @current-change="change_page"
                :current-page="tableData.page"
                :page-sizes="[10,20, 50, 100, 200]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.count">
        </el-pagination>
        <look-log v-model="logVisible" :log-data="logData" :title="titleName"></look-log>
        <add-member v-model="memberDialog"
                    :loading="memberLoading"
                    :data="dataMember"
                    :account-name="accountName"
                    @save="$emit('save-member')">
        </add-member>
    </div>
</template>
<style lang="stylus">
    .loseStatus {
        color: #ff0000;
    }
</style>
<script>
    import {url_update_pandao_account,url_change_status,
        url_get_authorization,url_look_pandao_account,
        api_account_log,url_account_log} from '@/api/my-mall';
    import {api_add_member,url_add_member} from '@/api/aliexpress';
    export default {
        permission:{
            url_look_pandao_account,
            url_get_authorization,
            url_change_status,
            url_update_pandao_account,
            url_account_log,
            url_add_member
        },
        data() {
            return {
                logData:[],
                logVisible:false,
                titleName:'',
                memberDialog:false,
                accountName:"",
                dataMember:[],
                memberLoading:false
            }
        },
        filters:{
            timeFilter(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            },
            filterAuthor(val){
                return parseInt(val) ? '已授权':'未授权'
            },
            filterEnabled(val){
                return parseInt(val) ? '有效':'失效'
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
        methods:{
            selects(row){
                let is_authorization = row.is_authorization ? '订单已授权' : '订单未授权';
                let buttons = [
                    {label:'查看',value:0, apis:'url_look_pandao_account'},
                    {label:'编辑',value:1, apis:'url_update_pandao_account'},
                    {label:is_authorization,value:2, apis:'url_update_pandao_account'},
                    // {label:'账号负责人',value:3, apis:'url_add_member'},
                    {label:'日志',value:4, apis:'url_account_log'}
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
                        this.$emit('edit', row);
                        break;
                    case 2:
                        this.$emit('do-authorization',row);
                        break;
                    case 3:
                        this.add_member(row);
                        break;
                    case 4:
                        this.look_log(row);
                        break;
                }
            },
//            添加成员事件
            add_member(row){
                this.accountName = row.account_name;
                this.api_add_member({channel_id:8,account_id:row.id});
            },
//            添加成员
            api_add_member(val){
                this.memberLoading = true;
                this.$http(api_add_member,val).then(res=>{
                    this.memberDialog = true;
                    this.memberLoading = false;
                    if (res.length > 0) {
                        this.dataMember = res;
                        this.dataMember.forEach(row=>{
                            row.customer_id = row.customer_id===0?"":row.customer_id;
                            row.info.forEach(res=>{
                                res.seller_id = res.seller_id===0?"":res.seller_id;
                            })
                        });
                    } else {
                        this.dataMember = [];
                        let cur = {
                            id:0,
                            channel_id:8,
                            customer_id:"",
                            account_id:val.account_id,
                            info:[
                                {seller_id:"",warehouse_type:0}
                            ]
                        };
                        this.dataMember.push(cur);
                    }
                }).catch(code=>{
                    setTimeOut(()=>{
                        this.memberLoading = true;
                    },100);
                    console.log(code);
                })
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
            sync_delivery_fliter(val){
                if(val===30){
                    return "发货状态30分钟同步一次"
                }
                else{
                    return `发货状态${val/60}小时同步一次`
                }
            },
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            change_size(size){
                this.$emit('change-size',size);
            },
            change_page(page){
                this.$emit('change_page',page);
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props:{
            tableData:{//列表所需数据
                type:Object,
                required:true,
            },
            load:{//加载
                type:Boolean,
                required:true,
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {
            lookLog:require('../look-log.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            addMember:require('../smt/add-member.vue').default,
        }
    }
</script>
