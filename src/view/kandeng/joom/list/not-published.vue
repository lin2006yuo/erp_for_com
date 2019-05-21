<template>
    <div class="wish-wishPublish-list">
        <div class="c-search-time">
        <!-- 搜索数据 -->
        <search-card @search="search" :params="params" :is-search="isSearch" :clears="clears">
            <label-item label="平台账号：" class="mr-sm">
                <super-select
                    class="inline s-width-middle"
                    v-sf.account_id
                    v-model="params.account_id"
                    @change="select_account"
                    :options="accountList"
                    storageKey="joomAccount"
                    :isPaging="false"
                ></super-select>
            </label-item>
            <label-item label="平台店铺：" class="mr-sm">
                <super-select
                    class="inline s-width-middle"
                    v-sf.shop_id
                    v-model="params.shop_id"
                    :options="shopList"
                    storageKey="joomShop"
                    :isPaging="false"
                    :disabled="storeIsDisable"
                ></super-select>
            </label-item>
            <el-select v-sf.snType
                       v-model="params.snType"
                       class="inline s-width-default" >
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!--批量搜索-->
            <order-input v-model="params.snText"
                         class="inline width-super"
                         @keydown='keydown'
                         v-sf.snText
                         :placeholder="placeholder">
            </order-input>
        </search-card>
        </div>
        <!--table数据-->
        <ui-table
            ref="table" class="mt-sm"
            v-loading="loading"  element-loading-text="玩命加载中..." :body-height="41" :first-loading="firstLoading"
            :has-data="products&&products.length>0"
            :heads="[
                        {label:'图片',width:10},
                        {label:'本地SPU',width:10},
                        {label:'产品中文名称',width:25},
                        {label:'产品英文名称',width:25},
                        {label:'分类',width:10},
                        {label:'创建时间',width:10},
                        {label:'操作',width:10},
                       ]">
            <tbody>
            <tr v-for="(row, index) in products" :key="row.goods_id">
                <td>
                    <el-popover
                        placement="right"
                        trigger="hover">
                        <img v-lazy="middle_img(row.thumb,'_60x60.')"  @click="large_img(row.thumb)" width="200px" height="200px">
                        <span slot="reference">
                              <img v-lazy="row.thumb" height="60px" width="60px" @click="large_img(row.thumb)" style="border:none">
                            </span>
                    </el-popover>
                </td>
                <td style="position: relative">
                    <img class="img-position" v-if="row.tort_flag==1" @click="is_tort_flag(row)"  src="../../../../assets/fanseright.png" alt="存在侵权标识"  >
                    <span v-if="row.is_discounting===1" class="postion" @click="discount(row)">跌价</span>
                    <ui-tip :is-operate="true" :content="row.spu" :width="98"
                            @cur-click="distribution(row)"></ui-tip>
                </td>
                <td><ui-tip :content="row.name" :width="98"></ui-tip></td>
                <td><ui-tip :content="row.packing_en_name" :width="98"></ui-tip></td>
                <td><ui-tip :content="row.category" :width="98"></ui-tip></td>
                <td><times :time="row.publish_time"></times></td>
                <td>
                    <el-button size="mini" @click="publish(row)" type="primary" >刊登</el-button>
                    <!--<permission tag="ElButton" size="mini" @click="publish(row)" type="primary" :route="apis.url_wish_add">刊登</permission>-->
                </td>
            </tr>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=page.page
            :page-sizes="[20, 50, 100, 200]"
            :page-size=page.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
        <!-- 点击列表spu时，查看  -->
        <look-edit v-model="lookVisable"
                   :showedit="showedit"
                   :goodsId="goodsId"
                   :spu="spu" ref="looks"
                   :child-active-name="activeName"
                   @reflash="reflash"
                   :edit-able="editAble"
                   @change-data="change_data"></look-edit>
        <!-- 500尺寸的大图  -->
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <tort-table :title="title" :isloading.sync="isloading" v-model="show" :tableData="trot_data" :count="count" @handleCurrentChange="trot_handleCurrentChange"/>
        <subsidy-diaog
            v-model="subDiaog"
            :title="sub_title"
            :datavalue="datavalue"
        ></subsidy-diaog>
    </div>
</template>
<style lang="stylus">
    .img-position{
        position absolute;
        top: 28px;
        left: 30px;
        cursor:pointer
    }
        .postion{
            position: absolute;
            top: 0px;
            left: 0px;
            border: 1px solid #603;
            color: #603;
            cursor: pointer;
            line-height: 16px;
            display: inline-block;
            width: 30px;
        }
    .wish-wishPublish-list{
    }
    .c-search-time{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_get_joom_store,} from '../../../../api/joom-set-classify'
    import {api_joom_product_list} from '../../../../api/publish-joom'
    import {api_get_goods_description} from '../../../../api/product-library'
    import {api_get_discount} from '@/api/product-library';
    export default{
        permission: {
        },
        data(){
            return{
                tortTitle:'',
                placeholder:'可批量搜索，shift+回车换行...',
            	page:{
            		page:1,
                    pageSize:50,
                },
                params:{
                    account_id:"",
                    shop_id:"",
                    snType:"spu",
                    snText:"",
                },
                clears:{
                    account_id:"",
                    shop_id:"",
                    snType:"spu",
                    snText:"",
                },
                total:0,
                shopList:[],
                goods:[
                    {label:"本地SPU",value:"spu"},
                    {label:"本地SKU",value:"sku"},
                    {label:"产品中文名称",value:"name"},
                ],
                loading:false,
                products:[],
                firstLoading:true,
                lookVisable:false,
                showedit:false,
                activeName:'wish平台',
                goodsId:0,
                spu:"",
                accountId:"",
                imgDialog: false,
                imgPath:"",
                editAble:false,
                show:false,
                trot_data:[],
                count:0,
                goodid:0,
                isloading:false,
                title:'',
                datavalue:[],
                sub_title:'',
                subDiaog:false,
            }
        },
        mounted(){
        },
        methods:{
            discount(data){
                this.$http(api_get_discount,{goods_id:data.goods_id}).then(res=>{
                    this.sub_title=`${data.spu}补贴信息`;
                    this.datavalue=res.data.map(row=>{
                        let discount_price='',discount_scale='';
                        if(row.discount_type===1){
                            discount_price=row.discount_value
                        }
                        if(row.discount_type===2){
                            discount_scale=row.discount_value;
                        }
                        return{
                            sku:row.sku,
                            inventory_price:row.inventory_price,
                            last_purchase_price:row.last_purchase_price,
                            new_price:row.new_price,
                            discount_price,
                            discount_scale,
                            discount:row.discount_num+'/'+row.sell_num,
                            valid_time:this.dateFilter(new Date(row.valid_time).getTime()/1000)+'-'+this.dateFilter(new Date(row.over_time).getTime()/1000),
                            warehouse:row.warehouse,
                            status:row.status,
                            status_text:row.status_text,
                            remark:row.remark,
                        }
                    })
                    this.subDiaog=true;
                })
            },
            dateFilter(val){
                return datef('YYYY-MM-dd', val);
            },
            is_tort_flag(row){
                this.isloading=true;
                this.title=row.spu;
                this.show=true
                this.goodid=row.id
              this.$http(api_get_goods_description,this.goodid,{page:1,page_size:20}).then(res=>{
                   this.count=res.count
                   this.trot_data=res.list;
                   this.isloading=false
               })

            },
            trot_handleCurrentChange(val){
                this.isloading=true;
                this.$http(api_get_goods_description,this.goodid,{page:val,page_size:20}).then(res=>{
                    this.trot_data=res.list;
                    this.isloading=false
                })
            },
            change_data(){},
            reflash(){},
            // 列表图片hover时，尺寸的修改
            middle_img(image){
                return image.replace('_60x60.','_200x200.');
            },
            // 列表图片点击时，尺寸的修改
            large_img(image){
                this.imgPath = image.replace('_60x60.','_500x500.');
                this.imgDialog = true;
            },
            search(){
                this.listFun();
            },
            keydown(){
                console.log(this.isSearch);
                if(!this.isSearch){
                    this.listFun();
                }
            },
            listFun(){
                this.loading=true;
                let data = window.clone(this.params);
                console.log(1111)
                // data.snText= data.snText.trim();
                if(this.params.snText.trim()){
                    data.snText = this.params.snText.split('\n').map(row=>row.trim()).filter(row => !!row);
                }
                data.page=this.page.page;
                data.pageSize=this.page.pageSize;
                this.$http(api_joom_product_list,data).then(res=>{
                    this.products=res.data;
                    this.total=res.count;
                    this.loading=false;
                    this.firstLoading = false;
                }).catch(code=>{
                	this.$message({message:code.message||code,type:'error'});
                    this.loading=false;
                })
            },
            // 选择了账号
            select_account(val){
                console.log(val)
                if(val === ''){
                    this.params.shop_id = '';
                    this.shopList = [];
                }else {
                    this.params.shop_id = '';
                    this.get_joom_store();
                }
            },
            //获取店铺列表
            get_joom_store(){
                this.$http(api_get_joom_store, {channel_id:7,account_id:this.params.account_id}).then(res => {
                    this.shopList = [...res.data];
                })
            },
            //查看产品信息
            distribution(data){
                this.lookVisable = true;
                this.goodsId = data.id;
                this.spu = data.spu;
                this.showedit = true;
                this.$nextTick(()=>{
//                    this.$refs.looks.editAble = true;
                    this.$refs.looks.titleName = `查看SPU：${data.spu}  `;
                })
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.listFun()
            },
            handleCurrentChange(page){
                this.page.page = page;
                this.listFun()
            },
            // 刊登按钮，打开详情页
            publish(row){
                let params = {
                    goods_id: row.goods_id,
                    isAdd: true,
                    account_id:this.params.account_id,
                    shop_id: this.params.shop_id,
                    title: `${row.spu}刊登`
                };
                console.log(params)
//                this.$open(`/publish/joom/getData/${row.goods_id}`, params)
                this.$open(`/publish/joom/getData?id=${row.goods_id}`, params)
            }
        },
        computed: {
        	// 未选择平台时，账号下拉框的状态
            storeIsDisable(){
                console.log(this.params.account_id=== '');
                return this.params.account_id === '';
            },
            isSearch(){
                if(this.params.account_id==""||this.params.shop_id==""){
                    return true;
                }else{
                    return false;
                }
            }
        },
        watch:{
        },
        props:{
            accountList:{
            	required: true,
                type:Array,
            },
        },
        components:{
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            lookEdit:require("../../../product/manager/look-edit.vue").default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
            orderInput:require('@/components/order-input').default,
            tortTable:require('../info/tort-table').default,
            subsidyDiaog:require("@/view/kandeng/ymx/subsidy-diaog.vue").default,
        }
    }
</script>
