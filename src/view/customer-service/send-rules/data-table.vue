<template>
    <div class="sendRules-table" >
        <ui-table :heads="['NO.','优先级','规则名称','平台','触发时间','触发动作','状态','操作人','创建时间','管理操作']"
                  :body-height="63"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
                <tbody v-if="tables.lists.length > 0">
                <tr v-for="(item,index) in tables.lists" :key="item.id" :class="[item.clickData?'active-color':'']" @click="addClass(item)">
                    <td>
                        {{index+1}}
                    </td>
                    <td  class="drag" :data-param="index" v-drag2="drag">
                        <span class="btn-small up  sort-span " @click="up(index)" style="border:0"><img src="../../../assets/turnUp .png" width="100%" height=" 100%"></span>
                        <span class="btn-small down  sort-span " @click="down(index)" style="border:0"><img src="../../../assets/turnDown.png" width="100%" height=" 100%"></span>
                        <el-popover
                                v-model="item.isTurn"
                                placement="top"
                                trigger="click">
                            <div style="width:200px;text-align: center;" >
                                <el-row>
                                    <span >跳转到</span>
                                    <el-input  v-model="item.number" type="number"  style="display:inline-block;width:60px" min="1" step="1"> </el-input>
                                    <span>行</span>
                                    <el-button  size="mini"  @click.native="turnClose(index)"  type="primary"   class="inline">确定</el-button>
                                </el-row>
                                <el-row>
                                </el-row>
                            </div>
                            <span class="btn-small  sort-span "  slot="reference" style="border:0"><img src="../../../assets/turn.png" width="100%" height=" 100%"></span>
                        </el-popover>
                    </td>
                    <td>{{item.title}}</td>
                    <td>{{item.platform | platformFilter}}</td>
                    <td>{{item.trigger_rule_str}}</td>
                    <td>{{item.action}}</td>
                    <td>
                        <el-switch v-model="item.status"
                                   @change="change_status(item)"
                                   on-text="启用"
                                   off-text="停用"
                        ></el-switch>
                    </td>
                    <td>{{item.operator}}</td>
                    <td>
                        <times :time="item.create_time"></times>
                    </td>
                    <td>
                        <permission tag="span" :route="apis.url_update_send_rules" class="mini operate" @click="lookup(item)">查看编辑</permission>
                        <permission tag="span" :route="apis.url_del_send_rules"> | </permission>
                        <permission tag="span" :route="apis.url_del_send_rules" class="mini operate" @click="del(item)">删除</permission>
                    </td>
                </tr>
                </tbody>
            <tr v-else>
                <td class="table-empty" colspan="7">
                    暂无数据
                </td>
            </tr>
        </ui-table>
    </div>
</template>
<style lang="stylus" scoped>
    .sendRules-table{
        tr:first-child .up {
            display: none;
        }
        tr:last-child .down {
            display: none;
        }
        .sort-span{
            height: 16px;
            width: 16px;
        }
        .btn-small{
            padding: 2px 2px;
            line-height: 16px;
            &:hover{
                background-color:rgba(7,17,27,.3);
            }
            &:active{
                background-color:rgba(7,17,27,.5);
            }
        }
    td.drag:hover{
        cursor url("../../../assets/drag.png");
        background-image: url('../../../assets/drag.png')
        background-size 25px;
        background-repeat no-repeat;
        background-position right center;
    }
    }
</style>
<script>
    import {
        api_del_send_rules,
        api_statues_send_rules,

        url_update_send_rules,
        url_del_send_rules
    } from '../../../api/send-rules';
    export default{
        permission: {
            url_update_send_rules,
            url_del_send_rules
        },
        data(){
            return {

            };
        },
        methods:{
            drag(src, dist){
                src = parseInt(src);
                dist = parseInt(dist);
                if(isNaN(src) || isNaN(dist)){
                    return;
                }
                console.log(`old:${src} new:${dist}`);
                let oelement = this.tables.lists[src];
                this.tables.lists.splice(src,1);
                this.tables.lists.splice(dist,0,oelement);
                this.$forceUpdate();
                this.$emit('change');
            },
            addClass(data){
                this.tables.lists.forEach(item =>{
                    this.$set(item, 'clickData',false);
                });
                data.clickData = true;
            },
            down(index){
                let datas = this.tables.lists.splice(index+1,1);
                this.tables.lists.splice(index, 0,datas[0]);
                this.$emit('change');
            },
            up(index){
                let datas = this.tables.lists.splice(index-1,1);
                this.tables.lists.splice(index, 0,datas[0]);
                this.$emit('change');
            },
            turnClose(index){
                //向上取整
                this.tables.lists[index].isTurn = false;
                if (this.tables.lists[index].number < 1) {
                    this.tables.lists[index].number = 1
                    this.$message({
                      type:"success",
                      message:"已位于当前第"+this.tables.lists[index].number+"行"
                    });
                } else {
                    this.tables.lists[index].number = Math.ceil(this.tables.lists[index].number);
                    this.$message({
                      type:"success",
                      message:"已位于当前第"+this.tables.lists[index].number+"行"
                    });
                }
                let i = this.tables.lists[index].number;
                let datas = this.tables.lists.splice(index,1);
                this.tables.lists.splice(i-1, 0,datas[0]);
                this.$emit('change');
            },
            lookup(item){
                let itemid = 0;
                let title = '';
                if(typeof item === 'object'){
                    itemid = item.id;
                    title = item.title;
                }else{
                    itemid = item;
                    title = '';
                }
                this.$emit('lookup', itemid,title);
            },
            change_status(data){//0-启用 1-停用
                let statusTitle = data.status ? '启用' : '停用';
                this.$confirm('您将修改'+data.title+'的状态，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let changeData = {
                        id:data.id,
                        status:data.status ? 0 : 1
                    }
                    this.$http(api_statues_send_rules,changeData).then(res=>{
                        this.$message({
                            type:"success",
                            message: res.message||res
                        });
                        let index = this.tables.lists.findIndex(row=>{
                        	return row.id === data.id;
                        });
                        this.tables.lists.splice(index,1);
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                    data.status = !data.status;
                });
            },
            del(data){
                this.$confirm('您将删除'+data.title+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_del_send_rules,data.id).then(res=>{
                        this.$message({
                            type:"success",
                            message: res.message
                        });
                        let i = this.tables.lists.indexOfFun(data,function (old,data) {
                            return old.id===data.id
                        });
                        this.tables.lists.splice(i,1)
                        this.$emit('change-total')
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
        },
        filters:{
            platformFilter(val){
                let ret = '';
                switch(+val){
                    case 1:
                        ret = 'ebay';
                        break;
                    case 2:
                        ret = '亚马逊';
                        break;
                    case 4:
                        ret = '速卖通';
                        break;
                }
                return ret
            }
        },
        watch:{
        },
        props:{
            tables:{
                required:true,
                type:Object
            },
            loading:{}
        },
        components:{
            draggable:require('../../../components/drag-drop'),
            pageDialog:require('../../../components/page-dialog'),
            uiTable:require('../../../components/ui-table.vue').default,
        }
    }
</script>
