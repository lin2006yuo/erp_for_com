<template>
    <div class="c-picking-sku-table">
        <div class="mt-xs mb-xs">
            <permission tag="ElButton" @click.native="make_handle"
                        :disabled="markHandle"
                        type="primary"
                        size="mini"
                        :route="apis.url_edit_parcel_exception">
                处理异常
            </permission>
        </div>
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  @selection-change="batch_select"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <!--<div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>-->
            <el-table-column type="selection" width="35"></el-table-column>

            <el-table-column label="运单号" min-width="55" inline-template>
                <div>
                    {{row.tracking_number}}
                </div>
            </el-table-column>
            <el-table-column label="采购单号" min-width="130" inline-template>
                <span>{{`PO${row.purchase_order_ids}`}}</span>
            </el-table-column>
            <el-table-column label="重量（g）" min-width="50" inline-template>
                <div>{{row.quantity}}</div>
            </el-table-column>
            <el-table-column label="供应商" min-width="50" inline-template>
                <div>{{row.supplier_name}}</div>
            </el-table-column>
            <el-table-column label="采购员" min-width="50" inline-template>
                <div>{{row.purchase_user_name_list}}</div>
            </el-table-column>
            <el-table-column label="拆包员" min-width="50" inline-template>
                <div>{{row.unpacked_name}}</div>
            </el-table-column>
            <el-table-column label="拆包时间" min-width="120" inline-template>
                <div>{{row.unpacked_time}}</div>
            </el-table-column>
            <el-table-column label="处理状态" min-width="60" inline-template>
                <div>{{row.exception_status | filterStatus}}</div>
            </el-table-column>
            <el-table-column label="异常描述" min-width="100" inline-template>
                <div>{{row.exception_content}}</div>
            </el-table-column>
            <el-table-column label="处理备注" min-width="60" inline-template>
                <div>{{row.process_method || '--'}}</div>
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
        <mark-handle v-model="markHandleVisible"
                     @search="$listeners['search']"
                     :selected-data="selectedData"></mark-handle>
    </div>
</template>

<style lang="stylus">
</style>

<script>
    import {url_edit_parcel_exception} from "@/api/arrival-parcel";

    export default {
        permission: {
            url_edit_parcel_exception
        },
        data() {
            return {
                selectedData: [],
                markHandleVisible: false,
            }
        },
        filters: {
            filterStatus(val) {
                switch (val) {
                    case 1:
                        return '待处理';
                    case 2:
                        return '继续入库';
                    case 3:
                        return '退货';
                    case 4:
                        return '其他入库';
                }
            }
        },
        methods: {
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            batch_select(val) {
                this.selectedData = val;
            },
            make_handle() {
                this.markHandleVisible = true;
            }
        },
        computed: {
            markHandle() {
                return this.selectedData.length === 0 || this.selectedData.filter(row => row.exception_status === 2).length !== 0;
            }
        },
        props: {
            tableData: {},
            loading: {},
            searchData: {},
            total: {},
        },
        components: {
            uiTip: require('@/components/ui-tip').default,
            markHandle: require('./mark-handle.vue').default,
        }
    }
</script>
