<template>
    <div class="order-rule-data-table add-data-tables">
        <ui-table :heads="[
        {label:'NO',width:5},
        {label:'优先级',width:10},
        {label:'销售计算规则名称',width:20},
        {label:'平台',width:5},
        {label:'站点',width:15},
        {label:'有效期',width:15},
        {label:'状态',width:5},
        {label:'操作人',width:5},
        {label:'创建时间',width:5},
        {label:'管理操作',width:15}
        ]
       " :body-height="41">
            <tbody>
            <tr class="tbody" v-if="tables.lists.length > 0"
                v-loading="loading" element-loading-text="拼命加载中"
                v-for="(item,index) in tables.lists"
                :key="item.id"
                :class="[clickData[index]?'active-color':'']"
                @click="addClass(index)">
                <td>{{item.id}} [{{index+1}}]</td>
                <td class="drag" :data-param="index" v-drag2="drag">
                    <span class="btn-small up sort-span invoice invoice-up" @click="up(index)"></span>
                    <span class="btn-small down sort-span invoice invoice-down" @click="down(index)"></span>
                    <el-popover
                            v-model="item.isTurn"
                            placement="top"
                            trigger="click">
                        <div style="width:200px;text-align: center;">
                            <el-row>
                                <span>跳转到</span>
                                <el-input v-model="item.number" type="number"
                                          style="display:inline-block;width:60px" min="1" step="1"></el-input>
                                <span>行</span>
                                <el-button size="mini"
                                           @click.native="turnClose(index)"
                                           type="primary"
                                           class="inline">确定
                                </el-button>
                            </el-row>
                            <el-row>
                            </el-row>
                        </div>
                        <span class="btn-small sort-span invoice invoice-turn"
                              slot="reference">
                        </span>
                    </el-popover>
                </td>
                <td style="text-align:center" class="user-select">
                    {{item.title}}
                </td>
                <td>{{item.channel}}</td>
                <td>
                    <ui-tips :content="item.site" :width="98"></ui-tips>
                </td>
                <td>
                    <ui-tips :content="item|timeFilter" :width="100"></ui-tips>
                </td>
                <td>
                    <el-switch
                            v-model="item.status"
                            @change="change_status(item)"
                            on-text="启用"
                            off-text="停用"
                            on-color="#20a0ff"
                            off-color="#C0CCDA"
                    ></el-switch>
                </td>
                <td>{{item.operator}}</td>
                <td>
                    <times :time="item.create_time"></times>
                </td>
                <td>
                    <permission tag="span" class="mini" @click="lookup(item)" :route="apis.url_modify">查看编辑</permission>
                    <permission tag="span" :route="apis.url_copy">&nbsp;|&nbsp;</permission>
                    <permission tag="span" class="mini" @click="copy(item)" :route="apis.url_copy">复制</permission>
                    <permission tag="span" :route="apis.url_delete">&nbsp;|&nbsp;</permission>
                    <permission tag="span" class="mini" @click="del(item)" :route="apis.url_delete">删除</permission>
                </td>
            </tr>
            <tr v-else>
                <td class="table-empty" colspan="10">
                    暂无数据！！！
                </td>
            </tr>
            </tbody>
        </ui-table>
    </div>
</template>
<style lang="stylus" scoped>
    .add-data-tables {
        width: 100%;
        .inputwidth {
            width: 60px;
            display: inline-block;
        }
        .tr-width {
            height: 100%;
            width: 150px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
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
        td.drag:hover{
            cursor url("../../../assets/drag.png");
            background-image: url('../../../assets/drag.png')
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

        table caption {
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
        background: url('../../../assets/turnUp .png') no-repeat 5px 5px;
    }

    .invoice-down {
        background: url('../../../assets/turnDown.png') no-repeat 5px 5px;
    }

    .invoice-turn {
        background: url('../../../assets/turn.png') no-repeat 5px 5px;
    }

    .sort-span {
        width: 16px;
        height: 16px;
    }
</style>
<script>

    import {api_delete,api_copy,api_change_status,
        url_modify,url_delete,url_change_status,url_copy
    } from '../../../api/publish-rules';
    export default{
        permission: {
            url_modify,url_delete,url_change_status,url_copy
        },
        data(){
            return {
                status: -1,
                clickData: []
            };
        },
        methods: {
            drag(src, dist){
                src = parseInt(src);
                dist = parseInt(dist);
                if(isNaN(src) || isNaN(dist)){
                    return;
                }
                console.log(`old:${src} new:${dist}`);
                let oelement = this.tables.lists[src];
                let nelement = this.tables.lists[dist];
                this.tables.lists.splice(dist,1,oelement);
                this.tables.lists.splice(src,1,nelement);
                this.$forceUpdate();
                this.$emit('change');
            },
            datef(item){
                return datef('YYYY-MM-dd HH:mm:ss', time);
            },
            addClass(index){
                this.clickData = this.clickData.map(() => {
                    return false
                });
                this.clickData[index] = true
            },
            change_status(item){//0-启用 1-停用
                let status = item.status ? 1 : 0;
                this.$confirm(`您将修改该规则状态`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.$http(api_change_status, item.id, status).then(res=> {
                        this.$message({
                            type: 'success',
                            message: "修改成功"
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: "修改失败"
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    item.status = !item.status;
                    console.log(item.status,111)
                });
                console.log(item.status)
            },
            down(index){
                let datas = this.tables.lists.splice(index + 1, 1);
                this.tables.lists.splice(index, 0, datas[0]);
                this.$emit('change');
            },
            up(index){
                let datas = this.tables.lists.splice(index - 1, 1);
                this.tables.lists.splice(index, 0, datas[0]);
                this.$emit('change');
            },
            turnClose(index){
                //向上取整
                this.tables.lists[index].isTurn = false;
                if (this.tables.lists[index].number < 1) {
                    this.tables.lists[index].number = 1
                }
                else if (this.tables.lists[index].number - 1 === index) {
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
            lookup(item){
                let itemid = 0;
                if (typeof item === 'object') {
                    itemid = item.id;
                } else {
                    itemid = item;
                }
                this.$emit('lookup', itemid, item);
            },
            del(item){
                this.$confirm('您将删除' + item.title + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete, item.id).then(res => {
                        this.showDelete = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        let i = this.tables.lists.indexOfFun(item,function (old,item) {
                            return old.id===item.id
                        });
                        this.tables.lists.splice(i,1)
                        this.$emit('change-total')
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    })
                }).catch((err) => {
                    console.log(err);
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            copy(item){
                this.$prompt('复制规则', '输入规则名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\u4e00-\u9fa5\w\d_-]+$/u,
                    inputErrorMessage: '规则名不能为空,且不能以空格开头'
                }).then(({value}) => {
                    this.$http(api_copy, item.id, value).then(res => {
                        this.$message({
                            type: 'success',
                            message: '复制成功'
                        });
                        this.$emit('reload');
                        this.lookup(res.id);
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })

                }).catch(() => {
                });
            },
            datef(time){
                return datef('YYYY-MM-DD HH:mm:ss', time);
            }
        },
        filters: {
            timeFilter(time){
                let times = datef('YYYY-MM-dd', time.start_time) + "/" + datef('YYYY-MM-dd', time.end_time);
                return times;
            }
        },
        watch: {},
        props: {
            tables: {
                required: true,
                type: Object
            },
            loading: {
                require: true,
                type: Boolean,
            }
        },
        components: {
            draggable: require('../../../components/drag-drop').default,
            pageDialog: require('../../../components/page-dialog').default,
            uiTable: require('../../../components/ui-table.vue').default,
            uiTips: require('../../../components/ui-tip.vue').default
        }
    }
</script>
