<template>
    <div class="c-package-return-table">
        <div class="mt-xs mb-xs">

        </div>
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  @selection-change="batch_select"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="运输方式" min-width="50" inline-template>
                <div>{{row.shipping_methods}}</div>
            </el-table-column>
            <el-table-column label="运单号" min-width="80" inline-template>
                <ui-tip :content="row.tracking_number" :width="90"></ui-tip>
            </el-table-column>
            <el-table-column label="采购单号" min-width="80" inline-template>
                <span>{{row.purchase_order_ids}}</span>
            </el-table-column>
            <el-table-column label="采购员" min-width="55" inline-template>
                <div>{{row.purchaser_user_name_list.join()}}</div>
            </el-table-column>
            <!--<el-table-column label="寄出运输方式" min-width="50" inline-template>
                <div>{{row.sent_shipping_methods}}</div>
            </el-table-column>-->
            <el-table-column label="寄出单号" min-width="55" inline-template>
                <ui-tip :content="row.sent_tracking_number" :width="90"></ui-tip>
            </el-table-column>
            <el-table-column label="寄出日期" min-width="70" inline-template>
                <div>{{row.sent_date | dateFilter}}</div>
            </el-table-column>
            <el-table-column label="重量(g)" min-width="50" inline-template>
                <div>{{row.weight}}</div>
            </el-table-column>
            <el-table-column label="寄出运费(￥)" min-width="70" inline-template>
                <div>{{row.sent_fee}}</div>
            </el-table-column>
            <el-table-column label="寄件人姓名" min-width="60" inline-template>
                <span>{{row.sender_name}}</span>
            </el-table-column>
            <el-table-column label="收件人姓名" min-width="60" inline-template>
                <span>{{row.recipient_name}}</span>
            </el-table-column>
            <el-table-column label="收件人手机" min-width="70" inline-template>
                <span>{{row.recipient_phone}}</span>
            </el-table-column>
            <el-table-column label="收件地址" min-width="90" inline-template>
                <div>{{row.recipient_address}}</div>
            </el-table-column>
            <el-table-column label="寄付方式" min-width="50" inline-template>
                <div>{{row.payment_type_text}}</div>
            </el-table-column>
            <el-table-column label="备注" min-width="50" inline-template>
                <ui-tip :content="row.remark" :width="90"></ui-tip>
            </el-table-column>
            <el-table-column label="处理人" min-width="50" inline-template>
                <div>{{row.return_parcel_handler}}</div>
            </el-table-column>
            <el-table-column label="采购提交时间" min-width="60" inline-template>
                <ui-tip :content="row.purchase_submit_time | timeFilter" :width="90"></ui-tip>
            </el-table-column>
            <el-table-column label="仓库处理时间" min-width="60" inline-template>
                <ui-tip :content="row.warehouse_submit_time | timeFilter" :width="90"></ui-tip>
            </el-table-column>
            <el-table-column label="操作" min-width="80" inline-template>
                <div>
                    <span class="operate" @click="look(row)">查看</span>
                    <template v-if="row.audit_status === 1">
                        <permission tag="span"
                                    :route="apis.url_warehouse_mail">|
                        </permission>
                        <permission tag="span"
                                    @click="edit(row)"
                                    :route="apis.url_warehouse_mail"
                                    class="operate">编辑
                        </permission>
                    </template>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <look-edit v-model="lookVisible"
                   @search="$listeners['search']"
                   :return-data="returnData"
                   :return-info="editData"></look-edit>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    import {api_warehouse_mail, url_warehouse_mail} from "@/api/parcel-return";

    export default {
        permission: {
            url_warehouse_mail,
        },
        data() {
            return {
                selectData: [],
                lookVisible: false,
                editData: {},
                returnData: {},
            };
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            dateFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd', val);
                } else {
                    return "--";
                }
            }
        },
        methods: {
            batch_select(selection) {
                this.selectData = selection;
            },
            // 查看
            look(row) {
                this.open_edit(row, 'look');
            },
            // 编辑/提交
            edit(row) {
                this.open_edit(row, 'edit');
            },
            open_edit(data, type) {

                this.editData = {
                    action: type,
                    title: this.get_title(type),
                };
                this.returnData = clone(data);
                this.returnData.sent_date && (this.returnData.sent_date = new Date(this.returnData.sent_date*1000));
                this.lookVisible = true;
            },
            get_title(type) {
                switch (type) {
                    case 'look':
                        return '查看邮寄信息';
                    case 'edit':
                        return '修改邮寄信息';
                }
            }
        },
        computed: {

        },
        watch: {

        },
        props: {
            tableData: {},
            loading: {},
            searchData: {},
            total: {},
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            lookEdit: require('./look-edit.vue').default,
        }
    }
</script>
