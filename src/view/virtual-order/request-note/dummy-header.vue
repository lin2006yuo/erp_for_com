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
                            style="width: 100%;"
                            ref="paramSale"
                            placeholder="输入搜索更多..."
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
                    <el-select class="inline s-width-default mr-sm"
                               v-model="form.channel_id"
                               :disabled="currentHandle!=='add'">
                        <el-option v-for="item in channelList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                    <el-select class="inline s-width-default"
                               v-model="form.site"
                               filterable clearable
                               :placeholder="sitePlaceholder"
                               :disabled="siteList.length<=1">
                        <el-option v-for="item in siteList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
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
    import {api_get_sales,api_account_list} from '../../../api/request-note';
    export default {
        data() {
            return {
                salesList:[],
//                1打造爆款 2 问题帐号 3 新店铺'
                reasonList:[
                    {label:"打造爆款",value:1},
                    {label:"问题帐号",value:2},
                    {label:"新店铺",value:3},
                ],
                siteList:[{label:"",value:""}],
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
            sitePlaceholder(){
                if(this.form.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteList.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
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
            get_site(channel_id){
                if(!channel_id)return this.siteList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        this.siteList = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteList = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        watch: {
            "form.channel_id"(val){
                this.siteList = [{label:"",value:""}];
                this.form.site = '';
                this.get_site(val);
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
            channelList:{
                type:Array,
                required:true
            },
        },
        components: {
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>