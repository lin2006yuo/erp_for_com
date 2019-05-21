<template>
    <page-dialog :title="title" v-model="show" size="large" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="lookData"
                 label-width="160px"
                 ref="lookData">
            <el-form-item label="服务器IP地址：">
                <el-col :span="14">
                    <span>{{lookData.ip_address}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="PayPal账户：">
                <el-col :span="14">
                    <span>{{lookData.account_name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="密码：">
                <el-col :span="14">
                    <span>******</span>
                </el-col>
            </el-form-item>
            <el-form-item label="PayPal类型：">
                <el-col :span="14">
                    <span>{{lookData.type | filtersType}}</span>
                </el-col>
            </el-form-item>
            <el-row v-for="(row,i) in lookData.withdrawals_accounts" :key="i">
                <el-form-item :label="`提款类型${i ? i :''}：`">
                    <el-col :span="14">
                        <super-select
                                disabled
                                class="inline"
                                v-model="row.id"
                                :storage-key="`withdraCreator`"
                                :options="withdrawalsList"
                                placeholder="暂无提款类型">
                        </super-select>
                    </el-col>
                </el-form-item>
                <el-form-item :label="`提款账号${i ? i :''}：`">
                    <el-col :span="14">
                        <span>{{row.account}}</span>
                    </el-col>
                </el-form-item>
            </el-row>
            <el-form-item label="账户持有人：">
                <el-col :span="14">
                    <span>{{lookData.belong}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="电话号码：">
                <el-col :span="14">
                    <span>{{lookData.phone}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="绑定信用卡：">
                <el-col :span="14">
                    <span>{{lookData.credit_card}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="对应客户经理：">
                <el-col :span="14">
                    <span>{{lookData.client}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="操作人：">
                <el-col :span="14">
                    <span>{{lookData.operator}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取PayPal订单功能：">
                <el-col :span="14">
                    <span>{{lookData.download_paypal | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取PayPal纠纷功能：">
                <el-col :span="14">
                    <span>{{lookData.download_dispute | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取PayPal邮件功能：">
                <el-col :span="14">
                    <span>{{lookData.download_email | filterHour}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show=false">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            open(){

            },
            close(){
            
            },
            keep(){
            	
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        filters: {
            filtersType(row) {
                if (row === 1) {
                    return '小额';
                } else {
                    return '大额'
                }
            },
            filterHour(val){
                if(!val)return '未启用';
                if(val === 30)return `${Number(val)}分钟`;
                return `${Number(val)/60}小时`
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            lookData:{},
            withdrawalsList:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>