<template>
        <page class="p-discount" v-loading="loading">
            <el-form>
                <div class="form-item">
                    <el-form-item label="运费折扣：" class="discount">
                        <el-input   v-model="disData.shipping_fee_discount"  :step="0.1"
                                    class="inline width-xs" :min="0" :max="2" :disabled="!editable"
                                    type="number"></el-input>
                        <span class="c-red">
                            (请注意,无折扣是请输入1, 8折时,请输入0.8)
                        </span>
                    </el-form-item>
                    <el-form-item label="运费币种：" class="corn">
                        <el-select v-model="disData.currency_code" ref="currency"
                                    v-mouse-side.mousewheel="()=>{$refs.currency.visible=false}"
                                    placeholder="请选择" class="inline width-md" :disabled="!editable">
                            <el-option :key="item.code"
                                        v-for="item in moneys"
                                        :label="item.name"
                                        :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <!-- 跟踪号规则 -->
                <div class="form-item">
                    <label class="inline lh-29">截取跟踪号规则：</label>
                    <div>
                        <!-- 第一条 -->
                        <div class="track-rule">
                            <label for="">跟踪号总位数：</label><el-input class="inline width-mini mr-md"></el-input>
                            <label for="">截取跟踪号总位数：</label>第 <el-input class="inline width-mini"></el-input> 位 --- 第 <el-input class="inline width-mini"></el-input> 位
                            <el-button size="mini" icon="plus" type="primary" class="ml-sm"></el-button>
                        </div>
                        <!-- 第二条 -->
                        <div class="track-rule">
                            <label for="">跟踪号总位数：</label><el-input class="inline width-mini mr-md"></el-input>
                            <label for="">截取跟踪号总位数：</label>第 <el-input class="inline width-mini"></el-input> 位 --- 第 <el-input class="inline width-mini"></el-input> 位
                            <el-button size="mini" icon="plus" type="primary" class="ml-sm"></el-button>
                        </div>
                    </div>
                </div>
                <!-- 敏感词 -->
                <div class="form-item mt-sm">
                    <span class="inline lh-29 sensitive-span">禁止发货的敏感词：</span>
                    <div class="sensitive-input-group">
                        <input-group />
                    </div>
                </div>
            </el-form>
        </page>
    </template>
    
    <script>
        import {api_get_currency} from '@/api/setLogistics'
        export default {
            name: "discount",
            data(){
                return{
                    loading:false,
                    disData:{},
                    moneys:[],
                }
            },
            mounted(){
                this.get_currency();
                this.disData = this.discountData
            },
            watch:{
                discountData:{
                    deep:true,
                    handler(val){
                        this.disData = val;
                    }
                }
            },
            methods:{
                get_currency(){
                    this.$http(api_get_currency).then(res=>{
                        this.moneys=[];
                        for (let i in res){
                            this.moneys.push(res[i])
                        }
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message || code});
                    })
                },
            },
            props:{
                discountData:{},
                editable:{
                    required:true,
                    type:Boolean
                }
            },
            components: {
                inputGroup: require('./input-group').default
            }
        }
    </script>
    
    <style lang="stylus">
        .lh-29 {
            line-height: 29px
        }
        .p-discount{
            .form-item {
                display: flex
                .sensitive-input-group {
                    width: 600px;
                }
                .track-rule {
                    margin-bottom: 6px;
                }
                .discount {
                    width: 420px
                }
                .corn {
                    width: 200px
                }
            }
        }
    </style>
    