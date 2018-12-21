<template>
    <div class="wish-wishPublish-list">
        <!-- 搜索数据 -->
        <search-card @search="search" @enter="search" :params="params" :is-search="isSearch" :clears="clears">
            <label-item label="平台账号：" class="mr-sm">
                <el-select class="inline s-width-middle" v-sf.account_id
                           v-model="params.account_id"
                           @change="select_account"
                           filterable
                           clearable
                           >
                    <el-option v-for="item in accountList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="平台店铺：" class="mr-sm">
                <el-select class="inline s-width-middle"
                           v-sf.shop_id
                           :disabled="storeIsDisable"
                           v-model="params.shop_id"
                           filterable
                           clearable
                           >
                    <el-option v-for="item in shopList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <el-select v-sf.snType
                       v-model="params.snType"
                       class="inline s-width-default" >
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input placeholder="请输入搜索内容..." v-sf.snText v-model="params.snText" class="inline mr-sm s-width-large" ></el-input>
        </search-card>
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
                <td>
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
    </div>
</template>
<style lang="stylus">
    .wish-wishPublish-list{
    }
</style>
<script>
    import {api_get_joom_store,} from '../../../../api/joom-set-classify'
    import {api_joom_product_list} from '../../../../api/publish-joom'
    export default{
        permission: {
        },
        data(){
            return{
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
            }
        },
        mounted(){
        },
        methods:{
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
            listFun(){
                this.loading=true;
                let data = window.clone(this.params);
                data.snText= data.snText.trim();
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
                this.$http(api_get_joom_store, {joom_account_id:this.params.account_id}).then(res => {
                    this.shopList = [{label: '全部', value: ''}, ...res.data];
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
//                    title: `${row.spu}刊登`
                };
//                this.$open(`/publish/joom/getData/${row.goods_id}`, params)
                this.$open(`/publish/joom/getData?id=${row.goods_id}`, params)
            }
        },
        computed: {
        	// 未选择平台时，账号下拉框的状态
            storeIsDisable(){
                return this.params.account_id === '';
            },
            isSearch(){
                return this.params.account_id===''||this.params.shop_id===''
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
        }
    }
</script>
