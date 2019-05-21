<template>
    <div class="c-${NAME}">
        <el-table
            class="scroll-bar"
            :data="dataList"
            border
            ref="dataList"
            :highlight-current-row="true"
            v-loading="isLoading"
            element-loading-text="玩命加载中..."
            style="width: 100%"
            v-resize="{height:41}"
            @selection-change="selection_change"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection"></el-table-column>
            <el-table-column
                align="center"
                label="订单号"
                min-width="130"
                inline-template>
                <ui-tips :width="98" :content="row.order_number" @click.native="click_order(row)" :is-operate="true"
                         style="cursor:pointer"></ui-tips>
            </el-table-column>
            <el-table-column
                align="center"
                label="包裹号"
                min-width="80"
                inline-template>
                <ui-tips :width="98" :content="row.number" style="cursor:pointer"
                         @click.native="parcel_information(row.number)" :is-operate="true"></ui-tips>
            </el-table-column>
            <el-table-column label="平台/站点" inline-template   min-width="70">
                <div class="p-table-list-td-text" :title="row.channel_id|emptyByDefault">{{row.channel_id|emptyByDefault}}/{{row.site|emptyByDefault}}
                </div>
            </el-table-column>
            <el-table-column label="账号简称" inline-template   min-width="50">
                <div class="p-table-list-td-text" :title="row.account|emptyByDefault">{{row.account|emptyByDefault}}
                </div>
            </el-table-column>
            <el-table-column label="销售员" inline-template   min-width="50">
                <div class="p-table-list-td-text" :title="row.seller|emptyByDefault">{{row.seller|emptyByDefault}}
                </div>
            </el-table-column>
            <el-table-column label="真实运输方式" inline-template   min-width="200">
                <div class="p-table-list-td-text" :title="row.shipping_name|emptyByDefault">{{row.shipping_name|emptyByDefault}}
                </div>
            </el-table-column>
            <el-table-column label="真实跟踪号" inline-template   min-width="80">
                <div class="p-table-list-td-text" :title="row.shipping_number|emptyByDefault">{{row.shipping_number|emptyByDefault}}
                </div>
            </el-table-column>
            <el-table-column label="虚拟运输方式" inline-template   min-width="90">
                <div class="p-table-list-td-text" :title="row.virtual_shipping_id|emptyByDefault">{{row.virtual_shipping_id|emptyByDefault}}
                </div>
            </el-table-column>
            <el-table-column label="虚拟跟踪号" inline-template   min-width="80">
                <div class="p-table-list-td-text" :title="row.virtaul_shipping_number|emptyByDefault">{{row.virtaul_shipping_number|emptyByDefault}}
                </div>
            </el-table-column>
            <el-table-column label="同步时间" inline-template   min-width="50">
                <div class="p-table-list-td-text" :title="row.synchronize_time|emptyByDefault">
                    <times :time="row.synchronize_time|emptyByDefault"></times>
                </div>
            </el-table-column>
            <el-table-column label="处理状态" inline-template   min-width="50">
                <div class="p-table-list-td-text" :title="row.handle_time|filterHandle">{{row.handle_time|filterHandle}}
                </div>
            </el-table-column>
            <el-table-column label="来源平台" inline-template   min-width="50">
                <div class="p-table-list-td-text" :title="row.source_channel_id|emptyByDefault">{{row.source_channel_id|emptyByDefault}}
                </div>
            </el-table-column>
        </el-table>
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="false"
                  @close-dialog="close_dialog"
                  @click-number="click_number"
                  :title="mdfTitle"></form-mdf>
        <parcel-information
            @close-parcel="close_parcel"
            v-model="informationVisble"
            @view-order="view_order"
            :order="order"
        ></parcel-information>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tables.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="tables.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tables.totalSize">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .p-table-list-td-text{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
<script>
    import parcelInformation from '../../entrepot/placeorder/parcel-information.vue';
    export default{
        data(){
            return{
                mdfValue:false,
                informationVisble:false,
                isShow:false,
                order: {},
                mdfTitle:'',
                mdfid:'',
                selectData:[],
            }
        },
        methods:{
            selection_change(val){
                this.selectData=val;
            },
            click_order(row) {
                this.$refs.formMdf.require_server(row.order_id);
                this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                this.mdfid = row.order_id;
                this.mdfValue = true;
            },
            parcel_information(order) {
                this.order.id = order;
                this.informationVisble = true;
            },
            close_dialog(val){
                if(this.isShow) this.informationVisble = true;
            },
            click_number(val){
                this.order = val.orderData;
                this.informationVisble = true;
            },
            close_parcel(){
                this.isShow = false;
            },
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            handleSizeChange(size){
                this.$emit("size-change",size);
            },
            handleCurrentChange(page){
                this.$emit("page-change",page);
            },
        },
        watch:{
            selectData(val){
                this.$emit("select",val);
            }
        },
        filters:{
            filterHandle(val){
                if (val===0) {
                    return '未处理';
                }else{
                    return '已处理';
                }
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            }
        },
        props:{
            dataList:{
                require:true,
                type:Array
            },
            isLoading:{
            },
            tables:{
                required:true,
                type:Object
            },
        },
        components:{
            uiTips: require("../../../components/ui-tip.vue").default,
            formMdf: require("./form-mdf.vue").default,
            parcelInformation: require("./parcel-information.vue").default,
        }
    }
</script>
