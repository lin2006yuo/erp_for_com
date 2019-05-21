<template>
    <div class="c-card-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <div>
                <label-buttons
                        label="状态："
                        :buttons="userStatus"
                        @select="change_select"
                        class="inline">
                </label-buttons>
            </div>
            <div  class="mb-mini">
                <el-select class="inline s-width-small"
                                       v-sf.snType
                                       v-model="searchData.snType">
                <el-option v-for="item in conditionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
                </el-select>
                <el-input class="inline"
                          v-sf.snText
                          :placeholder="`请输入${changeLabel}...`"
                          v-model="searchData.snText"
                          @input="keyword"
                ></el-input>
                <label class="inline ml-sm">账号状态：</label>
                <el-select class="inline s-width-small"
                           v-sf.site_status
                           v-model="searchData.site_status">
                    <el-option v-for="item in accountStatus"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <label class="inline ml-sm">授权状态：</label>
                <el-select
                    class="inline width-xs"
                    v-sf.authorization
                    v-model="searchData.authorization"
                    placeholder="请选择">
                    <el-option
                        v-for="item in authorList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <label class="inline">销售员：</label>
            <param-account
                class="inline s-width-default"
                ref="paramSale"
                placeholder="可输入搜索"
                v-model="searchData.seller_id"
                v-sf.seller_id
                :param="{type:'sales',data:{content:''}}"
                :fixUrl="true"
                :fixResult="sale_fix_result"
                type="memberShipSales"
                url="get|user/:type/staffs">
            </param-account>
            <label class="inline ml-sm">客服：</label>
            <param-account
                class="inline s-width-default"
                ref="paramCustomer"
                placeholder="可输入搜索"
                v-model="searchData.customer_id"
                v-sf.customer_id
                :param="{type:'customer',data:{content:''}}"
                :fixUrl="true"
                :fixResult="sale_fix_result"
                type="memberShipSales"
                url="get|user/:type/staffs">
            </param-account>
            <el-select class="inline s-width-large ml-sm"
                       v-sf.taskName
                       v-model="searchData.taskName"
                       filterable>
                <el-option
                        v-for="res in taskNameList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="searchData.taskCondition"
                       class="inline"
                       style="width:60px"
                       v-sf.taskCondition
                       filterable>
                <el-option
                        v-for="res in taskList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"></el-option>
            </el-select>
            <el-select v-model="searchData.taskTime"
                       class="inline s-width-small"
                       v-sf.taskTime
                       filterable>
                <el-option
                        v-for="res in taskTimeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-select class="inline s-width-small ml-sm"
                       v-sf.time_type
                       v-model="searchData.time_type">
                <el-option v-for="item in dataList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-date-picker
                type="date"
                v-sf.start_date
                placeholder="开始时间"
                v-model="searchData.start_time"
                class="inline date"
                :picker-options="pickerStart"
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                type="date"
                placeholder="结束时间"
                v-sf.end_date
                v-model="searchData.end_time"
                class="inline date mr-sm"
                :picker-options="pickerEnd"
            ></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_site_status} from '@/api/ymx';
    export default {
        data() {
            return {
                userStatus: [
                    {name: "全部", status: 0},
                    {name: "已启用", status: 1},
                    {name: "已停用", status: 2}
                ],
                authorList: [
                    {value: '', label: '全部'},
                    {value: '0', label: '未授权'},
                    {value: '1', label: '已授权'},
                ],
                conditionList: [
                    {value: 'account_name', label: '帐号'},
                    {value: 'code', label: '简称'},
                ],
                dataList:[
                    {label:"注册日期",value:'register'},
                    {label:'交接日期',value:'fulfill'},
                ],
                accountStatus:[],
                taskNameList: [
                    {label: "抓取Listing数据", value: 'download_listing'},
                    {label: "抓取订单数据", value: 'download_order'},
                    {label: "同步发货状态", value: 'sync_delivery'},
                ],
                taskTimeList: [
                    {label: "全部", value: ''},
                    {label: "未启用", value: 0},
                    {label: "30分钟", value: 30},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "4小时", value: 240},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "7小时", value: 420},
                    {label: "8小时", value: 480},
                    {label: "9小时", value: 540},
                    {label: "10小时", value: 600},
                    {label: "11小时", value: 660},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440}
                ],
                taskList: [
                    {label: "=", value: 'eq'},
                    {label: "<", value: 'lt'},
                    {label: ">", value: 'gt'},
                ],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_time) {
                            return time.getTime() > this.searchData.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.start_time) {
                            return time.getTime() < this.searchData.start_time||time.getTime()>Date.now();
                        }
                    }
                },
            }
        },
        mounted(){
            this.site_status();
        },
        methods: {
            site_status(){
                this.$http(api_site_status).then(res=>{
                    let data = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.status,
                        }
                    });
                    this.accountStatus= [{label: "全部", value: ""}, ...data]
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
//			状态/全部、启用、停用
            change_select(index) {
                let fSelect = this.userStatus[index].status;
                if (fSelect === 0) {
                    delete this.searchData.status;
                } else if (fSelect === 1) {
                    this.searchData.status = true;
                } else if (fSelect === 2) {
                    this.searchData.status = false;
                }
                this.$emit("change-select");
            },
//           输入
            keyword() {
                this.$emit("key-word");
            },
            sale_fix_result(res){
                let data=res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                });
                data.unshift({value:0,label:'空'});
                return data
            },
            search() {
                this.$emit("search");
            },
        },
        props: {
            searchData: {},
            clears: {},
        },
        computed: {
            changeLabel() {
                if (this.searchData.snType === 'account_name') {
                    return `账户`;
                } else{
                    return `简称`;
                }
            },
        },
        components: {
            labelButtons: require('@/components/label-buttons.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
        }
    }
</script>
