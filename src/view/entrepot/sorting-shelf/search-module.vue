<template>
    <div>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm ">
                <el-select v-model="warehouse_id" @change="change_depot" class="inline s-width-default">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears"
                     @init-params="init_status_btn">
            <label-buttons
                    label="默认播种车："
                    class="inline"
                    @select="change_car"
                    :buttons="carList">
            </label-buttons>
            <label-buttons
                    label="状态："
                    class="inline ml-sm"
                    @select="change_status"
                    :buttons="statusList">
            </label-buttons>
            <label-item label="播种车名称：" class="ml-sm mr-sm">
                <el-input v-model="searchData.name"
                          placeholder="请输入播种车名称"
                          v-sf.name>
                </el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking} from '../../../api/generate-order'

    export default {
        data() {
            return {
                warehouse_id: 2,
                searchData: {
                    name: '',
                    is_default: '',
                    status: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    page: 1,
                    pageSize: 20
                },
                warehouses: [],
                carList: [
                    {label: '全部', value: ''},
                    {label: '是', value: 1},
                    {label: '否', value: 0},
                ],
                statusList: [
                    {label: '全部', value: ''},
                    {label: '启用', value: 0},
                    {label: '停用', value: 1},
                ]
            }
        },
        mounted() {
            this.init_warehouse();
            this.init();
        },
        methods: {
            init_status_btn() {
                let cur = this.carList;
                let cur2 = this.statusList;
                this.carList = [];
                this.statusList = [];
                this.$nextTick(() => {
                    this.statusList = cur2;
                    this.carList = cur;
                })
            },
            init() {
                typeof this.searchData.name === 'string' && (this.searchData.name = this.searchData.name.trim());
                let searchData = window.clone(this.searchData);
                Object.assign(searchData, {warehouse_id: this.warehouse_id});
                this.$emit('init-data', searchData);
            },
            init_warehouse() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            change_depot() {
                this.init();
            },
            change_car(select, item) {
                this.searchData.is_default = item.value;
                this.init();
            },
            change_status(select, item) {
                this.searchData.status = item.value;
                this.init();
            },
            search() {
                this.init();
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
        },
    }
</script>
