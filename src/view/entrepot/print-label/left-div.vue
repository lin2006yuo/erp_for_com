<template>
    <div>
        <search-module @init-data="init_data"
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
            }
        },
        mounted(){
        },
        methods: {
            init_data(searchData){
                this.$set(this,"searchData",searchData);
                this.$emit('push-data', window.clone(this.searchData));
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
        },
    }
</script>
