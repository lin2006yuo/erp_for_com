<template>
    <div class="mark-pay-class">
        <page-dialog v-model="show" :title="title" width="80%" @close="close">
            <div class="mt-sm">
                <div v-if="is_batch">
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <div class="row-content">
                                <span>申请付款总额 : </span> <span>{{mark_detail.currency_code}} {{mark_detail.apply_amount | filtersPay}}</span>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="row-content">
                                <span>付款状态 : </span> <span> {{mark_detail.status | filterStatus}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <div class="row-content">
                                <span>供应商 : </span> <span>{{mark_detail.supplier}}</span>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="row-content">
                                <span>结算方式 : </span> <span>{{mark_detail.balance_text | filterCount}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <div class="row-content">
                                <span>申请时间 : </span> <span>{{mark_detail.create_time_date}}</span>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="row-content">
                                <span>最迟付款时间 : </span> <span>{{mark_detail.payment_last_time | dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="card-line"></div>
                </div>
                <el-table border
                          :data="checkList"
                          style="width: 100%;"
                          v-loading="pay_loading">
                    <el-table-column width="120" label="采购单号"  inline-template>
                        <div style="color: #69f;cursor:pointer;" title="点击可查看采购详情" @click="look_(row)">{{row.purchase_order_code}}</div>
                    </el-table-column>
                    <el-table-column label="外部流水号" width="170" inline-template>
                        <div class="p-table-list-td-text" :title="row.external_number">{{row.external_number | filterCount}}</div>
                    </el-table-column>
                    <el-table-column label="1688账号" inline-template>
                        <div class="p-table-list-td-text" :title="row.account_1688">{{row.account_1688 | filterCount}}</div>
                    </el-table-column>
                    <el-table-column label="采购单状态" inline-template>
                        <div class="p-table-list-td-text" :title="row.purchase_order_status_text">{{row.purchase_order_status_text}}</div>
                    </el-table-column>
                    <el-table-column label="币种" width="60" prop="currency_code">
                    </el-table-column>
                    <el-table-column label="申请付款金额" width="120" inline-template>
                        <div>{{row.apply_amount | pay_filter}}</div>
                    </el-table-column>
                    <el-table-column label="已付款金额" width="120" inline-template>
                        <div>{{row.payment_amount | pay_filter}}</div>
                    </el-table-column>
                    <el-table-column label="采购类型" width="140" inline-template>
                        <div class="p-table-list-td-text" :title="row.purchase_type">{{row.purchase_type}}</div>
                    </el-table-column>
                    <el-table-column label="采购员" width="120" prop="purchaser">
                    </el-table-column>
                    <el-table-column label="本次付款金额" inline-template>
                        <div class="deal-center-pay">
                            <span v-if="row.apply_amount === row.payment_amount">0.000</span>
                            <ui-limit-number v-model="row.this_payment"
                                             style="width:130px;margin-left:15px;"
                                             @blur="update_price(row)"
                                             v-else
                                             :limit="2"
                                             :min="0"
                                             :class="{'limit-input': row.this_payment > (row.apply_amount*10000- row.payment_amount*10000)/10000}">
                            </ui-limit-number>
                            <div v-if="row.this_payment > (row.apply_amount*10000 - row.payment_amount*10000)/10000" class="red" ref="showDiv">超过应付金额上限</div>
                        </div>
                    </el-table-column>
                </el-table>
                <div class="mt-lg" v-if="mark_detail.status ===5 || mark_detail.status ===8">
                    <label v-if="is_batch">付款回单：</label>
                    <image-upload v-model="old_images"
                                  @remove-img="remove_payment_image"
                                  :download-img="downloadImg"
                                  :is-look="isEdit"
                                  :show-download="true"
                                  :maximum="20"
                                  :maximize="500*1024"
                                  class="inline"
                                  ref="markPayRef">
                    </image-upload>
                </div>
            </div>
            <div slot="footer">
                <request-button req-key="batch_failed_pay" @click.native="sure_pay">确认付款</request-button>
                <el-button size="mini" @click.native="show = false">关闭</el-button>
            </div>
            <!--查看采购单详情-->
            <look-list v-model="lookVisable"
                       :lookData="lookData"
                       :edit="false"
                       :listId="listId"
                       @save-logistics="save_logistics">
            </look-list>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .mark-pay-class{
        .page-dialog {
            z-index: 1111 !important;
        }
        .row-content{
            display: flex;
            align-items: center;
            span:first-child{
                display: inline-block;
                width:120px;
                text-align:right;
                padding:6px 5px;
                font-weight: bold;
            }
            span:last-child{
                width: 80%;
            }
        }
        .card-line{
            border-top: 1px solid #dee5ee;
            height: 15px;
            margin-top: 20px;
        }
        .red-color{
            color: #f00;
        }
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .limit-input{
            .el-input__inner{
                border: 1px solid #f00;
            }
        }
        .deal-center-pay{
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 5px 5px;
        }
    }
</style>

<script>
    import {api_purchase_apply_mark_payed,api_purchase_apply_upload_payment_images} from "../../../api/finance-purchase"
    import {api_look_detail} from "../../../api/purchase"
    import {downloadFile} from '@/lib/http';
    export default {
        data(){
            return{
                show: false,
                lookVisable: false,
                lookData: {},
                old_images: [],
                listId: 0,
                removePaymentImage: [],
            }
        },
        computed: {},
        watch: {
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        methods: {
            close() {
                this.old_images = [];
                this.$emit('close');
            },
            downloadImg(file){
                downloadFile({
                    url:`${config.apiHost}supplier/download-image`,
                    get: {file: file},
                    fileName: file.slice(file.lastIndexOf('/') - 1, file.lastIndexOf('.')),
                    suffix: file.slice(file.lastIndexOf('.'))
                });
            },
            remove_payment_image(arr){
                this.removePaymentImage.push(...arr);
            },
            look_(info) {//查看采购详情
                this.lookVisable = true;
                this.lookData = {};
                this.$set(this, "listId", info.purchase_order_id);
                this.$set(this.lookData, "shipping_cost", 0);
                this.$http(api_look_detail, info.purchase_order_id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            save_logistics(id) {
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            upload_image() {
                let files = this.$refs.markPayRef.images;
                let dataImage = Object.keys(files).map(key => { //获取当前图片url
                    if(files[key].path){
                        return files[key].path
                    }else{
                        return files[key].file.image;
                    }
                });
                let pathArr = this.mark_detail.payment_images.map(row => {//旧的图片url
                    return row.path
                });
                let newImage = dataImage.concat(pathArr); //当前图片与旧图片合并
                let data = {
                    id: this.mark_detail.id,
                    images: (pathArr.length ===0 && dataImage.length ===0) ? [""] : newImage
                };
                this.$http(api_purchase_apply_upload_payment_images, data).then(res => {
                    console.log(res);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            singlePay(data) { //单个标记
                this.$http(api_purchase_apply_mark_payed, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.upload_image();//调用上传图片方法
                    this.show = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('batch_failed_pay', false);
                });
            },
            batchPay(data) {//批量标记
                this.$http(api_purchase_apply_mark_payed, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.show = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('batch_failed_pay', false);
                });
            },
            sure_pay(){//确认付款
                if(this.$refs.showDiv){
                    this.$reqKey('batch_failed_pay', false);
                    return;
                }
                let newList = this.checkList.filter(item => {
                    return  item.apply_amount !== item.payment_amount;
                });
                let ids = newList.map(row => {return row.id});
                let pay_amount = newList.map(row => {return row.this_payment});

                let obj = {};
                ids.forEach((item,index) => {
                    obj[item] = pay_amount[index];
                });
                let data = {
                    data: obj
                };
                if(this.is_batch === true){
                    this.singlePay(data);
                }else{
                    this.batchPay(data);
                }
            },
            update_price(row){
                if(row.this_payment < 0){
                    row.this_payment = 0;
                }
                row.this_payment = Number((row.this_payment * 1000) / 1000).toFixed(2);
            }
        },
        filters: {
            filtersPay(val){
                if(Number(val)>0){
                    return Number(val).toFixed(3);
                }
            },
            filterStatus(val){//付款状态
                const statusArr = new Map()
                    .set(0,"待采购审核")
                    .set(1,"采购审核不通过")
                    .set(2,"待财务审核")
                    .set(3,"财务审核不通过")
                    .set(4,"待采购排款")
                    .set(5,"待付款")
                    .set(6,"已付款")
                    .set(7,"取消付款")
                    .set(8,"部分付款")
                    .set(-1,"作废")
                    .set(-4,"采购排款不通过");
                return statusArr.get(val);
            },
            dateFilter(val){
                if(val >0){
                    return datef('YYYY-MM-dd', val);
                }else{
                    return '- -'
                }
            },
            pay_filter(val){
                if(Number(val)>=0){
                    return Number(val).toFixed(2);
                }else {
                    return '- -'
                }
            },
            filterCount(val){
                return val ==='' ? '- -' : val;
            },
        },
        props: {
            pay_loading: {required: true, type: Boolean},
            is_batch: {required: true, type: Boolean},
            value: {},
            checkList: {required: true, type: Array,
            },
            mark_detail: {required: true, type: Object},
            title:{required: true, type: String,},
            isEdit: {required: true, type: Boolean},
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../components/ui-limit-number').default,
            requestButton: require('../../../global-components/request-button').default,
            lookList:require('../../procurement/purchase/look-list.vue').default,
            imageUpload: require('./image-upload').default,

        }
    }
</script>

