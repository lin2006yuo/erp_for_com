<template>
    <page class="pabe-pickings-exception">
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-xs">
                <el-select v-model="warehouse_id" @change="changeWarehouse" class="inline width-sm">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <search-card :params="searchData" @search="init" :clears="clears" class="mb-xs">
            <label-item label="拣货单号：" class="inline mb-xs">
                <order-input v-model="searchData.code"
                             class="inline width-super"
                             v-sf.code
                             @keydown="init"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>

            </label-item>
            <label-item label="SKU：" class="inline ml-sm mb-xs">
                <order-input v-model="searchData.sku"
                             class="inline width-super"
                             v-sf.sku
                             @keydown="init"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>

            </label-item>
            <label-item label="分区：" class="inline ml-sm mb-xs">
                <el-select v-model="searchData.area" v-sf.area class="width-sm">
                    <el-option v-for="(item, index) in partitions"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="差异数：" class="inline ml-sm mb-xs">
                <el-select v-model="searchData.diff_code" class="inline s-width-mini" v-sf.diff_code>
                    <el-option v-for="compare in compares"
                               :label="compare.label"
                               :value="compare.value"
                               :key="compare.value"
                    ></el-option>
                </el-select>
                <input type="number" class="input-diff_code s-width-mini" v-model="searchData.diff_quantity"
                       onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                       onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                       min="0">
            </label-item>
            <label-item label="拣货人：" class="inline ml-sm mb-xs">
                <param-account
                        class="width-md"
                        v-sf.shipper_id
                        v-model="searchData.shipper_id"
                        :param="{data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="warehouseUser"
                        placeholder="请选择/输入..."
                        url="get|user/warehouse/staffs">
                </param-account>
            </label-item>
            <label-item label="处理状态：" class="inline ml-sm mb-xs">
                <el-select v-model="searchData.status" class="width-xs">
                    <el-option v-for="item in statusList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="拣货完成时间：" class="inline ml-sm mb-xs">
                <el-date-picker
                        class="inline"
                        style="width:140px;"
                        v-sf.date_b
                        v-model="searchData.date_b"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <span> -- </span>
                <el-date-picker
                        class="inline mr-sm"
                        style="width:140px;"
                        v-sf.date_e
                        v-model="searchData.date_e"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
        <div>
            <permission tag="requestButton"
                        class="inline ml-sm mb-xs"
                        :route="apis.url_goods_check"
                        :disabled="searchData.status === 1 || searchData.status === 2 || selectedIds.length === 0"
                        type="primary"
                        req-key="markProcessed"
                        @click.native="mark_processed">
                生成盘点单
            </permission>
        </div>
        <ui-table
                ref="table"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                :body-height="41"
                v-model="checkAll"
                @check="check_all"
                :first-loading="firstLoading"
                :has-data="tableData.length>0"
                :heads="[
                    {isCheck:true,width:2},
                    {label:'图片',width:7},
                    {label:'SKU/别名',width:7},
                    {label:'货位号',width:7},
                    {label:'商品名称（规格）', width:18},
                    {label:'拣货单数',width:4},
                    {label:'盘点单号',width:6},
                    {label:'盘点完成时间',width:10},
                    {label:'最早拣货完成时间',width:10},
                    {label:'最近拣货完成时间',width:10},
                   ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']" @click="addClass(index)"
                    :key="`${data.sku_id}${index}`">
                    <!--isCheck-->
                    <td>
                        <el-checkbox v-model="data.isCheck" @change="check_box"></el-checkbox>
                    </td>
                    <!-- 图片 -->
                    <td>
                        <el-popover
                                v-if="data.thumb"
                                placement="right"
                                trigger="hover">
                            <img :src="data.thumb | filterImage"
                                 width="200px"
                                 height="200px">
                            <div slot="reference">
                                <img :src="data.thumb"
                                     @click="search_img(data.thumb)"
                                     height="60px" width="60px"
                                     style="border:none">
                            </div>
                        </el-popover>
                        <img src="/static/error-picture-128.png"
                             v-else
                             height="60px" width="60px"
                             style="border:none">
                    </td>
                    <!-- SKU/SKU别名 -->
                    <td>
                        <i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']" title="点击展开菜单"></i>
                        <div>{{ data.sku}}</div>
                        <div v-for="(alia,aliaIndex) in data.alias" :key="aliaIndex">{{alia}}</div>
                    </td>
                    <!-- 货位号 -->
                    <td>
                        <ui-tips :content="data.warehouse_cargo_code"></ui-tips>
                    </td>
                    <!-- 商品名称（规格） -->
                    <td>
                        <span>{{data.sku_name}}</span>
                    </td>
                    <!-- 拣货单数 -->
                    <td>
                        <ui-tips :content="data.count_picking" :width="65"></ui-tips>
                    </td>
                        <!-- 盘点单号 -->
                    <td>
                        <ui-tips v-if="data.warehouse_goods_check_id>0" :content="data.warehouse_goods_check_id" :width="65"></ui-tips>
                        <div v-else>--</div>
                    </td>
                        <!-- 盘点完成时间 -->
                    <td>
                        <ui-tips :content="data.check_end_time||'-- --'" :width="65"></ui-tips>
                    </td>
                    <!-- 最早拣货完成时间 -->
                    <td>
                        <ui-tips :content="data.picking_begin_time" :width="65"></ui-tips>
                    </td>
                    <!-- 最近拣货完成时间 -->
                    <td>
                        <ui-tips :content="data.picking_end_time" :width="65"></ui-tips>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" :key="index" class="variant">
                        <td></td>
                        <td>拣货单号</td>
                        <td>计划下架数</td>
                        <td>实际下架数</td>
                        <td>差异数</td>
                        <td>拣货人</td>
                        <td colspan="2">拣货完成时间</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr v-for="(item,item_i) in data.detailList" :key="`${data.sku_id}${index}${item_i}`"
                        class="variant">
                        <td></td>
                        <td>
                            <ui-tips :content="item.code"></ui-tips>
                        </td>
                        <td>
                            <ui-tips :content="item.quantity"></ui-tips>
                        </td>
                        <td>
                            <ui-tips :content="item.picking_quantity"></ui-tips>
                        </td>
                        <td>{{item.quantity-item.picking_quantity}}</td>
                        <td>
                            <ui-tips :content="item.shipper"></ui-tips>
                        </td>
                        <td colspan="2">
                            <ui-tips :content="item.picking_time"></ui-tips>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
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
    </page>
</template>
<style lang="stylus">
    .pabe-pickings-exception {
        position: relative;
        height: 100%;
        .el-card {
            overflow: visible;
        }
        .input-diff_code {
            box-sizing: border-box;
            border: 1px solid #C0CCDA;
            border-radius: 3px;
            height: 26px;
            display: inline !important;
            position: relative;
            top: -1px;
            padding: 3px;
        }

    }
</style>
<script>

    import {
        api_pickings_exception,
        entrepot_picking,
        api_pickings_exception_detail,
        api_goods_check,
        url_goods_check,
    } from '@/api/pickings'
    import {api_get_area} from "@/api/generate-order";
    import {mapGetters} from 'vuex';

    export default {
        permission: {
            url_goods_check
        },
        data() {
            return {
                loading: false,
                firstLoading: true,
                warehouses: [],
                total: 0,
                warehouse_id: 2,
                searchData: {
                    code: '',
                    sku: '',
                    area: '',
                    diff_code: '>',
                    diff_quantity: '',
                    status: 0,
                    shipper_id: '',
                    date_b: Date.now() - (29 * 24 * 60 * 60 * 1000),
                    date_e: Date.now(),
                    page: 1,
                    pageSize: 20,
                },
                clears: {
                    diff_code: '>',
                    date_b: Date.now() - (29 * 24 * 60 * 60 * 1000),
                    date_e: Date.now(),
                    status: 0,
                    page: 1,
                    pageSize: 20,
                },
                compares: [
                    {label: '>', value: '>'},
                    {label: '<', value: '<'},
                    {label: '=', value: '='},
                ],
                statusList: [
                    {label: '未处理', value: 0},
                    {label: '盘点中', value: 2},
                    {label: '处理完成', value: 1},
                ],
                partitions: [],
                tableData: [],
                inputTimeStart: {
                    disabledDate: (time) => {
                        return time.getTime() > new Date();
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        return time.getTime() < this.searchData.date_b - 24 * 60 * 60 * 1000 || time.getTime() > new Date();
                    }
                },//结束时间
                imgDialog: false,
                imgPath: '',
                checkAll: false,
                selectedIds: [],
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_area();
        },
        methods: {
            changeWarehouse() {
                this.init();
            },
            init_warehouse() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map(item => {
                        return {label: item.name, value: item.id};
                    });
                    this.init();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_area() {
                this.$http(api_get_area, {warehouse_id: this.warehouse_id, warehouse_area_type: 11}).then(res => {
                    this.partitions = res.map(row => {
                        return {label: row.name, value: row.id};
                    });
                    this.partitions.unshift({label: '全部', value: ''});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init() {
                if (!this.searchData.date_e) {
                    this.$message({type: 'warning', message: '结束时间不能为空！'});
                    return
                }
                if (!this.searchData.date_b) {
                    this.$message({type: 'warning', message: '开始时间不能为空！'});
                    return
                }
                if (this.searchData.date_e - this.searchData.date_b > 30 * 24 * 60 * 60 * 1000) {
                    this.$message({type: 'warning', message: '开始时间和结束时间不能超过30天，请重新选择！'});
                    return
                }
                let data = this.init_params(this.searchData);
                this.firstLoading = false;
                this.loading = true;
                this.$http(api_pickings_exception, data).then(res => {
                    this.loading = false;
                    this.tableData = res.data;
                    this.addClass();
                    this.tableData.forEach(row => {
                        row.show = false;
                        row.isCheck = false;
                    });
                    this.total = res.count;
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //处理年月日
            init_params(searchData) {
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                data.date_b = data.date_b ? datef('YYYY-MM-dd', searchData.date_b / 1000) : '';
                data.date_e = data.date_e ? datef('YYYY-MM-dd', searchData.date_e / 1000) : '';
                data.code = data.code.trim() ? data.code.trim().replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '') : '';
                data.sku = data.sku.trim() ? data.sku.trim().replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '') : '';
                Object.assign(data, {warehouse_id: this.warehouse_id});
                return data;
            },
            sale_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            //分页器
            handle_size_change(val) {
                this.checkAll = false;
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.checkAll = false;
                this.searchData.page = val;
                this.init();
            },
            small_img(path, size) {
                if (path.includes('http')) {
                    return size ? `${path}${size}jpg` : path;
                } else {
                    let newSize = size ? size : '_500x500.';
                    return this.get_path(path, newSize, this.baseUrl);
                }
            },
            //查看大图
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            addClass(index) {
                this.tableData.forEach(row => {
                    this.$set(row, 'heighLight', false);
                });
                if (index !== undefined && index >= 0) {
                    this.tableData[index].heighLight = true;
                }
            },
            show_detail(tableRow) {
                if (tableRow.show || tableRow.detailList) {
                    this.$set(tableRow, 'show', !tableRow.show);
                } else {
                    let data = {
                        code: this.searchData.code ? this.searchData.code.trim().replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '') : '',
                        sku_id: tableRow.sku_id,
                        warehouse_id: this.warehouse_id,
                        diff_code: this.searchData.diff_code,
                        diff_quantity: this.searchData.diff_quantity,
                        shipper_id: this.searchData.shipper_id,
                        date_b: this.searchData.date_b ? datef('YYYY-MM-dd', this.searchData.date_b / 1000) : '',
                        date_e: this.searchData.date_b ? datef('YYYY-MM-dd', this.searchData.date_e / 1000) : ''

                    };
                    this.$set(tableRow, 'show', !tableRow.show);
                    this.$http(api_pickings_exception_detail, data).then(res => {
                        if (res.length > 0) {
                            this.$set(tableRow, 'detailList', res);
                        }
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }
            },
            //            -------------------------------------------------------  全选
            check_all(val) {
                this.tableData.forEach(row => {
                    row.isCheck = val;
                });
                this.selectedIds = this.tableData.filter(row => row.isCheck).map(row => row.sku_id);
            },
            //            -------------------------------------------------------  多选
            check_box() {
                let cur = this.tableData;
                if (cur.length > 0) {
                    let isCheckAll = !cur.find(row => !row.isCheck);
                    this.checkAll = isCheckAll;
                }
            },
            mark_processed() {//生成盘点单
                let realname = this.currentUser.realname;
                this.$confirm('您将已勾选的SKU生成盘点任务：盘点人('+realname+'),盘点类型(拣货异常),确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        let data = {
                            ids: this.selectedIds,
                        };
                        this.$http(api_goods_check, data).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code,});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('markProcessed', false);
                            }, 200)
                        })
                    }
                ).catch(() => {
                    this.$reqKey('markProcessed', false);
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
            }
        },
        filters: {
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            }
        },
        watch: {
            'searchData.date_b': function (val) {
                if (val !== undefined) {
                    if (this.searchData.date_e === undefined || new Date(val).getTime() + 30 * 24 * 60 * 60 * 1000 < this.searchData.date_e) {
                        this.searchData.date_e = new Date(val).getTime() + 30 * 24 * 60 * 60 * 1000;
                    } else if (new Date(val).getTime() > this.searchData.date_e || new Date(val).getTime() > new Date().getTime()) {
                        this.searchData.date_e = new Date();
                    }
                }
            },
            'searchData.date_e': function (val) {
                if (val !== undefined) {
                    if (this.searchData.date_b === undefined || new Date(val).getTime() - this.searchData.date_b > 30 * 24 * 60 * 60 * 1000) {
                        if (new Date(val).getDate() < new Date(this.searchData.date_b).getDate()) {
                            this.searchData.date_b = new Date(val).getTime() - 29 * 24 * 60 * 60 * 1000;
                        }
                    }
                }
            },
            tableData: {
                deep: true,
                handler() {
                    console.log(`table data change`);
                    if (this.tableData && this.tableData.length > 0) {
                        this.selectedIds = this.tableData.filter(row => row.isCheck).map(row => row.sku_id);
                    }
                }
            }
        },
        computed: {
            ...mapGetters({currentUser: 'user/info'})
        },
        components: {
            labelItem: require('@/components/label-item').default,
            searchCard: require('@/components/search-card').default,
            paramAccount: require('@/api-components/param-account').default,
            orderInput: require('@/components/order-input').default,
            uiTable: require("@/components/ui-table.vue").default,
            uiTip: require('@/components/ui-tip').default,
            uiTips: require('@/components/ui-tips').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            requestButton: require('@/global-components/request-button').default,
        }
    }
</script>
