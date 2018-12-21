<template>
    <div>
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears">
            <label-item label="平台：" class="inline">
                <select-remote class="s-width-default"
                               v-sf.channel_id
                               v-model="searchData.channel_id"
                               :remote="channel_remote">
                </select-remote>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select :disabled="accoutOptions.length<=1"
                           class="s-width-default"
                           v-sf.account_id
                           filterable clearable
                           :placeholder="accountPlaceholder"
                           v-model="searchData.account_id">
                    <el-option v-for="item in accoutOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="订单号：" class="ml-sm">
                <el-input v-model="searchData.order_number" v-sf.order_number></el-input>
            </label-item>
            <label-item label="状态：" class="ml-sm mr-sm">
                <el-select v-model="searchData.status" class="s-width-small" v-sf.status>
                    <el-option v-for="item in statusList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_channel, api_get_order, api_account_list} from '../../../api/order-number-management'
    export default {
        data(){
            return {
                accoutOptions:[{label:"",value:""}],
                accountPlaceholder:'请选择平台',
                searchData:{
                    page:1,
                    pageSize:20,
                    channel_id:0,
                    account_id:'',
                    order_number:'',
                    status:''
                },
                clears:{
                    page:1,
                    pageSize:20,
                    channel_id:0,
                    account_id:'',
                    order_number:'',
                    status:''
                },
                statusList:[
                    {label:'全部', value:''},
                    {label:'已拦截', value:1},
                    {label:'未拦截', value:0}
                ]
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){
                this.$emit('init-data', this.searchData);
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    this.$message({message:code.message, type:'error'});
                });
            },
            get_account(channel_id){
                if(!channel_id)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }else{
                        this.accoutOptions = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            search(){
                this.init();
            },
        },
        computed: {},
        watch: {
            'searchData.channel_id'(val){
                this.searchData.account_id = "";
                this.accoutOptions = [{label:"",value:""}];
                this.get_account(this.searchData.channel_id);
            },
        },
        props: {},
        components: {
            searchCard:require('../../../components/search-card.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default
        },
    }
</script>
