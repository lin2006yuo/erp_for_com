<template>
    <div class="p-set-sore-classify-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <label>平台账号：</label>
            <el-select class="inline s-width-small" v-sf.joom_account_id v-model="searchData.joom_account_id"
                       @change="select_account" filterable>
                <el-option v-for="(item, index) in joom_account" :key="index" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <label class="ml-sm">平台店铺：</label>
            <el-select class="inline s-width-large" v-sf.joom_shop_id v-model="searchData.joom_shop_id"
                       :disabled="storeIsDisable" placeholder="请先选择账号" filterable>
                <el-option v-for="(item, index) in joom_store" :key="index" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <label class="ml-sm">产品分类：</label>
            <ui-groups class="mr-sm" v-model="searchData.category_id" v-sf.category_id
                       :parent-click="parentClick"
                       :option="categoryTree"></ui-groups>
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

<style lang="stylus">
    .p-set-sore-classify-search {

    .el-card {
        overflow: unset;
    }

    }
</style>
<script>
    import {api_get_joom_store} from '../../../../api/joom-set-classify'

    export default{
        data(){
            return {
                searchData: {
                    page: 1,
                    pageSize: 50,
                    joom_account_id: '',
                    joom_shop_id: '',
                    category_id: ''
                },
                clears: {
                    page: 1,
                    pageSize: 50,
                    joom_account_id: '',
                    joom_shop_id: '',
                    category_id: ''
                },
                joom_store: [],
                parentClick:true,
            }
        },
        created(){

        },
        filters: {},
        mounted(){

        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){

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
            select_account(val){
                if (val === '') {
                    this.searchData.joom_shop_id = '';
                } else {
                    console.log(22)
                    this.get_joom_store();
                }
            },
            get_joom_store(){
                this.$http(api_get_joom_store, {joom_account_id: this.searchData.joom_account_id}).then(res => {
                    this.joom_store = [{label: '全部', value: ''}, ...res.data];
                })
            }
        },
        computed: {
            storeIsDisable(){
                return this.searchData.joom_account_id === ''
            }
        },
        watch: {},
        props: {
            categoryTree: {},
            joom_account: {},
            total: {
                default(){
                    return 0
                }
            },
        },
        components: {
            searchCard: require('../../../../components/search-card.vue').default,
            uiGroups: require("../../../../components/ui-groups.vue").default,
        }
    }
</script>

