<template>
    <div class="p-bound">
        <page-dialog title="添加属性" size="large" @open="open" v-model="showDialog" :close-on-click-modal="false">
            <h4>请从下列您已经启用的邮寄方式当中选择一个或多个添加到当前仓库可用列表中</h4>
            <el-row>
                <el-col :span="8">
                    <div class="p-bound_">
                        <div class="xmj-title_">
                            可用于自营仓库的邮寄方式
                        </div>
                    </div>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="line-height: 16px;">全部</span>
                        </div>
                        <div style="height: 300px;overflow: auto;">
                            <div v-for="item in shippingWays">
                                <span class="operate" @click="select_classify_all" :class="[item.logistics==='无对接物流商'?'not-ship':'custom-ship']">{{item.logistics}}({{item.userList.length}})</span>
                                <div v-for="data in item.userList" class="stroke" :class="current(data)" @click="select_classify(data.id)">
                                    <span><i class="el-icon-caret-right"></i>{{data.shortname}}</span>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="16" style="margin-top:38px;">
                    <div class="card">
                        <el-table ref="table" :data="lists" border style="width: 100%;" height="345" @select-all="select_all" @select="select">
                            <el-table-column width="30" type="selection" align="center"></el-table-column>
                            <el-table-column prop="shortname" label="名称" width="150" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="code" label="代码" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="name" label="物流商" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="period" label="类型" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column  label="状态" inline-template align="center">
                                <div>{{ row.is_add }}</div>
                            </el-table-column>
                        </el-table>
                        <div style="text-align:right;margin-top:10px">
                            <el-pagination
                                    @size-change="handle_size_change"
                                    @current-change="handle_current_change"
                                    :current-page="1"
                                    :page-sizes="[20, 50, 100, 200,500]"
                                    :page-size=tables.pageSize
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total=tables.total>
                            </el-pagination>
                        </div>
                        <div slot="footer" class="fr mt-lg">
                            <el-button type="primary" @click="save_data" size="mini">保 存</el-button>
                            <el-button   @click.native="cancel" size="mini">取 消</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-bound{
        .stroke{
            padding: 5px 0 5px 25px;
            &:hover{
                cursor: pointer;
                background: rgb(219, 235, 215);
            }
        }
        .current{
            background-color: rgba(22,22,22,0.1);
        }
        .el-card__header{
            background: #D8E8F7;
            color: #3054A2;
        }
        .p-bound_ {
            margin: 5px 0;
            border: 1px solid #396DB5;
            .xmj-title_ {
                box-sizing: border-box;
                padding: 3px 8px;
                height: 30px;
                line-height: 24px;
                background-color: #518AD9;
                color: #fff;
                font-weight: bold;
            }
        }
        .not-ship{
            padding-left:25px;
            height:20px;
            background:url('../../../assets/ship1.png') no-repeat;
        }
        .custom-ship{
            padding-left:25px;
            height:20px;
            background:url('../../../assets/ship2.png') no-repeat;
        }
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {store_getCarrier,store_getShip,store_bound} from '../../../api/storeManagement';
    export default{
        data(){
            return {
                showDialog:this.value,
                shippingWays:[],
                tables:{
                    page:1,
                    pageSize:50,
                    selected:[]
                },
                carrierId:0,
                lists:[],
                addSelected:[],
                delSelected:[]
            }
        },
        mounted(){
            this.$http(store_getCarrier).then(res=>{
                let  temp = [];
                let temps = [];
                res.forEach(data=>{
                    if (data.type_cn === 0) {
                        temp.push(data)
                    } else {
                        temps.push(data)
                    }
                });
                this.shippingWays.push({logistics:"无对接物流商",src:"",userList:temp},{logistics:"自定义对接物流商",src:"",userList:temps});
            }).catch(code => {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: code.message || code,
                });
            });
        },
        methods:{
            open(){
                this.addSelected = [];
                this.delSelected = [];
                this.require_server(true);
            },
            current(data){
                return data.id == this.carrierId ? 'current' : ''
            },
            select_classify(id){
                this.carrierId = id;
                this.require_server();
            },
            select_classify_all(){
                this.carrierId = 0;
                this.require_server();
            },
            select(selecteds, newSelect){
                let isAdd = !!selecteds.find(obj=>obj.id===newSelect.id);
                if(isAdd){
                    this.add_selected(newSelect);
                }else{
                    this.del_selected(newSelect);
                }
            },
            select_all(selected){
                if(this.lists.length > 0 && selected.length > 0){
                    selected.forEach(sel=>{
                        this.add_selected(sel);
                    });
                }else{
                    this.lists.forEach(val=>{
                        this.del_selected(val);
                    });
                }
            },
            add_selected(sel){
                let ind = null;
                if(!this.tables.selected.find(obj=>obj.id===sel.id)){
                    ind = this.addSelected.indexOfFun(sel,(old_,new_)=>old_.id === new_.id);;
                    ind<=-1 && this.addSelected.push(sel);
                }
                ind = this.delSelected.indexOfFun(sel,(old_,new_)=>old_.id === new_.id);
                if(ind >= 0){
                    this.delSelected.splice(ind, 1)
                }
            },
            del_selected(sel){
                let ind = this.addSelected.indexOfFun(sel,(old_,new_)=>old_.id === new_.id);
                ind>=0 && this.addSelected.splice(ind, 1);
                if(!!this.tables.selected.find(obj=>obj.id ===sel.id)){
                    this.delSelected.push(sel);
                }
            },
            save_data(){//-----------------------------保存
                let addSelected = [];
                let delSelected = [];
               this.addSelected.forEach(data=>{
                   addSelected.push(data.id)
                });
                this.delSelected.forEach(data=>{
                    delSelected.push(data.id)
                });
                let data={
                    ship_method_id_del: delSelected.join(","),
                    ship_method_id_add:addSelected.join(","),
                    carrier_id:this.carrierId
                };
                this.$http(store_bound,this.entrepotId,data).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.showDialog = false;
                    this.$emit('save_mail',this.entrepotId)
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: code.message || code,
                    });

                })
            },
            cancel(){//--------------------------取消
                this.showDialog = false;
            },
            handle_size_change(val) {//---------------分页每页显示条数
                this.tables.pageSize = val;
                this.require_server();
            },
            handle_current_change(val) {//------------分页当前页
                this.tables.page = val;
                this.require_server();
            },
            refresh_rows(){
                this.$nextTick(()=>{
                    this.lists.map(row=>{
                        let isSelected = (!!this.tables.selected.find(obj=>obj.id === row.id) || !!this.addSelected.find(obj=>obj.id === row.id)) &&
                                (!this.delSelected.find(obj=>obj.id===row.id));

                        this.$refs.table.toggleRowSelection(row, isSelected);
                    });
                });
            },
            require_server(isFirst){
                let params = {};
                if(isFirst){
                    this.selected = [];
                    this.tables.page = 1;
                    this.tables.pageSize = 20;
                    params = {
                        select:""
                    };
                }
                params.pageSize = this.tables.pageSize;
                params.page = this.tables.page;
                params.warehouse_id = this.entrepotId;
                params.carrier_id = this.carrierId;
                params.status_list = 1;
                this.$http(store_getShip,params).then(res=>{
                    if(isFirst){
                        this.tables.selected = res.select;
                    }
                    this.lists = res.data;
                    this.refresh_rows();
                    this.tables.total = res.count;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: code.message || code,
                    });
                })
            }
        },
        computed:{

        },
        watch:{
            showDialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.showDialog = val;
            },
            entrepotId(val){
            }
        },
        props:{
            value:{},
            entrepotId:{
                required:true,
                type:Number
            }
        },
        components: {
            pageDialog
        }
    }
</script>
