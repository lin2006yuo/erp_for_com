<template>
    <div class="p-search-amazon-outbox">
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears">
            <el-row>
                <label-buttons label="站内信：" :buttons="boxs" @select="select_boxs" v-sf.status></label-buttons>
            </el-row>
            <div class="inline">
                <el-select v-model="searchData.option_field" placeholder="请选择" class="inline s-width-default"  v-sf.option_field>
                    <el-option
                            :key="item.value"
                            v-for="item in optionType"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input  v-model="searchData.option_value" :placeholder="`请输入${changeLabel}...`" class="inline s-width-large" v-sf.option_value></el-input>
                <label class="ml-sm inline">账号简称：</label>
                <param-account v-model="searchData.account_code" url="get|orders/account"
                               :param="{channel_id:2}"
                               :fixResult="account_fix_result"
                               class="inline s-width-default mr-sm" type="amazonAccount"  v-sf.account_code>
                </param-account>
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import labelButtons from "../../../../components/label-all-buttons.vue"
    import {api_get_account} from "../../../../api/letter-amazon"
    export default{
        data(){
            return{
                boxs:[
                        {name:"待发送",value:0},
                        {name:"发送成功",value:1},
                         {name:"发送失败",value:2},
                    ],
                optionType:[
                    {label:"收件邮箱",value:"receiver_email"},
                    {label:"邮件主题",value:"subject"},
                    {label:"平台订单号",value:"order_number"},
                    {label:"客户邮箱",value:"buyer_email"},
                    {label:"客户ID",value:"buyer_id"},
                ],
                options:[],
                clears:{}
            }
        },

        mounted(){
            this.clears=clone(this.searchData)
        },
        methods:{
            init_status_btn(){
                let boxsBtn = this.boxs;
                this.boxs = [];
                this.$nextTick(()=>{
                    this.boxs = boxsBtn;
                });
            },
            account_fix_result(res){
                return res.account
            },
            select_boxs(val){
                this.searchData.status=this.boxs[val].value
                this.$emit("reflash")
            },
            search(){
                this.$emit("reflash")
            },
            clear(){
                this.$emit("clear")

            },
        },
        filters:{
        },
        watch:{
        },
        computed:{
            changeLabel(){
                let find = this.optionType.find(res=>{
                    return this.searchData.option_field === res.value;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props:{
            searchData:{
                required:true,
                type:Object,
            }
        },
        components:{
            labelButtons,
            paramAccount:require('../../../../api-components/param-account.vue').default,
            searchCard:require("../../../../components/search-card.vue").default
        }
    }
</script>
