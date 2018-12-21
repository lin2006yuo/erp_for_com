<template>
    <div class="c-picking-sku-table">
        <div class="mt-xs mb-xs">
            <permission tag="ElButton" size="mini" @click.native="batch_print"
                        :disabled="!canPrint"
                        type="default"
                        :route="apis.url_parcel_box_batch_print">
                打印标签
            </permission>
            <permission tag="requestButton" req-key="batchFinishBox"
                        @click.native="batch_finish"
                        type="default"
                        :disabled="selectedData.filter(row => row.status === 1).length === 0"
                        :route="apis.url_parcel_box_batch_finish">
                打板完成
            </permission>
            <permission tag="ElButton"
                        @click.native="batch_force"
                        type="default"
                        :disabled="selectedData.filter(row => row.status === 3).length === 0"
                        :route="apis.url_box_batch_force">
                拆板完成
            </permission>
            <permission tag="requestButton" req-key="batchDeleteBox"
                        @click.native="batch_delete"
                        type="default"
                        :disabled="selectedData.length === 0"
                        :route="apis.url_parcel_box_batch_delete">
                批量删除
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

            <el-table-column label="卡板号" min-width="80" inline-template>
                <div>
                    {{row.id}}
                </div>
            </el-table-column>
            <el-table-column label="状态" min-width="80" inline-template>
                <span>{{row.status | filterStatus}}</span>
            </el-table-column>
            <el-table-column label="接收（创建）人" min-width="50" inline-template>
                <div>{{row.create_id}}</div>
            </el-table-column>
            <el-table-column label="开始打板时间" min-width="100" inline-template>
                <div>{{row.create_time || '--'}}</div>
            </el-table-column>
            <el-table-column label="完成打板时间" min-width="100" inline-template>
                <div>{{row.recieve_end_time || '--'}}</div>
            </el-table-column>
            <el-table-column label="拆包（拆板）人" min-width="50" inline-template>
                <div>{{row.unpacking_id}}</div>
            </el-table-column>
            <el-table-column label="开始拆板时间" min-width="100" inline-template>
                <div>{{row.unpacking_start_time || '--'}}</div>
            </el-table-column>
            <el-table-column label="完成拆板时间" min-width="100" inline-template>
                <div>{{row.unpacking_end_time || '--'}}</div>
            </el-table-column>
            <el-table-column label="操作" min-width="80" inline-template>
                <div>
                    <permission tag="span" :route="apis.url_parcel_box_detail"
                                class="operate" @click="get_look(row)">
                        查看
                    </permission>
                    <permission tag="span" v-if="row.status === 1 || row.status === 0" :route="apis.url_parcel_box_log">
                        |
                    </permission>
                    <permission tag="span" v-if="row.status === 1 || row.status === 0" :route="apis.url_parcel_box_log"
                                class="operate"
                                @click="continue_receive(row)">继续打板
                    </permission>
                    <permission tag="span" :route="apis.url_parcel_box_log">|</permission>
                    <permission tag="span" :route="apis.url_parcel_box_log" class="operate"
                                @click="look_log(row)">日志
                    </permission>
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
        <look-log v-model="logVisible" :active-id="activeId"></look-log>
        <look-edit v-model="lookEditVisible" :cardboard-info="lookData"></look-edit>
        <preview v-model="printVisible"
                 :batch-data="batchData"
                 :column-height="700"
                 ref="preview">
        </preview>
        <force-reason v-model="forceVisible" :selected-data="selectedData" @search="$listeners['search']"></force-reason>
    </div>
</template>

<style lang="stylus">
</style>

<script>
    import {
        api_parcel_box_detail,
        api_parcel_box_batch_delete,
        api_parcel_box_batch_print,
        api_parcel_box_batch_finish,
        api_box_batch_force,
        url_parcel_box_log,
        url_parcel_box_detail,
        url_parcel_box_batch_delete,
        url_parcel_box_batch_print,
        url_parcel_box_batch_finish,
        url_box_batch_force,
    } from "@/api/purchase-parcels-box";

    export default {
        permission: {
            url_parcel_box_log,
            url_parcel_box_detail,
            url_parcel_box_batch_delete,
            url_parcel_box_batch_print,
            url_parcel_box_batch_finish,
            url_box_batch_force,
        },
        data() {
            return {
                selectedData: [],
                lookEditVisible: false,
                logVisible: false,
                printVisible: false,
                batchData: [],
                lookData: {},
                activeId: '',
                forceVisible: false,
            }
        },
        filters: {
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return '新增';
                    case 1:
                        return '接收打板中';
                    case 2:
                        return '打板完成';
                    case 3:
                        return '拆板拆包中';
                    case 4:
                        return '拆板完成';
                    case 5:
                        return '拆板强制完成';
                    case 6:
                        return '已作废';
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
            get_look(row) {
                console.log(`look`, row);
                this.$http(api_parcel_box_detail, row.id).then(res => {
                    this.lookData = res.list;
                    this.lookEditVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            look_log(row) {
                this.logVisible = true;
                this.activeId = row.id;
            },
            batch_print() {//批量打印
                let ids = this.selectedData.filter(row => row.status >= 2).map(row => row.id).join();
                this.$http(api_parcel_box_batch_print, {box_ids: ids}).then(res => {
                    this.batchData = res;
                    this.batchData.print_data.forEach(row => {
                        this.$set(row, 'print_num', 1);
                    });
                    this.printVisible = true;
                    this.$refs.preview.get_template(7);
                    if (this.batchData.default_temp_id) {
                        this.$nextTick(() => {
                            this.$refs.preview.change_print();
                        })
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            batch_delete() {//批量删除
                let ids = this.selectedData.map(row => row.id).join();
                this.$http(api_parcel_box_batch_delete, {box_ids: ids}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('batchDeleteBox', false);
                    }, 200);
                })
            },
            batch_finish() {//批量打板完成
                let ids = this.selectedData.filter(row => row.status === 1).map(row => row.id).join();
                this.$http(api_parcel_box_batch_finish, {box_ids: ids}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('batchFinishBox', false);
                    }, 200);
                })
            },
            batch_force() {
                this.forceVisible = true;
            },
            continue_receive(row) {//继续打板
                this.$confirm(`你将要继续对卡板${row.id}进行打板操作，确定继续打板吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$open('/purchase-parcels/createUpdateParcel', {box_id: row.id});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
            }
        },
        computed: {
            markHandle() {
                return this.selectedData.length === 0 || this.selectedData.filter(row => row.exception_status === 2).length !== 0;
            },
            canPrint() {
                return this.selectedData.filter(row => row.status >= 2).length > 0;
            }
        },
        props: {
            tableData: {},
            loading: {},
            searchData: {},
            total: {},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            uiTip: require('@/components/ui-tip').default,
            preview: require('./preview.vue').default,
            lookLog: require('./look-log.vue').default,
            lookEdit: require('./look-edit.vue').default,
            forceReason: require('./force-reason.vue').default,
        }
    }
</script>
