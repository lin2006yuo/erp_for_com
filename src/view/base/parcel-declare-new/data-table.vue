<template>
    <div class="parcel-declare-table" >
        <ui-table :body-height="20"
                  :first-loading="firstLoading"
                  :heads="[
            {label:'NO.',width:4},
            {label:'优先级',width:15},
            {label:'规则名称',width:45},
            {label:'状态',width:6},
            {label:'操作人',width:6},
            {label:'操作时间',width:12},
            {label:'管理操作',width:12}
            ]">
                <tr @update="$emit('change')"
                    class="tbody"
                    v-if="tables.lists.length > 0"
                    v-model="tables.lists"
                    tag="tbody"
                    v-for="(item,index) in tables.lists"
                    :key="item.id"
                    :class="[item.clickData?'active-color':'']"
                    @click="addClass(item)">
                    <td>
                        {{index+1}}
                    </td>
                    <td class="drag" :data-param="index" v-drag2="drag">
                        <span class="btn-small up  sort-span" @click="up(index)" style="border:0"><img src="../../../assets/turnUp .png" width="100%" height=" 100%"></span>
                        <span class="btn-small down  sort-span" @click="down(index)"  style="border:0"><img src="../../../assets/turnDown.png" width="100%" height=" 100%"></span>
                        <el-popover
                                v-model="item.isTurn"
                                placement="top"
                                trigger="click">
                            <div style="text-align: center;">
                                <el-row>
                                    <span >跳转到</span>
                                    <el-input v-model="item.number" type="number"  style="display:inline-block;width:60px" min="1" step="1"></el-input>
                                    <span>行</span>
                                    <el-button  size="mini" @click.native="turnClose(index)" type="primary" class="inline">确定</el-button>
                                </el-row>
                                <el-row>
                                </el-row>
                            </div>
                            <span class="btn-small sort-span" slot="reference" style="border:0"><img src="../../../assets/turn.png" width="100%" height=" 100%"></span>
                        </el-popover>
                    </td>
                    <td>{{item.title}}</td>
                    <td>
                        <permission tag="ElSwitch" :route="apis.url_declare_status"
                                    v-model="item.status"
                                    @change="change_status(item)"
                                    on-text="启用"
                                    on-color="#20a0ff"
                                    off-text="停用"
                                    off-color="#C0CCDA">
                        </permission>
                    </td>
                    <td>{{item.operator}}</td>
                    <td>{{item.update_time | timeFilter}}</td>
                    <td>
                        <permission tag="span" :route="apis.url_declare_update" class="operate" @click="lookup(item)">查看</permission>
                        <permission tag="span" :route="apis.url_declare_update">|</permission>
                        <permission tag="span" :route="apis.url_declare_update" class="operate" @click="editup(item)">编辑</permission>
                        <permission tag="span" :route="apis.url_declare_update">|</permission>
                        <permission tag="span" :route="apis.url_declare_del"class="operate"  @click="del(item)">删除</permission>
                    </td>
                </tr>
            <tr v-else>
                <td class="table-empty" colspan="7">
                    暂无数据
                </td>
            </tr>
        </ui-table>
    </div>
</template>
<style lang="stylus">
    .parcel-declare-table{
        tr:first-child .up {
            display: none;
        }
        tr:last-child .down {
            display: none;
        }
        td.drag:hover{
          cursor url("../../../assets/drag.png");
          background-image: url('../../../assets/drag.png')
          background-size 25px;
          background-repeat no-repeat;
          background-position right center;
        }
        .sort-span{
            height: 16px;
            width: 16px;
            &:hover{
                background-color:rgba(7,17,27,.3);
            }
            &:active{
                background-color:rgba(7,17,27,.5);
            }
        }
        .btn-small{
            padding: 2px 2px;
            line-height: 16px;
        }
    }
</style>
<script>
    import {api_declare_del,api_declare_status,url_declare_status,url_declare_update,url_declare_del} from '../../../api/parcel-declare';
    export default{
    	  permission:{
          url_declare_status,
          url_declare_update,
          url_declare_del
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
              let nelement = this.tables.lists[dist];
              this.tables.lists.splice(dist,1,oelement);
              this.tables.lists.splice(src,1,nelement);
              this.$forceUpdate();
              this.$emit('change');
            },
            addClass(data){
                this.tables.lists.forEach(item=>{
                    this.$set(item, 'clickData',false);
                });
                data.clickData=true;
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
                this.tables.lists[index].isTurn=false;
                if(this.tables.lists[index].number<1){
                    this.tables.lists[index].number=1
                }else {
                    this.tables.lists[index].number=Math.ceil(this.tables.lists[index].number);
                }
                let i=this.tables.lists[index].number;
                let datas = this.tables.lists.splice(index,1);
                this.tables.lists.splice(i-1, 0,datas[0]);
                this.$emit('change');

            },
//            查看
            lookup(item){
                let itemid = 0;
                if(typeof item === 'object'){
                    itemid = item.id;
                }else{
                    itemid = item;
                }
                this.$emit('lookup', itemid);
            },
//            编辑
            editup(item){
                let itemid = 0;
                if(typeof item === 'object'){
                    itemid = item.id;
                }else{
                    itemid = item;
                }
                this.$emit('editup', itemid);
            },
            change_status(data){//0-启用 1-停用
                let statusTitle=data.status?'停用':'启用';
                this.$confirm('您将'+statusTitle+data.title+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let status=data.status?0:1;
                    this.$http(api_declare_status,data.id,status).then(res=>{
                        this.$message({type: "success", message: res.message || res})
                        this.$emit('refresh-data');
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+statusTitle
                    });
                    data.status=!data.status
                });
            },
            del(data){
                this.$confirm('您将删除'+data.title+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_declare_del,data.id).then(res=>{
                        this.$message({type: "success", message: res.message || res})
                        let i = this.tables.lists.indexOfFun(data,function (old,data) {
                            return old.id===data.id
                        });
                        this.tables.lists.splice(i,1)
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
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
            timeFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss', val);
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
        firstLoading:{
            required:true,
            type:Boolean
        },
        components:{
            draggable:require('../../../components/drag-drop').default,
            pageDialog:require('../../../components/page-dialog').default,
            uiTable:require('../../../components/ui-table.vue').default,
        }
    }
</script>
