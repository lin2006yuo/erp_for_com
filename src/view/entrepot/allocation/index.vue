<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      :new-item="new_item"
                      @edit="edit"
                      @new-data="new_data"
                      @storage="storage"
                      @operate-achieve="operate_achieve"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {mapActions, mapGetters} from 'vuex';
    import {api_get_currency} from "@/api/transfer-plan.js"

    export default {
        page: {
            devinfo: {
                frontEnd: '张明亮',
                backEnd: '詹熏欣',
                createTime: '2017-12-06',
                updateTime: '2017-12-07'
            },
        },
        refresh() {
            this.$refs.search_module.init();
        },
        data() {
            return {
                searchData: {},
                tableData: [],
                new_item: {},
            }
        },
        mounted() {
        },
        methods: {
            init_data(searchData) {
                this.searchData = searchData;
                this.$nextTick(() => {
                    this.$refs.table_module.init();
                });
            },
            new_data(data) {
                this.init_data(this.searchData);
            },
            storage(data) {
                let flag = this.$refs.table_module.tableData.findIndex(row => {
                    return row.id === data.id;
                });
                if (flag !== -1) {
                    this.$refs.table_module.tableData.splice(flag, 1);
                }
            },
            operate_achieve(data) {
                if (this.searchData.status !== -1) {
                    let flag = this.$refs.table_module.tableData.findIndex(row => {
                        return row.id === data.id;
                    });
                    if (flag !== -1) {
                        this.$refs.table_module.tableData.splice(flag, 1);
                    }
                } else {
                    this.$refs.table_module.init();
                }
            },
            edit(data) {
                let item = null;
                let flag = this.$refs.table_module.tableData.findIndex(row => {
                    if (row.id === data.id) {
                        item = row;
                        item.update_time = Date.now() / 1000;
                        item.update = this.user.realname;
                    }
                    return row.id === data.id;
                });
                if (flag !== -1 && item) {
                    this.$refs.table_module.tableData.splice(flag, 1, item);
                }
            }
        },
        computed: {
            ...mapGetters({
                'user': 'user/info'
            }),
        },
        watch: {},
        props: {},
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
        },
    }
</script>
