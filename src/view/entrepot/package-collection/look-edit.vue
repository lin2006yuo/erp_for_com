<template>
    <page-dialog :title="trendAction.title"
                 size="large"
                 class="p-package-management"
                 v-model="visible"
                 :close-on-click-modal="false">
        <table class="right-table mt-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">集包单号</td>
                <td width="150">{{tableData.code}}</td>
                <td width="150">【主】邮寄方式</td>
                <td width="150">{{tableData.shipping_name}}</td>
                <td width="150">包裹数量</td>
                <td width="150">{{tableData.package_count}}</td>
                <td width="150">状态</td>
                <td width="150">{{tableData.status_txt}}</td>
            </tr>
            <tr>
                <td width="150">集包袋重量（kg）</td>
                <td width="150">{{tableData.collect_weight}}</td>
                <td width="150">包裹重量（kg）</td>
                <td width="150">{{tableData.package_weight}}</td>
                <td width="150">集包重量（kg）</td>
                <td width="150">{{tableData.weight}}</td>
                <td width="150">差异重量（kg）</td>
                <td width="150">{{tableData.diff_weight}}</td>
            </tr>
            <tr>
                <td width="150">集包人</td>
                <td width="150">{{tableData.creator}}</td>
                <td width="150">集包时间</td>
                <td width="150">{{tableData.create_time | filterTime}}</td>
                <td width="150">复核人</td>
                <td width="150">{{tableData.weigher}}</td>
                <td width="150">复核时间</td>
                <td width="150">{{tableData.weight_time | filterTime}}</td>
            </tr>
            <tr>
                <td width="150">交接人</td>
                <td width="150">{{tableData.handover}}</td>
                <td width="150">交接时间</td>
                <td width="150">{{tableData.handover_time | filterTime}}</td>
                <td width="150">作废人</td>
                <td width="150">{{tableData.deleter}}</td>
                <td width="150">作废时间</td>
                <td width="150">{{tableData.delete_time | filterTime}}</td>
            </tr>
        </table>
        <div class="border-box mt-sm">
            <div class="mt-sm ml-sm mb-sm">
                <label-item label="包裹号：">
                    <el-input v-model="searchData.package_number" @keyup.enter.native="init_tableList"></el-input>
                </label-item>
                <label-item label="面单号：" class="ml-sm">
                    <el-input v-model="searchData.shipping_number" @keyup.enter.native="init_tableList"></el-input>
                </label-item>
                <el-button type="primary"
                           size="mini"
                           class="ml-sm"
                           @click="init_tableList">搜索
                </el-button>
            </div>
            <el-button type="primary"
                       size="mini"
                       @click="batch_delete"
                       class="ml-xs"
                       :disabled="selected.length <= 0"
                       v-if="isEdit">批量移除</el-button>
            <el-table :data="tableList"
                      v-loading="loading"
                      v-resize="{height:185}"
                      class="scroll-bar mt-xs"
                      @selection-change="select"
                      element-loading-text="玩命加载中"
                      highlightCurrentRow>
                <el-table-column
                        v-if="isEdit"
                        width="30"
                        type="selection">
                </el-table-column>
                <el-table-column
                        inline-template
                        label="包裹号">
                    <div>
                        <ui-tip :is-operate="true"
                                :content="row.package_number"
                                :width="98"
                                @cur-click="parcel_information(row.package_number)">
                        </ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="面单号">
                    <div>
                        <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="120"
                        label="渠道/账号信息">
                    <div>
                        <ui-tip :content="`${row.channel}/${row.channel_account}`"
                                :width="98">
                        </ui-tip>
                    </div>
                </el-table-column><el-table-column
                    prop="shipping_name"
                    width="120"
                    label="邮寄方式">
            </el-table-column>
                <el-table-column
                        inline-template
                        width="120"
                        label="包裹订单状态">
                    <div>
                        <ui-tip :content="row.order_status"
                                :width="98">
                        </ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="120"
                        label="包裹状态">
                    <div>
                        <ui-tip :content="row.status_txt" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="包装时间">
                    <div>
                        <ui-tip :content="row.packing_time | filterTime" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="120"
                        label="包装人">
                    <div>
                        <ui-tip :content="row.packager_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="120"
                        label="是否出库">
                    <div>
                        <ui-tip :content="row.is_out" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        v-if="isEdit"
                        inline-template
                        width="100"
                        label="操作">
                    <div>
                        <el-button type="text"
                                   :disabled="tableData.status === 3"
                                   class="operate-color"
                                   @click="delete_picking(row)">移除
                        </el-button>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer">
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
        <el-pagination
                class="fr mt-sm"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="false"
                  @close-dialog="close_dialog"
                  @click-number="click_number"
                  :title="mdfTitle"></form-mdf>
        <parcel-information
                @close-parcel="close_parcel"
                @view-order="view_order"
                v-model="informationVisble"
                :order="order">
        </parcel-information>
    </page-dialog>
</template>
<style lang="stylus">
    .p-package-management{
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
                height:33px;
            }
            td:nth-child(2n+1){
                font-weight: 700;
                background-color: #f5f7fa;
            }
        }
    }
</style>
<script>
    import {api_get_package, url_package} from '../../../api/shipment'
    import {api_detail_collection, api_get_packagelist, api_delete_package, api_batch_delete} from '../../../api/package-collection'
    export default {
        permission: {
            url_package
        },
        data(){
            return {
                loading:false,
                visible: false,
                searchData:{
                    package_number:'',
                    shipping_number:'',
                    page:1,
                    pageSize:20
                },
                tableData:[],
                total:0,
                informationVisble:false,
                order:{},
                tableList:[],
                selected:[],
                mdfid:'',
                mdfValue:false,
                mdfTitle:'',
                isShow:false,
            }
        },
        mounted(){

        },
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
        },
        methods: {
            view_order(val){
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number(val){
                this.order = val.orderData;
                this.informationVisble = true;
            },
            close_dialog(){
                if(this.isShow) this.informationVisble = true;
            },
            close_parcel(){
                this.isShow = false;
            },
            init(){
                this.$http(api_detail_collection, this.trendAction.id).then(res=>{
                    if(res.status !== 3){
                        if(res.weight === 0){
                            res.weight = '';
                        }
                        if(res.diff_weight === 0){
                            res.diff_weight = '';
                        }
                    }
                    this.tableData = res;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_tableList(){
                Object.keys(this.searchData).forEach(key => {
                    if(typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.$http(api_get_packagelist, this.trendAction.id, this.searchData).then(res=>{
                    this.total = res.count;
                    this.tableList = res.list;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            select(selection){
                this.selected = selection;
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init_tableList();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init_tableList();
            },
            parcel_information(order){
                if (this.$hasPermission(this.apis.url_package)) {
                    this.$http(api_get_package, order).then(res=>{
                        this.order.id = order;
                        this.informationVisble = true;
                    }).catch(code => {
                        this.$message({type:"error",message:code.message || code});
                        this.informationVisble = false;
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            delete_picking(row){
                this.$confirm(`您将移除包裹${row.package_number},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_package, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.tableList.find((item, index)=>{
                            if(item.id === row.id){
                                this.tableList.splice(index, 1);
                            }
                            return item.id === row.id;
                        })
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            batch_delete(){
                let id = this.selected.map(row=>{
                    return row.id
                });
                let data = {
                    id:id,
                    package_collection_id:this.trendAction.id
                };
                this.$confirm(`您将移除这${this.selected.length}个包裹,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_batch_delete, data).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        data.id.forEach(row=>{
                            this.tableList.find((item, index)=>{
                                if(row === item.id){
                                    this.tableList.splice(index, 1);
                                }
                                return row === item.id;
                            })
                        })
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        computed: {
            isEdit(){
                return this.trendAction.value === 'edit';
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.init();
                    this.init_tableList();
                } else {
                    this.searchData = {
                        package_number:'',
                        shipping_number:'',
                        page:1,
                        pageSize:20
                    }
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            trendAction:{},
            editData:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            parcelInformation:require('../placeorder/parcel-information.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            formMdf: require("../../order/local/form-mdf.vue").default,
        },
    }
</script>
