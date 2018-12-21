<template>
    <div class="p-look-list">
        <page-dialog v-model="addVisable" @open="open" size="large" :title="`查看虚拟采购单号：${filterOrderNum(lookData.virtual_order_id)} 信息`" width="80%" left="10%">
            <el-row>
                <span class="inline">虚拟采购单号：{{filterOrderNum(lookData.virtual_order_id)}}</span>
                <span class="inline ml-sm">真实采购单号：{{filterOrderNum(lookData.real_order_id)}}</span>
            </el-row>
            <el-row>
                <div class="mt-sm" style=" text-align: center;">
                    <el-steps :space="110" :align-center="true" :active="stepsStatus" finish-status="success">
                        <el-step title="等待下单"></el-step>
                        <el-step title="等待到货"></el-step>
                        <el-step title="部分到货等待剩余"></el-step>
                        <el-step title="部分到货不等待剩余"></el-step>
                        <el-step title="全部到货"></el-step>
                        <el-step title="待付款"></el-step>
                        <el-step title="已付款"></el-step>
                        <el-step title="部分付款"></el-step>
                        <el-step title="拒绝付款"></el-step>
                    </el-steps>
                </div>
            </el-row>
            <card  label="基本信息" class="mt-sm">
                <el-form :model="lookData" label-width="120px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="采购仓库：">
                                <span>{{lookData.virtual_warehouse_name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="供应商：">
                                <span>{{lookData.virtual_supplier_name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="结算方式：">
                                <span>{{lookData.balance_type}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="付款状态：">
                                <span>{{lookData.payment_status}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="运单号：">
                                <span>{{lookData.tracking_number}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="采购状态：">
                                <span>{{lookData.status}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="运费">
                                <span>{{currency}} {{lookData.tracking_cost}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="货款：">
                                <span>{{currency}} {{lookData.amount}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="应付款">
                                <span>{{currency}} {{lookData.payment_amount}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="已付款：">
                                <span>{{currency}} {{lookData.actual_payment}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </card>
            <card  label="商品信息"  class="mt-sm">
                <el-table
                    highlight-current-row
                    class="mt-sm scroll-bar"
                    :data="lookList"
                    :max-height="495"
                    style="width: 100%;min-height: 225px;">
                    <el-table-column
                        width="70"
                        label="图片">
                        <template slot-scope="scope">
                            <el-popover
                                v-if="scope.row.thumb"
                                placement="right"
                                trigger="hover">
                                <img :src="scope.row.thumb | filterImage"
                                     width="200px"
                                     height="200px">
                                <span slot="reference">
                            <img :src="scope.row.thumb"
                                 @click="click_sku_img(scope.row.thumb)"
                                 height="60px" width="60px"
                                 style="border:none">
                                        </span>
                            </el-popover>
                            <img src="/static/error-picture-128.png"
                                 v-else
                                 height="60px" width="60px"
                                 style="border:none">
                        </template>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        label="SKU/别名"
                        min-width="80">
                        <div>
                            <div :title="row.sku">{{row.sku}}</div>
                            <div :title="row.sku_alias.toString()">{{row.sku_alias.toString()}}</div>
                        </div>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        label="商品名称"
                        min-width="150">
                        <div :title="row.sku_name">
                           {{row.sku_name}}
                        </div>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        inline-template
                        min-width="40"
                        label="虚拟采购单价">
                        <span>{{row.price}}</span>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        inline-template
                        min-width="40"
                        label="虚拟采购数量">
                        <span>{{row.qty}}</span>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        inline-template
                        min-width="40"
                        label="到货数">
                        <span>{{row.in_qty}}</span>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        inline-template
                        min-width="60"
                        label="到货时间">
                        <span>{{row.arrival_time|dataFilter}}</span>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="text-align: right;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count">
                </el-pagination>
            </card>
            <div class="clear p-look-list-count">
                <label-item label="货品种类数：">
                    <span>{{count}}</span>
                </label-item>
                <label-item class="ml-sm" label="货品总数量：">
                    <span>{{skuSum}}</span>
                </label-item>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="keep_edit">确 定</el-button>
                <el-button  size="mini" @click="cancel">关 闭</el-button>
            </div>
        </page-dialog>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .p-look-list{
        .select-link-btn {
            span.link {
                cursor: pointer;
                font-size: 1.2rem;
                color: #6699FF;
                &:hover {
                    text-decoration: underline;
                }
                &:active {
                    color: #397180;
                }
            }
        }
        table.template td, .el-table td, table.template th, .el-table th {
            padding 0;
        }
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        .el-input-number{
            width: 120px;
        }
        div.el-textarea{
            width:100%;
        }
        .page-dialog .dialog__body{
        }
        .default-width{
            width: 50%;
        }
        .other-width{
            width: 20%;
        }
        .del{
            cursor: pointer;
            &:hover{
                background: #FF4949;
                color: #ffffff;
            }
        }
        .link:hover{
            text-decoration: none;
        }
        .page-card .body{
            padding-left : 0;
        }
        .el-row{
            .el-form{
                .el-form-item__content{
                    float :left;
                }
            }
        }
        .p-look-list-count{
            font-weight: bold;
            margin-bottom: 10px;
            position absolute;
            bottom 10px;
        }
    }

</style>
<script>
    import card from "../../../components/card.vue"
    import pageDialog from "../../../components/page-dialog.vue"
    import addGoods from "../../../api-components/add-goods.vue"
    import uiInput from "../../../components/ui-input.vue";
    import {chinese} from '../../../define/validator_reg';
    import {api_get_virtual_purchase_order_id_detail} from '@/api/virtual-purchase-order';

    const statusOptions = [
        '未到货',
        '已到货',
        '部分到货',
    ];
    export default{
        page:{
            devinfo:{
                frontEnd:'张兵根;徐梦娇;黎宏珍',
                backEnd:'杨伟权;谭斌',
                createTime:'2017-1-14',
                updateTime:'2017-8-22'
            }
        },
        data(){
            let checkChinese = (rule, value, callback) => {
                setTimeout(() => {
                    if (chinese.test(value)) {
                        callback(new Error('请不要输入中文'));
                    }else{
                        callback();
                    }
                });
            };
            return{
                page:1,
                pageSize:20,
                count:0,
                addVisable:false,
                lookList:[],
                imgPath:'',
                imgDialog:false,
            }
        },
        computed:{
            currency(){
                return this.lookData.currency_code?this.lookData.currency_code:''
            },
            stepsStatus(){
            	switch(this.lookData.status){
                    case '等待下单':
                        return 1;
                        break;
                    case '等待到货':
                        return 2;
                        break;
                    case '部分到货等待剩余':
                        return 3;
                        break;
                    case '部分到货不等待剩余':
                        return 4;
                        break;
                    case '全部到货':
                        return 5;
                        break;
                    case '待付款':
                        return 6;
                        break;
                    case '已付款':
                        return 7;
                        break;
                    case '部分付款':
                        return 8;
                        break;
                    case '拒绝付款':
                        return 9;
                        break;
                }
            },
            skuSum(){
                return this.lookList.reduce((total,sku)=>total+=sku.qty,0);
            }
        },
        methods:{
            open(){
                this.file = [];
                this.textarea = '';
                this.sku_init();
            },
            small_img(image){
                if(!!image){
                    if(/http:\/\/.+/.test(image)){
                        return image;
                    }
                    return `${config.apiHost}${image}`;
                }
                return '';
            },
            sku_image(image){
                if(!!image){
                    if(/http:\/\/.+/.test(image)){
                        return image.replace('60x60','200x200');
                    }
                    return `${config.apiHost}${image.replace('60x60','200x200')}`;
                }
                return '';
            },
            click_sku_img(image){
                this.imgPath = /http:\/\/.+/.test(image)?image.replace("_60x60","_500x500"):`${config.apiHost}${image.replace('60x60','500x500')}`;
                this.imgDialog = true;
            },
            search_img(image){
                if(/http:\/\/.+/.test(image)){
                    window.open(image.replace('60x60','500x500'));
                }else{
                    window.open(`${config.apiHost}${image.replace('60x60','500x500')}`);
                }
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.sku_init();
            },
            handleCurrentChange(val){
                this.page = val;
                this.sku_init();
            },
            //请求Sku
            sku_init(){
            	let data = {
                    page:this.page,
                    pageSize:this.pageSize
                };
                this.lookList = [];
                this.$http(api_get_virtual_purchase_order_id_detail,this.listId,data).then(res=>{
                    this.lookList=res.data;
                    this.count=res.count;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            //点击保存
            keep_edit(){
                this.addVisable=false;
            },
            cancel(){
                this.addVisable=false;
            },
            filterOrderNum(val){
                return val?`PO${val}`:val
            }
        },
        filters:{
            dataFilter(val,hasHMS){
                let str = hasHMS?'YYYY-MM-dd HH:mm:ss':'YYYY-MM-dd';
                return  datef(str, val);
            },
            filterImage(val){
                return val.replace("_60x60","_200x200");
            }
        },
        watch:{
            value(val){
                this.addVisable=val;
            },
            addVisable(val){
                this.$emit("input",val);
            }
        },
        props:{
            value:{},
            lookData:{
                type:Object
            },
            listId:{
                required:true
            },
        },
        components:{
            card,
            pageDialog,
            addGoods,
            uiInput,
            selectText:require("../../../components/select-text.vue").default,
            uiTip: require('../../../components/ui-tip.vue').default,
            integerInput: require('../../../components/integer-input.vue').default,
            allowCreateSelect: require('../../../components/allow-create-select.vue').default,
            imageUpload:require("../../customer-service/smt/inbox/image-upload.vue").default,
            labelItem:require('@/components/label-item').default,
            lookLogistics: require('../purchase/look-logistics').default,
            blowupImage:require("@/components/blowup-image.vue").default,
        }
    }
</script>
