<template>
    <div class="p-size-attr">
    <el-row class="p-size"   >
        <div class="p-titleBgcol">
            <span class="p-title-span">包装信息</span>
        </div>
        <div class="p-titleColour-size">
            <el-form :model="singleData"   label-width="160px">
                <el-form-item label="产品包装后的重量：" required>
                        <ui-limit-number v-model="singleData.grossWeight" style="width:80px" class="inline" :limit="2"></ui-limit-number>
                    <span>公斤/{{unitName}}</span>
                    <div>
                    <el-checkbox v-model="singleData.isPackSell">自定义计重</el-checkbox>
                    </div>
                    <div v-if="singleData.isPackSell">
                        <el-row>
                            买家购买
                            <el-input-number size="small"
                                 v-model="singleData.baseUnit" style="width:80px"  class="inline"
                                :debounce="0"
                                 :controls="false">
                        </el-input-number>{{unitName}}以内，按单间产品重量计算运费。
                        </el-row>
                        <el-row>
                            在此基础上，买家每多买  <el-input-number size="small"
                                                          v-model="singleData.addUnit" style="width:80px"
                                                          :debounce="0"
                                                          class="inline"
                                                          :controls="false">
                        </el-input-number>
                            {{unitName}}，重量增加
                            <ui-limit-number  v-model="singleData.addWeight"  style="width:80px" class="inline" :limit="2" >
                            </ui-limit-number>kg
                        </el-row>
                    </div>
                </el-form-item>
                <el-form-item label="产品包装后的尺寸：" required>
                    <integer-input v-model="singleData.packageLength" style="width:80px" class="inline" :min="1"></integer-input>
                    <span>×</span>
                    <integer-input v-model="singleData.packageWidth" style="width:80px" class="inline" :min="1"></integer-input>
                    <span>×</span>
                    <integer-input v-model="singleData.packageHeight" style="width:80px" class="inline" :min="1"></integer-input>
                    <span>（单位：厘米，每升280cm<sup>3</sup> ）</span>
                    <!--<ui-limit-number  v-model="singleData.packageLength"  style="width:80px" class="inline" :limit="2" >-->
                    <!--</ui-limit-number>-->
                    <!--<ui-limit-number  v-model="singleData.packageWidth"  style="width:80px" class="inline" :limit="2" >-->
                    <!--</ui-limit-number>-->
                    <!--<ui-limit-number  v-model="singleData.packageHeight"  style="width:80px" class="inline" :limit="2" >-->
                    <!--</ui-limit-number>-->
                </el-form-item>
            </el-form>
        </div>
    </el-row>
    </div>
</template>
<style lang="stylus">
    .p-size-attr{
        .p-size{
            .p-titleBgcol{
                background: #FAECE7;
                .p-title-span{
                    color: #FFF;
                    font-weight:bold;
                    padding: 5px 10px;
                    font-size: 1.7rem;
                    background: #FFB732;
                    display: inline-block;
                }
            }
            .p-titleColour-size{
                padding: 20px;
                border-left: 3px solid #FFB732;
                .el-input--small .el-input__inner{
                    height: 26px;
                }
            }
        }
    }
</style>
<script>
import {api_aliexpress_productUnit} from "../../../../api/publish-smt"
    export default{
        data(){
            return {
                priceOptions:[],
            }
        },
        created(){
            this.$http(api_aliexpress_productUnit).then(res=>{
                this.priceOptions=res;
            }).catch(code=>{
                console.log(code)
            })
        },
        mounted(){
        },
        computed: {
            unitName(){
                let find=this.priceOptions.find(row=>{
                    return row.id===this.singleData.productUnit
                })
                if(!!find){
                    return find.name
                }else {
                    return "包"
                }
            }
        },
        methods: {},
        filters: {},
        watch: {},
        props: {
            singleData:{
                require:true,
                type:Object,
            },
        },
        components: {
            uiLimitNumber:require("../../../../components/ui-limit-number.vue").default,
            integerInput:require('../../../../components/integer-input.vue').default,
        }
    }
</script>
