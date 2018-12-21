<template>
    <div class="order-rule-data-table   add-data-table">
        <ui-table :heads="['NO.','优先级','规则名称','审批人','状态','有效期','创建人','创建时间','管理操作',]"
                  :body-height="10"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <tbody v-if="tables.lists.length > 0">
            <tr v-for="(item,index) in tables.lists" :key="item.id" :class="[clickData[index]?'active-color':'']"
                @click="addClass(index)">
                <td>
                    {{index+1}}
                </td>
                <td class="drag" :data-param="index" v-drag2="drag">
                    <span class="btn-small up sort-span invoice invoice-up" @click="up(index)" title="上调优先级"></span>
                    <span class="btn-small down sort-span invoice invoice-down" @click="down(index)"
                          title="下调优先级"></span>
                    <el-popover
                            v-model="item.isTurn"
                            placement="top"
                            trigger="click">
                        <div style="width:200px;text-align: center;">
                            <el-row>
                                <span>跳转到</span>
                                <el-input v-model="item.number" type="number" style="display:inline-block;width:60px"
                                          min="1" step="1"></el-input>
                                <span>行</span>
                                <el-button size="mini" @click.native="turnClose(index)" type="primary" class="inline">
                                    确定
                                </el-button>
                            </el-row>
                            <el-row>
                            </el-row>
                        </div>
                        <span class="btn-small sort-span invoice invoice-turn" slot="reference" title="跳转优先级"></span>
                    </el-popover>
                </td>
                <td>{{item.title}}</td>
                <td>{{item.approver}}</td>
                <td>
                    <permission tag="ElSwitch"
                                :route="apis.url_change_stock_status"
                                v-model="item.status"
                                @change="change_status(item)"
                                on-text="启用" off-text="停用"></permission>
                </td>
                <td>
                    {{item | validityFilter}}
                </td>
                <td>
                    {{item.operator}}
                </td>
                <td>
                    {{item.create_time | dateFilter}}
                </td>
                <td>
                    <permission tag="span" :route="apis.url_update_stock_rule" class="mini" @click="lookup(item)">编辑
                    </permission>
                    <permission tag="span" :route="apis.url_del_stock_rule">|</permission>
                    <permission tag="span" :route="apis.url_del_stock_rule" class="mini" @click="del(item)">删除
                    </permission>
                </td>
            </tr>
            </tbody>
            <tr v-else>
                <td class="table-empty" colspan="10">
                    暂无数据
                </td>
            </tr>
        </ui-table>

    </div>
</template>
<style lang="stylus" scoped>
    .add-data-table {
        width: 100%;
        .inputwidth {
            width: 60px;
            display: inline-block;
        }
        .mini {
            padding: 0;
            border-radius: 4px;
            font-size: 1.2rem;
            display: inline-block;
            border: none;
            color: #20A0FF;
            cursor: pointer;
        }
        .sort-span {
            height: 16px;
            width: 16px;
        }
        td, th {
            border: 1px solid rgb(211, 220, 230);
            box-sizing: border-box;
            line-height: 22px
        }
        tr {
            height: 26px;
            box-sizing: border-box
        }
        tr:hover {
            background-color: #DEE8F7
        }
        tr, td {
            padding: 0;
            margin: 0;

        }
        td.drag:hover {
            cursor url("../../../../assets/drag.png");
            background-image: url('../../../../assets/drag.png')
            background-size 25px;
            background-repeat no-repeat;
            background-position right center;
        }
        tr:first-child .up {
            display: none;
        }
        tr:last-child .down {
            display: none;
        }
        table {
            border-collapse: collapse;
            background-color: #FFF;
            box-sizing: border-box;
            border: 1px solid rgba(211, 220, 230, 0.51);
            font: 12px arial;
            width: 100%;
        }

        table .caption {
            font-size: 22px;
        }

        table, td, th {
            margin: 0;
            padding: 0;
            vertical-align: middle;
            text-align: center;
        }
        tbody td, tbody th {
        /*padding: 9px;*/
    }
        .tbody {
            width: 100%;
            overflow-y: auto;
        }
        .btn-small {
            /*padding: 2px  2px;*/
            line-height: 16px;
            border: none;
        }

    }

    .invoice {
        padding: 5px;
        width: 16px;
        height: 16px;
        &:hover {
            background-color: rgba(7, 17, 27, .3);
            border-radius: 3px;
        }
        &:active {
            background-color: rgba(7, 17, 27, .5);
            border-radius: 3px;
        }
    }

    .invoice-up {
        background: url('../../../../assets/turnUp .png') no-repeat 5px 5px;
    }

    .invoice-down {
        background: url('../../../../assets/turnDown.png') no-repeat 5px 5px;
    }

    .invoice-turn {
        background: url('../../../../assets/turn.png') no-repeat 5px 5px;
    }

    .sort-span {
        width: 16px;
        height: 16px;
    }
</style>
<script>
    import {
        api_del_stock_rule,
        api_change_stock_status,
        url_del_stock_rule,
        url_update_stock_rule,
        url_change_stock_status
    } from "@/api/stock-rules";

    export default {
        permission: {
            url_del_stock_rule,
            url_update_stock_rule,
            url_change_stock_status,
        },
        data() {
            return {
                status: -1,
                clickData: [],
            };
        },
        mounted() {
            for (let i = 0; i < this.tables.length; i++) {
                this.clickData.push(false)
            }
        },
        filters: {
            validityFilter(item) {
                return datef('YYYY-MM-dd', item.start_time) + "/" + datef('YYYY-MM-dd', item.end_time);
            },
            dateFilter(time) {
                return datef('YYYY-MM-dd', time);
            }
        },
        methods: {
            drag(src, dist) {
                src = parseInt(src);
                dist = parseInt(dist);
                if (isNaN(src) || isNaN(dist)) {
                    return;
                }
                let oelement = this.tables.lists[src];
                this.tables.lists.splice(src, 1);
                this.tables.lists.splice(dist, 0, oelement);
                this.$forceUpdate();
                this.$emit('change');
            },
            addClass(index) {
                this.clickData = this.clickData.map(() => {
                    return false
                });
                this.clickData[index] = true
            },
            change_status(item) {//0-启用 1-停用
                console.log(`666`, item);
                let statusTitle = item.status ? '停用' : '启用';
                this.$confirm(`您将${statusTitle}该规则，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let status = item.status ? 0 : 1;
                    this.$http(api_change_stock_status, item.id, status).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    item.status = !item.status;
                });
            },
            down(index) {
                let datas = this.tables.lists.splice(index + 1, 1);
                this.tables.lists.splice(index, 0, datas[0]);
                this.$emit('change');
            },
            up(index) {
                let datas = this.tables.lists.splice(index - 1, 1);
                this.tables.lists.splice(index, 0, datas[0]);
                this.$emit('change');

            },
            turnClose(index) {
                //向上取整
                this.tables.lists[index].isTurn = false;
                if (this.tables.lists[index].number < 1) {
                    this.tables.lists[index].number = 1
                } else if (this.tables.lists[index].number - 1 === index) {
                    return this.$message({type: "warning", message: "已在当前行！"})
                }
                else {
                    this.tables.lists[index].number = Math.ceil(this.tables.lists[index].number);
                }
                let i = this.tables.lists[index].number;
                let datas = this.tables.lists.splice(index, 1);
                this.tables.lists.splice(i - 1, 0, datas[0]);
                this.$emit('change');
                this.addClass(i - 1);
            },
            lookup(item) {
                let itemid = 0;
                if (typeof item === 'object') {
                    itemid = item.id;
                } else {
                    itemid = item;
                }
                this.$emit('lookup', itemid);
            },
            del(item) {
                this.$prompt(`您将删除${item.title},确认此操作吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput: false
                }).then(({value}) => {
                    this.$http(api_del_stock_rule, item.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        let i = this.tables.lists.indexOfFun(item, function (old, item) {
                            return old.id === item.id
                        });
                        this.tables.lists.splice(i, 1)
//                        this.$emit('refresh-data');
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    })
                }).catch(() => {
                    this.status = !this.status;
                    this.$message({
                        type: 'info',
                        message: "已取消"
                    })
                });
            },
            copy(item) {
                this.$prompt('复制规则', '输入规则名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /.{8,}/,
                    inputErrorMessage: '请输入8位长度的名字'
                }).then(({value}) => {
                    this.$http(api_copy, item.id, value).then(res => {
                        this.$message({
                            type: 'success',
                            message: '复制成功'
                        });
                        this.$emit('refresh-data');
                        this.lookup(res.id);
                    }).catch(code => {
                        console.error(code);
                    })

                }).catch(() => {
                });
            }
        },
        watch: {},
        props: {
            tables: {
                required: true,
                type: Object
            },
            loading: {}
        },
        components: {
            draggable: require('@/components/drag-drop').default,
            pageDialog: require('@/components/page-dialog').default,
            uiTable: require('@/components/ui-table.vue').default,
        }
    }
</script>
