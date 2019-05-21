<template>
    <div class="c-dummy-table">
        <ui-table
                v-model="checkAll"
                @check="check"
                :heads="currentHandle==='examineApprove'||currentHandle==='lookOver'?otherHeader:addHearder"
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
                            <img v-if="currentHandle==='add'&&row.path&&row.path.length>0" width="200px" height="200px" :src="get_path(row.path[0].path,'_200x200.',row.path[0].base_url)">
                            <img v-if="currentHandle!=='add'" width="200px" height="200px" :src="row.thumb | filterImage">
                            <span slot="reference" style="vertical-align:middle;">
                                <img v-if="currentHandle==='add'&&row.path&&row.path.length>0" height="26px" width="26px" style="border:none" :src="get_path(row.path[0].path,'_60x60.',row.path[0].base_url)">
                                <img v-if="currentHandle!=='add'" width="26px" height="26px" :src="row.thumb">
                            </span>
                        </el-popover>
                        <span v-if="row.isSaveBtn" @click="change_row_image(row)">
                            <i class="el-icon-edit mdfhove"></i>
                        </span>
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
                    <!--刷单类型-->
                    <td>
                        <el-select  v-if="row.isSaveBtn" v-model="row.type" placeholder="请选择">
                            <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <label v-else>{{row.type | typeFilter}}</label>
                    </td>
                    <td>
                        <el-select  v-if="row.isSaveBtn" v-model="row.shipping_type" placeholder="请选择" :disabled="form.channel_id!==2">
                            <el-option
                                    v-for="item in shippingTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <label v-else>{{row.shipping_type | shippingTypeFilter}}</label>
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
                    <!--添加购物车-->
                    <td>
                        <el-checkbox v-model="row.is_add_shopping_cart" :disabled="!row.isSaveBtn"></el-checkbox>
                    </td>
                    <!--添加wishlist-->
                    <td>
                        <el-checkbox v-model="row.is_add_wishlist" :disabled="!row.isSaveBtn"></el-checkbox>
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
                    <td v-if="currentHandle !== 'examineApprove'&&currentHandle !== 'lookOver'">
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
                        <!--<el-button type="primary"-->
                                   <!--size="mini"-->
                                   <!--class="inline"-->
                                   <!--v-if="currentHandle==='lookOver'"-->
                                   <!--@click.native="look_over(row)">查看</el-button>-->
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
                     :account-list="accountList"></look-detail>,
        <!--修改图片-->
        <mdf-img v-model="picVisable"
                 :img-form="imgTemp"
                 :goods-id="goodId"
                 :cur-sku="skuName"
                 :img-length="12"
                 :channel_id="1"
                 :img-number="12"
                 @mdfimg-submit="mdfimg_submit"
                 :baseUrl="baseUrl">
        </mdf-img>
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
    .mdfhove:hover{
        color: #20A0FF;
        cursor: pointer;
    }
</style>
<script>
import {api_account_list} from '../../../api/request-note';
import {url_execute_save,url_execute_submit} from '../../../api/request-note';
import {get_path,random_img} from '../../kandeng/ebay/kandeng-list/add-edit-listing/get-path';
    export default {
        permission:{
            url_execute_save,
            url_execute_submit
        },
        data() {
            return {
                goodId: '',
                skuName:'',
                imgTemp: {},
                picVisable: false,//修改图片弹框开关
                curId:"",
                lookDialog:false,
                detailTitle:"",
                detailOper:"",
                addHearder:[ {isCheck:true,width:2},
                        {label:'产品首图',width:4},
                        {label:'SKU',width:6},
                        {label:'ASIN',width:5},
                        {label:'店铺名',width:6,isRequired:true},
                        {label:'店铺账号简称',width:6,isRequired:true},
                        {label:'关键词',width:6,isRequired:true},
                        {label:'产品位置',width:6,isRequired:true},
                        {label:'产品链接',width:6,isRequired:true},
                        {label:'数量及要求',width:5,isRequired:true},
                        {label:'刷单类型',width:5,isRequired:true},
                        {label:'运单类型',width:5},
                        {label:'收藏产品',width:4},
                        {label:'收藏店铺',width:4},
                        {label:'打五星',width:3},
                        {label:'添加购物车',width:5},
                        {label:'添加wishlist',width:5},
                        {label:'状态',width:5},
                        {label:'备注',width:7},
                        {label:'操作',width:5}
                ],
                otherHeader:[
                    {isCheck:true,width:2},
                    {label:'产品首图',width:4},
                    {label:'SKU',width:6},
                    {label:'ASIN',width:5},
                    {label:'店铺名',width:6,isRequired:true},
                    {label:'店铺账号简称',width:8,isRequired:true},
                    {label:'关键词',width:8,isRequired:true},
                    {label:'产品位置',width:5,isRequired:true},
                    {label:'产品链接',width:7,isRequired:true},
                    {label:'数量及要求',width:5,isRequired:true},
                    {label:'刷单类型',width:5,isRequired:true},
                    {label:'运单类型',width:5},
                    {label:'收藏产品',width:4},
                    {label:'收藏店铺',width:4},
                    {label:'打五星',width:3},
                    {label:'添加购物车',width:5},
                    {label:'添加wishlist',width:5},
                    {label:'状态',width:5},
                    {label:'备注',width:8},
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
                checkAll:false,
                shippingTypeOptions:[
                    {label: 'FBA', value: 1},
                    {label: 'FBM', value: 2}
                ]
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
        filters:{
            typeFilter(val){
                if(val === 1){
                    return '内部刷单'
                }else if(val === 2){
                    return '外包刷单'
                }else if(val === 3){
                    return '国外刷单'
                }else{
                    return val
                }
            },
            shippingTypeFilter(val){
                let ret = '';
                switch (val){
                    case 0:
                        ret = '--';
                        break;
                    case 1:
                        ret = 'FBA';
                        break;
                    case 2:
                        ret = 'FBM';
                        break;
                }
                return ret
            },
            filterImage(val){
                return val.replace("_60x60","_200x200");
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
                        count += Number(res.quantity);
                    })
                }
                if(!row.account_name||!row.account_id||!row.keyword||!row.product_location||!row.product_link||count===0||!row.type){
                    return this.$message({type:"warning",message:"该行有必填项未填写，请补充完整。"});
                }else if(this.form.channel_id === 2&&!row.shipping_type || this.form.channel_id === 2&&!row.asin){
                    return this.$message({type: 'warning',message: '亚马逊平台的运单类型和asin为必填项'})
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
                        cur+=Number(row.quantity);
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
            get_path,
            //修改图片
            change_row_image(row){
                this.skuName = row.sku;
                this.picVisable=true;
                this.goodId = row.goods_id || this.goodId;
                this.imgTemp = window.clone(row);
            },
            mdfimg_submit(val){
                let curObj = this.form.detail.find(row=>row.sku===val.sku);
                if(!!curObj){
                    curObj.path = val.path;
                    if(val.path||val.path.length>0){
                        curObj.thumb = this.get_path(val.path[0].path,'_60x60.',this.baseUrl)
                    }else{
                        curObj.thumb = ''
                    }
                };
                console.log(curObj.thumb)
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
            },
            typeOptions: {
                type: Array
            },
            baseUrl:{
                required:true,
                type:String,
            },
        },
        components: {
            uiTable:require('../../../components/ui-table.vue').default,
            trendsSelect:require('../../../components/trends-select.vue').default,
            timeQuantity:require('./time-quantity.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            lookDetail:require('./look-detail.vue').default,
            mdfImg:require('./mdf-img.vue').default,
        }
    }
</script>