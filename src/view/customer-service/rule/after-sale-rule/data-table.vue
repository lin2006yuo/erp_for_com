<template>
    <ui-table class="order-rule-data-table add-data-tables" :heads="[
        {label:'NO',width:5},
        {label:'优先级',width:10},
        {label:'规则名称',width:22},
        {label:'平台',width:5},
        {label:'操作人',width:5},
        {label:'状态',width:5},
        {label:'创建时间',width:10},
        {label:'操作',width:20},
        ]" :body-height="10" v-loading="loading" element-loading-text="拼命加载中">
        <tbody v-if="tables.lists.length>0">
            <tr class="tbody"
                v-for="(item,index) in tables.lists"
                :key="item.id"
                :class="[clickData[index]?'active-color':'']"
                @click="addClass(index)">
                <!--NO-->
                <td>{{item.id}} [{{index+1}}]</td>
                <!--优先级-->
                <td class="drag" :data-param="index" v-drag2="drag">
                    <span class="btn-small up  sort-span invoice invoice-up" @click="up(index)"></span>
                    <span class="btn-small down  sort-span invoice invoice-down" @click="down(index)"></span>
                    <el-popover
                        v-model="item.isTurn"
                        placement="top"
                        trigger="click">
                        <div style="width:200px;text-align: center;">
                            <el-row>
                                <span >跳转到</span>
                                <el-input v-model="item.number" type="number" style="display:inline-block;width:60px" min="1" step="1"> </el-input>
                                <span>行</span>
                                <el-button size="mini" @click.native="turnClose(index)"  type="primary" class="inline">确定</el-button>
                            </el-row>
                            <el-row>
                            </el-row>
                        </div>
                        <span class="btn-small sort-span invoice invoice-turn"   slot="reference" title="跳转优先级"></span>
                    </el-popover>
                </td>
                <!--规则名称-->
                <td class="user-select t-center">
                    {{item.title}}
                </td>
                <!--平台-->
                <td>{{item.channel}}</td>
                <!--操作人-->
                <td>{{item.operator}}</td>
                <!--状态-->
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
                <!--创建时间-->
                <td>
                    <times :time="item.create_time"></times>
                </td>
                <!--操作-->
                <td class="btns">
                    <permission tag="span" class="operate" @click="lookup(item)"  :route="apis.url_put_after_sale_rules_id">编辑</permission>
                    <permission tag="span" :route="apis.url_delete_after_sale_rules_id"> | </permission>
                    <permission tag="span" class="operate" @click="del(item)" :route="apis.url_delete_after_sale_rules_id">删除</permission>
                </td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                <td colspan="10">
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
        api_delete_after_sale_rules_id,
        url_delete_after_sale_rules_id,
        api_post_after_sale_rules_status,
        url_put_after_sale_rules_id
    } from '@/api/after-sale-rules';
    export default{
        permission: {
            url_put_after_sale_rules_id,
            url_delete_after_sale_rules_id
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
                this.$emit('change');
            },
            turnClose(index){
                //向上取整
                this.tables.lists[index].isTurn=false;
                if(this.tables.lists[index].number<1){
                    this.tables.lists[index].number=1
                }else if( this.tables.lists[index].number-1 === index ){
                    return this.$message({type: "warning", message:"已在当前行！"})
                }
                else {
                    this.tables.lists[index].number=Math.ceil(this.tables.lists[index].number);
                }
                let i=this.tables.lists[index].number;
                let datas = this.tables.lists.splice(index,1);
                this.tables.lists.splice(i-1, 0,datas[0]);
                this.$emit('change');
                this.addClass(i-1);
            },
            addClass(index){
                this.clickData = this.clickData.map(() => {
                    return false
                });
                this.clickData[index] = true
            },
            change_status(item){
                let status = item.status?0:1;
                this.$confirm(`您将${status ? '停用' : '启用' }该规则`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.$http(api_post_after_sale_rules_status, {id:item.id, status}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        let index = this.tables.lists.findIndex(res=>{
                        	return res.id === item.id;
                        });
                        if(index>-1){
                            this.tables.lists.splice(index,1);
                            this.$emit('update-table',item.id);
                        }
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
                if(item.status===0){
                    this.$message({type:'warning',message:'请先停用该规则！'});
                    return
                }
                this.$confirm('您将删除' + item.title + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_after_sale_rules_id, item.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        let i = this.tables.lists.findIndex(row=>row.id===item.id);
                        if(i>-1) {
                            this.tables.lists.splice(i, 1);
                            this.$emit('update-table', item.id);
                        }
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
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
