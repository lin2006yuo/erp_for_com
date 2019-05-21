<template>
    <page-dialog :title="storageAction.title"
                 size="large"
                 v-model="visible"
                 class="p-parcel-returned-manage"
                 :close-on-click-modal="false">
        <label-item label="仓库：">
            <el-select v-model="storageData.warehouse_id" class="width-sm" :disabled="!returnDeal">
                <el-option v-for="(item, index) in warehouse"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item :label="`${storageAction.mean}库类型：`" class="ml-sm">
            <el-select v-model="storageData.warehouse_type" class="width-sm" disabled>
                <el-option v-for="(item, index) in typeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="来源单据：" class="ml-sm">
            <el-input v-model="storageData.package_return_number" disabled></el-input>
        </label-item>
        <el-table :data="storageData.details"
                  height="120"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar mt-sm mb-sm"
                  highlight-current-row>
            <el-table-column
                inline-template
                label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="商品名称">
                <div>
                    <ui-tip :content="row.spu_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                width="50"
                label="图片">
                <template slot-scope="scope">
                    <el-popover
                        placement="right"
                        trigger="hover">
                        <img :src="scope.row.thumb" width="150px" height="150px">
                        <span slot="reference">
                                    <img :src="scope.row.thumb" v-if="scope.row.thumb" height="26px" width="26px" style="border:none;vertical-align: middle">
                                </span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                inline-template
                label="单价">
                <div>
                    <ui-tip :content="row.cost_price" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="总数量"
                width="100"
            >
                <div>
                    <ui-tip :content="row.sku_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                width="250"
                :label="`${storageAction.mean}库数量`">
                <div>
                    <span>良品：</span>
                    <!--<el-input :value="row.quantity" v-range.number="{max: row.sku_quantity, min: 0}" class="storage_order_input"></el-input>-->
                    <integer-zero-input v-model="row.quantity"
                                        class="inline mr-xs"
                                        style="width: 65px"
                                        :min="0">
                    </integer-zero-input>
                    <span>次品：</span>
                    <!--<el-input :value="row.defective_quantity" v-range.number="{max: row.sku_quantity, min: 0}" class="storage_order_input"></el-input>-->
                    <integer-zero-input v-model="row.defective_quantity"
                                        class="inline mr-xs"
                                        style="width: 65px"
                                        :min="0">
                    </integer-zero-input>
                </div>
            </el-table-column>
        </el-table>
        <span class="inline mb-sm">备注：</span>
        <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="storageData.remark">
        </el-input>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="miniAdd" @click="saveAdd">保 存</request-button>
            <el-button @click="visible = false" size="mini">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .storage_order_input {
        display inline-block
        width: 50px
    }
</style>
<script>
    import {api_warehouse_get} from '@/api/transfer-plan';
    import {api_post_alreadystorage} from '@/api/package-return'
    export default {
        data(){
            return {
                warehouse: [],
                typeList:[
                    {label:'退回入库',value:15}
                ],
                visible:false,
                loading:false,
            }
        },
        mounted(){
            this.init_warehouse();
        },
        methods: {
            init_warehouse(){
                this.$http(api_warehouse_get).then(res=>{
                    this.warehouse = res;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:"warning",
                        message:code.message || code
                    });
                })
            },
            saveAdd(){
                this.$confirm(`您将生成${this.storageAction.mean}库单,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.validData(this.storageData.details).then(() => {
                            let details = this.storageData.details.map(row=>{
                                return {
                                    sku_id:row.sku_id,
                                    quantity:row.quantity,
                                    sku:row.sku,
                                    price:row.cost_price,
                                    goods_id:row.goods_id,
                                    defective_quantity: row.defective_quantity
                                }
                            });
                            let data = {
                                warehouse_id:this.storageData.warehouse_id,
                                type:this.storageData.warehouse_type,
                                original:this.storageData.package_return_number,
                                remark:this.storageData.remark,
                                details:details
                            };
                            this.$http(api_post_alreadystorage, this.storageAction.id, data).then(res=>{

                                if(this.searchData && this.searchData.status !== ''){
                                    this.$emit('delete-table', this.storageAction.id);
                                }else{
                                    this.$emit('init-data',this.searchData);
                                }
                                this.$message({type:"success",message:res.message || res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(()=>{
                                    this.$reqKey(`miniAdd`, false);
                                },200);
                            });
                        }).catch((code) => {
                            this.$message({
                                type: 'warning',
                                message: code
                            });

                        }).finally(()=>{
                            setTimeout(()=>{
                                this.$reqKey(`miniAdd`, false);
                            },200);
                        });
                    }).catch(() => {
                        this.$reqKey('miniAdd', false);
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            },
            handleKeyup_l(row, $event) {
                this.$nextTick(() => {
                    row.quantity = $event.target.value;
                    row.defective_quantity = row.sku_quantity - row.quantity
                })
            },
            handleKeyup_c(row, $event) {
                this.$nextTick(() => {
                    row.defective_quantity = $event.target.value;
                    row.quantity = row.sku_quantity - row.defective_quantity
                })
            },
            validData(data) {
                // sku_quantity 总数量
                // quantity 良品数量
                // defective_quantity 次品数量
                return new Promise((resolve, reject) => {
                    data.map(row => {
                        // 良品、次品数量不能为空且良品、次品数量之和小于总数量
                        if(row.quantity !== "" && row.defective_quantity !== "" && +row.sku_quantity >= +row.quantity + +row.defective_quantity && +row.quantity >= 0 && +row.defective_quantity >= 0) {
                            resolve()
                        } else {
                            reject('入库数量输入有误');
                        }
                    });
                })
            },
            begin_zero(str) {
                if(typeof str === 'number') {
                    str = String(str)
                }
                const reg = /^0/;
                return reg.test(str)
            }
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            searchData:{},
            storageData:{},
            storageAction:{},
            returnDeal:{
                default(){
                    return false;
                }
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
            integerInput:require('@/components/integer-input.vue').default,
            integerZeroInput:require('@/components/integer-zero-input').default,
            shippingType:require('./shipping-type').default
        },
        directives: {
            range: {
                bind(el, binding) {
                    const {max, min} = binding.value;
                    const INPUT_DOM = el.querySelector('input');
                    const handleInput = () => {
                        //如果指定限制输入number
                        if(binding.modifiers.number) {
                            INPUT_DOM.value = INPUT_DOM.value.replace(/[^0-9]/g, "")
                        }
                        //如果超出指定范围
                        if(INPUT_DOM.value > max) {
                            INPUT_DOM.value = max;
                        } else if(INPUT_DOM.value < min) {
                            INPUT_DOM.value = 0
                        }
                    };
                    el.addEventListener('keyup', handleInput)
                }
            }
        }
    }
</script>
