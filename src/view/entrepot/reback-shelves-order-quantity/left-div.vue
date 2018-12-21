<template>
    <div>
        <search-module @init-data="init_data"
                       @change-sku="change_sku"
                       :warning="warning"
                       ref="search_module">
        </search-module>
        <right-div class="mt-xs" ref="right_div"></right-div>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data(){
            return {
                warning:{
                    type:'',
                    message:''
                }
            }
        },
        mounted(){
        },
        methods: {
            init_data(searchData){
                this.$emit('init-data', searchData)
            },
            change_sku(){
                this.warning.message = '';
                this.warning.type = '';
            },
            search(searchData){
                this.$refs.search_module.searchData.search_sku = '';
                this.$refs.search_module.searchData.sku = searchData.sku;
                this.$refs.search_module.searchData.thumb = searchData.thumb;
                this.$refs.search_module.searchData.spu_name = searchData.spu_name;
                this.$refs.search_module.searchData.warehouse_cargo_code = searchData.warehouse_cargo_code;
                this.$refs.search_module.searchData.warehouse_area_type = searchData.warehouse_area_type;
            },
            searchError(){
                this.$refs.search_module.searchData.sku = '';
                this.$refs.search_module.searchData.thumb = '';
                this.$refs.search_module.searchData.spu_name = '';
                this.$refs.search_module.searchData.warehouse_cargo_code = '';
                this.$refs.search_module.searchData.warehouse_area_type = '';
                this.change_sku();
                this.$refs.search_module.select();
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            rightDiv:require('./right-div.vue').default
        },
    }
</script>
