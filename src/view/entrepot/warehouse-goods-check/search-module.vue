<template>
    <div>
        <search-card :params="searchData"
                     @search="$listeners['search']"
                     :clears="clears"
                     @init-params="$listeners['init-status-btn']">
            <div>
                <label-buttons
                        label="盘点状态："
                        class="inline"
                        @select="$listeners['change-status']"
                        :buttons="statusList">
                </label-buttons>
                <label-buttons
                        label="盘点类型："
                        class="inline ml-sm"
                        @select="$listeners['change-type']"
                        :buttons="typeList">
                </label-buttons>
            </div>
            <label-item label="盘点单号：">
                <el-input v-model="searchData.id"
                          v-sf.id
                          @keyup.enter.native="$listeners['search']"
                          placeholder="输入后按回车键确认...">
                </el-input>
            </label-item>
            <label-item label="" class="inline ml-sm">
                <el-select v-sf.operator_type v-model="searchData.operator_type" class="inline width-xs" @change="change_operator">
                    <el-option
                            :key="item.value"
                            v-for="item in operatorList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <super-select v-model="searchData.urText"
                              v-if="searchData.operator_type !== 'auditor_id'"
                              class="width-sm"
                              :options="staffsList"
                              storageKey="warehouseStaffs"></super-select>
                <!--<param-account-->
                        <!--class="width-sm"-->
                        <!--v-if="searchData.operator_type !== 'auditor_id'"-->
                        <!--v-model="searchData.operator_id"-->
                        <!--v-sf.operator_id-->
                        <!--:param="{data:{content:''}}"-->
                        <!--:fixUrl="true"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="warehouseUser"-->
                        <!--placeholder="请选择/输入..."-->
                        <!--url="get|user/warehouse/staffs">-->
                <!--</param-account>-->
                <el-input v-model="searchData.operator_id"
                          v-sf.operator_id
                          v-else
                          @keyup.enter.native="$listeners['search']"
                          placeholder="输入后按回车键确认...">
                </el-input>
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
    import {api_get_staffs_list} from '@/api/warehouse-cargo';
    export default {
        data() {
            return {
                operatorList: [
                    {label: '盘点人', value: 'checker_id'},
                    {label: '创建人', value: 'creator_id'},
                    {label: '待审核人', value: 'valid_auditor_ids'},
                    {label: '审核人', value: 'auditor_id'}
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
                staffsList: []
            }
        },
        mounted(){
            this.get_staffs()
        },
        methods: {
            get_staffs(){
                this.$http(api_get_staffs_list).then(res => {
                    this.staffsList = res.map(row => {
                        return {
                            value: row.id,
                            label: row.realname
                        }
                    })
                })
            },
            change_operator(){
                this.searchData.operator_id = ''
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
        props: {
            searchData: {},
            clears: {},
            warehouses: {},
            statusList: {},
            typeList: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            paramAccount: require('@/api-components/param-account').default
        },
    }
</script>
