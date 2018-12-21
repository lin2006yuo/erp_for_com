<template>
    <div>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
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
        <search-card :params="searchData"
                     @search="search"
                     @enter="search"
                     :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons
                        label="当前集结状态："
                        class="inline"
                        @select="change_work_status"
                        :buttons="massList">
                </label-buttons>
            </div>
            <label-item label="集结区号：">
                <el-input v-model="searchData.mass_zone_num"
                          placeholder="请输入集结区号"
                          v-sf.mass_zone_num>
                </el-input>
            </label-item>
            <label-item label="拣货单号：" class="ml-sm mr-sm">
                <el-input v-model="searchData.picking_num"
                          placeholder="请输入拣货单号"
                          v-sf.picking_num>
                </el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking} from '@/api/mass-zone'

    export default {
        data() {
            return {
                warehouse_id: 2,
                searchData: {
                    status: '',
                    work_status: '',
                    picking_id: '',
                    sequence_number: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    page: 1,
                    pageSize: 20
                },
                warehouses: [],
                massList: [
                    {label: '全部', value: ''},
                    {label: '空置', value: 0},
                    {label: '集结中', value: 1},
                    {label: '集结完成，待确认', value: 2}
                ]
            }
        },
        mounted() {
            this.init_warehouse();
        },
        methods: {
            init_status_btn() {
                let cur = this.statusList;
                let cur2 = this.massList;
                this.statusList = [];
                this.massList = [];
                this.$nextTick(() => {
                    this.statusList = cur;
                    this.massList = cur2;
                })
            },
            init() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === "string") {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
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
            change_work_status(select, item) {
                this.searchData.work_status = item.value;
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
