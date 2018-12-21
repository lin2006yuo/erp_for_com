<template>
    <page class="p-index">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id" class="inline width-sm" @change="select_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <div class="box">
            <p class="box-title t-left" style="padding-left:10px">扫描周转箱号验收集结区号</p>
            <div class="row">
                <label-item label="播种车：" class="mb-md mt-md ml-sm">
                    <el-select v-model="sorting_shelf_id" filterable @change="select_sorting_shelf" class="inline">
                        <el-option
                                :key="item.value"
                                v-for="item in cardList"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="扫描周转箱号/拣货单：" class="ml-sm">
                    <el-input ref="number" v-model="turnoverBox_id"
                              @focus="focus_input" @keyup.enter.native="submit($event)"></el-input>
                    <div v-if="message">
                        <span class="message red"><i class="el-icon-circle-close inline"
                                                     style="font-size:25px;color:red;margin: 0 5px 6px;"></i>{{message}}</span>
                    </div>
                </label-item>

            </div>
            <table cellpadding="0" cellspacing="0" class="box-table" v-if="boxShow">
                <tr>
                    <th>集结区号</th>
                    <th>拣货单号</th>
                    <th><span class="fl"><el-button type="primary" size="mini" @click="clear">清除扫描信息</el-button></span>周转箱号
                    </th>
                </tr>
                <tr>
                    <td style="width: 20%"><span
                            style="font-size: 20px;line-height: 45px;">{{boxData.mass_zone_num}}</span></td>
                    <td style="width: 20%"><span
                            style="font-size: 20px;line-height: 45px;">{{boxData.picking_number}}</span></td>
                    <td><span style="font-size: 20px;line-height: 45px;" v-for="(box,index) in boxData.box" :key="index"
                              :class="['inline', 'ml-lg', 'fl',box.color?'green':'red']">{{box.box}}</span></td>
                </tr>
            </table>
        </div>
        <div class="box mt-xs">
            <p class="box-title t-left" style="padding-left:10px">正在进行多品分拣作业</p>
            <ui-table v-loading="loading" element-loading-text="玩命加载中..." :has-data="tableData.length>0" class="local"
                      :body-height="40"
                      :heads="[
                        {label:'排序',width:10},
                        {label:'拣货单号',width:10},
                        {label:'拣货单类型',width:10},
                        {label:'作业开始时间',width:10},
                        {label:'时长',width:20},
                        {label:'分拣状态',width:20},
                        {label:'小组成员',width:20},
                    ]">
                <tbody>
                <template v-for="(row,index) in tableData">
                    <tr>
                        <td>{{index}}</td>
                        <td>{{row.number}}</td>
                        <td>{{row.type}}</td>
                        <td>{{row.picking_start_time | filterTime}}</td>
                        <td>{{row.duration}}</td>
                        <td>{{row.status}}</td>
                        <td>{{row.shipper_id}}</td>
                    </tr>
                </template>
                </tbody>
            </ui-table>
        </div>
    </page>
</template>
<style lang="stylus">
    .p-index {
        .c-label-item {
            height: 30px;
            line-height: 30px;
        }
        .message {
            margin-left: 20px;
            font-size: 30px;
        }
        .box {
            border: 1px solid #D3DCE6;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
            .box-title {
                border: 1px solid #D3DCE6;
                text-align: center;
                margin: 0;
                background-color: #6495ed;
                font-size: 1.2rem;
                line-height: 32px;
                height: 32px;
                color: #ffffff;
            }
            .box-table {
                width 100%;
                text-align: center;
                border-color: #e0e6ed;
                th {
                    padding: 0 5px;
                    height: 26px;
                    text-align: center;
                    box-sizing: border-box;
                    background-color: #eff2f7;
                    border: 1px solid #e0e6ed;
                }
                td {
                    padding: 0 5px;
                    height: 26px;
                    text-align: center;
                    box-sizing: border-box;
                    border-right: 1px solid #e0e6ed;
                    border-bottom: 1px solid #e0e6ed;
                }
                .green {
                    color: green;
                }
            }
        }
    }
</style>
<script>
    import {
        api_check_turnover_box,
        api_sorting_shelf_lists,
        api_audit_turnover_box,
        api_pickings_sorting
    } from '../../../../api/delivery-check'
    import {entrepot_picking} from '../../../../api/entrepot-picking';
    import {mapGetters} from 'vuex';

    export default {
        page: {
            devinfo: {
                frontEnd: '黎宏珍',
                backEnd: '詹熏欣',
                createTime: '2017-11-17',
                updateTime: '2017-12-13'
            },
        },
        refresh() {
            this.$nextTick(_ => {
                this.warehouse_id = 2;
                this.message = '';
                this.turnoverBox_id = '';
                this.sorting_shelf_lists();
                this.pickings_sorting();
                this.focus_input()
            })
        },
        data() {
            return {
                warehouse_id: 2,
                message: '',
                warehouses: [],
                sorting_shelf_id: '',
                turnoverBox_id: '',
                cardList: [],
                boxData: {},
                boxShow: false,
                loading: false,
                tableData: [],
            }
        },
        mounted() {
            this.warehouses_init();
            this.sorting_shelf_lists();
            this.pickings_sorting();
            this.message = '';
            this.turnoverBox_id = '';
            this.focus_input();
        },
        methods: {
            focus_input() {
                this.$refs.number.$refs.input.select();
            },
            pickings_sorting() {
                this.tableData = [];
                let data = {
                    warehouse_id: this.warehouse_id,
                    sorting_shelf_id: this.sorting_shelf_id,
                };
                this.$http(api_pickings_sorting, data).then(res => {
                    this.tableData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            warehouses_init() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            sorting_shelf_lists() {
                let data = {
                    warehouse_id: this.warehouse_id,
                };
                this.$http(api_sorting_shelf_lists, data).then(res => {
                    res.forEach(item => {
                        if (item.is_default === 1) {
                            this.sorting_shelf_id = item.id;
                        } else {
                            this.sorting_shelf_id = res[0].id;
                        }
                    });
                    this.cardList = res.map(row => {
                        return {
                            value: row.id,
                            label: row.name,
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            select_warehouse() {
                this.sorting_shelf_id = '';
                this.sorting_shelf_lists();
            },
            select_sorting_shelf() {
                this.pickings_sorting();
            },
            submit() {
                this.turnoverBox_id = this.turnoverBox_id.trim();
                //拣货单的处理
                if (this.turnoverBox_id.includes('PL')) {
                    this.audit_turnover_box(this.turnoverBox_id, this.sorting_shelf_id);
                    return;
                }
                if (this.boxShow) {
                    let find = this.boxData.box.find(res => `${res.box}` === this.turnoverBox_id);
                    if (!!find) {
                        this.boxData.box.forEach(row => {
                            if (row.box === find.box) {
                                row.color = true;
                                this.message = '';
                                this.turnoverBox_id = '';
                            }
                        });
                    } else {
                        this.message = `周装箱 ${this.turnoverBox_id} 不属于同一个拣货单`;
                        this.focus_input();
                    }
                    let color_green = this.boxData.box.find(res => res.color === false);
                    if (!color_green) {
                        this.audit_turnover_box(this.boxData.picking_number, this.sorting_shelf_id);
                    }
                } else {
                    let data = {
                        sorting_shelf_id: this.sorting_shelf_id,
                        turnoverBox_id: this.turnoverBox_id,
                        warehouse_id: this.warehouse_id
                    };
                    this.$http(api_check_turnover_box, data).then(res => {
                        console.log('check turnover box', data, res);
                        this.turnoverBox_id = '';
                        if (res.is_continue) {
                            this.make_sure_go_twice_sorting(res.picking_number, data);
                        } else {
                            this.boxData = res;
                            this.boxData.box = this.boxData.box.map(data => {
                                return {
                                    box: data,
                                    color: false
                                }
                            });
                            this.boxData.box.forEach(row => {
                                if (`${row.box}` === this.turnoverBox_id) {
                                    row.color = true;
                                }
                            });
                            this.boxShow = true;
                            if (this.boxData.box.length === 1) {
                                this.audit_turnover_box(this.boxData.picking_number, this.sorting_shelf_id);
                            }
                        }
                    }).catch(code => {
                        this.message = code.message || code;
                        this.focus_input();
                    });
                }
            },
            goTwiceSorting(query) {
                this.$router.push({
                    path: "/delivery-check/twice-sorting",
                    query: query
                });
            },
            make_sure_go_twice_sorting(picking_number, query){
                this.$confirm(`您正在进行${picking_number}拣货单分拣，确认继续分拣？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.goTwiceSorting(query);
                }).catch(code => {
                    this.$message({type: 'info', message: `已取消继续分拣`});
                });
            },
            audit_turnover_box(picking_number, sorting_shelf_id) {
                let data = {
                    picking_number: picking_number,
                    sorting_shelf_id: sorting_shelf_id,
                };
                this.$http(api_audit_turnover_box, data).then(res => {
                    if (res.data.is_continue && res.data.picking_number !== picking_number) {
                        this.make_sure_go_twice_sorting(res.data.picking_number, data);
                    } else {
                        this.goTwiceSorting(data);
                    }
                }).catch(code => {
                    if (code.message === '拣货单ID值不合法') {
                        this.message = `该拣货单不存在!`
                    } else {
                        this.message = code.message;
                    }
                    this.focus_input();
                });
            },
            clear() {
                this.boxData = {};
                this.boxShow = false;
                this.message = '';
                this.turnoverBox_id = '';
            },
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        computed: {
            ...mapGetters({currentUser: 'user/info'})
        },
        components: {
            labelItem: require('../../../../components/label-item.vue').default,
            uiTable: require('../../../../components/ui-table.vue').default,
        }
    }
</script>
