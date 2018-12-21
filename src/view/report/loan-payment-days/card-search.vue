<template>
    <div>
        <search-card @search="search" :params="form" :clears="clears">
            <label-item label="平台：" class="ml-sm">
                <el-select v-model="form.channel_id" class="s-width-default">
                    <el-option v-for="item in channelList" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="站点：" class="ml-xs">
                <el-select :disabled="siteOptions.length<=1"
                           class="s-width-middle"
                           filterable clearable
                           :placeholder="sitePlaceholder"
                           v-sf.site
                           v-model="form.site">
                    <el-option v-for="item in siteOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select :disabled="accoutOptions.length<=1"
                           filterable clearable
                           :placeholder="accountPlaceholder"
                           v-sf.account_id
                           class="s-width-small"
                           v-model="form.account_id">
                    <el-option v-for="item in accoutOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="统计日期：" class="inline ml-sm">
                <el-date-picker
                        class="inline date"
                        v-model="form.date_b"
                        v-sf.date_b
                        type="date"
                        :picker-options="pickerstart"
                        placeholder="开始时间">
                </el-date-picker><span>&nbsp;--&nbsp;</span><el-date-picker
                    class="inline date mr-sm"
                    v-model="form.date_e"
                    v-sf.date_e
                    type="date"
                    format="yyyy-MM-dd"
                    :picker-options="pickerend"
                    placeholder="结束时间">
            </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<style scoped>
    .s-width-small{
        width: 140px;
    }
</style>

<script>
    import {api_get_channel,api_account_list} from '../../../api/loan-payment-days';
    export default {
        refresh(){
            this.siteOptions=[{label:"",value:""}];
            this.accoutOptions=[{label:"",value:""}];
        },
        data() {
            return {
                channelList:[],
                siteOptions:[{label:"",value:""}],
                accoutOptions:[{label:"",value:""}],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.form.date_e){
                            return  time.getTime() > this.form.date_e.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        let date = new Date(this.form.date_b);
                        if(this.form.date_b&&time.getTime()<this.form.date_b){
                            return time.getTime() < date.getTime()
                        }else {
                            return time.getTime()>Date.now()
                        }
                    }
                },
            }
        },
        computed:{
            sitePlaceholder(){
                if(this.form.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            accountPlaceholder(){
                if(this.form.channel_id<=0){
                    return "请先选择平台";
                }else if(this.accoutOptions.length<=1){
                    return "该平台下暂无账号";
                }else{
                    return "请选择账号"
                }
            },
        },
        watch:{
            "form.channel_id"(val) {
                this.form.site = '';
                this.form.account_id = "";
                this.siteOptions = [{label: "", value: ""}];
                this.accoutOptions = [{label: "", value: ""}];
                this.get_site(val);
                this.get_account(val)
            },
        },
        mounted(){
            this.channel_remote();
        },
        methods: {
            search(){
                this.$emit('search')
            },
            channel_remote(){
                return this.$http(api_get_channel,{}).then(res=>{
                    res = res.filter(row=>row.value===4 ||row.value===3);
                    this.channelList = res;
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_site(channel_id){
                if(!channel_id)return this.siteOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        this.siteOptions = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteOptions = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id){
                if(!channel_id)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.account.length<=0){
                        this.accoutOptions = [{label:"",value:""}]
                    }else{
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            form:{},
            clears:{}
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            selectRemote:require('@/components/select-remote.vue').default,
        }
    }
</script>
