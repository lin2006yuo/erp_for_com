<template>
    <div>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      @warning="warning"
                      @pack-data="packData"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                searchData:{},
                action:{},
            }
        },
        mounted(){

        },
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            packData(data){
                this.$emit('push-data',data);
            },
            warning(code){
                this.$refs.search_module.$refs.shipping_number.$refs.input.select();
                this.$refs.search_module.warning.shipping_number = `面单号：${this.searchData.shipping_number}，${code}`;
            },
        },
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
        }
    }
</script>
