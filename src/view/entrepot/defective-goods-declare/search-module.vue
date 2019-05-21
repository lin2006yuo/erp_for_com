<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @init-params="init_btn" @search="search">
            <el-row>
                <label-item class="inline">
                    <label-buttons class="inline mr-sm" label="状态：" :buttons="statusBtn" @select="$listeners['select-status']"></label-buttons>
                </label-item>
                <label-item class="inline">
                    <label-buttons class="inline mr-sm" label="类型：" :buttons="typeBtn" @select="$listeners['select-type']"></label-buttons>
                </label-item>
            </el-row>
            <label-item label="">
                <el-select v-model="searchData.snType" class="inline s-width-default" v-sf.snType>
                    <el-option
                            :key="item.value"
                            v-for="item in searchOptions"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-model="searchData.snText"
                             class="ml-xs inline s-width-large"
                             v-sf.snText
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
            <label-item label="审核人：" class="inline ml-sm">
                <super-select v-model="searchData.auditor_id"
                              class="s-width-default"
                              :options="staffsList"
                              storageKey="warehouseStaffs"></super-select>
                <!--<param-account-->
                        <!--v-model="searchData.auditor_id"-->
                        <!--class="s-width-default"-->
                        <!--:param="{data:{content:''}}"-->
                        <!--:fixUrl="true"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="warehouseUser"-->
                        <!--placeholder="请选择/输入..."-->
                        <!--url="get|user/warehouse/staffs"></param-account>-->
            </label-item>
            <label-item label="申报人：" class="inline ml-sm">
                <super-select v-model="searchData.creator_id"
                              class="s-width-default"
                              :options="staffsList"
                              storageKey="warehouseStaffs"></super-select>
                <!--<param-account-->
                        <!--v-model="searchData.creator_id"-->
                        <!--class="s-width-default"-->
                        <!--:param="{data:{content:''}}"-->
                        <!--:fixUrl="true"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="warehouseUser"-->
                        <!--placeholder="请选择/输入..."-->
                        <!--url="get|user/warehouse/staffs"></param-account>-->
            </label-item>
            <label-item label="" class="ml-sm">
                <el-select v-model="searchData.time_type" class="s-width-default inline" v-sf.time_type>
                    <el-option v-for="(item, index) in timeList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.create_time_form"
                        type="date"
                        placeholder="选择日期"
                        class="inline date ml-xs"
                        v-sf.create_time_form
                        :picker-options="pickerStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.create_time_to"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        v-sf.create_time_to
                        :picker-options="pickerEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<style lang="stylus" scoped>
    .p-search-module{
        .el-card{
            overflow: inherit;
        }
    }
</style>

<script>
    import { api_get_declare_status } from '@/api/defective-goods-declaration-management';
    import {api_get_staffs_list} from '@/api/warehouse-cargo';
    export default {
        data () {
            return {
                typeBtn: [
                    {label: '全部', value: ''},
                    {label: '申报', value: 0},
                    {label: '盘点', value: 1},
                    {label: '退货', value: 2}
                ],
                statusBtn: [],
                warehouseId: 2,
                searchOptions: [
                    {label: 'SKU', value: 'sku'},
                    {label: '申报单号', value: 'numbers'}
                ],
                timeList: [
                    {label: '创建时间', value: 1},
                    {label: '审核时间', value: 2}
                ],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.searchData.create_time_to){
                            return  time.getTime() > this.searchData.create_time_to
                        }else {
                            return false
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.searchData.create_time_form){
                            return time.getTime() < this.searchData.create_time_form
                        }else {
                            return false
                        }
                    }
                },
                staffsList: []
            }
        },
        mounted() {
            this.get_status();
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
            init_btn() {
                let statusArr = this.statusBtn;
                let typeArr = this.typeBtn;
                this.statusBtn = [];
                this.typeBtn = [];
                this.$nextTick(() => {
                    this.statusBtn = statusArr;
                    this.typeBtn = typeArr;
                });
            },
            //获取状态
            get_status(){
                this.$http(api_get_declare_status).then(res => {
                    this.statusBtn = [{label: '全部', value: ''}, ...res]
                }).catch(code => {
                    this.$message({type: error, message: code.message||code})
                })
            },
            search(){
                this.$emit('search')
            },
            sale_fix_result(res){
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
        },
        props: {
            searchData:{
                require: true,
                type: Object
            },
            clears:{
                require: true,
                type: Object
            }
        },
        components: {
            searchCard:require("@/components/search-card.vue").default,
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            paramAccount:require('@/api-components/param-account').default,
            orderInput: require("@/components/order-input.vue").default
        }
    }
</script>