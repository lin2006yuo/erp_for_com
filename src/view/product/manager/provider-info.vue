<template>
    <el-row class="c-provider-info">
            <el-form label-width="130px">
                <el-form-item label="采购员：" >
                    <el-select class="inline" ref="purchaserId"
                               filterable clearable
                               v-model="providerData.purchaser_id"
                               v-mouse-side.mousewheel="()=>{$refs.purchaserId.visible = false}"
                               placeholder="请选择"
                               v-if="editAble"
                               @change="change_purchaser">
                        <el-option
                                v-for="item in purchasers"
                                :key="item.id"
                                :label="item.realname"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <span v-else>{{providerData.purchaser}}</span>
                </el-form-item>
                    <el-form-item  v-for="(item,index)  in providerData.supplier"
                                   :key="`item${index}`"
                                   :label="item.is_default===1?'默认供应商：':'供应商：'"
                    >
                        <el-row class="mb-sm">
                       <span>{{item.company_name}}</span>
                        <el-button size="mini" type="success" v-if="item.is_default!==1&&editAble"   class="inline ml-lg" @click="set_provider(item,index)">设置为默认供应商</el-button>
                        </el-row>
                        <el-table
                                :data="item.skus"
                                style="width: 100%"
                                >
                            <el-table-column
                                    inline-template
                                    label="图片"
                                    width="100">
                                <img :src="row.thumb" height="26px" width="26px">
                            </el-table-column>
                            <el-table-column
                                    prop="sku"
                                    label="SKU"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="链接"
                                    width="255">
                                    <a :href="row.link" target="blank_"></a>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="最新报价"
                                    width="80">
                                <div>{{row.currency_code}}  {{row.price}}</div>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="区间报价"
                                    width="90">
                                <div>
                                    <div  v-for="(price,index) in row.section" :key="`price${index}`">
                                        <span>{{price.min_quantity}}</span>-<span>{{price.max_quantity}}</span> /
                                                    <span>{{price.price}}</span>
                                    </div>
                                </div>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="仓库/交货周期"
                                   >
                                <div>
                                    <div  v-for="(day,index) in row.cycle"  :key="index">
                                        <span>{{day.warehouse_name}}</span>/ <span>周期：{{day.delivery_days}}</span>
                                    </div>
                                </div>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                        <el-form-item label="" v-if="!isAdd">
                            <div v-if="editAble">
                                <request-button req-key="providerInfo" @click="keep_">保 存</request-button>
                                <el-button size="mini" @click="cancel_">取 消</el-button>
                            </div>
                            <el-button size="mini"
                                       v-else
                                       type="primary"
                                       @click="edit">编 辑</el-button>
                        </el-form-item>
            </el-form>

    </el-row>
</template>
<style lang="stylus">
</style>
<script>
    import card from '../../../components/card.vue';
    import  uiInput from  '../../../components/ui-input.vue'
    import {api_get_purchase} from  "../../../api/product-library"
    export default{
        data(){
            return{
                purchasers:[]
            }
        },
        created(){
            this.get_purchasers();
        },
        methods:{
            change_purchaser(){
              let find=this.purchasers.find(row=>{
                 return  row.id===this.providerData.purchaser_id
              })
                if(!!find){
                    this.providerData.purchaser=find.realname
                }
            },
            keep_(){
                this.$emit("keep")
            },
            cancel_(){
                this.$emit("cancel")
            },
            edit(){
                this.$emit("edit")
            },
          get_purchasers(){
              this.$http(api_get_purchase,{content:""}).then(res=>{
                    this.purchasers=res;
              }).catch(code=>{
                  console.log(code)
              })
          },
            set_provider(item ,index){
              this.providerData.supplier.forEach(row=>{
                  row.is_default=0
              });
              item.is_default=1;
                this.providerData.supplier.splice(index,1);
                this.providerData.supplier.unshift(item)
            },
        },
        computed:{
            providerData(){
                if(this.supplierData.length===0){
                    return {}
                }
                else {
                    return this.supplierData[0]
                }
            },
//            editAble(){
//                if(!this.editAble){
//                    if(this.isShow){
//                        return  false;
//                    }
//                    return true;
//                }else {
//                    return  false
//                }
//
//            },


        },
        props:{
            supplierData:{
                required:true,
                type:Array
            },
            editAble:{
                required:true,
                type:Boolean
            },
//            isShow:{
//                default(){
//                    return false;
//                }
//            },
            isAdd:{
                default(){
                    return false;
                }
            }
        },
        components:{
            card,
            uiInput,
          uiTip: require('../../../components/ui-tip.vue').default,
            requestButton:require('@/global-components/request-button.vue').default,
        }
    }
</script>
