<template>
    <div>
        <search-card :params="searchData" @search="search" :clears="clears" @enter="search">
            <label-item label="仓库：">
                <el-select v-model="searchData.warehouse_id" class="width-sm" v-sf.warehouse_id>
                    <el-option v-for="(item, index) in warehouseList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="SKU：">
                <el-input v-model="searchData.sku" class="width-sm enter-result" v-sf.sku></el-input>
            </label-item>
            <label-item label="创建人：">
                <param-account
                        v-model="searchData.creator_id"
                        v-sf.creator_id
                        class="width-sm"
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
                        v-sf.create_time_from
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.date_b
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.create_time_to"
                        v-sf.create_time_to
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.date_e
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_warehouse} from '@/api/arrival-parcel'

    export default {
        data() {
            return {
                searchData: {
                    warehouse_id: 2,
                    sku: '',
                    creator_id: '',
                    create_time_from: '',
                    create_time_to: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    warehouse_id: 2,
                    page: 1,
                    pageSize: 20
                },
                warehouseList: [],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b;
                        } else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted() {
            this.init_warehouse();
        },
        methods: {
            init_warehouse() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = res.map(item => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            search() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === "string") {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.$emit('init-data', this.searchData);
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
        watch: {},
        props: {},
        components: {
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default,
            paramAccount: require('@/api-components/param-account').default
        }
    }
</script>
