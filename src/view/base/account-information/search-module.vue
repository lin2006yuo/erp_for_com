<template>
    <div class="p-account-infomarion">
        <search-card @search="search" @enter='search' :params="searchData" :clears="clears">
            <div class="mb-mini">
                <label-item label="状态：">
                    <el-select v-model="searchData.status" class="s-width-small" v-sf.status>
                        <el-option v-for="item in statusOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="平台：" class="ml-sm">
                    <el-select v-model="searchData.channel_id"
                               class="s-width-default"
                               v-sf.channel_id
                               default-first-option
                               filterable clearable
                               @change="acquire_company_name">
                        <el-option
                                v-for="res in channelList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
                <label-item label="站点：" class="ml-sm">
                    <el-select :disabled="siteOptions.length<=1"
                               class="s-width-default"
                               v-sf.site_code
                               filterable clearable
                               :placeholder="sitePlaceholder"
                               v-model="searchData.site_code">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item>
                    <el-select v-model="searchData.snType"
                               class="s-width-default ml-sm"
                               v-sf.snType>
                        <el-option v-for="type in accountOptions"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                    <el-input v-sf.snText
                              v-model="searchData.snText"
                              class="width-sm ml-xs"></el-input>
                </label-item>
                <label-item label="服务器名：" class="ml-sm">
                    <el-input type="text"
                              v-sf.server_name
                              v-model="searchData.server_name"
                              class="s-width-small">
                    </el-input>
                </label-item>
                <label-item label="公司名称：" class="ml-sm">
                    <el-select v-model="searchData.company_id"
                               class="width-super"
                               placeholder="请选择/输入公司名称"
                               v-sf.company_id
                               clearable filterable>
                        <el-option v-for="type in companyData"
                                   class="width-super"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item>
                    <el-select v-model="searchData.s_type"
                               class="s-width-default ml-sm"
                               v-sf.s_type
                               @change="get_phone_email">
                        <el-option v-for="type in searchType"
                                   class="s-width-default"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.s_value"
                               class="width-super ml-xs"
                               v-sf.s_value
                               clearable filterable
                               :placeholder="placeholder"
                               @change="get_svalue">
                        <el-option v-for="type in searchValue"
                                   class="width-super"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                </label-item>
            </div>
            <label-item label="创建人：">
                <scroll-select v-model="account_creator" style="width:158px" class="inline"
                               textAlign="left"
                               ref="creater"
                               v-sf.account_creator
                               :remote="urlcreater"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account">
                </scroll-select>
            </label-item>
            <label-item  class="ml-sm">
                <el-select v-model="searchData.snDate"
                           class="s-width-small mr-mini"
                           v-sf.snDate>
                    <el-option v-for="type in time_type_list"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.date_b"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.date_b
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_e"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        v-sf.date_e
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-account-infomarion{
        .el-card{
            overflow: visible;
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list} from  '../../../api/report-channel';
    import {api_get_company_name,} from '@/api/account-information';
    import {api_get_phone_info,api_get_has_used_email} from '@/api/account-apply'
    export default {
        data(){
            return {
                siteOptions:[{label:"",value:""}],
                statusOptions:[
                    {label:"全部",value:""},
                    {label:"新增",value:0},
                    {label:"已交接",value:3},
                    {label:"已回收",value:4},
                    {label:"已作废",value:5},
                ],
                accountOptions:[
                    {label:"主账号全称",value:"name"},
                    {label:"账号简称",value:"code"},
                    {label:"店铺名称",value:"shop_name"}
                ],
                time_type_list:[
                    {label:'创建时间',value:'create_time'},
                    {label:'交接时间',value:'transfer_time'}
                ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },//结束时间
                urlcreater:'get|user',
                companyData:[],
                searchType:[
                    {label:'手机号',value:1},
                    {label:'邮箱',value:2}
                ],
                searchValue:[]
            }
        },
        mounted(){
            this.get_phone_email(1);
            this.acquire_company_name();
        },
        methods: {
            get_svalue(val){
                let find =this.searchValue.find(row=>row.value===val);
                if(find){
                    this.$set(this.searchData,'s_value',find.label);
                }
            },
            get_phone_email(val){
                let param={
                    page:1,
                    pageSize:1000000000,
                };
                let api;
                if(val===1){
                    this.$set(param,'phone','');
                    api=api_get_phone_info;
                }else{
                    this.$set(param,'email','');
                    api=api_get_has_used_email;
                }
                this.$set(this.searchData,'s_value','');
                this.$http(api,param).then(res=>{
                    this.searchValue=res.list.map(row=>{
                        return {label:val===1?row.phone:row.email,value:row.id}
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            acquire_company_name(){
                this.$http(api_get_company_name,{}).then(res=>{
                    this.companyData=res.data.map(row=>{
                        return {label:row.company,value:row.id};
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    this.$message({type:"error", message:code.message || code});
                });
            },
            site_remote(){
                return this.$http(api_get_channel_categories,{}).then(res=>{
                    return Promise.resolve(res.map(cate=>{
                        return {label:cate.name,value:cate.id};
                    }));
                }).catch(code=>{
                    console.log(code);
                });
            },
            warehouse_remote(){
                this.$http(api_get_warehouse).then(res=>{
                    this.warehouseList = [{label:"全部",value:""}, ...res];
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
            get_account(channel_id,site_code){
                if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
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
            //账号参数
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snText:keyword||"",
                    snType:"realname"
                };
            },
            //账号结果
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            search(){
                this.$emit('search');
            },
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.searchData.channel_id = 0;
                this.searchData.snType = 'name';
                this.searchData.snDate = 'create_time';
            },
        },
        computed: {
            placeholder(){
                let find = this.searchType.find(row=>row.value===this.searchData.s_type)
                if(find){
                    return `请选择/输入${find.label}`;
                }
            },
            sitePlaceholder(){
                if(this.searchData.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            account_creator:{
                get(){
                    return {label:this.searchData.creator, value:this.searchData.creator_id}
                },
                set(val){
                    this.searchData.creator = val?val.label:'';
                    this.searchData.creator_id = val?val.value:'';
                }
            },
        },
        watch: {
            "searchData.channel_id"(val){
                this.searchData.site_code ='';
                this.siteOptions = [{label:"",value:""}];
                this.get_site(val);
            },
            'searchData.site_code'(val){
                this.get_account(this.searchData.channel_id,val);
            },
        },
        props: {
            clears:{},
            searchData:{},
            channelList:{}
        },
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            searchCard:require('../../../components/search-card.vue').default
        },
    }
</script>
