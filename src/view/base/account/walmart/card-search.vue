<template>
    <div class="c-card-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <label-buttons
                label="状态："
                :buttons="userStatus"
                @select="change_select"
                class="inline">
            </label-buttons>
            <el-row class="mb-xs">
                <label-item label="站点：" class="inline">
                    <el-select class="inline s-width-small"
                               v-sf.site
                               v-model="searchData.site" filterable clearable>
                        <el-option v-for="item in siteList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="账号状态：" class="inline ml-sm">
                    <super-select
                            class="s-width-small"
                            v-model="searchData.site_status"
                            :storage-key="`channelStatus`"
                            :options="accountStatus">
                    </super-select>
                </label-item>
                <label-item label="订单授权状态：" class="inline ml-sm">
                    <el-select
                            class="inline width-xs mr-sm"
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
                </label-item>
            </el-row>
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
            <label-item label="销售员：" class="inline ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.seller_id"
                        :storage-key="`channelSeller`"
                        :options="sellerData">
                </super-select>
            </label-item>
            <label-item label="客服：" class="inline ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.customer_id"
                        :storage-key="`customerSeller`"
                        :options="customerData">
                </super-select>
            </label-item>
            <el-select class="inline s-width-large ml-sm"
                       v-sf.taskName
                       v-model="searchData.taskName"
                       @change="change_taskName"
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
            <el-select v-model="searchData.time_type"
                       class="inline ml-sm s-width-small"
                       v-sf.time_type>
                <el-option
                        v-for="res in timeData"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"></el-option>
            </el-select>
            <el-date-picker
                    v-model="searchData.start_time"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.start_time
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.end_time"
                    type="date"
                    placeholder="选择日期"
                    class="inline date mr-sm"
                    v-sf.end_time
                    :picker-options="inputTimeEnd">
            </el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_customer_list,api_get_seller,api_site_status} from '@/api/ymx';
    export default {
        data() {
            return {
                accountStatus:[],
                sellerData:[],
                customerData:[],
                timeData:[
                    {value: 'register',label: '注册日期'},
                    {value:'fulfill',label: '交接日期'}
                ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if (this.searchData.end_time) {
                            return time.getTime() > this.searchData.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if (this.searchData.start_time) {
                            return time.getTime()<this.searchData.start_time||time.getTime() > Date.now();
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
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
                    {value: 'shop_name', label: '店铺名'},
                ],
                taskNameList: [
                    {label: "抓取订单数据", value: 'download_order'},
                    {label: "同步发货状态", value: 'sync_delivery'},
                    {label: "抓取Listing数据", value:'download_listing'}
                ],
                taskTimeList: [
                    {label: "全部", value: ''},
                    {label:"未启用",value:0},
                    {label:'30分钟',value:30},
                    {label:'1小时',value:60},
                    {label:'2小时',value:120},
                    {label:'3小时',value:180},
                    {label:'4小时',value:240},
                    {label:'5小时',value:300},
                    {label:'6小时',value:360},
                    {label:'7小时',value:420},
                    {label:'8小时',value:480},
                    {label:'9小时',value:540},
                    {label:'10小时',value:600},
                    {label:'11小时',value:660},
                    {label:'12小时',value:720},
                    {label:'24小时',value:1440}
                ],
                taskList: [
                    {label: "=", value: 'eq'},
                    {label: "<", value: 'lt'},
                    {label: ">", value: 'gt'},
                ],
            }
        },
        mounted(){
            this.user_staffs();
            this.get_member();
            this.site_status()
        },
        methods:{
            site_status(){
                this.$http(api_site_status).then(res=>{
                    let data = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.status,
                        }
                    });
                    this.accountStatus = [{label: "全部", value: ""}, ...data]
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            user_staffs(){
                this.$http(api_get_seller).then(res=>{
                    let data = res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id,
                        }
                    });
                    this.sellerData = [{label: "全部", value: ""},{label: "空", value: 0}, ...data];
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            get_member(){
                this.$http(api_customer_list,{data:{content:''}}).then(res=>{
                    let data =res.map(item=>{
                        return {label:item.realname,value:item.id};
                    })
                    this.customerData = [{label: "全部", value: ""},{label: "空", value: 0}, ...data];
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
//			状态/全部、启用、停用
            change_select(index) {
                switch(index){
                    case 0:
                        delete this.searchData.status;
                        break;
                    case 1:
                        this.searchData.status = 1;
                        break;
                    case 2:
                        this.searchData.status = 0;
                        break;
                }
                this.$emit("change-select");
            },
//           输入
            keyword() {
                this.$emit("key-word");
            },
//          抓取数据
            change_taskName() {
                this.$emit("change-taskName");
            },
            search() {
                this.$emit("search");
            },
        },
        props: {
            searchData: {},
            clears: {},
            siteList:{
                required:true,
                type:Array
            }
        },
        computed: {
            changeLabel() {
                if (this.searchData.snType === 'account_name') {
                    return `账户`;
                } else if(this.searchData.snType === 'code'){
                    return `简称`;
                } else{
                	return `店铺名`
                }
            },
        },
        components: {
            labelButtons: require('@/components/label-buttons.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>
