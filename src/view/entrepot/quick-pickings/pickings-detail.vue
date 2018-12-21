<template>
    <div>
        <label-item label="SKU：" class="ml-sm">
            <el-input v-model="searchData.sku" class="enter-result" @enter="init"></el-input>
        </label-item>
        <el-button type="primary"
                   size="mini"
                   class="ml-sm"
                   @click="init">搜索
        </el-button>
        <el-table :data="detailData"
                  v-loading="loading"
                  v-resize="{height:40}"
                  class="scroll-bar mt-xs"
                  element-loading-text="玩命加载中"
                  highlightCurrentRow>
            <el-table-column
                    type="index"
                    width="40">
            </el-table-column>
            <el-table-column
                width="80"
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
                                 @click="search_img(scope.row.thumb)"
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
                    width="120"
                    label="货位">
                <div>
                    <ui-tip :content="row.warehouse_cargo" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="货位库存">
                <div>
                    <ui-tip :content="row.stock_quantity"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                width="100"
                label="冻结库存">
                <div>
                    <ui-tip :content="row.hold_quantity"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                width="100"
                label="包裹所需">
                <div>
                    <ui-tip :content="row.quantity"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="商品名称（规格）">
                <div>
                    {{row.name}}({{row.attributes}})
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
    .p-pickings{
        .pagination{
            position: absolute;
            right: 5px;
            bottom: 5px;
        }
    }
</style>
<script>
    import {api_quick_detail} from '@/api/pickings'
    export default {
        data() {
            return {
                loading: false,
                searchData: {
                    sku: '',
                    warehouse_id: '',
                    page: 1,
                    pageSize: 20
                },
                clone_detailData: [],
                detailData: [],
                total: 0,
                imgPath:'',
                imgDialog:false
            }
        },
        mounted() {
            this.init();
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
        },
        methods: {
            init() {
                this.loading = true;
                this.searchData.warehouse_id = this.warehouseId;
                typeof this.searchData.sku === 'string' && (this.searchData.sku = this.searchData.sku.trim());
                this.$http(api_quick_detail, this.searchData).then(res => {
                    this.clone_detailData = res.data;
                    this.tabData();
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            //前端分页
            tabData() {
                this.arr = [];
                this.detailData = [];
                let searchList = [];
                this.clone_detailData.forEach(row => {
                    if (row.sku === this.searchData.sku || this.searchData.sku === '') {
                        searchList.push(row);
                    }
                });
                searchList.forEach((row, index) => {
                    if (index < this.searchData.page * this.searchData.pageSize && index >= (this.searchData.page - 1) * this.searchData.pageSize) {
                        this.arr.push(row);
                    }
                });
                this.detailData = this.arr;
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.tabData();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.tabData();
            },
            //查看大图
            search_img(image){
                this.imgPath = image.replace("_60x60","_500x500");
                this.imgDialog = true;
            },
        },
        computed: {},
        watch: {
            warehouseId() {
                this.init();
            }
        },
        props: {
            pickingsVisible: {},
            warehouseId: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            blowupImage:require('@/components/blowup-image').default
        },
    }
</script>
