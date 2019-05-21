<template>
    <search-card :params="searchData" @search="search" :clears="clears">
        <el-row>
            <label class="inline mb-mini" title="请选择仓库"> 仓库：</label>
            <super-select class="inline width-sm"
                          v-model="searchData.warehouse_id"
                          v-sf.warehouse_id
                          storageKey="virtual_store"
                          :options="warehouseList">
            </super-select>
            <!--数据来源-->
            <label-item label="包裹数据来源：" class="ml-sm">
                <el-select v-model="searchData.source"
                           v-sf.source
                           class="s-width-default mb-mini">
                    <el-option v-for="data in dataSources"
                               :key="data.value"
                               :label="data.label"
                               :value="data.value"
                    ></el-option>
                </el-select>
            </label-item>
            <!--处理状态-->
            <label-item label="异常类型：" class="ml-sm">
                <el-select v-model="searchData.abnormal_type"
                           v-sf.abnormal_type
                           class="s-width-default mb-mini">
                    <el-option v-for="exception in abnormalType "
                               :key="exception.value"
                               :label="exception.label"
                               :value="exception.value"
                    ></el-option>
                </el-select>
            </label-item>
            <!--审批状态-->
            <label-buttons label='审批状态：'
                           class="inline ml-sm mb-mini"
                           :buttons="auditStatus"
                           @select="select_audit">
            </label-buttons>
        </el-row>
        <!--采购员 处理人 审批人-->
        <el-select class="inline s-width-default"
                   v-sf.person_type
                   v-model="searchData.person_type">
            <el-option v-for="item in personType"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value">
            </el-option>
        </el-select>
        <!--采购人员-->
        <!--<super-select class="inline s-width-default"-->
                      <!--v-model="staffs"-->
                      <!--storageKey="virtual_user"-->
                      <!--:adjustStructure="adjust_structure"-->
                      <!--:remoteRequestHttp="remoteRequestHttp">-->
        <!--</super-select>-->
        <scroll-select v-model="staffs"
                       style="width:158px"
                       class="inline"
                       textAlign="left"
                       v-sf.person_id
                       ref="creater"
                       remote="get|user"
                       :fix-params="fix_params_account"
                       :fixResult="fix_result_account">
        </scroll-select>
        <!--运单号-->
        <el-select class="inline ml-sm s-width-default"
                   v-sf.bill_type
                   v-model="searchData.bill_type">
            <el-option v-for="item in billTypeList"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value">
            </el-option>
        </el-select>
        <order-input v-model="searchData.bill_number"
                     class="inline width-super"
                     v-sf.bill_number
                     @keydown="$emit('search')"></order-input>
        <!--时间搜索-->
        <el-select class="inline ml-sm s-width-default"
                   v-sf.time_type
                   v-model="searchData.time_type">
            <el-option v-for="item in timeTypeList"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value">
            </el-option>
        </el-select>
        <el-date-picker v-model="searchData.date_b"
                        type="date"
                        placeholder="开始时间"
                        v-sf.date_b
                        :picker-options="pickerStart"
                        class="inline date"></el-date-picker>
        <label>&nbsp;--&nbsp;</label>
        <el-date-picker v-model="searchData.date_e"
                        type="date"
                        placeholder="结束时间"
                        v-sf.date_e
                        :picker-options="pickerEnd"
                        class="inline date mr-sm"></el-date-picker>
    </search-card>
</template>
<style lang="stylus">
    .el-card {
        overflow: visible;
        .width-super.el-input {
            width: 200px
        }
    }
</style>
<script>
    import {api_get_purchase_parcels_abnormal_type} from '@/api/package-return-list'
    import {api_get_user} from  '../../../api/report-channel'
    export default {
        name: "search-module",
        data(){
            return{
                dataSources:[],
                abnormalType:[
                    { label:'全部', value:''},
                    { label:'退回供应商', value:4 },
                    { label:'包裹转移仓库', value:5 }
                ],
                billTypeList: [
                    { label: '运单号', value: 0 },
                    { label: '采购单号', value: 1 },
                ],
                statusList: [
                    {label: '全部', value:""},
                    {label: '退回供应商', value: 0},
                    {label: '包裹转移仓库', value: 1},
                ],
                personType: [
                    {label: '采购员', value: 3},
                    {label: '处理人', value: 5},
                    {label: '审批人', value: 6},
                ],
                timeTypeList: [
                    {label: '创建时间', value: 0},
                    {label: '提交时间', value: 5},
                ],
                auditStatus:[
                    { label:'全部', value:"" },
                    { label:'采购待确认', value: 3 },
                    { label:'采购已确认', value: 4 },
                    { label:'仓库待确认', value: 1 },
                    { label:'仓库已确认', value: 2 },
                    { label:'待上传凭证', value: 9 },
                    { label:'已上传凭证', value: 10 },
                ],
                options:[],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e.getTime()
                        } else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b.getTime()
                        } else {
                            return false
                        }
                    }
                },
                initCount:0
            }
        },
        mounted(){
            this.get_data_sources();
        },
        methods:{
            adjust_structure(res) {
                let data = res.data.map(row => {
                    return {
                        label: row.realname,
                        value: row.id
                    }
                });
                return {
                    count: res.count,
                    data: data
                }
            },
            remoteRequestHttp(page,pageSize,query) {
                let data = {
                    page: page,
                    pageSize: 10000,
                    snType: 'realname',
                    snText: query || "",
                };
                return api_get_user(data);
            },
            get_data_sources(){
                this.$http(api_get_purchase_parcels_abnormal_type).then(res=>{
                    this.dataSources = [{label:'全部',value:''},...res];
                }).catch(code=>{
                    console.log(code)
                })
            },
            search(){
                this.$emit('search');
            },
            select_audit(index,data){
                this.initCount++;
                if(this.initCount>1) {
                    this.$emit('select-audit',data.value);
                }
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname"
                };
            },
            //账号结果
            fix_result_account(res) {
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },

        },
        computed: {
            staffs: {
                get() {
                    return {
                        value: this.searchData.person_id,
                        label: this.searchData.person_name,
                    };
                },
                set(val) {
                    this.searchData.person_id = val.value;
                    this.searchData.person_name = val.label;
                }
            },
        },
        props:{
            searchData:{
                type:Object,
                required:true
            },
            clears:{
                type:Object,
                required:true
            },
            warehouseList:{
                type:Array,
                required:true
            },
        },
        components:{
            scrollSelect: require('@/components/scroll-select.vue').default,
            labelButtons:require('@/components/label-buttons').default,
            labelItem:require('@/components/label-item.vue').default,
            orderInput: require('@/components/order-input.vue').default,
        }
    }
</script>
