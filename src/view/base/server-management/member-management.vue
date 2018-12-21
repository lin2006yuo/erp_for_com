<template>
    <page-dialog v-model="show"
                 :title="title"
                 :close-on-click-modal="false"
                 size="large">
        <el-row class="mb-xs mt-xs">
            <el-button @click.native="add_inner"
                       type="primary"
                       size="mini"
                       class="ml-sm">添加
            </el-button>
            <el-button @click.native="batch_delete"
                       :disabled="!outsideSelectData.length"
                       type="primary" size="mini">批量删除
            </el-button>
        </el-row>
        <el-table class="scroll-bar"
                  :data="tempList"
                  height="600"
                  @selection-change="select_outside"
                  element-loading-text="玩命加载中..."
                  highlight-current-row>
            <el-table-column type="selection"
                             width="50">
            </el-table-column>
            <el-table-column label="系统用户"
                             inline-template>
                <div>{{row.user.user_label}}</div>
            </el-table-column>
            <el-table-column label="服务器登录用户名"
                             prop="username">
            </el-table-column>
        </el-table>
        <page-dialog v-model="addMemberShow"
                     :title="addMemberTitle"
                     size="large">
            <el-row class="mt-xs mb-xs">
                <el-button @click.native="add_data"
                           type="primary"
                           size="mini"
                           class="ml-sm">添加
                </el-button>
            </el-row>
            <el-table
                    class="scroll-bar"
                    :data="tableData"
                    height="600"
                    element-loading-text="玩命加载中..."
                    highlight-current-row>
                <el-table-column label="系统用户"
                                 inline-template>
                    <scroll-select v-model="row.user" class="inline"
                                   textAlign="left"
                                   @select-user="selectUser"
                                   ref="creater"
                                   :remote="urlcreater"
                                   :index="$index"
                                   :fix-params="fix_params_account"
                                   :fixResult="fix_result_account">
                    </scroll-select>
                </el-table-column>
                <el-table-column label="服务器登录用户名"
                                 inline-template>
                    <el-input v-model="row.username"></el-input>
                </el-table-column>
                <el-table-column inline-template label="操作">
                    <el-button @click="delete_account($index)"
                               type="text"
                               class="operate"> 删除
                    </el-button>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button type="primary" @click.native="submit" :disabled="disabled">确 定</el-button>
                <!--<request-button req-key="addMemberManagement" @click="submit">确 定</request-button>-->
                 <el-button size="mini" @click.native="addMemberShow = false">取 消</el-button>
            </span>
        </page-dialog>
        <div slot="footer">
            <el-button size="mini" @click.native="show = false">关 闭</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">

</style>

<script>
    import scrollSelect from '@/components/scroll-select.vue';
    import {api_add_save_user_info,api_delete_user_info} from '@/api/server-management'
    export default {
        name: "member-management",
        data() {
            return {
                show:this.value,
                tempList:this.list,
                addMemberShow:false,
                addMemberTitle:'',
                tableData:[],
                urlcreater:'get|user',
                outsideSelectData:[],
                disabled:false
            }
        },
        computed: {},
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            },
            list:{
                deep:true,
                handler(val){
                    this.tempList=val;
                }
            }
        },
        methods: {
            add_inner(){
                this.addMemberTitle=`为服务器${this.name}添加成员`;
                this.tableData=[];
                this.addMemberShow=true;
            },
            add_data(){
                let account = {
                    user:{user_id:'',user_label:''},
                    username:'',
                };
                this.tableData.push(account);
            },
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snText:keyword||"",
                    snType:"realname"
                };
            },
            //账号结果
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id,
                            job_number: row.job_number
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            selectUser(item, index){
                let row = this.tableData[index];
                row.username = `rondaful${item.job_number}`;
                this.tableData.splice(index, 1, row);
            },
            delete_account(index){
                this.tableData.splice(index, 1);
            },
            submit(){
                let filter = this.tableData.filter(row=>row.user.value);
                if(!filter.length){
                    return this.$message({type:'warning',message:'请添加信息'});
                }
                let arr=[],str;
                this.tempList.forEach(temp=>{
                    filter.forEach(item=>{
                        if(temp.user.user_id===item.user.value){
                            arr.push(temp);
                        }
                    })
                });
                let user_ids=filter.map(row=>row.user.value);
                if(arr.length){
                    str=arr.map(arr=>arr.user.user_label).join(',');
                    this.$confirm(`${str}${arr.length}个已添加，已添加数据不会重复，是否继续`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.submit_fun(user_ids);
                    }).catch(() => {
                        this.$message({type: 'info',message: `已取消`});
                    });
                }else{
                    this.submit_fun(user_ids);
                }
                /*
                user_ids=user_ids.filter(row=>row!==undefined);
                if(!user_ids.length)return this.$message({type:'warning',message:'请添加信息'});
                */
            },
            submit_fun(ids){
                this.disabled=true;
                this.$http(api_add_save_user_info,this.serverId,{user_ids:ids}).then(res=>{
                    this.$message({type:'success', message:res.message||res});
                    this.tempList=res.data;
                    this.addMemberShow=false;
                    this.disabled=false;
                }).catch( error =>{
                    this.disabled=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            select_outside(selection){
                this.outsideSelectData=selection;
            },
            batch_delete(){
                this.$confirm(`您将删除所选中的数据', 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let user_ids=this.outsideSelectData.map(row=>row.user.user_id);
                    this.$http(api_delete_user_info,this.serverId,{user_ids:user_ids}).then(res=>{
                        this.tempList=this.tempList.filter(row=>!user_ids.includes(row.user.user_id));
                        this.$message({type:'success', message:res.message||res});
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: `已取消删除'`});
                });
            }
        },
        props: {
            value:{},
            title:{},
            list:{},
            serverId:{},
            name:{}
        },
        components: {
            scrollSelect
        },
    }
</script>

