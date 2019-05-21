<template>
    <div class="c-table-data">
        <el-row class="mt-xs mb-xs">
            <el-button size="mini"
                       type="primary"
                       @click.native="add">添加
            </el-button>
        </el-row>
        <el-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :data="tableData.data"
                  ref="tableData"
                  border
                  align="center"
                  v-resize="{height:41}"
                  highlight-current-row>
            <el-table-column
                    width="60"
                    label="NO."
                    prop="id">
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    label="手机号"
                    prop="phone">
            </el-table-column>
            <el-table-column
                    label="手机号运营公司"
                    show-overflow-tooltip
                    inline-template
                >
                    <span>{{row.operator|companyoperator}}</span>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="注册账号数">
                 <span  :class="[row.account_count>0 ? 'activeBlue': 'activeRed']"  class="see-account" @click="see_show(row)">{{row.account_count}}</span>
            </el-table-column>
            <el-table-column
                inline-template
                label="猫池">
                <span>{{row.cat_pool===0?'':row.cat_pool}}</span>
            </el-table-column>
            <el-table-column
                    label="状态"
                    inline-template>
                <div>
                    <el-switch v-model="row.status"
                            on-text="启用"
                            off-text="停用"
                            :on-value="1"
                            :off-value="0"
                            @change="change_status(row,$event)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    prop="reg_txt"
                    label="注册人">
            </el-table-column>
            <el-table-column
                    width="150"
                    label="注册日期"
                    inline-template>
                <div>{{row.reg_time_txt}}</div>
            </el-table-column>
            <el-table-column
                    label="操作"
                    inline-template>
                <div>
                    <el-button  size="mini" type="primary"  @click="see_account(row)">查看</el-button>
                    <span> | </span>
                    <el-button v-if="Number(row.account_count) ===0"  size="mini" @click="edit(row)">编辑</el-button>
                    <el-button v-if="Number(row.account_count)>0"  size="mini" class="activeRed">编辑</el-button>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination class="page-fixed"
            @size-change="$emit('size',$event)"
            @current-change="$emit('page',$event)"
            :current-page="tableData.page"
            :page-sizes="[20, 50,100, 200, 500]"
            :page-size="tableData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.count">
        </el-pagination>
        <!-- 添加与修改. -->
        <add-look-edit v-model="dialogShow"
            :title="title"
            :flag="flag"
            :baseData="form"
            :relationFlag='relationFlag'
            @refresh="$emit('fresh')">
        </add-look-edit>
        <!-- 查看手机号注册了多少个账号-->
        <see-account
           :title='title'
           v-model="seeShow"
           :loading='seeLoading'
           :see-table-data='seeTableData'
           >
        </see-account>
    </div>
</template>

<style lang="stylus">

.c-table-data{
    .see-account{
        cursor pointer
    }
    .activeBlue{
        color green;
    }
    .activeRed{
        color #a29f9c
    }
}
</style>

<script>
    import addLookEdit from './add-look-edit';
    import seeAccount from './see-account';
    import {api_operation__phone, api_one__phone,api_switch_status, api_accout } from '@/api/phone-management'
import { createGzip } from 'zlib';
    export default {
        name: "table-data",
        data() {
            return {
                dialogShow:false,
                title:'',
                flag:0, //0 add  1 see  2 edit,
                form: {
                    operator: 1,  /** 手机号运营公司 */
                    phone: '',    /** 手机号  */
                    reg_id: {},   /** 注册人 */
                    reg_time: Date.now(),
                    status: 1,
                    cat_pool:''
                },
                formBackups: '',   
                seeLoading: false,
                seeTitle: '',
                seeShow: false,
                seeTableData: {
                    data: [],
                    page: 1,
                    pageSize: 20,
                    count: 0
                },
                relationFlag: false
            }
        },
        methods: {
            add() {
                this.deal_with_data(0);
                // 还原参数。
                this.relationFlag = false;
                this.form = clone(this.formBackups);
                this.dialogShow = true;
            },
            /** 编辑 */
            edit(row) {
                if (row.is_bind > 0) {
                    this.$message({
                        message: '已注册不能在次编辑',
                        type: "info"
                    });
                    return
                } 
                this.deal_with_data(2,row);
                this.relationFlag = false;
                this.look_edit(row);
                this.dialogShow = true;
            },
            deal_with_data(num,row){
                this.title=`${num===2?'编辑':num===1?'查看':'添加'}手机号`;               
            },
            /** 查看 */
            see_account(row) {
                this.deal_with_data(1, row);
                // 请求数据。
                this.relationFlag = true;
                this.look_edit(row);
                this.dialogShow = true;               
            },
            look_edit(row){
                // 需要更新一下账号数
                this.$http(api_one__phone, row.id).then(res=>{
                    if(res.cat_pool===0){res.cat_pool='';}
                    this.form = res;
                    this.form = {...res, reg_id: {label: res.reg_txt, value: res.reg_id - 0}, reg_time: res.reg_time * 1000};
                    this.dialogShow=true;
                }).catch(error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            change_status(row,status){
                this.$confirm(`您将${status?'启用':'停用'}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_switch_status,row.id,{status:status}).then(res=>{
                        this.$message({type:'success',message:res.message||res});
                    }).catch( error=>{
                        this.$set(row,'status',status?0:1);
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: `已取消${status?'停用':'启用'}`});
                    this.$set(row,'status',status?0:1);
                });
            },
            see_show(row){
                this.title=`查看：${row.phone} 注册账号详情`;
                this.$http(api_accout,row.id).then(res=>{
                    this.seeTableData.data = res;
                    this.seeShow = true;
               })
            }
        },
        filters: {
            fmsdatetime(val) {
                return val
            },
            companyoperator(val) {
                if (val === 1) {
                    return '电信'
                } else if (val === 2) {
                    return '移动'
                } else if (val === 3) {
                    return '联通'
                } 
            }
        },
        created() {
            /** 给初始化数据一个备份。 */ 
            this.formBackups = clone(this.form);
        },
        props: {
            loading:{
                required:true,
                type:Boolean
            },
            tableData:{
                type:Object,
                required:true
            }
        },
        components: {
            addLookEdit,
            seeAccount
        },
    }
</script>

