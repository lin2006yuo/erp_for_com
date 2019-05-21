<template>
    <ui-table class="order-rule-data-table add-data-tables" :heads="[
        {label:'NO',width:5},
        {label:'优先级',width:10},
        {label:'规则名称',width:22},
        {label:'平台',width:5},
        {label:'有效期',width:18},
         {label:'运输方式',width:5},
        {label:'操作人',width:5},
        {label:'状态',width:5},
        {label:'创建时间',width:10},
        {label:'管理操作',width:20},
        ]" :body-height="10" v-loading="loading" element-loading-text="拼命加载中">
        <tbody  v-if="tables.lists.length > 0">
            <tr class="tbody"
            v-for="(item,index) in tables.lists"
            :key="item.id"
            :class="[clickData[index]?'active-color':'']"
            @click="addClass(index)">
            <td>{{item.id}} [{{index+1}}]</td>
            <td class="drag" :data-param="index" v-drag2="drag">
                <span class="btn-small up  sort-span invoice invoice-up" @click="up(index)"></span>
                <span class="btn-small down  sort-span invoice invoice-down" @click="down(index)"></span>
                <span class="btn-small  sort-span invoice invoice-turn" title="跳转行" @click="jump(item, index)"></span>
            </td>
            <td class="user-select t-center">
                {{item.title}}
            </td>
            <td>{{item.channel}}</td>
            <td>
                <span :title="item|timeFilter">{{item|dateFilter}}</span>
            </td>
            <td>{{item.shipping}}</td>
            <td>{{item.operator}}</td>
            <td>
                <el-switch
                        :value="item.status"
                        @change="change_status(item)"
                        :on-value="0"
                        :off-value="1"
                        on-text="启用"
                        off-text="停用"
                        on-color="#20a0ff"
                        off-color="#C0CCDA"
                ></el-switch>
            </td>
            <td>
                <times :time="item.create_time"></times>
            </td>
            <td class="btns">
                <permission tag="span" class="mini btn" @click="lookup(item)"  :route="apis.url_lookup">查看编辑</permission>
                <permission tag="span" class="mini btn" @click="copy(item)"  :route="apis.url_rules_copy">复制</permission>
                <permission tag="span" class="mini btn" @click="del(item)" :route="apis.url_del_virtual_rules">删除</permission>
                <permission tag="span" class="mini btn" @click="log(item)" :route="apis.url_log">日志</permission>
            </td>
        </tr>
        </tbody>
        <tbody v-else>
            <tr>
                <td class="table-empty" colspan="10">
                    暂无数据！！！
                </td>
            </tr>
        </tbody>
    </ui-table>
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
            cursor url("../../assets/drag.png");
            background-image: url('../../assets/drag.png')
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
        background: url('../../assets/turnUp .png') no-repeat 5px 5px;
    }

    .invoice-down {
        background: url('../../assets/turnDown.png') no-repeat 5px 5px;
    }

    .invoice-turn {
        background: url('../../assets/turn.png') no-repeat 5px 5px;
    }

    .sort-span {
        width: 16px;
        height: 16px;
    }
</style>
<script>
    import {api_del_virtual_rules,api_rules_copy,api_log,api_lookup,api_change_status,
            url_del_virtual_rules,url_rules_copy,url_log,url_lookup,url_change_status} from '@/api/api-virtual-rules';
    export default{
        permission: {
            url_del_virtual_rules,url_rules_copy,url_log,url_lookup
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
                let oelement = this.tables.lists[src];
                this.tables.lists.splice(src,1);
                this.tables.lists.splice(dist,0,oelement);
                this.$forceUpdate();
            },
            jump(item, index){
                const maxLine = this.tables.lists.length;
                this.$prompt(`当前行${index+1}，跳转到（最大行：${maxLine}）：`, `${item.title}`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator:(val)=>{
                        if(/^[^0][\d]*$/.test(val)){
                            val = parseInt(val);
                            if(maxLine >= val){
                                return true;
                            }else{
                                return `超过最大行号（${maxLine}）`;
                            }
                        }else{
                            return `请输入正确的行号`;
                        }
                    },
                    inputErrorMessage: '请输入正确的行数'
                }).then(({ value }) => {
                    let i = parseInt(value);
                    let datas = this.tables.lists.splice(index, 1);
                    this.tables.lists.splice(i - 1, 0, datas[0]);
                    this.$emit('change');
                    this.addClass(i - 1);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
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
                let status = !item.status===false?0:1;
                this.$confirm(`您将${status? '停用' : '启用' }该规则`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let params = {
                        id:item.id,
                        status:status
                    };
                    this.$http(api_change_status,params).then(res => {
                        this.$message({
                            type: 'success',
                            message: status ? '停用成功' : '启用成功'
                        });
                        item.status = status;
                        this.$emit('change-status',item.id,status);
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: status ? '停用失败' : '启用失败'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
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
            lookup(item){
                let itemid = 0;
                let itemName ='';
                if (typeof item === 'object') {
                    itemid = item.id;
                    itemName = item.title;
                } else {
                    itemid = item;
                }
                this.$emit('lookup', itemid,itemName);
            },
            del(item){
                this.$confirm('您将删除' + item.title + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_del_virtual_rules,item.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        let i = this.tables.lists.indexOfFun(item,function (old,item) {
                            return old.id===item.id
                        });
                        this.tables.lists.splice(i,1)
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    })
                }).catch(() => {
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
                    inputPattern: /.{1,}/,
                    inputErrorMessage: '规则名不能为空'
                }).then(({value}) => {
                    let params = {
                        id:item.id,
                        name:value
                    };
                    this.$http(api_rules_copy,params).then(res => {
                        this.$message({
                            type: 'success',
                            message: '复制成功'
                        });
                        this.$emit('refresh-data');
                        this.lookup(res.id);
                    }).catch(code => {
                        this.$message({type:'error',message:code.message || code});
                    })

                }).catch(() => {
                });
            },
            datef(time){
                return datef('YYYY-MM-DD HH:mm:ss', time);
            },
            log(item){
                this.$http(api_log, item.id).then(res=>{
                    this.$emit('look-log', res);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        filters: {
            timeFilter(item){
                return datef('YYYY-MM-dd HH:mm:ss', item.start_time) + "/" + datef('YYYY-MM-dd HH:mm:ss', item.end_time);
            },
            dateFilter(item){
                return datef('YYYY-MM-dd', item.start_time) + "/" + datef('YYYY-MM-dd', item.end_time);
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
            draggable: require('@/components/drag-drop'),
            pageDialog: require('@/components/page-dialog').default,
            uiTable: require('@/components/ui-table.vue').default,
            uiTips: require('@/components/ui-tip.vue').default,

        }
    }
</script>
