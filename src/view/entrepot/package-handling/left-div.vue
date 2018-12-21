<template>
    <div>
        <search-module @init-data="init_data"
                       :is-finish="is_finish"
                       :printer="printer"
                       @pack-data="packData"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data(){
            return {
                searchData:{},
                is_finish:false,
            }
        },
        mounted(){},
        methods: {
            init_data(searchData){
                this.searchData = window.clone(searchData);
            },
            packData(data){
                let item = window.clone(data);
                this.$emit('push-data', item);
            },
        },
        computed: {},
        watch: {},
        props: {
            printer: {}
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
        },
    }
</script>
