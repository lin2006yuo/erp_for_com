<template>
    <div>
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" :is-search="isSearch">
            <div class="mb-xs">
                <label class="ml-sm">{{$t('ymx-list.pa')}}：</label>
                <el-select class="inline s-width-default"
                           v-model="searchData.account"
                           placeholder="请先选择站点" filterable>
                    <el-option v-for="(item, index) in account"
                               :label="item.code"
                               :value="item.account_id"
                               :key="item.account_id"></el-option>
                </el-select>
                <el-select class="inline s-width-default ml-sm" v-model="searchData.snType">
                    <el-option v-for="(item, index) in snType" :value="item.value" :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <el-input class="inline s-width-middle ml-sm" v-model="searchData.snText"></el-input>
                <label class="ml-sm">{{$t('ymx-list.develop')}}：</label>
                <param-account
                        class="s-width-default"
                        ref="paramDevelopment"
                        v-model="searchData.developer_id"
                        v-sf.developer_id
                        :fixResult="development_fix_result"
                        type="memberShipDeveloper"
                        :placeholder="$t('ymx-list.pse')"
                        url="get|user/development/staffs">
                </param-account>
                <label class="ml-sm">{{$t('ymx-list.pc')}}：</label>
                <ui-groups class="inline mr-sm  " v-model="searchData.category_id" v-sf.category_id
                           :parent-click="parentClick"
                           :option="categoryTree"></ui-groups>
            </div>
            <label class="ml-sm">{{$t('ymx-list.langSup')}}：</label>
            <el-select :placeholder="$t('ymx-list.pl')"
                       class="inline mr-sm"
                       style="width: 550px;"
                       v-model="searchData.lang_id" multiple filterable clearable>
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
    import {api_get_amazon_account} from '../../../../api/amazon-publish-list';
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
                    category_id:'',
                    developer_id:'',
                    lang_id:''
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
                    category_id:''
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
                langList:[]
            }
        },
        created(){
            this.get_category_tree();
            this.get_account();
            this.get_lang()
        },
        methods: {
            development_fix_result(res){
                console.log(res,'res');
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            get_category_tree(){
                this.$http(api_joom_category_tree).then(res => {
                    this.categoryTree = this.data_format(res.data);
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
                this.$emit('search', this.searchData);
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
                    this.account = res;
                    this.searchData.account = this.account.length>0?this.account[0].account_id:'';
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message:code.message || code
                    });
                    this.account.splice(0, this.account.length+1);
                })
            },
            get_lang(){
                this.$http(publish_edit_lang).then(res => {
                    this.langList = res.map(row => {
                        return row;
                    })
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
            }
        },
        computed: {
            isHasSite(){
                return !this.searchData.site;
            },
            isSearch(){
                return !this.searchData.account
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
        }
    }
</script>

