<template>
    <page-dialog class="add-suppliers" @open="open" size="large" title="新增供应商" v-model="addSupplierValue"
                 :close-on-click-modal="false">
        <el-select class="inline" v-model="searchData.snType" style="width:110px;">
            <el-option v-for="item in searchCondition" :label="item.condition" :value="item.text"
                       :key="item.text"></el-option>
        </el-select>
        <el-input class="inline" v-model="searchData.snText"></el-input>
        <el-button type="primary" size="mini" @click="search">搜索</el-button>
        <el-button type="primary" size="mini" @click="clearSearch">清空搜索</el-button>
        <div style="position: relative">
            <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:65}"
                border
                ref="listtable"
                @select="selectData"
                @select-all="selectAll"
                :data="dataList"
                v-loading="isLoading"
                element-loading-text="玩命加载中...">
                <el-table-column type="selection" align="center" width="35px"
                                 :selectable="set_disable"></el-table-column>
                <el-table-column label="供应商名称" inline-template align="center" width="200px" show-overflow-tooltip>
                    <span>{{row.company_name}}</span>
                </el-table-column>
                <el-table-column label="联系人" inline-template align="center">
                    <span>{{row.contacts}}</span>
                </el-table-column>
                <el-table-column label="结算方式" inline-template align="center">
                    <span>{{row.balance_type_text}}</span>
                </el-table-column>
                <el-table-column label="等级" inline-template align="center">
                    <span>{{row.level_text}}</span>
                </el-table-column>
            </el-table>
            <el-pagination
                style="position: absolute;bottom:0;right: 0;text-align: right"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <div style="text-align: right">
            <el-button type="primary" size="mini" @click="save">确定</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">
    .add-suppliers {
        .inner {
            top: 6% !important;
            left: 30% !important;
            width: 650px !important;
            z-index: 2011;
            .el-table {
                height: 568px !important;
            }
            .el-table__body-wrapper {
                height: 510px !important;
            }
        }
    }
</style>
<script>
    import {api_supplier} from '../../../../api/assert-sup'

    export default {
        page: {},
        refresh() {
            this.searchData = {};
            this.init();
        },
        data() {
            return {
                addSupplierValue: false,
                searchData: {
                    snType: 'company_name',
                    snText: '',
                    pageSize: 50,
                    page: 1
                },
                total: 0,
                searchCondition: [
                    {condition: '供应商名称', text: 'company_name'},
                    {condition: '联系人', text: 'contacts'}
                ],
                dataList: [],
                isLoading: true,
                addSuppliers: []
            }
        },
        created() {

        },
        filters: {},
        mounted() {

        },
        updated() {

        },
        destroy() {

        },
        methods: {
            open() {
                this.clearSearch();
                this.init();
                this.addSuppliers = [];
            },
            init() {
                this.isLoading = true;
                this.dataList = [];
                this.$http(api_supplier, this.searchData).then(res => {
                    this.dataList = res.data;

                    this.$nextTick(() => {
                        this.dataList.forEach(row => {
                            let find = this.addSuppliers.find(item => {
                                return row.id === item.id
                            })
                            if (!!find) {
                                this.$refs.listtable.toggleRowSelection(row, true);
                            }
                        })
                    });

                    console.log(this.dataList);
                    this.total = res.count;
                    this.isLoading = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                });
            },
            set_disable(row) {
                return !this.selectList.find(item => {
                    return item.value === row.id
                });
            },
            selectData(selection, row) {
                let find = this.addSuppliers.findIndex(res => {
                    return res.id === row.id
                });
                if (find === -1) {
                    this.addSuppliers.push(row);
                } else {
                    this.addSuppliers.splice(find, 1);
                }
                console.log(this.addSuppliers);
            },
            selectAll(selection) {
                this.addSuppliers = selection;
            },
            search() {
                this.init();
            },
            clearSearch() {
                this.searchData = {
                    snType: 'company_name',
                    snText: '',
                    pageSize: 50,
                    page: 1
                };
                this.init();
            },
            save() {
                this.addSupplierValue = false;
                this.$emit('addSupplier', this.addSuppliers);
            },
            cancel() {
                this.addSupplierValue = false;
            },
            size_change(size) {
                this.searchData.pageSize = size;
                this.init();
            },
            current_change(page) {
                this.searchData.page = page;
                this.init();
            },
        },
        computed: {},
        watch: {
            addSupplierValue(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.addSupplierValue = val;
            }
        },
        props: {
            value: {},
            selectList: {
                type: Array
            }
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default
        }
    }
</script>

