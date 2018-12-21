<template>
    <div>
        <page-dialog title="" size="full" v-model="visible" :close-on-click-modal="false">
            <el-card v-for="(data,data_i) in list" :key="data_i">
                <p class="tracking"><span>查看运单号:{{purchaseNote.tracking_number}}明细</span></p>
                <table class="line search-table" cellspacing="0">
                    <tr>
                        <td width="120" class="t-right">接收员：</td>
                        <td>{{purchaseNote.creator_user_name}}</td>
                        <td class="t-right">接收时间：</td>
                        <td>{{purchaseNote.create_time_str}}</td>
                    </tr>
                    <tr>
                        <td class="t-right">采购员：</td>
                        <td>
                            {{purchaseNote.purchaser_user_name_list}}
                        </td>
                        <td class="t-right">收货台：</td>
                        <td>{{purchaseNote.receiving_platform}}</td>
                    </tr>
                    <tr>
                        <td class="t-right">仓库：</td>
                        <td>{{purchaseNote.warehouse_name}}</td>
                        <td class="t-right">重量：</td>
                        <td>{{(purchaseNote.purchase_parcel_weight)/1000}}kg</td>
                    </tr>
                </table>
                <div>
                    <trends-select class="inline mb-sm"
                                   @trigger="p_action($event)"
                                   :selects="printallOptions"
                                   type="primary">
                    </trends-select>
                </div>
                <el-card v-for="(item, index) in data" class="mb-md" :key="item.purchase_order">
                    <p style="margin-top: 0;">
                        采购单ID：<span class="mr-sm">{{item.purchase_order}}</span>采购单号：<span>{{item.purchase_parcel}}</span></p>
                        <el-table
                                :data="item.parcel_skus"
                                class="mt-xs scroll-bar"
                                ref="table"
                                @selection-change="handle_selection_change(index, $event, item)"
                                highlightCurrentRow
                                max-height="300">
                            <el-table-column
                                    type="selection"
                                    width="35">
                            </el-table-column>
                            <el-table-column label="图片"
                                             width="80">
                                <template slot-scope="scope">
                                    <el-popover
                                            placement="right"
                                            trigger="hover">
                                        <img :src="scope.row.thumb | filterImage" width="200px" height="200px">
                                        <span slot="reference">
                                            <img :src="scope.row.thumb"
                                                 @click="search_img(scope.row.thumb)"
                                                 v-if="scope.row.thumb"
                                                 height="60px" width="60px" style="border:none">
                                        </span>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="SKU">
                                <div>
                                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                                </div>
                            </el-table-column>
                            <el-table-column
                                    min-width="100"
                                    inline-template
                                    label="名称">
                                <div>
                                    {{row.sku_name}}
                                </div>
                            </el-table-column>
                            <el-table-column
                                    width="80"
                                    prop="qty"
                                    label="采购数量">
                            </el-table-column>
                            <el-table-column
                                    width="80"
                                    inline-template
                                    label="已接收数量">
                                <div>
                                    <ui-tip :content="row.accumulative_total | isZero" :width="98"></ui-tip>
                                </div>
                            </el-table-column>
                            <el-table-column
                                    width="80"
                                    prop="accepted_goods_qty"
                                    label="本次良品">
                            </el-table-column>
                            <el-table-column
                                    width="80"
                                    prop="defective_product_qty"
                                    label="本次次品">
                            </el-table-column>
                            <el-table-column
                                    min-width="100"
                                    inline-template
                                    label="录入时间">
                                <div>
                                    <ui-tip :content="row.create_time_str" :width="98"></ui-tip>
                                </div>
                            </el-table-column>
                            <el-table-column
                                    min-width="80"
                                    prop="operator_user_name"
                                    label="录入员">
                            </el-table-column>
                            <el-table-column
                                    width="80"
                                    label="质检类型">
                                <template slot-scope="scope">
                                    <span>{{scope.row.check_type | checkType}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    width="80"
                                    inline-template
                                    label="操作">
                                <el-button type="primary"
                                           size="mini"
                                           @click="print_label(row, item)">打印标签</el-button>
                            </el-table-column>
                        </el-table>
                </el-card>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="visible = false" size="mini">关 闭</el-button>
            </div>
            <preview v-model="printVisable"
                     :table-data="tableData"
                     :print-data="printData"
                     :relevance="relevance"
                     :preview-show="previewShow"
                     ref="preview"></preview>
            <batch_preview v-model="batch_printVisable"
                           :batch-show="batchShow"
                           :batch-data="batchData"
                           ref="batch_preview">
            </batch_preview>
            <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .search-table td {
        height:30px;
    }
    .search-table{
        width: 100%;
    }
    .tracking{
        position: absolute;
        top:0;
        z-index: 999;
    }
</style>
<script>
    import {api_lable_data, api_print_label, api_print_lable_box, url_print_label, url_print_lable_box} from '../../../../api/arrival-parcel'
    export default {
        permission:{
            url_print_label,
            url_print_lable_box
        },
        data(){
            return {
                visible: false,
                listData:[],
                printData:{},
                tableData:[],
                printVisable:false,
                batch_printVisable:false,
                select_sku:[],
                batchData:[],
                list:[],
                relevance:false,
                previewShow:false,
                batchShow:false,
                imgDialog:false,
                imgPath:'',
                printallButtons:[
                    {label:'批量打印标签',value:1,apis:url_print_label,
                        p_action(){
                            let printList = [];
                            console.log(this.select_sku)
                            for(let i = 0; i < this.select_sku.length; i++){
                                for(let j = 0; j < this.select_sku[i].length; j++){
                                    let post={};
                                    post.sku_id = this.select_sku[i][j].sku_id;
                                    post.purchase_order_id = this.select_sku[i][j].purchase_order_id;
                                    post.num = this.select_sku[i][j].accepted_goods_qty;
                                    post.label_type = 1;
                                    post.purchase_parcel_code = this.select_sku[i][j].purchase_parcel_code;
                                    printList.push(post);
                                }
                            }
                            if(!printList.length){
                                this.$message({type:"warning",message:'请选择要打印的sku'});
                                return false;
                            }
                            console.log('printList',printList);
                            this.$http(api_print_label,{json_data:printList}).then(res=>{
                                this.batchData = res;
                                this.batchShow = true;
                                this.batch_printVisable=true;
                                this.$refs.batch_preview.get_template(1);
                                console.log('batchData',this.batchData)
                                if(this.batchData.default_temp_id){
                                    this.$nextTick(()=>{
                                        this.$refs.batch_preview.change_print();
                                    })
                                }
                            }).catch(code=>{
                                this.$message({type: "error", message: code.message || code})
                            })
                        }
                    },
                    {label:'批量打印箱唛',value:2,apis:url_print_lable_box,
                        p_action(){
                            let printList = [];
                            if(!this.select_sku.length){
                                this.$message({type:"warning",message:'请选择要打印的sku'});
                                return false;
                            }
                            console.log(this.select_sku)
                            for(let i = 0; i < this.select_sku.length; i++){
                                for(let j = 0; j < this.select_sku[i].length; j++){
                                    let post={};
                                    post.sku_id = this.select_sku[i][j].sku_id;
                                    post.purchase_order_id = this.select_sku[i][j].purchase_order_id;
                                    post.num = this.select_sku[i][j].num;
                                    post.label_type = 2;
                                    post.purchase_parcel_code = this.select_sku[i][j].purchase_parcel_code;
                                    console.log(post);
                                    printList.push(post);
                                }
                            }
                            console.log('printList',printList);
                            this.$http(api_print_label,{json_data:printList}).then(res=>{
                                this.batch_printVisable=true;
                                this.batchShow = true;
                                this.$refs.batch_preview.get_template(2);
                                console.log('batchData',this.batchData);
                                if(this.batchData.default_temp_id){
                                    this.$nextTick(()=>{
                                        this.$refs.batch_preview.change_print();
                                    })
                                }
                            }).catch(code=>{
                                this.$message({type: "error", message: code.message || code})
                            })
                        }
                    }
                ]
            }
        },
        mounted(){},
        filters:{
            checkType(val){
                switch(val){
                    case 1:
                        return '全检';
                    case 2:
                        return '抽检';
                    case 3:
                        return '免检';
                }
            },
            isZero(val){
                if(val === 0){
                    return '';
                } else {
                    return val;
                }
            },
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
        },
        methods: {
            init(){
                let ret = [];
                if(this.purchaseNote.purchase_order_ids) {
                    console.log('purchaseNote', this.purchaseNote);
                    const ids = this.purchaseNote.purchase_order_ids.split(",");
                    const codes = this.purchaseNote.purchase_order_codes.split(",");
                    const users = this.purchaseNote.purchaser_user_ids.split(",");
                    this.purchaseNote.purchaser_user_name_list = this.purchaseNote.purchaser_user_name_list.toString();
                    ret.push(ids.map((id, index) => {
                        const ele = {
                            id: this.purchaseNote.id,
                            tracking_number: this.purchaseNote.tracking_number,
                            purchase_parcel_code:'PO' + id,
                            purchase_order: id,
                            purchase_parcel: 'PO' + id,
                            update_user_id: this.purchaseNote.update_user_id,
                            create_time: this.purchaseNote.create_time,
                            update_time: this.purchaseNote.update_time,
                            purchase_parcel_weight: this.purchaseNote.purchase_parcel_weight,
                            purchaser_user_ids: users[index],
                            parcel_skus: this.purchaseNote[`parcel_skus-${id}`]
                        };
                        return ele;
                    }))
                }
                console.log('ret',ret)
                this.list = ret;
            },
            print_label(row, item){
                this.tableData = [];
                let post={
                    sku_id:row.sku_id,
                    purchase_order_id:item.purchase_order,
                    num: row.accepted_goods_qty,
                    label_type:1,
                    purchase_parcel_code:this.purchaseNote.purchase_parcel_code,
                };
                this.$http(api_lable_data,post).then(res=>{
                    this.$set(this,'printData',res);
                    this.tableData.push(res);
                    this.printVisable=true;
                    this.previewShow = true;
                    this.$refs.preview.get_template(1);
                    if(this.printData.default_temp_id){
                        this.$nextTick(()=>{
                            this.$refs.preview.change_print();
                        })
                    }
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            //批量打印
            p_action(act){
                act.p_action.call(this);
            },
            handle_selection_change(index, select, item) {
                this.select_sku[index] = select;
                this.select_sku[index].forEach(row=>{
                    this.$set(row, 'purchase_order_id', item.purchase_order);
                    this.$set(row, 'purchase_parcel_code', item.purchase_parcel_code);
                });
                console.log('select',this.select_sku);
            },
            //查看大图
            search_img(image){
                this.imgPath = image.replace("_100x100","_500x500");
                this.imgDialog = true;
            },
        },
        computed: {
            printallOptions(){
                return this.printallButtons.filter(row=>{
                    return this.$hasPermission(row.apis);
                })
            },
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.init();
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            purchaseNote:{},
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            uiTip: require("../../../../components/ui-tip.vue").default,
            preview:require('../arrival/preview.vue').default,
            batch_preview:require('../arrival/batch_preview.vue').default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
        }
    }
</script>
