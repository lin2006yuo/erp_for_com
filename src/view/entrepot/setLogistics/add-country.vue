<template>
    <page class="p-add-country">
        <page-dialog @close="close" v-model="editVisible" size="large" title="添加国家" class="add-country"
                     :close-on-click-modal="false">
            <el-row :gutter="8">
                <el-col :span="12">
                    <el-card>
                        <label-buttons label="按地区搜索：" @select="select" :buttons="buttons"></label-buttons>
                        <div>
                            <label>批量搜索：</label>
                            <order-input class="inline"
                                         style="width:50%"
                                         @keydown='search'
                                         v-model="searchList.snText"
                                         placeholder="请输入国家中文名称"></order-input>
                            <el-button class="inline" size="mini" type="primary" @click="search">搜索</el-button>
                        </div>
                        <div v-if="!!noFound">
                            <label class="red">未搜索到的国家：</label>
                            <el-input type="textarea"
                                      v-model="noFound"></el-input>
                        </div>
                    </el-card>
                    <el-card class="mt-xs">
                        <el-button class="inline mb-xs" size="mini" type="primary" :disabled="isCheck" @click="check">
                            确认选中({{tableCheck.length}})
                        </el-button>
                        <el-table
                                class="scroll-bar"
                                :data="tableData"
                                height="400"
                                border
                                @selection-change="table_change">
                            <el-table-column
                                    type="selection"
                                    width="35">
                            </el-table-column>
                            <el-table-column
                                    show-overflow-tooltip
                                    prop="country_code"
                                    label="代码"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="country_en_name"
                                    label="英文名"
                                    show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                    prop="country_cn_name"
                                    label="中文名"
                                    show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <div class="titles">
                        <span> 已选中国家</span>
                        <el-button type="primary" size="mini" class="fr" :disabled="isShow" @click="del_check">
                            移除选中({{delList.length}})
                        </el-button>
                    </div>
                    <el-table
                            class="scroll-bar"
                            :data="checkedList"
                            border
                            height="500"
                            @selection-change="handle_selection_change">
                        <el-table-column
                                type="selection"
                                width="35">
                        </el-table-column>
                        <el-table-column
                                show-overflow-tooltip
                                prop="country_code"
                                label="代码"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="country_en_name"
                                label="英文名"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="country_cn_name"
                                label="中文名"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="keep">确定</el-button>
                <el-button size="mini" @click.native="editVisible=false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-add-country {
        .noFound-box{
            min-height:
        }
        .el-card{
            overflow: inherit;
        }
        .title {
            background-color: #ffffff;
            color: #000;
        }
        .titles {
            box-sizing: border-box;
            padding: 3px 8px;
            height: 30px;
            line-height: 19px;
            background-color: #6495ED;
            color: #fff;
            font-weight: bold;
        }
    }

</style>
<script>
    import {api_get_zone, api_get_country_list} from "../../../api/setLogistics"
    export default {
        data() {
            return {
                noFound:'',
                checkedList: [],
                delList: [],
                tableData: [],
                tableCheck: [],
                editVisible: false,
                buttons: [],
                searchList: {zone_code: "all", snText: ""},
                number: 0,
            }
        },
        mounted() {
            this.get_zone();
            this.get_country();
        },
        methods: {
            // 弹框关闭时
            close() {
                this.delList = [];
                this.tableCheck = [];
            },
            //右边table 选中
            handle_selection_change(val) {
                this.delList = val;
            },
            //左边table 选中
            table_change(val) {
                this.tableCheck = val;
            },
            //删除选中
            del_check() {
                this.delList.length !== 0 && this.delList.forEach(row => {
                    //右边边table删除
                    let index = this.checkedList.indexOfFun(row, function (old, row) {
                        return old.country_code === row.country_code
                    });
                    this.checkedList.splice(index, 1);
                    //左边table 添加
                    let i = this.tableData.filter(item => {
                        return row.country_code === item.country_code
                    });
                    if (i.length === 0) {
                        this.tableData.push(row);
                    }
                });
                this.delList = [];
            },
            //获取分区
            get_zone() {
                this.$http(api_get_zone).then(res => {
                    this.buttons = res.map(row => {
                        row.name = row.zone_cn_name;
                        return row
                    })
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            //获取国家
            get_country() {
                this.$http(api_get_country_list, this.searchList).then(res => {
                    this.tableData = res.data;
                    this.noFound = res.no_match?res.no_match.join(' '):'';
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            //保存
            keep() {
                this.$emit("get-country", this.number, this.checkedList);
                this.editVisible = false;
            },
            //确认选中国家
            check() {
                this.tableCheck.length !== 0 && this.tableCheck.forEach(row => {
                    //右边table 添加
                    let index = this.checkedList.filter(item => {
                        return row.country_code === item.country_code
                    });
                    if (index.length === 0) {
                        this.checkedList.push(row);
                    }
                    //左边table 删除
                    let i = this.tableData.indexOfFun(row, function (old, row) {
                        return old.country_code === row.country_code
                    });
                    this.tableData.splice(i, 1)

                });
                this.tableCheck = [];
            },
            // 点击国家
            select(index) {
                this.searchList.zone_code = this.buttons[index].zone_code;
                this.get_country();
            },
            //点击搜索
            search() {
                this.get_country();
            },

        },
        watch: {
            value(val) {
                this.editVisible = val;
            },
            editVisible(val) {
                this.$emit("input", val);
            }
        },
        computed: {
            isShow() {
                if (this.delList.length > 0) {
                    return false
                } else {
                    return true
                }
            },
            isCheck() {
                if (this.tableCheck.length > 0) {
                    return false
                } else {
                    return true
                }
            }
        },
        props: {
            value: {}
        },
        components: {
            labelButtons: require('../../../components/label-all-buttons.vue').default,
            pageDialog: require('../../../components/page-dialog.vue').default,
            orderInput:require('../../../components/order-input.vue').default,
        }
    }
</script>
