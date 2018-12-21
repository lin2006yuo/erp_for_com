<template>
    <div>
        <el-row class="mb-xs relative">
            <permission class="ml-sm" tag="requestButton" :route="apis.url_delete_batchDelete" :disabled="deleteShow"
                        :request="delete_all">批量删除
            </permission>
        </el-row>
        <el-table
                :data="tableData"
                v-resize="{height:40}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow @selection-change="selection_changes">
            <el-table-column type="selection" width="35px"
                             align="center"></el-table-column>
            <el-table-column
                    width="80"
                    label="图片">
                <template slot-scope="scope">
                    <el-popover
                            v-if="scope.row.sku_img"
                            placement="right"
                            trigger="hover">
                        <img :src="scope.row.sku_img | filterImage"
                             width="200px"
                             height="200px">
                        <div slot="reference">
                            <img :src="scope.row.sku_img"
                                 @click="search_img(scope.row.sku_img)"
                                 height="60px" width="60px"
                                 style="border:none">
                        </div>
                    </el-popover>
                    <img src="/static/error-picture-128.png"
                         v-else
                         height="60px" width="60px"
                         style="border:none">
                </template>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="包裹明细ID">
                <div>
                    <ui-tip :content="row.id" :is-operate="true" @cur-click="search_id(row)" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="SKU/SKU别名">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="接收数量">
                <div>
                    <ui-tip :content="row.total_qty" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="采购单号">
                <div>
                    <ui-tip :content="row.purchase_order_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="创建人">
                <div>
                    <ui-tip :content="row.parcels.creator_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="拆包人">
                <div>
                    <ui-tip :content="row.unpacked_parcels_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作">
                <div>
                    <span class="operate" @click="delete_one(row)">删除</span>
                </div>
            </el-table-column>
        </el-table>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_records, url_delete_batchDelete, api_delete_batchDelete} from '@/api/arrival-parcel'

    export default {
        data() {
            return {
                loading: false,
                tableData: [],
                total: 0,
                imgPath: '',
                imgDialog: false,
                selectIDs: []
            }
        },
        permission: {
            url_delete_batchDelete
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
        },
        methods: {
            init() {
                this.loading = true;
                let data = this.deal_time(this.searchData);
                this.$http(api_get_records, data).then(res => {
                    this.loading = false;
                    this.total = res.count;
                    this.tableData = res.data.map(row => {
                        row.purchase_order_code = 'PO' + row.purchase_order_id;
                        return row;
                    });
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code});
                });
            },
            search_id(row) {
                this.$emit('search-id', row);
            },
            //处理年月日
            deal_time(searchData) {
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                if (searchData.create_time_from) {
                    data.create_time_from = datef('YYYY-MM-dd', searchData.create_time_from / 1000);
                } else {
                    data.create_time_from = '';
                }
                if (searchData.create_time_to) {
                    data.create_time_to = datef('YYYY-MM-dd', searchData.create_time_to / 1000);
                } else {
                    data.create_time_to = '';
                }
                return data;
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            //查看大图
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            selection_changes(val) {
                this.selectIDs = val.map(res => {
                    return res.id;
                });
            },
            delete_one(row) {
                const data = {ids: [row.id]};
                this.delete(data);
            },
            delete_all() {
                const data = {ids: this.selectIDs};
                this.delete(data);
            },
            delete(data) {
                return this.$confirm(`您将删除所勾选数据, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_delete_batchDelete, data).then(res => {
                        if (res.stauts === 1) {
                            this.$message({type: "success", message: res.message || res});
                        }
                        data.ids.forEach(row => {
                            let index = this.tableData.findIndex(item => item.id === row);
                            this.tableData.splice(index, 1);
                        });
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        watch: {},
        props: {
            searchData: {}
        },
        computed: {
            deleteShow() {
                return this.selectIDs.length === 0;
            }
        },
        components: {
            uiTip: require('@/components/ui-tip').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>
