<template>
    <div   class="ymx-setting-p-search">
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears">
            <label-item label="平台：" >
            <el-select v-sf.channel_id  v-model="searchData.channel_id" @change="change_channel" class="s-width-default">
                <el-option v-for="item in channel"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select :disabled="accoutOptions.length<=1"
                           filterable clearable
                           placeholder="请选择平台"
                           v-sf.account_id
                           class="s-width-middle"
                           v-model="searchData.account_id">
                    <el-option v-for="item in accoutOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="收取邮箱：" class="ml-sm">
            <el-input v-model="searchData.email_account"  class="inline mr-sm s-width-default" v-sf.email_account></el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    import {api_email_account} from "@/api/order-local"
    export default{
        data(){
            return {
                clears:{},
                siteOptions:[{lable:'全部',value:''}],
                accoutOptions:[{lable:'全部',value:''}]
            }
        },
        mounted(){
            this.clears = clone(this.searchData);
            this.change_channel(this.searchData.channel_id)
        },
        computed:{
        },
        methods: {
            change_channel(channel_id){
                if(!channel_id){
                    this.siteOptions = [{label:"",value:""}];
                    this.accoutOptions = [{label:"",value:""}];
                    return
                }
                this.searchData.account_id=''
                this.searchData.site=''
                this.$http(api_email_account,{channel_id:channel_id}).then(res=>{
                    this.accoutOptions = [{label:"全部",value:""},...res.account];
                }).catch(code=>{
                    console.log(code);
                })
            },
            search(){
                this.$emit("reflash");
            },
            clear(){
                this.$emit("clear");
            },

        },
        props: {
            searchData:{
                required:true,
                type:Object
            },
            channel:{
                required:true,
                type:Array
            }

        },
        components: {
            paramAccount:require('@/api-components/param-account.vue').default,
            searchCard:require("@/components/search-card.vue").default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>
