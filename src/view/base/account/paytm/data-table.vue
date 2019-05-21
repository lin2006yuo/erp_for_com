<template>
    <el-row class="p-paytm-table">
        <el-table v-resize="{height:41}"
                  :data="paytmList.list"
                  border
                  highlight-current-row
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
                  @selection-change="selectionChange"
                  @sort-change="sort_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column inline-template
                             label="简称"
                             sortable>
                <ui-tip :content="row.code" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column inline-template
                             label="账户名称"
                             sortable>
                <ui-tip :content="row.account_name" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column inline-template
                             label="密钥有效期"
                             sortable>
                <ui-tip :content="row.expiry_time | filterRegisterTime" :width="98"></ui-tip>
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
                <div v-if="row.status=='1'">
                        <span>
                            <span class="succeed"
                                  v-if="parseInt(row.download_order)>0"
                                  :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                            <span v-else class="default" title="同步远程订单已关闭"></span>
                        </span>
                    <span>
                            <span class="succeed_sync"
                                  v-if="parseInt(row.sync_delivery)>0"
                                  :title="`发货状态${row.sync_delivery}分钟同步一次`"></span>
                            <span v-else class="default_sync" title="同步发货状态未开启"></span>
                        </span>
                    <span>
                            <span class="succeed-download-listing"
                                  v-if="parseInt(row.download_listing)>0"
                                  :title="`远程刊登数据${row.download_listing}分钟抓取一次`"></span>
                            <span class="default-download-listing" v-else title="同步远程刊登数未开启"></span>
                        </span>
                </div>
                <div v-else>
                    <span class="default" title="同步远程订单未开启"></span>
                    <span class="default_sync" title="同步发货状态未开启"></span>
                    <span class="default-download-listing" title="同步远程刊登数据未开启"></span>
                </div>
            </el-table-column>
            <el-table-column label="Paytm状态" align="center" inline-template>
                <div :class="parseInt(row.paytm_enabled)===0?'loseStatus':'sucStatus'">
                    {{row.paytm_enabled|filterStatus}}
                </div>
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
        <look-log v-model="logVisible" :log-data="logData" :title="titleName"></look-log>
        <add-member v-model="memberDialog"
                    :loading="memberLoading"
                    :data="dataMember"
                    :account-name="accountName"
                    @save="$emit('save-member')">
        </add-member>
    </el-row>
</template>
<style lang="stylus">
    .p-paytm-table {
        .el-table__body-wrapper {
            overflow-x hidden
        }
        .accout-display{
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
    }

    .sucStatus {
        color: #339907
    }

    .loseStatus {
        color: #ff0000;
    }

    .succeed {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3468px;
    }

    .default {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3490px;
    }

    .succeed_sync {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -1325px;
    }

    .default_sync {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -1351px;
    }
</style>
<script>
    import {
        url_get_paytm_account, url_put_paytm_account,
        url_token_paytm_account, api_account_log,url_account_log} from '@/api/paytm';
    import {api_add_member,url_add_member} from '@/api/aliexpress';
    export default {
        permission: {
            url_get_paytm_account,
            url_put_paytm_account,
            url_token_paytm_account,
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
        methods: {
            selects(row){
                let is_authorization = row.is_authorization ? '订单已授权' : '订单未授权';
                let is_authorization_cat = row.is_authorization_cat ? '商品已授权' : '商品未授权';
                let buttons = [
                    {label:'查看',value:0, apis:'url_get_paytm_account'},
                    {label:'编辑',value:1, apis:'url_put_paytm_account'},
                    {label:is_authorization,value:2, apis:'url_token_paytm_account'},
                    {label:is_authorization_cat,value:3, apis:'url_token_paytm_account'},
                    // {label:'账号负责人',value:4, apis:'url_add_member'},
                    {label:'日志',value:5, apis:'url_account_log'}
                ];
                return buttons.filter(item => {
                    return this.$hasPermission(item.apis);
                });
            },
            trigger(row,val){
                switch (val.value){
                    case 0:
                        this.$emit('look-over', row);
                        break;
                    case 1:
                        this.$emit('edit', row);
                        break;
                    case 2:
                        this.$emit('add-accredit', row);
                        break;
                    case 3:
                        this.$emit('add-merchandise', row);
                        break;
                    case 4:
                        this.add_member(row);
                        break;
                    case 5:
                        this.look_log(row);
                        break;
                }
            },
//            添加成员事件
            add_member(row){
                this.accountName = row.account_name;
                this.api_add_member({channel_id:10,account_id:row.id});
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
                            channel_id:10,
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
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val) {//-----------------------表格排序
                this.$emit("sort-change", val);
            }
        },
        filters: {
            filterStatus(value) {
                return parseInt(value) ? '有效' : '失效';
            },
            filterAuthor(val) {
                return parseInt(val) ? '订单已授权' : '订单未授权';
            },
            filterCommodity(val) {
                return parseInt(val) ? '商品已授权' : '商品未授权';
            },
            timeFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val)
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
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props: {
            paytmList: {
                required: true,
                type: Object,
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            lookLog:require('../look-log.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            addMember:require('../smt/add-member.vue').default,
        }
    }
</script>
