<template>
    <search-card @search="search" :params="searchData" :clears="clears">
        <label-button label="账号表现："
                      class="ml-lg mr-lg mb-sm"
                      ref="ebayAccountShow"
                      :buttons="buttons"
                      @select="change_button"></label-button>
        <label class="inline ml-lg mb-mini">账号简称：</label>
        <el-select v-model="searchData.accountIds" multiple clearable
                   size="mini"
                   filterable
                   :placeholder="$t('ebay-list.ps')"
                   class="inline mr-sm input-no-margin self-width" >
            <el-option
                v-for="item in accountList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>

    </search-card>
</template>

<script>
    export default {
        name: "search",
        data(){
            return{
            }
        },
        methods:{
            search(){
                this.$emit('search')
            },
            change_button(val, item){
                this.$emit('change-button',val,item)
            },
        },
        props:{
            buttons:{},
            accountList:{},
            searchData:{},
            clears:{}
        },
        components:{
            searchCard:require('@/components/search-card.vue').default,
            labelButton: require('@/components/label-buttons.vue').default,
        }
    }
</script>

<style scoped>

</style>
