<template>
    <div class="c-search-list">
        <search-card :params="searchData" @search="search" :clears="clears">
            <label-item :label="$t('ymx-up-lower-rule.ruleName')+'：'" class="ml-sm mr-sm">
                <el-input v-model="searchData.rule_name" class="s-width-middle" @keyup.native.enter="search" v-sf.name :placeholder="$t('ymx-heel-sale-list.supportSearch')" ></el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        methods:{
            search(){
                this.$emit('search');
            },
            fixRule(res){
                let list = res.data.map(row => {
                    return {
                        label: row.rule_name,
                        value: row.id
                    }
                });
                return list
            },
        },
        props:{
            searchData:{},
            clears: {},
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            paramAccount:require('@/api-components/param-account').default
        }
    }
</script>
