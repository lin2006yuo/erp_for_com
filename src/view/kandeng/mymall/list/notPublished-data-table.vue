<template>
    <div class="p-table">
        <el-row class="shipment-data-table mt-xs">
            <!-- 表格 -->
            <el-col :span="24">
                <ui-table
                    v-loading="loading"  element-loading-text="玩命加载中..." :body-height="40" :first-loading="firstLoading"
                    :has-data="products&&products.length>0"
                    :heads="[
                                {label:'图片',width:10},
                                {label:'本地SPU',width:10},
                                {label:'产品中文名称',width:25},
                                {label:'产品英文名称',width:25},
                                {label:'本地分类',width:10},
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
                            <span  class="copyright" v-if="row.is_discounting" @click="discount(row)">跌价</span>
                            <ui-tip :is-operate="true" :content="row.spu"
                                    @cur-click="distribution(row)"></ui-tip>
                        </td>
                        <td><ui-tip :content="row.name" ></ui-tip></td>
                        <td><ui-tip :content="row.packing_en_name" ></ui-tip></td>
                        <td><ui-tip :content="row.category" ></ui-tip></td>
                        <td><times :time="row.publish_time"></times></td>
                        <td>
                            <el-button size="mini" @click="publish(row)" type="primary" >刊登</el-button>
                        </td>
                    </tr>
                    </tbody>
                </ui-table>
            </el-col>
        </el-row>
        <!-- 商品信息弹窗 -->
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
            :title="title"
            :datavalue="datavalue"
        ></subsidy-diaog>
    </div>
</template>
<style lang="stylus">
    .copyright{
        position absolute;
        left 0;
        top:0;
        width: 30px;
        height: 16px;
        cursor: pointer;
        line-height: 16px;
        display: inline-block;
        vertical-align: middle;
        border: 1px solid #660033;
        color:#660033;
    }
    .img-position{
        position absolute;
        top: 28px;
        left: 30px;
        cursor:pointer
    }
  .shipment-data-table {
    font-size 12px;
    .shipment-simulate {
      box-sizing: border-box;
      display: inline-block;
      color: #fff;
      width: 100%;
      padding: 0 5px;
      height: 32px;
      line-height: 32px;
      font-size: 1.2rem;
      background: #6495ED;
      border: 1px solid #6495ED;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border-bottom: 1px solid transparent;
    }
    .tree-myself {
      height: 555px;
      overflow-y: auto;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
        .el-tree-node__label{
          font-size:12px;
        }
    }
    .shipment > .el-card__header {
      background: #6495ED;
      padding: 3px 5px;
      .el-checkbox__label {
        color: #fff;
      }
      height: 32px;
      line-height: 26px;
    }
    .aliRight {
      text-align: right;
    }
    .shipment-header {
      float: right;
      line-height: 26px;
    }
    .shipping-data-table {
      .error-log {
        color: #f00;
      }
    }
  .error{
      padding-right: 12px;
      display: inline-block;
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
      background:rgba(173,227,255,.7) !important;
  }
  .el-tree-node__content:hover{
      background:rgba(204, 227, 199, .7) !important;
  }
  .table{
      .ui-table-head {
        border-left: 1px solid #ddd;
        border-top: 1px solid #ddd;
      }
  }
  }
</style>
<script>
    import {api_get_goods_description,api_get_discount} from '@/api/product-library'

    export default{
        data(){
            return {
                lookVisable:false,
                showedit:false,
                goodsId:0,
                activeName:'pandao平台',
                editAble:false,
                imgDialog: false,
                imgPath:'',
                spu:"",
                isloading:false,
                show:false,
                goodid:0,
                trot_data:[],
                count:0,
                title:'',
                datavalue:[],
                subDiaog:false
            }
        },
        methods:{
            discount(data){
                this.$http(api_get_discount,{goods_id:data.goods_id}).then(res=>{
                    this.title=`${data.spu}补贴信息`;
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
                this.show=true;
                this.title=row.spu;
                console.log(row);
                console.log(this.title)
                this.goodid=row.id;
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
            large_img(image){
                this.imgPath = image.replace('_60x60.','_500x500.');
                this.imgDialog = true;
            },
            middle_img(image){
                return image.replace('_60x60.','_200x200.');
            },
            publish(row){
                let params = {
                        goods_id: row.goods_id,
                        account_id:this.params.account_id,
                        isAdd: true,
                        spu:row.spu,
                        id:row.id,
                };
                this.$open(`/publish/mymall/getdata?id=${row.goods_id}`, params)
            },
            //查看产品信息
            distribution(data){
                this.lookVisable = true;
                this.goodsId = data.id;
                this.spu = data.spu;
                this.showedit = true;
                this.$nextTick(()=>{
                    this.$refs.looks.titleName = `查看SPU：${data.spu}  `;
                })
            },
        },
        created(){
            console.log('created');
            this.$emit('search');
        },
        computed:{

        },
        props:{
            loading:{
                type:Boolean,
            },
            products:{
                type: Array,
            },
            firstLoading:{
                type: Boolean,
            },
            params:{
                type: Object,
            }
        },
        components: {
            uiTip: require("../../../../components/ui-tip.vue").default,
            uiTable:require('../../../../components/ui-table.vue').default,
            lookEdit:require("../../../product/manager/look-edit.vue").default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
            tortTable:require('./tort-table').default,
            subsidyDiaog:require("@/view/kandeng/ymx/subsidy-diaog.vue").default,
        }
    }
</script>
