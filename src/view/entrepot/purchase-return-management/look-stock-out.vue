<template>
    <page-dialog :title="action.title"
                 size="large"
                 @open="open"
                 class="p-purchase-return-management"
                 v-model="visible"
                 :close-on-click-modal="false">
        <table class="right-table mt-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">退货单号</td>
                <td width="150">{{formData.number}}</td>
                <td width="150">采购单号</td>
                <td width="150">{{formData.purchase_order_id}}</td>
            </tr>
            <tr>
                <td widht="150">状态</td>
                <td width="150">{{formData.status_name}}</td>
                <td width="150">生成时间</td>
                <td width="150">{{formData.create_time | filterTime}}</td>
            </tr>
            <tr v-if="!stockOut">
                <td width="150">操作人</td>
                <td width="150">{{formData.operator_name}}</td>
                <td width="150">操作时间</td>
                <td width="150">{{formData.operator_time | filterTime}}</td>
            </tr>
            <tr v-if="!stockOut">
                <td width="150">运输方式</td>
                <td width="150">{{formData.shipping_name}}</td>
                <td width="150">运单号</td>
                <td width="150">{{formData.shipping_number}}</td>
            </tr>
            <tr v-if="!stockOut">
                <td width="150">支付方式</td>
                <td width="150">{{formData.pay_name}}</td>
                <td width="150">运费</td>
                <td width="150">CNY{{formData.shipping_fee}}</td>
            </tr>
            <tr>
                <td width="150">退货收件人</td>
                <td width="150">{{formData.recipients}}</td>
                <td width="150">收件人电话</td>
                <td width="150">{{formData.recipients_phone}}</td>
            </tr>
            <tr>
                <td width="150">退货收件地址</td>
                <td colspan="3">{{formData.recipients_address}}</td>
            </tr>
        </table>
        <div class="border-box mt-sm">
            <el-table
                    :data="formData.details"
                    height="300"
                    class="scroll-bar"
                    highlightCurrentRow>
                <el-table-column
                        inline-template
                        label="图片">
                    <div>
                        <el-popover
                                placement="right"
                                width="200"
                                trigger="hover">
                            <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                            <div slot="reference">
                                <img v-lazy="row.thumb" width="60" height="60" style="vertical-align: middle;">
                            </div>
                        </el-popover>
                    </div>
                </el-table-column>
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
                        <span>{{row.spu_name}}</span>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="待出库数量">
                    <div>
                        <ui-tip :content="row.quantity" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="出库数量">
                    <div>
                        <integer-zero-input v-model="row.actual_quantity"
                                            v-if="stockOut"
                                            :min="0"></integer-zero-input>
                        <ui-tip :content="row.actual_quantity" :width="98" v-else></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        v-if="!stockOut"
                        inline-template
                        label="货位">
                    <div>
                        <ui-tip :content="row.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <el-card class="mt-sm" v-if="stockOut">
            <label-item label="支付方式：" class="inline">
                <span>{{formData.pay_name}}</span>
            </label-item>
            <label class="red inline ml-lg">*</label>
            <label-item label="运输方式：" class="inline">
                <super-select v-model="shipping_id"
                              class="inline"
                              :options="transportList"
                              storageKey="transportList"></super-select>
                <!--<el-select  v-model="shipping_id" class="inline" filterable>-->
                    <!--<el-option-->
                            <!--:key="item.value"-->
                            <!--v-for="item in transportList"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </label-item>
            <label class="red inline ml-lg">*</label>
            <label-item label="运单号：" class="inline">
                <el-input type="text" v-model="shipping_number"></el-input>
            </label-item>
            <label class="red inline ml-lg">*</label>
            <label-item label="运费：" class="inline">
                <el-input v-model="shipping_fee" class="inline" type="number"></el-input>
                <span class="ml-sm">CNY</span>
            </label-item>
        </el-card>
        <div class="mt-sm">
            <label>备注：</label>
            <span class="red" v-if="stockOut">当实际出库数量和待出库数量不等时，备注为必填项</span>
            <el-input v-model="remark" placeholder="请输入内容" type="textarea" :rows="4" :disabled="!stockOut"></el-input>
        </div>
        <div slot="footer">
            <el-button size="mini"
                       @click="visible = false"
                       v-if="!stockOut">关闭</el-button>
            <div v-else>
                <el-button size="mini"
                           type="primary"
                           @click.native="save">保存</el-button>
                <el-button size="mini"
                           @click.native="visible = false">取消</el-button>
            </div>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-purchase-return-management{
        .border-box{
            border-left:1px solid #d3dce6;
            border-top:1px solid #d3dce6;
            border-right:1px solid #d3dce6;
        }
        .right-table{
            width: 100%;
            border:1px solid #d3dce6;
            td{
                text-align: center;
                border-bottom:1px solid #d3dce6;
                border-right:1px solid #d3dce6;
                height:26px;
            }
            td:nth-child(2n+1){
                background-color: #f5f7fa;
            }
        }
    }
</style>
<script>
    import { api_get_express } from '@/api/purchase-return-management';
    export default {
        data(){
            return {
                visible: false,
                remark:'',//备注
                shipping_fee: '',//运费
                shipping_id: '',//渠道id
                shipping_number: '',//运单号
                transportList: []
            }
        },
        mounted(){
            this.get_transport_list()
        },
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss", val);
            }
        },
        methods: {
            open(){
                if(this.stockOut){
                    this.remark = '';
                    this.shipping_fee = '';
                    this.shipping_id = '';
                    this.shipping_number = ''
                }
            },
            sku_image(image){
                return image.replace('60x60', '200x200');
            },
            get_transport_list(){
                this.$http(api_get_express).then(res => {
                    this.transportList = res.map(row => {
                        return {
                            label: row.company,
                            value: row.id
                        }
                    })
                }).catch(err => {
                    this.$message({type: 'error', message: err.message || err})
                })
            },
            save(){
                if(!this.shipping_id){
                    this.$message({type: 'warning', message: '请选择运输方式'});
                    return
                }
                if(!this.shipping_number.trim()){
                    this.$message({type: 'warning', message: '请填写运单号'});
                    return
                }
                if(this.shipping_fee === ''){
                    this.$message({type: 'warning', message: '请填写运费'});
                    return
                }
                let empty = this.formData.details.some(row => !row.actual_quantity);
                if(empty){
                    this.$message({type: 'warning', message: '有SKU的实际出库数量未填写或为0，请填写完整后重试'});
                    return
                }
                let flag = this.formData.details.some(row => +row.actual_quantity > +row.quantity);
                if(flag){
                    this.$message({type: 'warning', message: 'SKU列表中含有实际出库数量大于待出库数量的数据，请修改后重试'});
                    return
                }
                let difference = this.formData.details.some(row => +row.actual_quantity !== +row.quantity);
                if(difference && this.remark.trim()===''){
                    this.$message({type: 'warning', message: '请填写备注'});
                    return
                }
                let params = {
                    shipping_fee: this.shipping_fee,
                    shipping_id: this.shipping_id,
                    shipping_number: this.shipping_number.trim(),
                    remark: this.remark,
                    sku_list: this.formData.details.map(row => {
                        return {
                            id: row.id,
                            sku_id: row.sku_id,
                            sku: row.sku,
                            quantity: row.quantity,
                            goods_id: row.goods_id,
                            actual_quantity: row.actual_quantity
                        }
                    })
                };
                this.$emit('stock-out', params, this.formData.id)
            }
        },
        computed: {
            stockOut(){
                return this.action.operation === 'stock_out'
            }
        },
        watch: {
            visible(val){
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{
                type: Boolean,
                required: true
            },
            action:{
                type: Object,
                required: true
            },
            formData:{
                type: Object,
                required: true
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            labelItem: require('@/components/label-item').default,
            integerZeroInput: require('@/components/integer-zero-input.vue').default
        },
    }
</script>
