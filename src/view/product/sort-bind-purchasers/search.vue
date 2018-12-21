<template>
    <search-card @search="search" :clears="clears" :params="searchData">
        <label-item label="采购员：">
            <el-select v-model="searchData.purchaser_id" filterable>
                <el-option v-for="item in purchasing"
                           :label="item.realname"
                           :value="item.id"
                           :key="item.id"
                ></el-option>
            </el-select>
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