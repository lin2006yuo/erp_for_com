<template>
    <div class="self-popover">
        <page-dialog :title="title" @open="open" v-model="dialog" size="large" width="1000px"
                     :close-on-click-modal="false">
            <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
            <template v-if="operationView!==5">
                <div class="mb-sm">
                    <div v-if="operationView===1||operationView===4" class="detail-font">
                        <el-row>
                            <label class="ml-sm ">SKU：{{form.sku}}</label>
                            <label class="ml-lg"  v-if="operationView!==4">备货总数：{{form.sku_in_quantity}}</label>
                            <label class="ml-lg"  v-if="operationView===4">申请备货总数：{{form.sku_quantity}}</label>
                            <label class="ml-lg" v-if="operationView===4">审核备货总数：{{form.sku_in_quantity}}</label>
                        </el-row>
                    </div>
                    <div v-else>
                        <el-row class="detail-font">
                            <el-col :span="12">
                                <label class="ml-sm">
                                    <div class="inline t-right bold-font default-width">SKU：</div>
                                    {{form.sku}}
                                </label>
                            </el-col>
                            <el-col :span="12">
                                <label class="ml-sm">
                                    <div class="inline t-right bold-font default-width">SKU状态：</div>
                                    {{form.sku_status_label }}
                                </label>
                            </el-col>
                        </el-row>
                        <el-row class="detail-font ">
                            <el-col :span="12">
                                <label class="ml-sm default-width">
                                    <div class="inline t-right bold-font default-width">日均销量：</div>
                                    {{form.daily_sale}}
                                </label>
                            </el-col>
                            <el-col :span="12">
                                <label class="ml-sm default-width">
                                    <div class="inline t-right bold-font default-width">在途库存：</div>
                                    {{form.intransit_stock_qty }}
                                </label>
                            </el-col>
                        </el-row>
                        <el-row class="detail-font">
                            <el-col :span="12">
                                <label class="ml-sm default-width">
                                    <div class="inline t-right bold-font default-width">供应商名称：</div>
                                    {{form.supplier}}
                                </label>
                            </el-col>
                            <el-col :span="12">
                                <label class="ml-sm default-width">
                                    <div class="inline t-right bold-font default-width">备货总数：</div>
                                    {{form.sku_in_quantity }}
                                </label>
                            </el-col>
                        </el-row>
                        <el-row class="detail-font">
                            <el-col :span="12">
                                <label class="ml-sm default-width">
                                    <div class="inline t-right bold-font default-width">中转仓：</div>
                                    {{form.transit_warehouse}}
                                </label>
                            </el-col>
                            <el-col :span="12">
                                <label class="ml-sm default-width">
                                    <div class="inline t-right bold-font default-width">中转仓可用库存：</div>
                                    {{form.transit_warehouse_available_qty }}
                                </label>
                            </el-col>
                        </el-row>
                        <el-row class="detail-font">
                            <el-col :span="12" v-for="(row,index) in form.availableList" :key="row.id">
                                <label class="ml-sm default-width">
                                    <div class="inline t-right bold-font default-width">{{row.warehouse}}可用库存：</div>
                                    {{row.quantity}}
                                </label>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <el-row>
                    <el-table
                        class="scroll-bar"
                        :data="form.list"
                        :highlight-current-row="true"
                        element-loading-text="玩命加载中..."
                    >
                        <div slot="empty" class="no-data-reminder">
                            <i></i>
                            {{emptyText}}
                        </div>
                        <el-table-column label="备货计划" inline-template row-key="company_name" >
                            <div>
                                <ui-tip :content="row.code" :width="100"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column label="创建人" inline-template row-key="company_name">
                            <div>
                                <ui-tip :content="row.creator" :width="130"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column label="备货仓库" inline-template row-key="company_name">
                            <div>
                                <ui-tip :content="row.warehouse" :width="100"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column label="中转仓" inline-template row-key="company_name" width="130">
                            <div>
                                <ui-tip :content="row.transit_warehouse" :width="130"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column label="备货仓库可用库存" v-if="title==='审核备货建议'||title==='查看备货建议'" inline-template row-key="company_name" width="130">
                            <div>
                                <ui-tip :content="row.warehouse_available_qty" :width="130"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column :label="operationView===4?'申请备货数量':'备货数量'" inline-template row-key="company_name">
                            <div v-if="operationView===4">
                                <ui-tip :content="row.quantity" :width="100"></ui-tip>
                            </div>
                            <div v-else>
                                <ui-tip :content="row.in_quantity" :width="100"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column label="审核备货数量" inline-template row-key="company_name" v-if="operationView===4">
                            <div>
                                <ui-tip :content="row.in_quantity" :width="100"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column label="审核备货数量" inline-template row-key="company_name" v-if="operationView===3">
                            <div>
                                <el-input v-model="row.new_quantity" type="number" min='0' auto-complete="off" :class="row.isBeyond?'red-error':''" @change="monitor_change(row)"></el-input>
                            </div>
                        </el-table-column>
                        <el-table-column label="批注" width="250" inline-template row-key="company_name"  v-if="operationView===3">
                            <div class="operation">
                                <el-input :class="row.isRequired?'postilRed':'postilContent'" v-model="row.remark" placeholder="请填写批注" @change="monitor_change(row)"></el-input>
                                <el-button class="postilBtn" type="primary"  size="mini" @click="postilBtn(row.remark)">同步批注</el-button>
                            </div>
                        </el-table-column>
                    </el-table>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <permission v-if="operationView===3"
                                tag="request-button"
                                class="ml-sm inline"
                                :route="apis.url_develop_review"
                                req-key="url_develop_review"
                                :mintime="200"
                                :disabled="isEmpty"
                                @click.native="auditBtn('ValidateForm')">审核完成
                    </permission>
                    <el-button size="mini" @click.native="dialog=false">取 消</el-button>
                </div>
            </template>
            <!--分配详情-->
            <template v-else>
                <div class="mb-sm">
                    <el-row class="detail-font">
                        <el-col :span="12">
                            <label class="ml-sm">
                                <span class="bold-font">备货计划：</span>
                                {{form.code}}
                            </label>
                        </el-col>
                        <el-col :span="12">
                            <label class="ml-sm">
                                <span class="bold-font">创建人：</span>
                                {{form.creator }}
                            </label>
                        </el-col>
                    </el-row>
                    <el-row class="detail-font">
                        <el-col :span="12">
                            <label class="ml-sm">
                                <span class="bold-font">备货仓库：</span>
                                {{form.warehouse}}
                            </label>
                        </el-col>
                        <el-col :span="12">
                            <label class="ml-sm">
                                <span class="bold-font">中转仓：</span>
                                {{form.transit_warehouse }}
                            </label>
                        </el-col>
                    </el-row>
                </div>
                <el-row>
                    <el-table
                        class="scroll-bar"
                        border
                        :data="[form]"
                        ref="dataList"
                        :first-loading="firstLoading"
                        :highlight-current-row="true"
                        v-loading="loading"
                        element-loading-text="玩命加载中..."
                        style="width: 100%">
                        <!--产品SKU/别名-->
                        <el-table-column label="产品SKU/别名" inline-template>
                            <div>
                                <div class="p-suggest-td-text" :title="row.sku">{{row.sku}}</div>
                                <div class="p-suggest-td-text" :title="row.sku_alias|filterAlias">
                                    {{row.sku_alias|filterAlias}}
                                </div>
                            </div>
                        </el-table-column>
                         <!--图片-->
                        <el-table-column label="图片"  inline-template>
                            <el-popover
                                placement="right"
                                width="200"
                                trigger="hover">
                                <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                                <div slot="reference" style="position: relative;">
                                    <img v-lazy="row.thumb"
                                         @click="search_img(row.thumb)"
                                         width="60"
                                         height="60"
                                         style="vertical-align: middle;">
                                </div>
                            </el-popover>
                        </el-table-column>
                        <!--产品名称-->
                        <el-table-column label="产品名称" class="t-right"  inline-template>
                            <span :title="row.sku_name">{{row.sku_name}}</span>
                        </el-table-column>
                        <!--申请备货数量-->
                        <el-table-column label="申请备货数量"  inline-template>
                            <span :title="row.quantity">{{row.quantity}}</span>
                         </el-table-column>
                        <!--审核备货数量-->
                        <el-table-column label="审核备货数量" inline-template>
                            <span :title="row.in_quantity">{{row.in_quantity}}</span>
                         </el-table-column>
                        <!--中转仓锁定库存-->
                        <el-table-column label="中转仓锁定库存"  inline-template>
                            <span :title="row.allocated_qty">{{row.allocated_qty}}</span>
                        </el-table-column>
                        <template v-if="hasData">
                            <!--中山仓调拨数量-->
                            <el-table-column  inline-template v-for="(item,key,index) in form.allocation_list" :key="key" :label="item.warehouse+'调拨数量'">
                                <div>
                                    <div v-if="Number(item.quantity)>0&&item.list.length">
                                        <el-popover placement="right"
                                                    :open-delay="500"
                                                    trigger="click">
                                            <el-table :data="item.list" class="allocation-popover">
                                                <el-table-column label="调拨计划单号" prop="order_code" min-width="100"></el-table-column>
                                                <el-table-column label="调拨数量" prop="quantity"></el-table-column>
                                                <el-table-column label="状态" prop="status"></el-table-column>
                                            </el-table>
                                            <div class="inline" style="vertical-align: bottom;" slot="reference">
                                                <span class="operate">{{item.quantity}}</span>
                                            </div>
                                        </el-popover>
                                    </div>
                                    <div v-else>
                                        <span class="operate">{{item.quantity}}</span>
                                    </div>
                                </div>
                            </el-table-column>
                        </template>
                        <!--采购计划数量-->
                        <el-table-column  inline-template label="采购计划数量">
                            <div>
                                <div v-if="Number(row.purchase_plan_num)>0&&row.purchase_plan_list.length" class="purchase_plan_style">
                                    <el-popover placement="right"
                                                :open-delay="500"
                                                trigger="click">
                                        <el-table :data="row.purchase_plan_list" class="allocation-popover">
                                            <el-table-column label="采购计划编号" prop="code" min-width="100"></el-table-column>
                                            <el-table-column label="采购数量" prop="quantity"></el-table-column>
                                            <el-table-column label="状态" prop="status"></el-table-column>
                                        </el-table>
                                        <div class="inline" style="vertical-align: bottom;" slot="reference">
                                            <span class="operate">{{row.purchase_plan_num}}</span>
                                        </div>
                                    </el-popover>
                                </div>
                                <div v-else>
                                    <span class="operate">{{row.purchase_plan_num}}</span>
                                </div>
                            </div>
                        </el-table-column>
                        <!--采购单数量-->
                        <el-table-column label="采购单数量" inline-template>
                            <div>
                                <div v-if="Number(row.purchase_order_num)>0&&row.purchase_order_list.length">
                                    <el-popover placement="right"
                                                :open-delay="500"
                                                trigger="click">
                                        <el-table :data="row.purchase_order_list"   class="allocation-popover">
                                            <el-table-column label="采购单号" prop="code" min-width="100"></el-table-column>
                                            <el-table-column label="采购数量" prop="qty"></el-table-column>
                                            <el-table-column label="入库数量" prop="in_qty"></el-table-column>
                                            <el-table-column label="状态" prop="status"></el-table-column>
                                        </el-table>
                                        <div class="inline" style="vertical-align: bottom;" slot="reference">
                                            <span class="operate">{{row.purchase_order_num}}</span>
                                        </div>
                                    </el-popover>
                                </div>
                                <div v-else>
                                    <span class="operate">{{row.purchase_order_num}}</span>
                                </div>
                            </div>
                        </el-table-column>
                    </el-table>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" @click.native="dialog=false">取 消</el-button>
                </div>
            </template>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .self-popover{
        .default-width {
            width: 50%;
        }
        .detail-font{
            font-size: 1.3rem;
        }
        .postilContent {
            width: 60%;
            display inline-block;
        }
        .red-error{
            .el-input__inner{
                border-color: #f00 !important;
            }
        }
        .el-popover .el-table--enable-row-hover .el-table__body-wrapper{
            height:auto!important;
        }
        .postilRed{
            width: 60%;
            display inline-block;
            .el-input__inner{
                border-color: #f00 !important;
            }
        }
        .postilBtn{
            width:30%;
            height :26px;
            display inline-block;
            margin :0;
            margin-left :5px;
            text-align center;
        }
        .allocation-popover{
            .el-table__body-wrapper{
                height :auto !important
            }
        }
        .operation{
            width:100%;
            height: 100%
        }
    }

</style>
<script>
    import {api_develop_review,url_develop_review} from '../../../api/purchasing'
    export default {
        permission: {
            url_develop_review
        },
        data() {
            return {
                visible:false,
                imgPath: '',
                imgDialog: false,
                dialog: false,
                channels: [],
                content:'',
                SelectedIndex:0,
                isAudit:false
            }
        },
        created() {

        },
        mounted() {

        },
        methods: {
            open() {
                this.content=''
            },
            isFloat(val){
              return /^-?\d*\.\d+$/.test(val)
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
//                  --------------------------------------审核
            auditBtn(formName){
                if (!this.form.list.every(row=>row.isRequired===false)) {
                    this.$message({type:'warning',message:'审核备货数量与申请备货数量不一致，请填写批注'});
                    this.$reqKey('url_develop_review', false);
                }else {
                    if(!this.form.list.every(row=>row.isBeyond===false)){
                        this.$message({type:'warning',message:'审核备货数量不可大于申请备货数量或小于0与浮点数'});
                        this.$reqKey('url_develop_review', false);
                    }else {
                        this.$confirm(`此操作为审批通过，确认此操作吗？`, "提示", {
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                            type: 'warning'
                        }).then(() => {
                            this.audit();
                        }).catch((code) => {
                            console.log(code);
                            this.$message({type: "info", message: `已取消操作`})
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_develop_review', false);
                            }, 200);
                        });
                    }
                }
            },
            audit(){          //-------------------------------------<!--审核-->
                let data={review_list:[]};
                data.review_list=window.clone(this.form.list);
                data.review_list.forEach(row=>{
                    delete row.code;
                    delete row.creator;
                    delete row.warehouse;
                    delete row.transit_warehouse;
                    delete row.warehouse_available_qty;
                    delete row.isRequired;
                    delete row.isEmpty;
                    delete row.isBeyond;
                    row.quantity=parseInt(row.new_quantity);
                    delete row.new_quantity;
                });
                this.$http(api_develop_review,data).then(res=>{
                    this.$message({type:'success',message:res.message});
                    this.dialog=false;
                    this.$emit('update-data',res);
                }).catch(code=>{
                    this.$reqKey('url_develop_review', false);
                    this.$message({type:'error',message:code.message||code});
                });
            },
            monitor_change(row){                //满足以下条件不做验证
                row.isRequired = (Number(row.new_quantity)<Number(row.in_quantity)&&Number(row.new_quantity)>0)||Number(row.new_quantity)===0;
                row.isEmpty=row.new_quantity==="";
                if (row.remark!==''&& row.isRequired){
                    row.isRequired=false
                }
                if (row.new_quantity===""){
                    this.$message({type:'warning',message:'审核备货数量不能为空'})
                }
                row.isBeyond=Number(row.new_quantity)>Number(row.in_quantity)||Number(row.new_quantity)<0||this.isFloat(Number(row.new_quantity))
            },
            postilBtn(remark){
                this.$confirm(`此操作为同步批注，确认此操作吗？`, "提示", {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.$emit('update-remark',remark)
                }).catch((code) => {
                    console.log(code);
                    this.$message({type: "info", message: `已取消操作`})
                })
            }
        },
        filters: {
            filterAlias(val) {
                return Array.isArray(val) ? val.join(',') : val
            },
        },
        watch: {
            value(val) {
                this.dialog = val;
            },
            dialog(val) {
                this.$emit('input', val)
            }
        },
        computed: {
            isEmpty(){
                if(this.form.list){
                    return this.form.list.some(row=>row.isEmpty===true)
                }
            },
            hasData(){
                if (this.form.allocation_list instanceof Array) {
                    return this.form.allocation_list.length
                }else {
                    return this.form.allocation_list
                }
            },
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            },
            operationView(){
                if (this.title==='查看备货总量详情'){
                    return 1
                }else if(this.title==='查看备货建议'){
                    return 2
                }else if (this.title==='查看审核备货总数') {
                    return 4
                }else if (this.title==='查看分配详情') {
                    return 5
                }else{
                    return 3
                }
            }
        },
        props: {
            title:{
                required:true
            },
            value: {},
            form: {},
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components: {
            blowupImage: require("@/components/blowup-image").default,
            uiTable:require('@/components/ui-table').default,
            pageDialog: require('../../../components/page-dialog.vue').default
        }
    }
</script>
