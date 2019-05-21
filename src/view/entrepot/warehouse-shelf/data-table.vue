    <template>
        <div class="c-data-table">
            <el-table
                class="mb-sm scroll-bar"
                border :data="dataTable"
                highlight-current-row
                v-resize="{height:41}"
                v-loading="loading"
                element-loading-text="玩命加载中...">
                <el-table-column label="排序" type="index"></el-table-column>
                <el-table-column label="货架号" inline-template>
                    <div>
                        <ui-tip :content="row.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="仓库" inline-template>
                    <div>
                        <ui-tip :content="row.warehouse" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="分区" inline-template>
                    <div>
                        <ui-tip :content="row.warehouse_area" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="分区功能" inline-template>
                    <div>
                        <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="是否靠墙" inline-template>
                    <div>
                        <ui-tip :content="row.rely | relyFilter" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="货位类型" inline-template>
                    <div>
                        <ui-tip :content="row.cargo_class" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="货位数（禁用/总数）" inline-template min-width="120">
                    <div>{{row.cargo_disable_count}}/{{row.cargo_count}}</div>
                </el-table-column>
                <el-table-column label="行数" inline-template>
                    <div>{{row.row}}</div>
                </el-table-column>
                <el-table-column label="对面通道" inline-template>
                    <div>{{row.face_aisle}}</div>
                </el-table-column>
                <el-table-column label="状态" inline-template>
                    <div>
                        <permission
                            tag="ElSwitch"
                            :route="apis.url_status_warehouse_shelf"
                            :key="row.id"
                            :value="!!row.status"
                            on-text="启用"
                            off-text="停用"
                            @change="changStatus(row)"></permission>
                    </div>
                </el-table-column>
                <el-table-column label="更新时间" inline-template min-width="150">
                    <div>{{row.update_time}}</div>
                </el-table-column>
                <el-table-column label="操作" inline-template min-width="130">
                    <div>
                        <permission tag="span"
                                    :route="apis.url_look_warehouse_shelf || url_edit_warehouse_shelf"
                                    class="operate"
                                    @click="edit_data(row)">编辑</permission>
                        <permission tag="span"
                                    :route="apis.url_delete_warehouse_shelf"
                                    >|</permission>
                        <permission tag="span"
                                    :route="apis.url_delete_warehouse_shelf"
                                    :class="{disabled: row.cargo_count > 0}"
                                    :title="row.cargo_count>0 ? '货位数大于0,不可删除!' : ''"
                                    class="operate"
                                    @click="delete_data(row)">删除
                        </permission>
                    </div>
                </el-table-column>
            </el-table>
        </div>
    </template>
    <style lang="stylus">

    </style>
    <script>
import {api_delete_warehouse_shelf,url_delete_warehouse_shelf,
    api_look_warehouse_shelf,url_look_warehouse_shelf,
    api_status_warehouse_shelf,url_status_warehouse_shelf,
    api_edit_warehouse_shelf,url_edit_warehouse_shelf} from '../../../api/warehouse-shelf';
        export default{
        	permission:{
                url_delete_warehouse_shelf,
                url_look_warehouse_shelf,
                url_edit_warehouse_shelf,
                url_status_warehouse_shelf
            },
            data(){
                return{
                }
            },
            methods:{
                changStatus(row){
                    this.$confirm(`您将更改 ${row.code} 状态，确定进行此操作？`,"提示",{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        let status= row.status?0:1;
                        this.$http(api_status_warehouse_shelf,row.id,{status:status}).then(res=>{
                            this.$message({
                                type:"success",
                                message:res.message
                            });
                            if(this.status===''){
                                row.status = !row.status;
                                row.update_time = datef("YYYY-MM-dd HH:mm:ss",Date.parse(new Date)/1000);
                            }else{
                                let index = this.dataTable.findIndex(item=>item.id===row.id);
                                this.dataTable.splice(index,1);
                                this.$emit('delete-data');
                            }
                        }).catch(code=>{
                            this.$message({
                                type:"error",
                                message:code.message
                            })
                        })
                    }).catch(()=>{
                        this.$message({
                            type:"info",
                            message:"已取消操作"
                        })
                    })
                },
                edit_data(row){
                	this.$http(api_look_warehouse_shelf,row.id).then(res=>{
                        this.$emit('update-data',res,row.warehouse_area);
                    }).catch(code=>{
                                    this.$message({
                                      type:'error',
                                      message:code.message || code
                                    });
                                  });
                },
                delete_data(row){
                    this.$confirm(`您将删除 ${row.code}, 确认此操作吗?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_delete_warehouse_shelf,row.id).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                            let index = this.dataTable.findIndex(item=>item.id===row.id);
                            this.dataTable.splice(index,1);
                            this.$emit('delete-data');
                        }).catch(code=>{
                            this.$message({message:code.message||code,type:'error'})
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            filters:{
                relyFilter(val){
                    return val?`是`:`否`;
                },
                statusFilter(val){
                    return val?`启用`:`禁用`;
                }
            },
            props:{
                dataTable:{
                    required:true,
                    type:Array,
                },
                status:{},
                loading:{}
            },
            components:{
                uiTip:require('../../../components/ui-tip.vue').default,
            }
        }
    </script>

