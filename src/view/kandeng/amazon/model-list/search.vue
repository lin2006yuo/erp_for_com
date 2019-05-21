<template>
    <div class="c-card-search-order">
        <search-card @search="search_data"
                     :params="searchData" :clears="clears">
            <el-select v-model="searchData.snType"
                       class="s-width-small inline" v-sf.snType
                       default-first-option filterable>
                <el-option
                    v-for="res in snTypeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"></el-option>
            </el-select>
            <order-input v-model="searchData.snText"
                         placeholder = '可批量搜索，shift+回车换行...'
                         class="width-super inline" v-sf.snText
                         @keydown="search_data"></order-input>
            <label-item label="开发员：" class="ml-sm">
                <!--<param-account v-model="searchData.developer_id" class="s-width-default" v-sf.developer_id-->
                               <!--:fixResult="development_fix_result"-->
                               <!--type="memberShipSales"-->
                               <!--placeholder="请选择/输入..."-->
                               <!--url="get|user/development/staffs"></param-account>-->
                <super-select
                v-model="searchData.developer_id"
                class="s-width-default"
                v-sf.developer_id
                :placeholder="'请选择/输入...'"
                :options="developmentArr"
                :storageKey="'amazon_model_list_developer'"
            ></super-select>
            </label-item>
            <label-item label="创建人：" class="ml-sm mr-sm">
                <!--<param-account v-model="searchData.creator_id" class="s-width-default" v-sf.creator_id-->
                               <!--:fixResult="fixResult_creator"-->
                               <!--type="creatorList"-->
                               <!--placeholder="请选择/输入..."-->
                               <!--url="get|publish/amazon/doc-creator"></param-account>-->
                <super-select
                    v-model="searchData.creator_id"
                    class="s-width-default"
                    v-sf.creator_id
                    :placeholder="'请选择/输入...'"
                    :options="creatorList"
                    :storageKey="'amazon_model_list_creator_id'"
                ></super-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search-order{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_development_staffs} from '../../../../api/amazon-publish-list';
    import {api_publish_amazon_doc_creator} from '../../../../api/product-category-api';
    export default {
        data() {
            return {
                snTypeList:[
                    {label:'本地SPU',value:'spu'},
                    {label:'本地SKU',value:'sku'},
                ],
                developmentArr:[],
                creatorList:[],
                type:2
            }
        },
        mounted(){
            this.get_development_staffs();
            this.get_site_creator();
        },
        methods:{
            fixResult_creator(val){
                console.log(val,'val');
                return val.data
            },
            get_site_creator(){
                this.$http(api_publish_amazon_doc_creator).then(res=>{
                    console.log(res);
                    this.creatorList = res.data;
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            search_data(){
                this.$emit('search-data');
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
        },
        props:{
            searchData:{
                type:Object,
                required:true,
            },
            clears:{
                type:Object,
                required:true,
            },
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
            orderInput:require('@/components/order-input.vue').default,

        }
    }
</script>
