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
                <param-account v-model="searchData.developer_id" class="s-width-default" v-sf.developer_id
                               :fixResult="development_fix_result"
                               type="memberShipSales"
                               placeholder="请选择/输入..."
                               url="get|user/development/staffs"></param-account>
            </label-item>
            <label-item label="创建人：" class="ml-sm mr-sm">
                <param-account v-model="searchData.creator_id" class="s-width-default" v-sf.creator_id
                               :fixResult="fixResult_creator"
                               type="creatorList"
                               placeholder="请选择/输入..."
                               url="get|publish/amazon/doc-creator"></param-account>
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

    export default {
        data() {
            return {
                snTypeList:[
                    {label:'本地SPU',value:'spu'},
                    {label:'本地SKU',value:'sku'},
                ]
            }
        },
        methods:{
            development_fix_result(val){
                return val.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            fixResult_creator(val){
                console.log(val,'val');
                return val.data
            },
            search_data(){
                this.$emit('search-data');
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