<template>
    <div class="c-search-card">
        <search-card @search="search" @enter="search" :params="form" :clears="clears">
            <label-buttons class='inline' label="状态：" v-sf.is_invalid
                           @select="select" :buttons="buttons"></label-buttons>
            <el-row class="mb-xs">
                <label-item label="账号状态：" class="inline">
                    <super-select
                            class="s-width-small"
                            v-model="form.site_status"
                            :storage-key="`channelStatus`"
                            :options="accountStatus">
                    </super-select>
                </label-item>
                <label-item label="授权状态：" class="ml-sm inline mb-mini">
                    <el-select class='s-width-small' v-sf.is_authorization
                               @change="change_select"
                               v-model="form.is_authorization" default-first-option filterable clearable>
                        <el-option
                                v-for="res in authorization"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
            </el-row>
            <label-item label="">
                <el-select class="inline s-width-small mr-xs" v-sf.snType v-model="form.snType"
                           default-first-option filterable clearable>
                    <el-option
                        v-for="res in snTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>   
                </el-select>
                <el-input class="inline width-super" v-sf.snText v-model="form.snText"
                          default-first-option filterable clearable></el-input>
            </label-item>
            <label-item label="销售员：" class="inline ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="form.seller_id"
                        :storage-key="`channelSeller`"
                        :options="sellerData">
                </super-select>
            </label-item>
            <label-item label="客服：" class="inline ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="form.customer_id"
                        :storage-key="`customerSeller`"
                        :options="customerData">
                </super-select>
            </label-item>
            <el-select v-model="form.taskNameList"
                        class="inline s-width-default ml-sm">
                <el-option
                    v-for="item in taskNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="form.taskCondition" 
                       class="inline"
                       style="width:60px">
                <el-option
                    v-for="item in taskCondition"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="form.taskTime"
                       class="inline s-width-small">
                <el-option
                    v-for="item in taskTime"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="form.time_type"
                       class="inline ml-sm s-width-small"
                       v-sf.time_type>
                <el-option
                        v-for="res in timeData"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"></el-option>
            </el-select>
            <el-date-picker
                    v-model="form.start_time"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.start_time
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="form.end_time"
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
                        if (this.form.end_time) {
                            return time.getTime() > this.form.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if (this.form.start_time) {
                            return time.getTime()<this.form.start_time||time.getTime() > Date.now();
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                taskNameList:[
                    {label:"抓取订单数据",value:'download_order'},
                    {label:"同步发货状态",value:'sync_delivery'},
                    {label:"抓取listing数据",value:'sync_listing '}
                ],
                taskCondition:[
                    {label:"=",value:'eq'},
                    {label:"<",value:'lt'},
                    {label:">",value:'gt'}
                ],
                taskTime:[
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
                    {label: "24小时", value: 1440},
                ],
                authorization:[
                    {label:'全部',value:''},
                    {label:'未授权',value:0},
                    {label:'已授权',value:1},
                ],
                snTypeList:[
                    {label:'账户',value:'account_name'},
                    {label:'简称',value:'code'},
                ],
                buttons:[
                    {label:'全部',value:''},
                    {label:'已启用',value:1},
                    {label:'已停用',value:0},
                ]
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
            search(){
                this.$emit('search');
            },
            select(index){
                this.form.is_invalid = this.buttons[index].value;
                this.$emit('select');
            },
            change_select(){
                this.$emit('change-select');
            },
        },
        props:{
            form:{//搜索参数
                type:Object,
                required:true
            },
            clears:{//带有默认值的参数
                type:Object,
                required:true
            },
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
        }
    }
</script>