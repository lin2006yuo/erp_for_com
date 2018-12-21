<template>
    <page>
        <search-module v-resize="{height:500}" @save="save" class="mb-sm scroll"></search-module>
        <table-module :table-data="tableData" v-resize="{height:65}" class="scroll"></table-module>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                tableData:[]
            }
        },
        methods: {
            save(data){
                this.tableData.push(data);
            }
        },
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module').default,
            tableModule:require('./table-module').default
        }
    }
</script>
