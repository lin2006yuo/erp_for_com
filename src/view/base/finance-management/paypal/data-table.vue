<template>
    <el-row class="p-paypal-table">
        <el-table
                v-resize="{height:41}"
                class="scroll-bar"
                :data="lists"
                @sort-change="sort_change"
                highlight-current-row
                @selection-change="handleSelectionChange">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="35"
                    align="center">
            </el-table-column>
            <el-table-column
                    width="50"
                    prop="id"
                    label="NO.">
            </el-table-column>
            <el-table-column
                    inline-template sortable
                    label="服务器名">
                <div>
                    <ui-tip :content="row.ip_name" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="120"
                    inline-template
                    label="服务器地址">
                <div>
                    <ui-tip :content="row.ip_address" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template sortable
                    label="PayPal账户">
                <div>
                    <ui-tip :content="row.account_name" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="90"
                    inline-template
                    label="PayPal类型">
                <div>
                    <ui-tip :content="row.type | filterType" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    prop="withdrawals_type"
                    label="提款类型">
            </el-table-column>
            <el-table-column
                    width="160"
                    inline-template
                    label="绑定信用卡">
                <div>
                    <ui-tip :content="row.credit_card" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="订单授权状态">
                <div>
                    <ui-tip :content="row.paypal_authorized | authFilter" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="纠纷授权状态">
                <div>
                    <ui-tip :content="row.rest_authorized | authFilter" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="120"
                    inline-template
                    label="数据同步">
                <div>
                    <span class="succeed-download-order"
                          v-if="row.is_invalid&&row.download_paypal>0"
                          :title="`远程订单${row.download_paypal/60}小时抓取一次`">
                    </span>
                    <span class="default-download-order"
                          v-else title="同步远程订单数据未开启"></span>
                    <span class="succeed-dispute-icon"
                          v-if="row.is_invalid&&row.download_dispute>0"
                          :title="`远程纠纷${row.download_dispute/60}小时抓取一次`">
                    </span>
                    <span class="default-dispute-icon"
                          v-else title="同步远程纠纷数据未开启"></span>
                    <span class="succeed_message"
                          v-if="row.is_invalid && row.download_email>0"
                          :title="`远程邮件${row.download_email/60}小时同步一次`">
                    </span>
                    <span class="default_message"
                          v-else title="同步远程邮件数据未开启"></span>
                </div>
            </el-table-column>
            <el-table-column
                    width="90"
                    inline-template
                    label="PayPal状态">
                <div>
                    <span :class="{green:row.status,red:!row.status}">{{row.status?'有效':'无效'}}</span>
                </div>
            </el-table-column>
            <el-table-column inline-template width="90" label="系统状态" align="center">
                <div>
                    <permission
                            tag="ElSwitch"
                            :route="apis.url_change_status"
                            :key="row.id"
                            :value="row.is_invalid"
                            on-text="启用"
                            off-text="停用"
                            @change="changStatus(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="operator"
                    label="操作人">
            </el-table-column>
            <el-table-column
                    width="200"
                    inline-template
                    label="操作"
                    align="center">
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_edit"
                            class="operate" @click="$emit('look-edit',row,'查看')">查看</permission>
                    <span>  |  </span>
                    <permission
                            tag="span"
                            :route="apis.url_upd"
                            class="operate"
                            @click="$emit('look-edit',row,'编辑')">编辑</permission>
                    <span>  |  </span>
                    <span class="operate" @click="$emit('authorize',row)">授权</span>
                    <permission tag="span" :route="apis.url_paypal_account_member">|</permission>
                    <permission
                            tag="span"
                            :route="apis.url_paypal_account_member"
                            class="operate"
                            @click="user_account(row)">成员管理</permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tables.page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="tables.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tables.total">
        </el-pagination>
        <user-table v-model="memDialog"
                    :title="title"
                    :mem-form="memForm"
                    :id="mdfid"
                    :is-loading="memLoading"></user-table>
    </el-row>
</template>
<style lang="stylus">
    .green{
        color: green
    }
    .red{
        colr: red
    }
    .succeed_message{
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3510px;
    }
    .default_message{
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3529px;
    }
</style>
<script>
    import {url_change_status,url_upd,url_edit,url_paypal_account_member,api_paypal_account_member} from '@/api/paypal';
    export default{
        permission:{
            url_change_status,
            url_upd,
            url_edit,
            url_paypal_account_member
        },
        data(){
            return{
                memLoading:false,
                mdfid:'',
                channelId:'',
                title:'',
                memDialog:false,
                memForm:[],
                sellerId:[]
            }
        },
        filters:{
            authFilter(val){
                if(Number(val) === 0){
                    return '未授权'
                }else if(Number(val) === 1){
                    return '已授权'
                }
            },
            filterType(val){
                if(Number(val) === 1){
                    return '小额'
                }else if(Number(val) === 2){
                    return '大额'
                }
            }
        },
        methods:{
            user_account(row){//---成员管理
                console.log('row',row);
                this.memLoading = true;
                this.mdfid = row.id;
                this.$http(api_paypal_account_member,row.id).then(res=>{
                    this.loading = true;
                    this.memForm = res.data;
                    this.memDialog = true;
                    this.memLoading = false;
                    this.title = `账号简称： ${res.account_name} 的成员管理`;
                }).catch(error=>{
                    this.memLoading = false;
                    error&&this.$message({type:'error',message:error.message||error})
                });
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            handleSizeChange(size){
                this.$emit('change-size',size);
            },
            handleCurrentChange(page){
                this.$emit('change-page',page)
            },
            handleSelectionChange(selects){
                this.$emit('selects', selects);
            },
            changStatus(row){
                this.$emit('change-status',row);
            },
        },
        computed:{
            lists(){
                return this.tables.lists.map(data=>{
                    data.is_invalid = data.is_invalid ? true : false;
                    return data;
                })
            },
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props:{
            tables:{
                required:true,
                type:Object
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components:{
            uiTip:require('@/components/ui-tip.vue').default,
            userTable:require("./user-table.vue").default,
        }
    }
</script>
