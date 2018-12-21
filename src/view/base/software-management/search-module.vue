<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">
            <label-item class="inline">
                <label-buttons class="inline mr-sm" label="状态：" :buttons="statusBtn" @select="select_status"></label-buttons>
            </label-item>
            <label-item label="" class="inline">
                <label-buttons class="inline mr-sm" label="软件类型：" :buttons="typeBtn" @select="select_type"></label-buttons>
            </label-item>
        </search-card>
    </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        data () {
            return {

            }
        },
        mounted(){

        },
        methods: {
            search(){
                this.$emit('search')
            },
            //切换状态
            select_status(index){
                this.$emit('select-status',this.statusBtn[index].value)
            },
            //切换类型
            select_type(index){
                this.$emit('select-type',this.typeBtn[index].value)
            },
        },
        props: {
            searchData:{
                require: true,
                type: Object
            },
            clears:{
                require: true,
                type: Object
            },
            statusBtn:{
                require: true,
                type: Array
            },
            typeBtn:{
                require: true,
                type: Array
            },
        },
        components: {
            searchCard:require("@/components/search-card.vue").default,
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>