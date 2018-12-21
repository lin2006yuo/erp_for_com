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
                    label="公司名称"
                    prop="company">
            </el-table-column>
            <el-table-column
                    label="公司注册号"
                    prop="company_registration_number">
            </el-table-column>
            <el-table-column
                    label="公司法人"
                    prop="corporation">
            </el-table-column>
            <el-table-column
                    label="收款账号"
                    show-overflow-tooltip
                    prop="collection_account">
            </el-table-column>
            <el-table-column
                    label="VAT（%）"
                    prop="vat">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="公司成立时间"
                    prop="company_time">
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    width="200"
                    label="公司注册地址+邮编"
                    prop="company_address_zip">
            </el-table-column>
            <el-table-column
                    label="状态"
                    inline-template>
                <div>
                    <el-switch v-model="row.status"
                               on-text="启用"
                               off-text="停用"
                               :on-value="0"
                               :off-value="1"
                               @change="change_status(row,$event)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    prop="sum"
                    label="注册账号数">
            </el-table-column>
            <el-table-column
                    width="150"
                    label="添加时间"
                    inline-template>
                <div>{{row.create_time|fmsdatetime}}</div>
            </el-table-column>
            <el-table-column
                    label="操作"
                    inline-template>
                <div>
                    <span class="operate" @click="look_over(row)">查看</span> |
                    <span class="operate" @click="edit(row)">编辑</span>
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
        <add-look-edit v-model="dialogShow"
                       :title="title"
                       :flag="flag"
                       :id="id"
                       :form="form"
                       @refresh="$emit('fresh')">
        </add-look-edit>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    import addLookEdit from './add-look-edit';
    import {api_get_company_detail_info,api_update_list_status} from '@/api/company-info';
    export default {
        name: "table-data",
        data() {
            return {
                dialogShow:false,
                title:'',
                flag:0,//0 add  1 see  2 edit,
                id:0,
                form:{
                    company:'',
                    charter_url:'',
                    company_type:'',
                    company_registration_number:'',
                    corporation:'',
                    corporation_id:'',
                    corporation_id_front:'',
                    corporation_id_contrary:'',
                    company_time:'',
                    company_address_zip:'',
                    corporation_address_zip:'',
                    status:0,
                    channel:[],
                    id:0,
                    log:[],
                    collection_account:'',
                    credit_card:'',
                    vat:0
                }
            }
        },
        methods: {
            add(){
                this.deal_with_data(0);
                this.form={
                    company:'',
                    charter_url:'',
                    company_type:'',
                    company_registration_number:'',
                    corporation:'',
                    corporation_id:'',
                    corporation_id_front:'',
                    corporation_id_contrary:'',
                    company_time:'',
                    company_address_zip:'',
                    corporation_address_zip:'',
                    status:0,
                    channel:[],
                    id:0,
                    log:[],
                    collection_account:'',
                    credit_card:'',
                    vat:0
                };
                this.dialogShow=true;
            },
            look_over(row){
                this.deal_with_data(1,row);
                this.look_edit(1,row);
            },
            edit(row){
                this.deal_with_data(2,row);
                this.look_edit(2,row);
            },
            deal_with_data(num,row){
                this.title=`${num===2?'编辑':num===1?'查看':'添加'}公司资料`;
                this.flag=num;
                if(!!row){
                    this.id=row.id;
                }else{
                    this.id=0;
                }

            },
            look_edit(flag,row){
                this.$http(api_get_company_detail_info,row.id).then(res=>{
                    if (res.company_time) {
                        this.$set(res, 'company_time', res.company_time * 1000);
                    }
                    if(flag===1) {
                        if(res.collection_account){
                            this.$set(res,'collection_account',res.collection_account.join(','));
                        }else{
                            this.$set(res,'collection_account','');
                        }
                    }
                    this.$set(res,'log',[]);
                    this.form=res;
                    this.dialogShow=true;
                }).catch(error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            change_status(row,status){
                this.$confirm(`您将${status?'停用':'启用'}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_update_list_status,row.id,{status:status}).then(res=>{
                        this.$set(row,'status',status);
                        this.$message({type:'success',message:res.message||res});
                    }).catch( error=>{
                        this.$set(row,'status',status?0:1);
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: `已取消${status?'停用':'启用'}`});
                    this.$set(row,'status',status?0:1);
                });

            }
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
            addLookEdit
        },
    }
</script>

