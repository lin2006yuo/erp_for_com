<template>
    <search-card @search="$emit('search')"
                 @enter="$emit('search')"
                 :params="searchData"
                 :clears="clears">
        <el-row class="mb-xs">
            <label-item label="状态：">
                <el-select v-model="searchData.status"
                           class="s-width-small"
                           @change="change_status"
                           v-sf.status>
                    <el-option v-for="item in statusOptions"
                               class="s-width-small"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="平台：" class="ml-sm">
                <super-select v-model="searchData.channel_id"
                              v-sf.channel_id
                              :options="channelLists"
                              :storage-key="`baseAccountChannel`"
                              class="width-lg"
                              @change="acquire_site">
                </super-select>
            </label-item>
            <label-item label="站点：" class="ml-sm">
                <el-select :disabled="!siteOptions.length"
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
                           class="width-sm"
                           v-sf.snType>
                    <el-option v-for="type in accountOptions"
                               class="width-sm"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
                <el-input v-sf.snText
                          v-model="searchData.snText"
                          :placeholder="`请输入${accountOptions.find(row=>row.value===searchData.snType).label}`"
                          class="width-sm ml-xs">
                </el-input>
            </label-item>
            <label-item label="服务器名：" class="ml-sm">
                <el-input v-sf.server_name
                          v-model="searchData.server_name"
                          class="s-width-small">
                </el-input>
            </label-item>
            <label-item label="公司名称：" class="ml-sm">
                <super-select v-model="searchData.company_id"
                              v-sf.company_id
                              :placeholder="`请选择/输入公司名称`"
                              :options="companyData"
                              :storage-key="`baseAccountCompany`"
                              class="width-super">
                </super-select>
            </label-item>
            <label-item>
                <el-select v-model="searchData.s_type"
                           class="s-width-small ml-sm"
                           v-sf.s_type
                           @change="get_phone_email">
                    <el-option v-for="type in searchType"
                               class="s-width-small"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
                <super-select v-model="searchData.s_value"
                              v-sf.s_value
                              :placeholder="placeholderPhoneEmail"
                              :options="phoneEmail"
                              :storage-key="phoneEmailKey"
                              class="width-super ml-xs">
                </super-select>
            </label-item>
        </el-row>
        <label-item label="账号状态：">
            <el-select v-model="searchData.site_status"
                       class="s-width-default"
                       :disabled="!searchData.status"
                       v-sf.s_type>
                <!--状态空和0不让搜-->
                <el-option v-for="type in accountStatus"
                           class="s-width-default"
                           :key="type.value"
                           :label="type.label"
                           :value="type.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="创建人：" class="ml-sm">
            <super-select v-model="searchData.creator_id"
                          v-sf.creator_id
                          :placeholder="`请输入/选择创建人`"
                          :options="creatorData"
                          :storage-key="`baseAccountCreator`"
                          class="width-super ml-xs">
            </super-select>
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
                    class="inline date s-width-small"
                    v-sf.date_b
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="选择日期"
                    class="inline date mr-sm s-width-small"
                    v-sf.date_e
                    :picker-options="inputTimeEnd">
            </el-date-picker>
        </label-item>
    </search-card>
</template>

<script>
    import {api_account_list} from  '@/api/report-channel';
    import {api_get_company_name,api_get_company_nameAll,api_get_base_account_status_account} from '@/api/account-information';
    import {api_get_base_account_status,api_get_phone_info,api_get_has_used_email} from '@/api/account-apply';
    export default {
        name: "search",
        data() {
            return {
                clears:{
                    status:'',
                    channel_id:'',
                    site_code:'',
                    snType:'name',
                    snText:'',
                    server_name:'',
                    company_id:'',
                    s_type:1,
                    s_value:'',
                    creator:'',
                    creator_id:'',
                    snDate:'create_time',
                    date_b:'',
                    date_e:'',
                },
                statusOptions:[],
                siteOptions:[],
                accountOptions:[
                    {label:'主账号全称',value:'name'},
                    {label:'账号简称',value:'code'}
                ],
                companyData:[],
                searchType:[
                    {label:'手机号',value:1},
                    {label:'邮箱',value:2}
                ],
                phoneEmail:[],
                accountStatus:[],
                time_type_list:[
                    {label:'创建时间',value:'create_time'},
                    {label:'交接时间',value:'transfer_time'}
                ],
                inputTimeStart:{
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },
            }
        },
        computed:{
            channelLists(){
                return [{label:'全部',value:''},...this.channelList];
            },
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
                let find=this.accountOptions.find(row=>row.value===this.searchData.snText);
                if(find){
                    return `请输入${find.label}`;
                }
            },
            placeholderPhoneEmail(){
                let find = this.searchType.find(row=>row.value===this.searchData.s_type)
                if(find){
                    return `请选择/输入${find.label}`;
                }
            },
            phoneEmailKey(){
                return this.searchData.s_type===1?'baseAccountPhoneKey':'baseAccountEmailKey';
            },
        },
        mounted() {
            this.get_status();
            this.get_company();
            this.get_phone_email(1);
            this.get_account_status();
        },
        methods: {
            get_status(){
                this.$http(api_get_base_account_status).then(res=>{
                    this.statusOptions=[{label:"全部",value:''},...res.map(row=>{
                        return {label:row.remark,value:row.status}
                    })];
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            change_status(status){
                if(!status){
                    if(this.searchData.site_status!==''){
                        this.$set(this.searchData,'site_status','');
                    }
                }
            },
            acquire_site(channel_id){
                this.$set(this.searchData,'site_code','');
                this.siteOptions=[];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    this.siteOptions=res.site.length?[{label:'全部',value:''},...res.site]:[];
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            get_company(){
                this.$http(api_get_company_name).then(res=>{
                    this.companyData=res.data.map(row=>{
                        return {label:row.company,value:row.id}
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            get_phone_email(type){
                this.$set(this.searchData,'s_value','');
                let api=type===1?api_get_phone_info:api_get_has_used_email;
                this.$http(api).then(res=>{
                    this.phoneEmail=res.list.map(phone_email=>{
                        return {label:type===1?phone_email.phone:phone_email.email,value:phone_email.id}
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            get_account_status(){
                this.$http(api_get_base_account_status_account).then(res=>{
                    this.accountStatus=[{label:"全部",value:''},...res.map(row=>{
                        return {label:row.remark,value:row.status}
                    })];
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
        },
        props: {
            searchData:{
                required:true,
                type:Object
            },
            channelList:Array,
            creatorData:Array
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>

