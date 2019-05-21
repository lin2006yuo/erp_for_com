<template>
    <div>
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears">
            <label-item label="平台：" class="inline">
                <super-select
                    storageKey="order_channel"
                    class="s-width-default"
                    v-model="searchData.channel_id"
                    v-sf.channel_id
                    :is-paging="true"
                    :options='channelList'
                ></super-select>
                <!--<select-remote class="s-width-default"-->
                               <!--v-sf.channel_id-->
                               <!--v-model="searchData.channel_id"-->
                               <!--:remote="channel_remote">-->
                <!--</select-remote>-->
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <super-select
                    storageKey="order_account"
                    class="s-width-default"
                    v-model="searchData.account_id"
                    v-sf.account_id
                    :disabled="accountOptions.length<=1"
                    :placeholder="accountPlaceholder"
                    :is-paging="true"
                    :options='accountOptions'
                ></super-select>
                <!--<el-select :disabled="accountOptions.length === 0"        旧版-->
                           <!--class="s-width-default"-->
                           <!--v-sf.account_id-->
                           <!--filterable-->
                           <!--clearable-->
                           <!--remote-->
                           <!--:remote-method="remoteMethod"-->
                           <!--:placeholder="accountPlaceholder"-->
                           <!--v-model="searchData.account_id">-->
                    <!--<el-option v-for="item in accountOptions"-->
                               <!--:label="item.label"-->
                               <!--:value="item.value"-->
                               <!--:key="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
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
    import {api_get_channel, api_account_list} from '../../../api/order-number-management'
    export default {
        data(){
            return {
                accountLists:[],
                channelList:[],
                accountOptions:[{label: "", value: ""}],
                accountPlaceholder:'请选择平台',
                clears:{
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
        methods: {
            // remoteMethod(query){
            //     if (query !== '') {
            //         this.accountOptions = this.accountLists.filter(item => {
            //             return typeof query === 'string' ?item.label.toLowerCase()
            //                 .indexOf(query.toLowerCase()) > -1:item.value === query;
            //         });
            //     } else {
            //         this.accountOptions = this.accountLists.length>100? this.accountLists.filter((row,index)=>index<100) : this.accountLists;
            //     }
            // },
            channel_remote(){
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelList=[{label:'全部',value:0},...res]
                    this.$emit('channel-remote',window.clone(res));
                }).catch(code=>{
                    console.log(code);
                });
            },
            // channel_remote(callback){
            //     return this.$http(api_get_channel,{}).then(res=>{
            //         this.$emit('channel-remote',window.clone(res));
            //         callback(res);
            //     }).catch(code=>{
            //         this.$message({message:code.message, type:'error'});
            //     });
            // },
            get_account(channel_id){
                if(!channel_id){
                    this.accountOptions = [{label: "", value: ""}];
                    return
                }
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accountOptions = [{label: "全部", value: ""},...res];
                    }else{
                        this.accountOptions = [{label: "", value: ""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            search(){
                this.$emit('search');
            },
        },
        mounted(){
            this.channel_remote();
        },
        watch: {
            'searchData.channel_id'(val){
                this.searchData.account_id ="";
                this.accountOptions = [{label: "", value: ""}];
                this.get_account(this.searchData.channel_id);
            },
        },
        props: {
            searchData:{
                required:true,
                type:Object
            }
        },
        components: {
            searchCard:require('../../../components/search-card.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
        },
    }
</script>
