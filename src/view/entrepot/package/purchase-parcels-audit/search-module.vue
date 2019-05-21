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
            <label-item label="SKU：" class="ml-sm">
                <el-input v-model="searchData.sku" class="width-sm enter-result" v-sf.sku></el-input>
            </label-item>
            <label-item class="ml-sm">
                <el-select  v-model="searchData.creator_type" class="width-xs mr-xs" v-sf.creator_type>
                    <el-option v-for="(item, index) in creators"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <super-select class="width-sm inline"
                              v-model="searchData.creator_id"
                              v-sf.creator_id
                              storage-key="staffs"
                              :options="userList"
                              placeholder="请选择/输入..."></super-select>
                <!--<param-account
                        v-model="searchData.creator_id"
                        v-sf.creator_id
                        class="width-sm"
                        :param="{data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="warehouseUser"
                        placeholder="请选择/输入..."
                        url="get|user/warehouse/staffs">
                </param-account>-->
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
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    import {api_warehouse_staffs} from "@/api/warehouse-cargo";

    export default {
        data() {
            return {
                searchData: {
                    warehouse_id: '',
                    sku: '',
                    creator_id: '',
                    creator_type: 0,
                    create_time_from: '',
                    create_time_to: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    creator_type: 0,
                    page: 1,
                    pageSize: 20
                },
                warehouseList: [],
                userList: [],
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
                creators: [
                    {label: '创建人', value: 0},
                    {label: '拆包人', value: 1}
                ]
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_staffs();
        },
        methods: {
            init_warehouse() {
                //本地仓包括中转仓
                let params = {
                    sign: 'local_transit'
                };
                this.$http(api_get_warehouse_default, params).then(res => {
                    this.warehouseList = res.map(item => {
                        return {label: item.name, value: item.id};
                    });
                    this.searchData.warehouse_id = this.warehouseList[0].value
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_staffs() {
                this.$http(api_warehouse_staffs).then(res => {
                    this.userList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
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
            paramAccount: require('@/api-components/param-account').default,
        }
    }
</script>
