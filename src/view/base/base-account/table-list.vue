<template>
    <div>
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="tableData.list.length>0"
                  v-model="checkAll"
                  :body-height="38"
                  @check="change_all"
                  @sort-click="$emit('sort',$event)"
                  :heads="[
                    {isCheck:true,width:2},
                    {label:'平台',width:5,isSort:true},
                    {label:'主账号全称',width:10,isSort:true},
                    {label:'账号简称',width:6,isSort:true},
                    {label:'服务器名',width:6},
                    {label:'服务器地址',width:7},
                    {label:'服务器类型',width:6},
                    {label:'手机号',width:6},
                    {label:'邮箱',width:9,},
                    {label:'注册公司',width:10},
                    {label:'状态',width:4},
                    {label:'备注',width:8},
                    {label:'创建人',width:5},
                    {label:'创建时间',width:6},
                    {label:'操作',width:10}
                ]">
            <tbody>
            <template v-for="(basic,index) in tableData.list">
                <tr :key="basic.id" :class="[basic.show?'active':'','left']"
                    @click="addClass(index)">
                    <td>
                        <el-checkbox v-model="basic.is_check" @change="single_select(basic)"></el-checkbox>
                    </td>
                    <td>
                        {{basic.channel_id}}
                    </td>
                    <td class="t-left">
                        <plus-minus @show-detail="show_detail(basic,index)"
                                    :show="basic.show"
                                    :title="`点击可查看站点、账号简称、账号状态等信息`">
                        </plus-minus>
                        <ui-tip :content="basic.account_name" :width="70"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="basic.account_code"></ui-tip>
                    </td>
                    <td>
                        {{basic.server_name}}
                    </td>
                    <td>
                        <ui-tip :content="basic.server_ip"></ui-tip>
                    </td>
                    <td>
                        {{basic.server_type_txt}}
                    </td>
                    <td>
                        <ui-tip :content="basic.phone"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="basic.email"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="basic.company"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="basic.status_name"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="basic.remark"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="basic.account_creator"></ui-tip>
                    </td>
                    <td>
                        {{basic.account_create_time|fymd}}
                    </td>
                    <td>
                        <span v-for="(item,index) in operation"
                              :key="item.id">
                              <span v-if="index!==0" class="ml-mini">|</span>
                              <span @click="operates(basic,item)" class="operate">{{item.label}}</span>
                        </span>
                    </td>
                </tr>
                <template v-if="basic.show">
                    <tr>
                        <th></th>
                        <th colspan="2">站点</th>
                        <th colspan="2">账号简称</th>
                        <th>账号状态</th>
                        <th colspan="9"></th>
                    </tr>
                    <template v-if="basic.show&&basic.details.length">
                        <tr v-for="detail in basic.details">
                            <td>
                                <el-checkbox v-model="detail.is_check"
                                             :disabled="is_disabled(basic,detail)"
                                             @change="get_account_status(detail)">
                                </el-checkbox>
                            </td>
                            <td colspan="2">
                                <ui-tip :content="detail.site_code"></ui-tip>
                            </td>
                            <td colspan="2">
                                <ui-tip :content="detail.account_code"></ui-tip>
                            </td>
                            <td>{{detail.site_status}}</td>
                            <td colspan="9"></td>
                        </tr>
                    </template>
                    <template v-if="basic.show&&!basic.details.length">
                        <tr>
                            <td colspan="15">
                                暂无站点、账号简称和账号状态信息
                            </td>
                        </tr>
                    </template>
                </template>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="$emit('size-change',$event)"
            @current-change="$emit('page-change',$event)"
            :current-page="tableData.page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="tableData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.count">
        </el-pagination>
        <operation-log v-model="logShow"
                       :title="logTitle"
                       :log-data="logData">
        </operation-log>
    </div>
</template>

<script>
    import operationLog from './operation-log';
    import {api_get_account_site_detail, api_get_operation_log} from '@/api/account-information';

    export default {
        name: "table-list",
        data() {
            return {
                operation: [
                    {label: '编辑', id: 1},
                    {label: '成员管理', id: 2},
                    {label: '日志', id: 3},
                ],
                selectedData: [],
                logShow: false,
                logTitle: '',
                logData: [],
                tempArr: []
            }
        },
        computed: {
            checkAll: {
                get() {
                    return !this.tableData.list.find(row => !row.is_check)
                },
                set(val) {
                    this.tableData.list.forEach(row => {
                        row.is_check = val;
                    })
                }
            }
        },

        methods: {
            addClass() {
            },
            change_all(val) {
                this.checkAll = val;
                let selected = this.tableData.list.filter(row => !!row.is_check);
                this.$emit('check', selected);
            },
            is_disabled(row, detail) {
                let r = row.status_name === '新增';
                let arr = ['申诉中', '冻结中', '运营中', '回收中'];
                let bool = !arr.includes(detail.site_status);
                if (r || bool) return true;
            },
            single_select(row) {
                let selected = this.tableData.list.filter(item => item.is_check);
                this.$emit('check', selected);
            },
            show_detail(basic, index) {
                this.$set(basic, 'show', !basic.show);
                if (basic.details.length) return;
                this.$http(api_get_account_site_detail, basic.id).then(res => {
                    this.$set(basic, 'details', res.data);
                }).catch(error => {
                    error && this.$message({type: 'error', message: error.message || error});
                });
            },
            //清空数组
            intArr() {
                this.tempArr = [];
            },
            //选中数组处理
            get_account_status(detail) {
                if (detail.is_check) {
                    this.tempArr.push(detail);
                } else {
                    this.tempArr.forEach((item, index) => {
                        if (item.id == detail.id) {
                            this.tempArr.splice(index, 1);
                        }
                    })
                }
                this.$emit('check-detail', this.tempArr);
            },
            operates(row, operate) {
                // operate.action.call(this,row,operate);
                switch (operate.id) {
                    case 1:
                        return this.$emit('edit', row);
                    case 2:
                        return this.$emit('member', row);
                    case 3:
                        return this.look_over_log(row);
                }
            },
            look_over_log(row) {
                this.$http(api_get_operation_log, row.id).then(res => {
                    this.logTitle = `账号：${row.account_name}的操作日志`;
                    this.logData = res;
                    this.logShow = true;
                }).catch(error => {
                    error && this.$message({type: 'error', message: error.message || error});
                });
            }
        },
        props: {
            tableData: {
                type: Object,
                default() {
                    return {
                        list: [],
                        page: 1,
                        pageSize: 50,
                        count: 0
                    }
                }
            },
            loading: Boolean,
        },
        components: {
            plusMinus: require('@/components/plus-minus.vue').default,
            operationLog
        }
    }
</script>

