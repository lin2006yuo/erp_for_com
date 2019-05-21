<template>
    <div>
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" :is-search="isSearch">
            <div class="mb-xs">
                <label class="ml-sm">{{$t('ymx-list.pa')}}：</label>
                <!--<el-select class="inline s-width-default mr-sm"-->
                           <!--v-sf.account-->
                           <!--v-model="searchData.account"-->
                           <!--:placeholder="$t('ymx-list.selectTheSite')" filterable clearable  remote :remote-method="remoteMethod" >-->
                    <!--<el-option v-for="(item, index) in account"-->
                               <!--:label="item.code"-->
                               <!--:value="item.account_id"-->
                               <!--:key="item.account_id"></el-option>-->
                <!--</el-select>-->
                <super-select
                    class="inline s-width-default mr-sm"
                    v-sf.account
                    v-model="searchData.account"
                    :placeholder="$t('ymx-list.selectTheSite')"
                    :clearable="true"
                    :options="account"
                    storageKey="not_published_account"
                ></super-select>
                <el-select class="inline s-width-default" v-model="searchData.snType" v-sf.snType >
                    <el-option v-for="(item, index) in snType" :value="item.value" :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <!--<el-input class="inline s-width-middle ml-sm" v-model="searchData.snText" :placeholder="$t('ymx-list.searchTip')"></el-input>-->
                <order-input v-if="searchData.snType!=='name'" class="inline s-width-middle" style="width: 200px;" v-model="searchData.snText" v-sf.snText @keydown.enter.native="search" :placeholder="getplace"></order-input>
                <el-input
                    v-else
                    class="inline s-width-middle"
                    style="width: 200px;"
                    v-model="searchData.snText"
                    v-sf.snText
                    :placeholder="getplace"
                    @keydown.enter.native="search"
                >
                </el-input>
                <!--开发员-->
                <label class="ml-sm">{{$t('ymx-list.develop')}}：</label>
                <!--<param-account-->
                        <!--class="inline s-width-default"-->
                        <!--ref="paramDevelopment"-->
                        <!--v-model="searchData.developer_id"-->
                        <!--v-sf.developer_id-->
                        <!--:fixResult="development_fix_result"-->
                        <!--type="memberShipDeveloper"-->
                        <!--:placeholder="$t('ymx-list.pse')"-->
                        <!--url="get|user/development/staffs">-->
                <!--</param-account>-->
                <super-select
                    class="inline s-width-default"
                    v-model="searchData.developer_id"
                    v-sf.developer_id
                    :options="developmentArr"
                    :placeholder="$t('ymx-list.pse')"
                    storageKey="not_published_developer_id"
                ></super-select>
                <label class="ml-sm">{{$t('ymx-list.pc')}}：</label>
                <!--<ui-groups class="inline" v-model="searchData.category_id" v-sf.category_id-->
                           <!--:parent-click="parentClick"-->
                           <!--:option="categoryTree"></ui-groups>-->
                <el-cascader
                    class="inline"
                    clearable
                    :placeholder="$t('ymx-list.ps')"
                    v-model="searchData.category_id"
                    v-sf.category_id
                    :options="categoryTree"
                    change-on-select
                    expand-trigger="hover"
                ></el-cascader>
                <!--产品标签-->
                <label class="ml-sm">{{$t('ymx-list.productLabel')}}：</label>
                <el-select
                    class="inline s-width-default"
                    v-model="searchData.tag_id" v-sf.tag_id >
                    <el-option  v-for="(item,index) in productLabelArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <label class="ml-sm">{{$t('ymx-list.langSup')}}：</label>
            <el-select :placeholder="$t('ymx-list.pl')"
                       class="inline mr-sm s-width-default"
                       style="width: 550px;"
                       v-model="searchData.lang_id" v-sf.lang_id multiple filterable clearable>
                <el-option
                        v-for="(item, index) in langList"
                        :value="item.id"
                        :label="item.name"
                        :key="index"
                ></el-option>
            </el-select>
        </search-card>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page=searchData.page
            :page-sizes="[20, 50,100, 200, 500]"
            :page-size=searchData.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
    </div>
</template>

<style lang="stylus" scoped>
    .width-100{
        width:110px;
    }
    .el-card{
        overflow: inherit;
    }
</style>
<script>
    import {api_get_amazon_account,api_publish_amazon_tags,api_development_staffs} from '../../../../api/amazon-publish-list';
    import {api_joom_category_tree,} from '../../../../api/joom-set-classify';
    import {publish_edit_lang} from '../../../../api/product-library';
    export default{
        data(){
            return {
                searchData: {
                    page:1,
                    pageSize:50,
                    snType: 'spu',
                    snText: '',
                    site: '',
                    account: '',
                    category_id:[],
                    developer_id:'',
                    lang_id:'',
                    tag_id:""
                },
                snType: [
                    {
                        label: this.$t('ymx-list.localspu'),
                        value: 'spu'
                    },
                    {
                        label: this.$t('ymx-list.localsku'),
                        value: 'sku'
                    },
                    {
                        label: this.$t('ymx-list.name'),
                        value: 'name'
                    }
                ],
                clears: {
                    page:1,
                    pageSize:50,
                    snType: '',
                    snText: '',
                    site: '',
                    account: '',
                    category_id:[]
                },
                test: [
                    {
                        label: 1,
                        value: 1
                    }
                ],
                account:[],
                categoryTree: [],
                parentClick:true,
                langList:[],
                productLabel:0,
                productLabelArr:[],
                allAccount:[],
                developmentArr:[]
            }
        },
        created(){
            this.get_category_tree();
            this.get_account();
            this.get_lang();
            this.get_tags();
            this.get_development_staffs();
        },
        methods: {
            development_fix_result(res){
                res = res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                });
                return {
                    count: res.length||0,
                    data:res
                }
            },
            get_development_staffs(){
                this.$http(api_development_staffs)
                    .then(res=>{
                        console.log(res);
                        res.forEach(item=>{
                            this.developmentArr.push({label:item.realname,value:item.id});
                        })
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message || err
                        })
                    })
            },
            get_category_tree(){
                this.$http(api_joom_category_tree).then(res => {
                    this.categoryTree = this.data_format(res.data);
                    console.log(this.categoryTree);
                });
            },
            data_format(val){
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },
            search(){
                let str=this.searchData.snText;
                str=str.replace(new RegExp('\n','gm')," ");
                str=str.replace(new RegExp(' ','gm'),",");
                str=str.replace(/,{1,}/g,",");
                this.$emit('search', this.searchData,str);
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.search();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.search();
            },
            get_account(){
                this.$http(api_get_amazon_account).then(res => {
                    this.allAccount = res;
                    // this.account =res.slice(0,50);
                    res.forEach(item=>{
                        this.account.push({label:item.code,value:item.account_id});
                    })
                    // this.searchData.account = this.account.length>0?this.account[0].account_id:'';
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message:code.message || code
                    });
                    // this.account.splice(0, this.account.length+1);
                })
            },
            remoteMethod(query) {
                if (query !== '') {
                        this.account = this.allAccount.filter(item => {
                            return item.code.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                }else{
                    this.account = this.allAccount.slice(0,50); //没有输入默认显示30条数据
                }
            },
            get_lang(){
                this.$http(publish_edit_lang).then(res => {
                    this.langList = res.map(row => {
                        return row;
                    })
                    console.log(this.langList,'this.langList');
                }).catch(code => {
                    console.log(code);
                })
            },
            change_site(val){
                if(!!val){
//                    this.get_account();
                }else {
                    this.account.splice(0, this.account.length+1);
                    this.searchData.account = '';
                }
            },
            get_tags(){
                this.$http(api_publish_amazon_tags).then(res=>{
                    this.productLabelArr=[{label:this.$t('ymx-list.all'),value:''},...res];
                    console.log(res);
                })
            },
        },
        computed: {
            isHasSite(){
                return !this.searchData.site;
            },
            isSearch(){
                return !this.searchData.account
            },
            getplace(){
                return this.searchData.snType=="name"? this.$t('ymx-list.Fuzzy') + "...":this.$t('ymx-list.searchTip');
            },
        },
        watch: {},
        props: {
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            },
            siteList:{
                required: true,
                type: Array,
            },
        },
        components: {
            searchCard: require('../../../../components/search-card.vue').default,
            uiGroups: require("../../../../components/ui-groups.vue").default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>

