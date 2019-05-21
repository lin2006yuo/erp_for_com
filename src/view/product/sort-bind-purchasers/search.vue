<template>
    <search-card @search="search" :clears="clears" :params="searchData">
        <label-item label="采购员：" class="ml-sm">
            <!--<el-select v-model="searchData.purchaser_id" filterable clearable >-->
                <!--<el-option v-for="item in purchasing"-->
                           <!--:label="item.realname"-->
                           <!--:value="item.id"-->
                           <!--:key="item.id"-->
                <!--&gt;</el-option>-->
            <!--</el-select>-->
            <super-select v-model="searchData.purchaser_id"
                          storageKey="purchasing" placeholder="全部"
                          :options="purchasing"></super-select>
        </label-item>
        <label-item label="SKU查重文员："  class="ml-sm" >
            <!--<el-select v-model="searchData.sku_checking_id" filterable clearable >-->
                <!--<el-option v-for="item in skuManager"-->
                           <!--:label="item.realname"-->
                           <!--:value="item.id"-->
                           <!--:key="item.id"-->
                <!--&gt;</el-option>-->
            <!--</el-select>-->
            <super-select v-model="searchData.sku_checking_id" placeholder="全部"
                          storageKey="skuManager" :options="skuManager"></super-select>
        </label-item>
    </search-card>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            search() {
                this.$emit('search')
            }
        },
        props:{
            purchasing:{},
            skuManager:{},
            secretary:{},
            searchData:{
                type:Object
            },
            clears:{}
        },
        components:{
            searchCard:require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default,
        }
    }
</script>

<style scoped>

</style>
