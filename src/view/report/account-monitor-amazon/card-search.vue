<template>
    <div class="account-monitor-amazon">
        <searchCard
            :params="searchData" @search="search" :clears="originData" @enter="search"
        >
            <label-item label="平台：" class="ml-sm">
                <el-select
                    v-model="searchData.channel_id"
                    class="s-width-default"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(opt, index) in channelList"
                        :key="`channel_${index}`"
                        :label="opt.label"
                        :value="opt.value"
                    >
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="站点：" class="ml-sm">
                <el-select
                    :disabled="websiteList.length<=1"
                    v-model="searchData.site_code"
                    class="s-width-default"
                    filterable
                    clearable
                    :placeholder="sitePlaceholder"
                >
                    <el-option
                        v-for="(opt, index) in websiteList"
                        :key="`website_${index}`"
                        :label="opt.label"
                        :value="opt.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select
                    v-model="searchData.account_name"
                    class="s-width-default"
                    clearable filterable remote
                    :remote-method="filter_account"
                >
                    <el-option
                        v-for="(item, index) in accountOptions"
                        :key="`account_${index}`"
                        :label="item.label"
                        :value="item.label"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="销售员：" class="ml-sm">
                <el-select
                    placeholder="请选择/输入"
                    class="width-sm input"
                    filterable remote clearable
                    v-model="searchData.seller_id"
                    :remote-method="filter_seller"
                >
                    <el-option
                        v-for="(opt, index) in sellerOptions"
                        :key="`seller_${index}`"
                        :value="opt.id"
                        :label="opt.realname"
                    ></el-option>
                </el-select>
            </label-item>
        </searchCard>
    </div>
</template>
<script>
    import {api_account_list} from '@/api/report-channel'
    import {api_get_seller} from '@/api/amazon-monitor'
    export default {
        data() {
            return {
                //重置的数据
                originData: {},
                //平台选项数据
                channelList: [{label: '亚马逊平台', value: 2}],
                //站点选项数据
                websiteList: [],
                //销售员查询值
                sellerQuery: '',
                //账号简称查询值
                accountQuery: '',
                //账号选项数据
                accountList: [],
                //销售员过滤表
                sellerList: [],
            }
        },
        computed: {
            sitePlaceholder() {
                if(this.searchData.channel_id<=0){
                    return "请先选择平台";
                }else if(this.websiteList.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            accountPlaceholder(){
                if((this.searchData.site_code<=0&&this.accountList.length>1) || this.searchData.site_code>0){
                    return "请选择账号";
                }else if(this.searchData.site_code<=0){
                    return "请先选择站点";
                }else if(this.accountList.length<=1){
                    return "该站点下暂无账号";
                }
            },
            sellerOptions() {
                if(this.sellerQuery) {
                    return this.sellerList.filter(v => {
                        if(!isNaN(+this.sellerQuery)){
                            return v.id.toString().indexOf(this.sellerQuery) > -1
                        } else {
                            return v.realname.indexOf(this.sellerQuery) > -1
                        }
                    });
                } else {
                    return this.sellerList.length >= 50 ? this.sellerList.slice(0,50) : this.sellerList
                }
            },
            accountOptions() {
                if(this.accountQuery === '全部') {
                    const accountList = this.accountList;
                    return accountList.length >= 50 ? accountList.slice(0,50) : accountList
                }
                if(this.accountQuery) {
                    const fillterList = this.accountList.filter(v => {
                        return v.label.toLowerCase().indexOf(this.accountQuery.toLowerCase()) > -1
                    });
                    return fillterList.length >= 50 ? fillterList.slice(0,50) : fillterList
                } else {
                    const accountList = this.accountList;
                    return accountList.length >= 50 ? accountList.slice(0,50) : accountList
                }
            }
        },
        mounted() {
            this.get_site(this.searchData.channel_id);
            this.get_seller()
        },
        methods: {
            search() {
                this.$emit('search')
            },
            get_site(channel_id){
                if(!channel_id)return this.websiteList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        if(res.account.length>0){
                            res = res.account;
                            this.accountList = [{label:"全部",value:""},...res];
                        }else{
                            this.accountList = [{label:"",value:""}];
                        }
                        this.websiteList = [{label:"",value:""}]
                    }else{
                        this.websiteList = [{label:"全部",value:""}, ...res.site];
                        this.accountList = [{label:"全部",value:""}, ...res.account];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id,site){
                if(!channel_id||!site)return this.accountList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site:site}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accountList = [{label:"全部",value:""},...res];
                    }else{
                        this.accountList = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_seller() {
                this.$http(api_get_seller).then(res => {
                    this.sellerList = res
                })
            },
            filter_seller(query) {
                this.sellerQuery = query
            },
            filter_account(e) {
                // this.accountQuery = e.target.value
                this.accountQuery = e
            }
        },
        props: {
            searchData: {
                type: Object,
                required: true
            }
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default
        },
        watch: {
            'searchData.channel_id'(val){
                this.searchData.site_code ='';
                this.searchData.account_name = "";
                this.websiteList = [{label:"",value:""}];
                this.accountList = [{label:"",value:""}];
                this.get_site(val);
            },
            'searchData.site_code'(val){
                if(!val) {
                    this.accountList = [{label:"",value:""}];
                    return
                }
                this.searchData.account_name = "";
                this.get_account(this.searchData.channel_id,val);
            },
        }
    }
</script>
<style>
    .account-monitor-amazon .input {
        margin-right: 10px;
    }
</style>
