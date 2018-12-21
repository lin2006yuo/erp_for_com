<template>
    <div class="c-dummy-table">
        <ui-table
                v-model="checkAll"
                @check="check"
                :heads="currentHandle==='examineApprove'?otherHeader:addHearder"
        >
            <template v-for="(row,index) in form.detail" v-resize="{height:200}">
                <tr :class="[row.status===2?'bg-red':'']">
                    <td>
                        <el-checkbox v-model="row.isCheck" @change="changeOne"></el-checkbox>
                    </td>
                    <!--产品首图-->
                    <td>
                        <el-popover
                                placement="right"
                                trigger="hover">
                            <img width="150px" height="150px" v-lazy="row.thumb">
                            <span slot="reference">
                              <img height="26px" width="26px" style="border:none" v-lazy="row.thumb">
                            </span>
                        </el-popover>
                    </td>
                    <!--SKU-->
                    <td>{{row.sku}}</td>
                    <!--ASIN-->
                    <td>
                        <el-input v-if="row.isSaveBtn&&form.channel_id===2" v-model="row.asin"></el-input>
                        <label v-else>{{row.asin}}</label>
                    </td>
                    <!--店铺名-->
                    <td>
                        <el-input v-if="row.isSaveBtn" v-model="row.account_name"></el-input>
                        <label v-else>{{row.account_name}}</label>
                    </td>
                    <!--店铺账号简称-->
                    <td>
                        <el-select v-model="row.account_id"
                                   filterable clearable
                                   v-if="row.isSaveBtn"
                                   ref="accountId"
                                   v-mouse-side.mousewheel="()=>{$refs.accountId.visible = false}">
                            <el-option
                                v-for="res in accountList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                            ></el-option>
                        </el-select>
                        <label v-else>{{account_label(row)}}</label>
                    </td>
                    <!--关键词-->
                    <td>
                        <el-input v-model="row.keyword" v-if="row.isSaveBtn"></el-input>
                        <label v-else>{{row.keyword}}</label>
                    </td>
                    <!--产品位置-->
                    <td>
                        <el-input v-model="row.product_location" v-if="row.isSaveBtn"></el-input>
                        <label v-else>{{row.product_location}}</label>
                    </td>
                    <!--产品链接-->
                    <td>
                        <el-input v-model="row.product_link" v-if="row.isSaveBtn"></el-input>
                        <el-button type="success"
                                   size="mini" v-else
                                   :disabled="row.status===1||row.status===2"
                                   @click.native="copy_link(row.product_link)">复制链接</el-button>
                    </td>
                    <!--数量及要求-->
                    <td>
                        <span :class="[row.isSaveBtn?'bianji':'','operate']" @click="add_time_quantity(row,index)">{{get_total(row)}}</span>
                    </td>
                    <!--收藏产品 1 0-->
                    <td>
                        <el-checkbox v-model="row.is_collection_product" :disabled="!row.isSaveBtn"></el-checkbox>
                    </td>
                    <!--收藏店铺-->
                    <td>
                        <el-checkbox v-model="row.is_collection_shop" :disabled="!row.isSaveBtn"></el-checkbox>
                    </td>
                    <!--打五星-->
                    <td>
                        <el-checkbox v-model="row.is_stars" :disabled="!row.isSaveBtn"></el-checkbox>
                    </td>
                    <!--费用预估-->
                    <td>
                        <el-input v-model="row.estimate_cost" v-if="row.isSaveBtn"></el-input>
                        <label v-else>{{row.estimate_cost}}</label>
                    </td>
                    <!--状态-->
                    <td>
                        <label :class="[row.status===2?'red':'']">{{row.status_txt}}</label>
                    </td>
                    <!--备注-->
                    <td>
                        <el-input v-model="row.remark" v-if="row.isSaveBtn"></el-input>
                        <label v-else>{{row.remark}}</label>
                    </td>
                    <!--操作-->
                    <td v-if="currentHandle!=='examineApprove'">
                        <div v-if="currentHandle==='add'">
                            <el-button type="primary" size="mini"
                                       v-if="row.isSaveBtn"
                                       class="inline"
                                       @click.native="save(row)">保存</el-button>
                            <trends-select class="inline"
                                           @trigger="action(row,index,$event)"
                                           :selects="handleList"
                                           v-else
                                           type="primary"></trends-select>
                        </div>
                        <el-button type="primary"
                                   size="mini"
                                   class="inline"
                                   v-if="currentHandle==='lookOver'"
                                   @click.native="look_over(row)">查看</el-button>
                        <div v-if="currentHandle==='dispose'">
                            <permission tag="ElButton"
                                        :route="apis.url_execute_save||apis.url_execute_submit"
                                        type="primary"
                                        size="mini"
                                        class="inline"
                                        @click.native="dispose(row)"
                                        v-if="row.status!==1&&row.status!==2">处理</permission>
                            <el-button type="primary"
                                       size="mini"
                                       v-else
                                       @click.native="look_over(row)"
                                       class="inline" >查看</el-button>
                        </div>
                    </td>
            </tr>
            </template>
        </ui-table>
        <!--刷单要求-->
        <time-quantity v-model="addDialog"
                       :form="timeData"
                       @cancel="cancel"
                       :current-handle="currentHandle"></time-quantity>
        <!--查看/处理-->
        <look-detail v-model="lookDialog"
                     :title="detailTitle"
                     :cur-id="curId"
                     :detail-oper="detailOper"
                     :account-list="accountList"></look-detail>
    </div>
</template>
<style lang="stylus">
    span.bianji:after{
        content:"";
        display:inline-block;
        margin-left:6px;
        width:16px;
        height:16px;
        background:url('../../../assets/edit.png') no-repeat center center;
        vertical-align:bottom;
    }
    .bg-red{
        background-color: rgba(250,172,171,0.5) !important;
    }

</style>
<script>
import {api_account_list} from '../../../api/scalp-task';
import {url_execute_save,url_execute_submit} from '../../../api/scalp-task';
    export default {
        permission:{
            url_execute_save,
            url_execute_submit
        },
        data() {
            return {
                curId:"",
                lookDialog:false,
                detailTitle:"",
                detailOper:"",
                addHearder:[ {isCheck:true,width:2},
                        {label:'产品首图',width:4},
                        {label:'SKU',width:6},
                        {label:'ASIN',width:7},
                        {label:'店铺名',width:8,isRequired:true},
                        {label:'店铺账号简称',width:8,isRequired:true},
                        {label:'关键词',width:8,isRequired:true},
                        {label:'产品位置',width:7,isRequired:true},
                        {label:'产品链接',width:9,isRequired:true},
                        {label:'数量及要求',width:5,isRequired:true},
                        {label:'收藏产品',width:4},
                        {label:'收藏店铺',width:4},
                        {label:'打五星',width:3},
                        {label:'费用预估($)',width:5},
                        {label:'状态',width:6},
                        {label:'备注',width:9},
                        {label:'操作',width:5}
                ],
                otherHeader:[
                    {isCheck:true,width:2},
                    {label:'产品首图',width:4},
                    {label:'SKU',width:6},
                    {label:'ASIN',width:7},
                    {label:'店铺名',width:8,isRequired:true},
                    {label:'店铺账号简称',width:8,isRequired:true},
                    {label:'关键词',width:11,isRequired:true},
                    {label:'产品位置',width:7,isRequired:true},
                    {label:'产品链接',width:9,isRequired:true},
                    {label:'数量及要求',width:5,isRequired:true},
                    {label:'收藏产品',width:4},
                    {label:'收藏店铺',width:4},
                    {label:'打五星',width:3},
                    {label:'费用预估($)',width:5},
                    {label:'状态',width:6},
                    {label:'备注',width:11},
                ],
                timeData:{},
                addDialog:false,
                accountList:[],
                handleList:[
                    {label:"编辑",value:1,action:function (val) {
                        val.isSaveBtn = true;
                    }},
                    {label:"复制",value:2,action:function (val,index) {
                        let cur = clone(val);
                        cur.time_quantity = val.time_quantity;
                        this.form.detail.splice(index+1,0,cur);
                    }},
                ],
                checkAll:false
            }
        },
        created(){
            this.get_account(4);
        },
        watch:{
            "form.channel_id"(val){
                if(this.form.detail&&this.form.detail.length>0){
                    this.form.detail.forEach(row=>{
                        row.account_id = "";
                    });
                }
                this.get_account(val);
            }
        },
        methods:{
            copy_link(link){
                let input=document.createElement("input");
                let body=document.getElementsByTagName("body")[0];
                input.type= 'text';
                input.value=link;
                body.appendChild(input);
                input.select();
                document.execCommand("Copy");
                body.removeChild(input);
                this.$message({type:"success",message:"复制成功"});
            },
            look_over(val){
                this.lookDialog = true;
                this.detailTitle = `查看SKU:${val.sku}虚拟订单`;
                this.curId = val.id;
                this.detailOper="lookOver";
            },
            dispose(val){
                this.lookDialog = true;
                this.detailTitle = `查看SKU:${val.sku}虚拟订单`;
                this.curId = val.id;
                this.detailOper="dispose";
            },
            sale_fix_result(val){
                return val.account;
            },
            account_label(row){
                let cur = this.accountList.find(res=>{return res.value === row.account_id});
                if(!!cur) return cur.label;
                return "暂无数据";
            },
            add_time_quantity(row,index){
                this.addDialog = true;
                this.timeData = row;
            },
            cancel(val){
                for(let i in val){
                    val.hasOwnProperty(i) && (this.timeData[i] = val[i]);
                }
            },
            save(row){
                let count = 0;
                if(row.time_quantity&&row.time_quantity.length>0){
                    row.time_quantity.forEach(res=>{
                        count += Number(res.total);
                    })
                }
                if(!row.account_name||!row.account_id||!row.keyword||!row.product_location||!row.product_link||count===0){
                    return this.$message({type:"warning",message:"该行有必填项未填写，请补充完整。"});
                }
                row.isSaveBtn = false;
            },
            get_account(val){
                this.$http(api_account_list,{channel_id:val}).then(res=>{
                    this.accountList = res.account;
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_total(row){
                let cur = 0;
                if(row.time_quantity&&row.time_quantity.length>0){
                    row.time_quantity.forEach(row=>{
                        cur+=Number(row.total);
                    });
                }
                return `${cur}单`
            },
            action(row,index,action){
                action.action.call(this,row,index);
            },
            changeOne(){
                if (this.form.detail.length > 0) {
                    this.checkAll = !this.form.detail.find(data => !data.isCheck);
                }
            },
            //表头的 全选框
            check(val){
                this.form.detail.forEach(data => {
                    data.isCheck = val
                });
            },
        },
        props:{
            form:{
                required:true,
                type:Object
            },
            currentHandle:{
                required:true,
                type:String
            }
        },
        components: {
            uiTable:require('../../../components/ui-table.vue').default,
            trendsSelect:require('../../../components/trends-select.vue').default,
            timeQuantity:require('./time-quantity.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            lookDetail:require('./look-detail.vue').default,
        }
    }
</script>
