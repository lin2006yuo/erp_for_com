<template>
    <div class="c-dummy-header">
        <table class="template">
            <tr>
                <td>
                    <label class="red">*</label>&nbsp;销售员
                </td>
                <td>
                    <param-account
                            v-if="currentHandle==='add'"
                            style="width:100%"
                            ref="paramSale"
                            placeholder="可输入搜索"
                            v-model="form.seller_id"
                            :param="{type:'sales',data:{content:''}}"
                            :fixUrl="true"
                            :fixResult="sale_fix_result"
                            type="memberShipSales"
                            url="get|user/:type/staffs">
                    </param-account>
                    <label v-else>{{comSeller}}</label>
                </td>
                <td>销售员岗位</td>
                <td>{{comJob}}</td>
                <td>销售员部门</td>
                <td>{{comDepartment}}</td>
                <td>当前状态</td>
                <td class="red">{{form.status_txt}}</td>
            </tr>
            <tr>
                <td>平台</td>
                <td>
                    <el-radio-group class="inline ml-sm" v-model="form.channel_id"
                                       v-for="item in channelList"
                                        :disabled="currentHandle!=='add'"
                                       :key="item.value">
                        <el-radio :label="item.value" >{{item.label}}</el-radio>
                    </el-radio-group>
                </td>
                <td>操作虚拟订单原因</td>
                <td>
                    <el-radio-group class="inline ml-sm" v-model="form.reason"
                                    v-for="item in reasonList"
                                    :disabled="currentHandle!=='add'"
                                    :key="item.value">
                        <el-radio :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </td>
                <td>总费用预估</td>
                <td>
                    <label class="light-gray" v-if="currentHandle==='add'">自动汇总SKU预估费用</label>
                    <label v-else>{{form.estimate_total_cost}}</label>
                </td>
                <td>
                    <label>申请日期</label>
                </td>
                <td>
                    <label class="light-gray"  v-if="currentHandle==='add'">自动获取提交时间</label>
                    <label v-else>{{form.created_time | filterTime}}</label>
                </td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">
    .c-dummy-header{
        >.template{
            tr {
                td:nth-child(odd) {
                    background-color: #EFF2F7;
                    width:8.32%;
                }
                td:nth-child(even){
                    width:16.64%;
                }
            }
        }
        .light-gray{
            color:#A1B6D2;
        }
    }
</style>
<script>
    import {api_get_sales} from '../../../api/scalp-task';
    export default {
        data() {
            return {
                salesList:[],
                channelList:[
                    {label:"速卖通",value:4},
                    {label:"亚马逊",value:2},
                    {label:"eBay",value:1},
                    {label:"Wish",value:3},
                ],
//                1打造爆款 2 问题帐号 3 新店铺'
                reasonList:[
                    {label:"打造爆款",value:1},
                    {label:"问题帐号",value:2},
                    {label:"新店铺",value:3},
                ]
            }
        },
        filters:{
            filterTime(val){
                return val? datef('YYYY-MM-dd',val):"";
            }
        },
        created(){
            this.get_sales();
        },
        computed:{
            comJob(){
                let curObj = this.com_methods();
                if(!!curObj) return curObj.job;
            },
            comDepartment(){
                let curObj = this.com_methods();
                if(!!curObj) return curObj.department_id;
            },
            comSeller(){
                let curObj = this.com_methods();
                if(!!curObj) return curObj.realname;
            },
        },
        methods:{
            com_methods(){
                let cur = {};
                if(!!this.form.seller_id&&this.salesList.length>0){
                   cur =  this.salesList.find(row=>row.id===this.form.seller_id);
                   if(!!cur) return cur;
                }
                return cur;
            },
            sale_fix_result(val){
                return {
                    label:val.realname,
                    value:val.id
                }
            },
            get_sales(){
                this.$http(api_get_sales,{content:""}).then(res=>{
                    this.salesList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
        },

        props:{
            form:{
                type:Object,
                required:true,
            },
            currentHandle:{
                required:true,
                type:String
            },

        },
        components: {
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>
