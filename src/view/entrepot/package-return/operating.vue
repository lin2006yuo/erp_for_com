<template>
    <page-dialog :title="action.title"
                 size="large"
                 v-model="visible"
                 class="p-parcel-returned-manage"
                 :close-on-click-modal="false">
        <table class="right-table" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">退货单号</td>
                <td width="150">{{operatingData.package_return_number}}</td>
                <td width="150">状态</td>
                <td width="150">{{operatingData.status_name}}</td>
            </tr>
            <tr>
                <td width="150">面单号</td>
                <td width="150">{{operatingData.shipping_number}}</td>
                <td width="150">退货类型</td>
                <td width="150">{{operatingData.return_type}}</td>
            </tr>
            <tr>
                <td width="150">退货原因</td>
                <td colspan="3">{{operatingData.return_reason}}</td>
            </tr>
            <tr>
                <td width="150">创建人</td>
                <td width="150">{{operatingData.creator_id}}</td>
                <td width="150">创建时间</td>
                <td width="150">{{operatingData.create_time | filterTime}}</td>
            </tr>
            <tr>
                <td width="150">更新人</td>
                <td width="150">{{operatingData.updater_id}}</td>
                <td width="150">更新时间</td>
                <td width="150">{{operatingData.update_time | filterTime}}</td>
            </tr>
        </table>
        <tab-item label="包裹信息" :def="true" class="mt-sm" id="package" v-if="!!operatingData.package">
            <table class="right-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="150">包裹号</td>
                    <td width="150">
                        <ui-tip :is-operate="true"
                                :content="operatingData.package.package_number"
                                :width="98"
                                @cur-click="parcel_information(operatingData.package.package_number)">
                        </ui-tip>
                    </td>
                    <td width="150">订单号</td>
                    <td width="150">
                        <ui-tip :is-operate="true"
                                :content="operatingData.package.order_number"
                                :width="98"
                                @cur-click="show_order(operatingData.package)">
                        </ui-tip>
                    </td>
                </tr>
                <tr>
                    <td width="150">平台</td>
                    <td width="150">{{operatingData.package.channel_name}}</td>
                    <td width="150">邮寄方式</td>
                    <td width="150">{{operatingData.package.shipping_name}}</td>
                </tr>
                <tr>
                    <td width="150">国家</td>
                    <td width="150">{{operatingData.package.country_code}}</td>
                    <td width="150">发货时间 </td>
                    <td width="150">{{operatingData.package.shipping_time | filterTime}}</td>
                </tr>
            </table>
        </tab-item>
        <tab-item label="重发信息" :def="true" class="mt-sm" id="again" v-if="!!operatingData.repeat">
            <table class="right-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="150">新邮寄方式</td>
                    <td width="150">{{operatingData.repeat.new_shipping_name}}</td>
                    <td width="150">新面单号</td>
                    <td width="150">{{operatingData.repeat.new_shipping_number}}</td>
                </tr>
                <tr>
                    <td width="150">新发货时间</td>
                    <td width="150" colspan="3">{{operatingData.repeat.new_shipping_time | filterTime}}</td>
                </tr>
            </table>
        </tab-item>
        <tab-item label="日志" :def="false" class="mt-sm" id="dialog">
            <el-table :data="operatingData.log"
                      height="120"
                      v-loading="loading"
                      element-loading-text="玩命加载中"
                      class="scroll-bar"
                      highlight-current-row>
                <el-table-column
                        inline-template
                        label="操作">
                    <div>
                        <ui-tip :content="row.remark" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="状态">
                    <div>
                        <ui-tip :content="row.process" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="操作人">
                    <div>
                        <ui-tip :content="row.operator" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="操作时间">
                    <div>
                        <ui-tip :content="row.create_time | filterTime" :width="88"></ui-tip>
                    </div>
                </el-table-column>
            </el-table>
        </tab-item>
        <div slot="footer">
            <el-button @click.native="remark" type="primary" size="mini">备注</el-button>
            <el-button @click.native="mark_reissued" type="primary" size="mini" v-if="!isLook && operatingData.status === 0">标记待重发</el-button>
            <el-button @click.native="mark_warehouse" type="primary" size="mini" v-if="!isLook && operatingData.status === 0">标记待入库</el-button>
            <el-button @click.native="visible = false" size="mini">关闭</el-button>
        </div>
        <!--原因-->
        <div v-if="showRemark" class="el_card_remark">
            <div class="remark-sale-look">
                <label class="remark-sale-header">备注: </label>
                <el-form class="remark-sale-body">
                    <el-form-item>
                        <el-input type="textarea" v-model="remark_content" :maxlength="225" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                </el-form>
                <div class="remark-sale-footer">
                    <div class="fr">
                        <request-button class="small-button submit" req-key="saveMarkAdd" @click="saveMark">确定</request-button>
                        <button class="small-button cancel" type="button" @click="showRemark=false">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-parcel-returned-manage{
        .border-box{
            border-left:1px solid #d3dce6;
            border-top:1px solid #d3dce6;
            border-right:1px solid #d3dce6;
        }
        .right-table{
            width: 100%;
            border-collapse:collapse;
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
        .table_head{
            height:32px;
            line-height: 32px;
            border:1px solid #e0e6ed;
            background-color: #6295E9;
            color:white;
        }
        .c-label-item{

        }
        .c-label-item >*{
            vertical-align: baseline;
        }
        .el-col-8{
            height:30px;
        }
        .tab-item{
             .body{
                 padding:0;
             }
         }
        .el_card_remark{
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 140px;
                position: absolute;
                bottom: 50px;
                right: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #fff;
                padding: 0 5px;
                z-index: 999;
                .remark-sale-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 25px;
                    padding-left: 10px;
                    padding-top: 5px;
                    background-color: #fff;
                }
                .remark-sale-body {
                    overflow-y: auto;
                    position: absolute;
                    top: 30px;
                    left: 0;
                    right: 0;
                    bottom: 30px;
                    padding: 0 5px;
                }
                .remark-sale-footer {
                    position: absolute;
                    height: 25px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    background-color: #fff;
                }
            }
        }
    }
</style>
<script>
    import {api_post_waitreissued, api_post_waitstorage, api_post_note} from '@/api/package-return'
    export default {
        data(){
            return {
                visible: false,
                loading: false,
                shippingVisible: false,
                showRemark:false,
                remark_content:''
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
            parcel_information(row){
                this.$emit('parcel-information', row);
            },
            show_order(row){
                this.$emit('show-order',row);
            },
            mark_reissued(){
                this.$emit('mark-reissued', this.action, this.operatingData.package);
            },
            mark_warehouse(){
                this.$emit('mark-warehouse', this.action, this.operatingData.package.package_number);
            },
            remark(){
                this.showRemark = true;
            },
            saveMark(){
                typeof this.remark_content === 'string' && (this.remark_content = this.remark_content.trim());
                this.$http(api_post_note, this.operatingData.id, {note:this.remark_content}).then(res=>{

                    this.remark_content = '';
                    this.$message({type:"success",message:res.message || res});
                    this.showRemark = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`saveMarkAdd`, false);
                    },200);
                });
            }
        },
        computed: {
            isLook(){
                return this.action.value === 'look';
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.showRemark = false;
                    this.remark_content = '';
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            action:{},
            operatingData:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
            tabItem:require('@/components/tab-item.vue').default,
        },
    }
</script>
