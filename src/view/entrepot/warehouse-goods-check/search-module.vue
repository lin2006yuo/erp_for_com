<template>
    <div>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id" @change="change_depot" class="inline width-xs">
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
                     :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons
                        label="盘点状态："
                        class="inline"
                        @select="change_status"
                        :buttons="statusList">
                </label-buttons>
                <label-buttons
                        label="盘点类型："
                        class="inline ml-sm"
                        @select="change_type"
                        :buttons="typeList">
                </label-buttons>
            </div>
            <label-item label="盘点单号：">
                <el-input v-model="searchData.id"
                          v-sf.id
                          @keyup.enter.native="id_enter"
                          placeholder="输入后按回车键确认...">
                </el-input>
            </label-item>
            <label-item label="盘点人：" class="ml-sm">
                <param-account
                        class="width-sm"
                        v-model="searchData.checker_id"
                        :param="{data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="warehouseUser"
                        placeholder="请选择/输入..."
                        url="get|user/warehouse/staffs">
                </param-account>
            </label-item>
            <label-item label="创建人：" class="ml-sm">
                <param-account
                        class="width-sm"
                        v-model="searchData.creator_id"
                        :param="{data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="warehouseUser"
                        placeholder="请选择/输入..."
                        url="get|user/warehouse/staffs">
                </param-account>
            </label-item>
            <label-item label="创建时间：" class="ml-sm mr-sm">
                <el-date-picker
                        v-model="searchData.create_time_from"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.create_time_from
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.create_time_to"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.create_time_to
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking} from '@/api/turnover-box'
    import {api_get_status} from '@/api/warehouse-goods-check'

    export default {
        data() {
            return {
                warehouse_id: 2,
                searchData: {
                    type: '',
                    status: '',
                    id: '',
                    checker_id: '',
                    creator_id: '',
                    create_time_from: '',
                    create_time_to: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    page: 1,
                    pageSize: 20
                },
                warehouses: [],
                statusList: [],
                typeList: [
                    {label: '全部', value: ''},
                    {label: '动态盘点', value: 0},
                    {label: '静态盘点', value: 1},
                    {label: '拣货异常', value: 2}
                ],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.create_time_to) {
                            return time.getTime() > this.searchData.create_time_to;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.create_time_from) {
                            return time.getTime() < this.searchData.create_time_from;
                        } else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_status();
        },
        methods: {
            init_status_btn() {
                let cur = this.boxList;
                let cur2 = this.statusList;
                this.boxList = [];
                this.statusList = [];
                this.$nextTick(() => {
                    this.boxList = cur;
                    this.statusList = cur2;
                })
            },
            init() {
                typeof this.searchData.id === 'string' && (this.searchData.id = this.searchData.id.trim());
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
            init_status() {
                this.$http(api_get_status).then(res => {
                    this.statusList = [{label: '全部', value: ''}, ...res];
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            change_depot() {
                this.init();
            },
            change_status(select, item) {
                this.searchData.status = item.value;
                this.init();
            },
            change_type(select, item) {
                this.searchData.type = item.value;
                this.init();
            },
            search() {
                this.init();
            },
            id_enter() {
                this.init();
            },
            sale_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            paramAccount: require('@/api-components/param-account').default
        },
    }
</script>
