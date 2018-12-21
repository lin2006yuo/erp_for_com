<template>
    <div class="declare-table">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <label style="line-height: 26px;">特殊申报规则</label>
                <el-button size="mini" @click="addParcel">新增</el-button>
                <el-button size="mini" v-if="showSub" @click="sortBtn">保存</el-button>
            </div>
            <div>
                <ui-table :heads="['NO.','优先级','规则名称','状态','创建人','创建时间','管理操作']"
                          :body-height="600" class="declare"  v-loading="loading" element-loading-text="拼命加载中">
                    <draggable  @update="showSub=true" v-model="tables.lists" tag="tbody">
                        <tr v-for="(item,index) in tables.lists" :key="item.id" :class="[item.clickData?'active-color':'']" @click="addClass(item)" >
                            <td >
                                {{index+1}}
                            </td>
                            <td>
                                <span class="btn-small up  sort-span " @click="up(index)"><img src="../../../assets/turnUp .png" width="100%" height=" 100%"></span>
                                <span class="btn-small down  sort-span " @click="down(index)"><img src="../../../assets/turnDown.png" width="100%" height=" 100%"></span>
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
                                    <span class="btn-small  sort-span "  slot="reference"><img src="../../../assets/turn.png" width="100%" height=" 100%"></span>
                                </el-popover>
                            </td>
                            <td>
                                <ui-tips  :content="item.title" :width="150"></ui-tips>
                            </td>
                            <td>
                                <el-switch
                                        v-model="item.status"
                                        @change="change_status(item)"
                                        on-text="启用"
                                        off-text="停用"
                                ></el-switch>
                            </td>
                            <td>{{item.operator}}</td>
                            <td>{{item.create_time|timeFilter}}</td>
                            <td>
                                <span class="operate" @click="look(item)">查看</span>&nbsp;&nbsp;|&nbsp;&nbsp;
                                <span class="operate" @click="edit(item)">编辑</span>&nbsp;&nbsp;|&nbsp;&nbsp;
                                <span class="operate" @click="del(item)">删除</span>&nbsp;&nbsp;
                            </td>
                        </tr>
                    </draggable>
                </ui-table>
            </div>
        </el-card>
        <parcel-dialog ref="parcelDialog" v-model="showBox" :title-name="titleName" :mark-id="markId" :info-data="infoData" :rules-data="rulesData" @refresh_list="refresh_list"></parcel-dialog>
    </div>
</template>
<style lang="stylus">
    .declare-table {
        .el-card__header {
            background: #A9CDEB;
            padding: 2px 8px;
        }
        .declare {
            .ui-table-body {
                .template.secTable {
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
                    }
                }
            }
        }
    }
</style>
<script>
    import parcelDialog from './parcel-dialog.vue'
    import {api_declare_status,api_declare_del,api_declare_rules,api_declare_edit,api_declare_look,api_declare_sort} from '../../../api/parcel-declare'
    export default{
        data(){
            return {
                showSub:false,
                showBox:false,
                markId:0,//--标示
                infoData:[],
                rulesData:{},
                titleName:'',
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            addClass(data){
                this.tables.lists.forEach(item=>{
                    this.$set(item, 'clickData',false);
                });
                data.clickData=true;
            },
            /*----新增*/
            addParcel(){
                this.showBox=true;
                this.titleName='添加包裹自动规则';
                this.markId=0;
                this.defaultFun();//--获取默认设置
                /*---申报规则初始化*/
                this.rulesData={};
                this.$refs.parcelDialog.getRules()
            },
            /*-------------编辑*/
            edit(data){
                this.showBox=true;
                this.markId=data.id;
                this.titleName='编辑包裹自动规则';
                this.infoData=[];
                this.$http(api_declare_rules).then(res=>{
                    res.forEach(item=>{
                    this.$set(item,'radio','');
                    this.rulesFun(item.data)
                });
                    this.$set(this,"infoData",res)
                    this.$http(api_declare_edit,data.id).then(res=>{
                    this.rulesData=res;
                    this.$refs.parcelDialog.formData.name=this.rulesData.title;
                    this.$refs.parcelDialog.formData.status=this.rulesData.status;
                    this.$refs.parcelDialog.getRules();
                    res.action_value.forEach(rules=>{//----默认设置值
                        this.infoData.forEach(item=>{
                            if(item.code===rules.item_code){
                                this.infoFun(item.data,rules.choose,item)
                            }
                        });
                    });
                }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                });
            }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
        },
            /*----查看*/
            look(data){
                this.showBox=true;
                this.markId=-1;
                this.titleName='查看包裹自动规则';
                this.infoData=[];
                this.$http(api_declare_rules).then(res=>{
                    res.forEach(item=>{
                    this.$set(item,'radio','');
                    this.rulesFun(item.data)
                });
                    this.$set(this,"infoData",res)
                    this.$http(api_declare_look,data.id).then(res=>{
                        this.rulesData=res;
                        this.$refs.parcelDialog.formData.name=this.rulesData.title;
                        this.$refs.parcelDialog.formData.status=this.rulesData.status;
                        this.$refs.parcelDialog.getRules();
                        res.action_value.forEach(rules=>{//----默认设置值
                            this.infoData.forEach(item=>{
                                if(item.code===rules.item_code){
                                    this.infoFun(item.data,rules.choose,item)
                                }
                            });
                        });
                    }).catch(code=>{this.$message({message:code.message,type:'error'});})
                }).catch(code=>{})
            },
            defaultFun(){//----获取默认设置并初始化函数
                this.infoData=[];
                this.$http(api_declare_rules).then(res=>{
                    res.forEach(item=>{
                        this.$set(item,'radio','');
                        /*---------------初始化单选项默认选择第一个--------------*/
                        item.data.forEach(data=>{
                            if((data.type==2||data.type==6)&&item.radio==''){
                                item.radio=data.key;
                            }
                        });
                        /*-----------------------------*/
                        this.rulesFun(item.data)
                    });
                    this.$set(this,"infoData",res)

                }).catch(code=>{})
            },
            rulesFun(arr){//-----初始化
                arr.forEach(data=>{
                    this.$set(data,'val','');
                    this.$set(data,'other','');
                    this.$set(data,'checked',false);
                    if(data.child.length>0){
                        this.rulesFun(data.child)
                    }
                })
            },
            infoFun(arr,rules,item){//----获取默认设置值函数
                arr.forEach(data=>{
                    let child=[];
                    rules.forEach(choose=>{
                        if(data.key===choose.key){
                            if(data.type==2||data.type==6){
                                item.radio=data.key
                            }
                            if(data.type==5){
                                data.checked=true
                            }
                            data.val=choose.value;
                            data.group=choose.group;
                            data.other=choose.other;
                            data.operator=choose.operator;
                            child=choose.child
                        }
                    });
                    if(data.child.length>0){
                        this.infoFun(data.child,child,item)
                    }
                })
            },
            /*------排序*/
            down(index){
                let datas = this.tables.lists.splice(index+1,1);
                this.tables.lists.splice(index, 0,datas[0]);
                this.showSub=true
            },
            up(index){
                let datas = this.tables.lists.splice(index-1,1);
                this.tables.lists.splice(index, 0,datas[0]);
                this.showSub=true
            },
            turnClose(index){
                //向上取整
                this.tables.lists[index].isTurn=false;
                if(this.tables.lists[index].number<1){
                    this.tables.lists[index].number=1
                }else {
                    this.tables.lists[index].number=Math.ceil(this.tables.lists[index].number);
                }
                let i=this.tables.lists[index].number;
                let datas = this.tables.lists.splice(index,1);
                this.tables.lists.splice(i-1, 0,datas[0]);
                this.showSub=true
            },
            /*------排序end*/

            /*---------------启用停用*/
            change_status(data){
                console.log(data);
                let statusTitle=data.status?'启用':'停用';
                this.$confirm('您将'+statusTitle+data.title+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let status=data.status?0:1;
                    this.$http(api_declare_status,data.id,status).then(res=>{
                        this.$message({
                            showClose: true,
                            message: res.message
                        });
                        this.$emit('refresh_list')

                    }).catch(code=>{
                        this.$message({message:code.message,type:'error'});

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+statusTitle
                    });
                    data.status=!data.status
                });
            },
            /*-------------删除*/
            del(data){
                console.log(data);
                this.$confirm('您将删除'+data.title+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_declare_del,data.id).then(res=>{
                        this.$message({
                            showClose: true,
                            message: res.message
                        });
                        this.$emit('refresh_list')
                    }).catch(code=>{
                        this.$message({message:code.message,type:'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            /*-----------排序*/
            sortBtn(){
                console.log(this.tables.lists);
                let sort=this.tables.lists.map((data,index)=>{
                    return {
                        id:data.id,
                        sort:index
                    }
                });
                let sortData={
                    sort:sort
                };
                this.$http(api_declare_sort,sortData).then(res=>{
                    this.$message({
                        showClose: true,
                        message: res.message
                    });
                    this.showSub=false;
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                    this.$emit('refresh_list')
                })
            },
            refresh_list(){//----刷新
                this.$emit('refresh_list')
            }
        },
        filters: {
            timeFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        watch: {},
        computed: {},
        props: {
            tables:{},
            loading:{}
        },
        components: {
            draggable:require('../../../components/drag-drop'),
            uiTable:require('../../../components/ui-table.vue').default,
            uiTips:require('../../../components/ui-tips.vue').default,
            parcelDialog
        }
    }
</script>