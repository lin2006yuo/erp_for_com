<template>
    <div class="p-account-information">
        <search-card @search="$emit('search')"
                     @enter="$emit('search')"
                     :params="searchData"
                     :clears="clears"
                     style="overflow: visible">
            <el-row class="mb-mini">
                <label-item label="状态：">
                    <el-select v-model="searchData.status"
                               class="width-lg"
                               v-sf.status>
                        <el-option v-for="item in statusOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="平台：" class="ml-sm">
                    <super-select v-model="searchData.channel_id"
                                  v-sf.channel_id
                                  :options="channelData"
                                  :storage-key="`accountApplyChannel`"
                                  class="width-lg"
                                  @change="get_site">
                    </super-select>
                </label-item>
                <label-item label="站点：" class="ml-sm">
                    <super-select v-model="searchData.site_code"
                                  v-sf.site_code
                                  :options="siteOptions"
                                  :storage-key="`accountApplySiteCode`"
                                  :disabled="!siteOptions.length"
                                  :placeholder="sitePlaceholder"
                                  class="width-lg">
                    </super-select>
                    <!--<el-select :disabled="!siteOptions.length"-->
                               <!--class="width-lg"-->
                               <!--v-sf.site_code-->
                               <!--filterable clearable-->
                               <!--:placeholder="sitePlaceholder"-->
                               <!--v-model="searchData.site_code">-->
                        <!--<el-option v-for="item in siteOptions"-->
                                   <!--class="width-lg"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                </label-item>
                <label-item>
                    <el-select v-model="searchData.snType"
                               class="s-width-small ml-sm"
                               v-sf.snType>
                        <el-option v-for="type in accountOptions"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                    <el-input v-model.trim="searchData.snText"
                              class="width-sm ml-mini"
                              :placeholder="placeholder"
                              v-sf.snText></el-input>
                </label-item>
            </el-row>
            <label-item label="注册人：" >
                <super-select v-model="searchData.register_id"
                              v-sf.register_id
                              :options="creatorData"
                              :storage-key="`accountApplyCreator`"
                              class="width-super">
                </super-select>
            </label-item>
            <label-item label="创建时间：" class="ml-sm">
                <el-date-picker
                        v-model="searchData.create_time_st"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.create_time_st
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.create_time_nd"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        v-sf.create_time_nd
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_channel, api_account_list,api_get_user} from  '@/api/report-channel';
    import {api_get_account_status} from '@/api/account-apply';
    export default {
        data(){
            return {
                clears:{
                    status:'',
                    channel_id:'',
                    site_code:'',
                    snType:'name',
                    snText:'',
                    create_time_st:'',
                    create_time_nd:'',
                },
                siteOptions:[],
                accountOptions:[
                    {label:'账号全称',value:'name'},
                    {label:'账号简称',value:'code'}
                ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if (this.searchData.create_time_nd) {
                            return time.getTime() > this.searchData.create_time_nd;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if (this.searchData.create_time_st) {
                            return time.getTime()<this.searchData.create_time_st||time.getTime() > Date.now();
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                channelData:[],
            }
        },
        mounted(){
            this.$http(api_get_channel,{}).then(res=>{
                this.channelData=res;
            }).catch( error =>{
                error&&this.$message({type:'error', message:error.message||error});
            });
        },
        methods: {
            get_site(channel_id){
                this.siteOptions=[];
                this.$set(this.searchData,'site_code','');
                if(!channel_id)return;
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    this.siteOptions=res.site.map(row=>{
                        return {label:row.label,value:row.value}
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
        },
        computed: {
            sitePlaceholder(){
                if(!this.searchData.channel_id){
                    return "请先选择平台";
                }else if(this.searchData.channel_id&&!this.siteOptions.length){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            placeholder(){
                let find=this.accountOptions.find(row=>row.value===this.searchData.snType);
                if(find){
                    return `请输入${find.label}`;
                }
            },
        },
        props: {
            searchData:{},
            statusOptions:Array,
            creatorData:Array
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            // selectRemote:require('@/components/select-remote.vue').default,
            // scrollSelect:require('@/components/scroll-select.vue').default,
        },
    }
</script>
