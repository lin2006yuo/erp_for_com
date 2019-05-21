<template>
    <div class="c-card-search">
        <search-card @search="$emit('search')" @enter="$emit('search')" :params="params" :clears="clears">
            <div>
                <label-buttons label="状态："
                               :buttons="userStatus"
                               @select="changeSelect"
                               class="inline">
                </label-buttons>
            </div>
            <el-row class="mb-xs">
                <label-item label="站点：" class="inline">
                    <super-select
                            class="s-width-small"
                            v-model="params.site"
                            :storage-key="`channelSite`"
                            :options="siteList">
                    </super-select>
                </label-item>
                <label-item label="账号状态：" class="inline ml-sm">
                    <super-select
                            class="s-width-small"
                            v-model="params.site_status"
                            :storage-key="`channelStatus`"
                            :options="accountStatus">
                    </super-select>
                </label-item>
                <label-item label="授权状态：" class="inline ml-sm">
                    <el-select class="inline s-width-small"
                               v-sf.authorization
                               v-model="params.authorization">
                        <el-option v-for="item in authorList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="亚马逊状态：" class="inline ml-sm">
                    <el-select class="inline s-width-small"
                               v-sf.authorization
                               v-model="params.is_invalid">
                        <el-option v-for="item in amzonStatus"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
            </el-row>
            <el-select class="inline s-width-small"
                       v-sf.snType
                       v-model="params.snType">
                <el-option v-for="item in conditionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline"
                      v-sf.snText
                      :placeholder="`请输入${changeLabel}...`"
                      v-model="params.snText"
                      @input="keyword"></el-input>
            <label-item label="销售员：" class="inline ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="params.seller_id"
                        :storage-key="`channelSeller`"
                        :options="sellerData">
                </super-select>
            </label-item>
            <label-item label="客服：" class="inline ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="params.customer_id"
                        :storage-key="`customerSeller`"
                        :options="customerData">
                </super-select>
            </label-item>
            <el-select v-model="params.taskName"
                       class="inline s-width-large ml-sm"
                       v-sf.taskName
                       @change="change_taskName"
                       filterable>
                <el-option
                        v-for="res in taskNameList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="params.taskCondition"
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
            <el-select v-model="params.taskTime"
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
            <el-select v-model="params.time_type"
                       class="inline ml-sm s-width-small"
                       v-sf.time_type>
                <el-option
                        v-for="res in timeData"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"></el-option>
            </el-select>
            <el-date-picker
                    v-model="params.start_time"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.start_time
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="params.end_time"
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
    import labelButtons from '@/components/label-buttons.vue';
    import {api_customer_list,api_get_seller,api_site_status} from '@/api/ymx';
    export default {
        data() {
            return {
                userStatus:[
                    {name:"全部",status:''},
                    {name:"已启用",status:1},
                    {name:"已停用", status:0},
                ],
                accountStatus:[],
                authorList:[
                    {value: -1,label: '全部'},
                    {value: 0,label: '未授权'},
                    {value: 1,label: '已授权'},
                ],
                amzonStatus:[
                    {label:'全部',value:''},
                    {label:'有效',value:1},
                    {label:'失效',value:0},
                ],
                conditionList:[
                    {value: 'account_name',label: '账户'},
                    {value:'code',label: '简称'}
                ],
                taskNameList:[
                    {label:"抓取订单数据",value:'download_order'},
                    {label:"同步发货状态",value:'sync_delivery'},
                    {label:"抓取Listing数据",value:'download_listing'},
                    {label:"同步健康数据",value:'download_health'},
                ],
                taskList:[
                    {label:"=",value:'eq'},
                    {label:"<",value:'lt'},
                    {label:">",value:'gt'},
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
                    {label:'24小时',value:1440},
                ],
                sellerData:[],
                customerData:[],
                timeData:[
                    {value: 'register',label: '注册日期'},
                    {value:'fulfill',label: '交接日期'}
                ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if (this.params.end_time) {
                            return time.getTime() > this.params.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if (this.params.start_time) {
                            return time.getTime()<this.params.start_time||time.getTime() > Date.now();
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
            }
        },
        mounted(){
            this.user_staffs();
            this.get_member();
            this.site_status();
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
            changeSelect(select){//----------------更改启用/禁用/全部按钮时的事件
                switch(select){
                    case 0:
                        delete this.params.status;
                        break;
                    case 1:
                        this.params.status = 1;
                        break;
                    case 2:
                        this.params.status = 0;
                        break;
                }
                this.$emit('change-select');
            },
            change_taskName(){
                this.params.taskTime = '';
            },
            keyword(){
                this.params.snText = this.params.snText.replace(/\s*/g,'')
            },
        },
        computed:{
            changeLabel(){
                if(this.params.snType === 'account_name'){
                    return `账户`;
                }else{
                    return `简称`;
                }
            }
        },
        props:{
            siteList:{},
            params:{},
            clears:{}
        },
        components: {
            labelButtons,
            labelItem:require('@/components/label-item').default,
        }
    }
</script>
