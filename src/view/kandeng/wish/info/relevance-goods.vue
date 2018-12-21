<template>
    <div  class="wish-publish-relevance">
        <!--关联商品信息-->
        <el-row class="p-relevance-goods-wish">
            <div class="p-titleBgcol">
                <span>{{label}}</span>
            </div>
            <div class="p-titleColour">
                <el-form :model="relevanceForm" ref="relevanceForm" label-width="180px">
                    <el-form-item label="产品名称：">
                        <span v-if="!!relevanceForm.zh_name">{{relevanceForm.zh_name}}</span>
                        <span v-else>未关联</span>
                    </el-form-item>
                    <el-form-item label="本地SPU：">
                        <span>{{relevanceForm.parent_sku}}</span>
                    </el-form-item>
                    <el-form-item label="品牌：">
                      <span v-if="!!relevanceForm.brand">{{relevanceForm.brand}}</span>
                      <span v-else>无品牌信息</span>
                    </el-form-item>
                    <el-form-item label="产品物流属性：">
                        <el-tag type="success" v-if="!!relevanceForm.transport_property">{{relevanceForm.transport_property}}</el-tag>
                        <span v-else>无</span>
                    </el-form-item>
                    <el-form-item label="详细信息网址：">
                        <div class="inline" v-if="curUrl">
                              <span style="display: inline-block ;max-width:500px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap" :title="relevanceForm.landing_page_url">{{relevanceForm.landing_page_url}}</span>
                              <el-button size="mini" type="success" @click.native="open_link">打开连接</el-button>
                        </div>
                        <span v-else>无网址</span>
                    </el-form-item>
                    <el-form-item label="发货仓库：">
                        <el-select v-model="relevanceForm.warehouse" placeholder="请选择类型"
                                   style="width:200px" @change="change_warehouse">
                            <el-option
                                    v-for="item in warehouseList"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button size="mini"  v-if="add"  type="primary" :disabled="relevanceForm.warehouse===''"
                                   @click.native="accountVisable=true">添加账号
                        </el-button>
                    </el-form-item>
                </el-form>
                <accounts v-model="accountVisable"
                          :accounts="channel"
                          :loading="accountLoading"
                          @selected="keep_channel(channels,$event)" ></accounts>
            </div>
        </el-row>
        <!--标题与价格-->
        <el-tabs type="border-card" style="width:100%" :closable="add"
                 v-if="relevanceForm.vars&&relevanceForm.vars.length!==0"
                 :active-name="currentTab"  @tab-remove="removeTab"  @tab-click="tab_click"
                 class="mt-sm">
            <el-tab-pane v-for="(item,index) in  relevanceForm.vars" :key="index"
                         :label="item.account_code" :name="item.account_code">
                <div>
                    <title-price label="标题与价格" ref="title" :form="item" :isTime="isTime"></title-price>
                    <attribute-set label="SKU设置"
                                   :cur-model="curModel"
                                   :is-copy="isCopy"
                                   :goodsId="relevanceForm.goods_id"
                                   :true-id="trueId"
                                   :base-url="relevanceForm.base_url"
                                   :channel-id="relevanceForm.channel_id"
                                   :account-id="item.accountid"
                                   :tableData="item.variant"
                                   :id="id"
                                   :add="add"
                                   :spu="spu"
                                   :is-promoted="isPromoted"
                                   @sku-submit="sku_submit"
                                   v-if="relevanceForm.vars&&relevanceForm.vars.length!==0&&showAttr(item)">

                    </attribute-set>
                    <picture-describe
                            v-if="relevanceForm.vars&&relevanceForm.vars.length!==0"
                            :is-copy="isCopy"
                            :true-id="trueId"
                            :pictureData="item"
                            :especial-ids="especialIds"
                            :id="id"
                            :channel-id="relevanceForm.channel_id"
                            :base-url="relevanceForm.base_url"
                            :spu="spu"
                            ref="describe"
                            label="图片与描述">
                    </picture-describe>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style lang="stylus">
    .wish-publish-relevance{
        .el-tabs__nav{
            white-space: normal!important;
        }
        .el-tabs__nav-prev{
            display: none;
        }
        .el-tabs__nav-next.is-disabled{
            display: none;
        }
    .p-relevance-goods-wish {
        .p-titleBgcol {
            background: #FAECE7;
            span {
                color: #FFF;
                font-weight: bold;
                padding: 5px 10px;
                font-size: 1.7rem;
                display: inline-block;
                background: #FF6C36;
            }
        }
        .acconut-choose{
            min-height:300px;
            width:300px;
            overflow-x:hidden;
            .el-select{
                .el-select__tags{
                    position: absolute;
                    top:40px;
                    .el-select__input.is-undefined{
                        position: absolute;
                        top: -27px;
                    }
                    >span{
                        display:inline-grid;
                        white-space:normal;
                    }
                }
             .el-input{
               .el-input__inner{
                   height:26px!important;
               }
                 .el-input__icon .el-icon-caret-top{
                     height:26px!important;
                 }
             }

            }

        }
        .p-titleColour {
            padding: 20px;
            border-left: 3px solid #FF6C36;
            .channel {
                height: 26px;
                .el-select__tags {
                    display: none;
                }
                .el-select > .el-input {
                    height: 26px;
                }
                .el-input__inner {
                    height: 26px !important;
                }
            }
        }
    }
    }
</style>
<script>
    import {api_pricing_rules} from "../../../../api/publish-smt"
    import {product_brand, product_tag, warehouse_type} from '../../../../api/product_create'
    import {api_wish_channel} from "../../../../api/kandeng"
    import attributeSet from './attribute-set.vue'; //-----多属性设置引入
    import pictureDescribe from './picture-describe.vue'; //-----图片与描述引入
    import {mapGetters} from "vuex"
    export default{
        data(){
            return {
                especialIds:[],
                accountLoading:false,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                currentTab: "",
                brandList: [],
                tagsList: [],
                channels: [],
                warehouseList: [],
                tempData: {},
                accountVisable: false,
            }
        },
        created(){
            this.$http(warehouse_type).then(res=> {
                this.warehouseList = res;
            }).catch(code=> {
                console.log(code,'code');
            });
        },
        mounted(){
            this.get_channel();
            this.$nextTick(()=>{
                this.especialIds = [this.id];
            });
        },
        computed: {
            ...mapGetters({currentUser:'user/info'}),
            curUrl(){
                let cur = false;
                if(!!this.relevanceForm.landing_page_url){
                    cur = this.relevanceForm.landing_page_url.includes('http');
                }
                return cur;
            },
            channel(){
                return this.channels.map(account=> {
                    let vars = this.relevanceForm.vars || [];
                    let find = vars.find((r)=> {
                        return r.accountid === account.id;
                    });
                    account.disabled = !!find;
                    return account;
                });
            },

        },
        methods: {
            sku_submit(val){
                this.especialIds = [...this.especialIds,...val];
            },
            showAttr(item){
                if(!this.add){
                    return  item.variant&&item.variant.length
                }else {
                    return true
                }
            },
            open_link(){
                let url=this.relevanceForm.landing_page_url;
                  window.open(url)
            },
            change_warehouse(){
                if(!this.add){
                    return ;
                }
                let find=this.warehouseList.find(row=>{
                    return row.name===this.relevanceForm.warehouse
                });
                if(!!find){
                    this.relevanceForm.warehouse_type=find.type;
                    this.get_channel();
                }
            },
            get_channel(){
                if(!this.relevanceForm.parent_sku||!this.relevanceForm.warehouse_type){
                    return "";
                }
                this.accountLoading = true;
                this.$http(api_wish_channel,{spu:this.relevanceForm.parent_sku,type:this.relevanceForm.warehouse_type}).then(res=> {
                    this.accountLoading = false;
                    this.channels = res.data.map(row=> {
                        row.disabled = false;
                        return row
                    });
                    if(this.relevanceForm&&this.relevanceForm.vars){
                        this.relevanceForm.vars=this.relevanceForm.vars.filter(row=>{
                            let find= this.channels.find(item=>{
                                return item.id===row.accountid
                            });
                            return !!find
                        })
                    }
                }).catch(code=> {
                    this.$message({type:'error',message:code.message||code});
                });
            },
            tab_click(val){
                this.currentTab=val.name
            },
            account_dialog(val){
                if(!val){
                    this.channelid= [];
                }
            },
            keep_channel(Array,val){//Array 为账号列表
                if(val.length===0){
                  this.$message({
                      type:"error",
                      message:"请选择账号"
                  });
                    return ;
                }
                /*处理刊登定价*/
                let price_field = (PricingRules,skuId,field)=>{
                    let priceField = '';
                    if(PricingRules&&PricingRules[skuId]&&PricingRules[skuId].total_price){
                        priceField = parseFloat(PricingRules[skuId][field])<=0?'':PricingRules[skuId][field];
                    }
                    return priceField;
                };
                val.forEach(async item=>{
                    let obj=Array.find(row=> {
                                return item.id === row.id;
                             });
                    if(obj){
                        let data = window.clone(this.tempData);
                        data.accountid = obj.id;
                        data.account_name = obj.account_name;
                        data.account_code = obj.code;
                        data.realname = this.currentUser.realname;
                        let length = this.relevanceForm.vars.length;
                        data.index = length + "";
                        this.relevanceForm.vars.push(data);
                        let skuIdList = data.variant.map(item=>item.sku_id);
                        let PricingRules = await this.$http(api_pricing_rules,{
                            channel_id:3,
                            account_id:obj.account_id,
                            site_code:0,
                            sku_id:skuIdList,
                        });
                        data.variant = data.variant.map(item=>{
                            /*吊牌价*/
                            item.msrp = price_field(PricingRules,item.sku_id,'tag_price');
                            /*销售价*/
                            item.price = price_field(PricingRules,item.sku_id,'sale_price');
                            /*运费*/
                            item.shipping = price_field(PricingRules,item.sku_id,'shipping_fee');
                            return item;
                        });
                    }
                });
               let length = this.relevanceForm.vars.length ;
                if(length>0)this.currentTab=this.relevanceForm.vars[length-1].account_code||"";
            },
            removeTab(val){
                let index=this.relevanceForm.vars.findIndex(row=>{
                    return row.account_code===val
                })
                this.relevanceForm.vars.splice(index, 1);
                if(index>0){
                    this.currentTab=this.relevanceForm.vars[index-1].account_code
                }else {
                    this.relevanceForm.vars[0]&&(this.currentTab=this.relevanceForm.vars[0].account_code)
                }
            },
            submit(){
                let length = this.$refs.title.length;
                let data = [];
                for (let i = 0; i < length; i++) {
                    data[i] = false;
                    data[i] = this.$refs.title[i].sumbit();
                }
                return data;
            },
        },
        props: {
            isPromoted:{
                required: true,
                type: Number
            },
            relevanceForm: {
                required: true,
                type: Object
            },
            label: {
                required: true,
                type: String
            },
            id: {  //goods_id
                required: true,
            },
            trueId:{
                required: true,
            },
            spu: {
                required: true,
            },
            curModel:{//当前模块
                required: true,
                type: String
            },
            add: {
                required: true,
                type: Boolean
            },
            isTime:{
                type: Boolean
            },
            isCopy:{
                type: Boolean
            },
        },
        components: {
            attributeSet,
            pictureDescribe,
            titlePrice: require("./title-price.vue").default,
            pageDialog: require("../../../../components/page-dialog.vue").default,
            accounts:require("./accounts.vue").default,
            imgAdd:require('../../../../components/img-add.vue').default,
        }
    }
</script>
