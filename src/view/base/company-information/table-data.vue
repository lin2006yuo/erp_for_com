<template>
    <div class="c-table-data">
        <el-row class="mt-xs mb-xs">
            <el-button size="mini" class="ml-sm"
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
                  highlight-current-row
                  @sort-change="$emit('sort',$event)"
                  empty-text="暂无数据">
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
            <el-table-column label="公司类型"
                             width="80"
                             prop="type">
            </el-table-column>
            <el-table-column label="资料来源"
                             width="80"
                             prop="source">
            </el-table-column>
            <el-table-column
                    label="公司注册号"
                    show-overflow-tooltip
                    prop="company_registration_number">
            </el-table-column>
            <el-table-column
                    label="公司法人/姓名"
                    prop="corporation">
            </el-table-column>
            <!--<el-table-column-->
            <!--label="收款账号"-->
            <!--show-overflow-tooltip-->
            <!--prop="collection_account">-->
            <!--</el-table-column>-->
            <el-table-column
                    label="VAT（%）"
                    prop="vat_code">
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
                    width="70"
                    prop="status_txt">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="account_count"
                    width="120"
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
                    type:'',
                    source:'',
                    company:'',
                    charter_url:[],
                    company_registration_number:'',
                    corporation:'',
                    corporation_identification:'',
                    corporation_id_front:[],
                    corporation_id_contrary:[],
                    company_time:'',
                    company_address_zip:'',
                    corporation_address_zip:'',
                    status:0,
                    channel:[],
                    id:0,
                    log:[],
                    business_term_st:'',
                    business_term_nd:'',
                    id_date_st:'',
                    id_date_nd:'',
                    open_licence:[],
                    open_bank:'',
                    open_bank_account:'',
                    open_date:'',
                    vat_data:[],
                    vat_attachment:[]
                },
            }
        },
        methods: {
            add(){
                this.deal_with_data(0);
                Reflect.ownKeys(this.form).forEach(key=>{
                    this.form[key]='';
                });
                this.form.id=0;
                this.form.type=0;
                this.form.status=0;
                this.form.channel=[];
                this.form.charter_url=[];
                this.form.corporation_id_front=[];
                this.form.corporation_id_contrary=[];
                this.form.open_licence=[];
                this.form.vat_data=[{vat:'',code:'',type:2}];
                this.form.vat_attachment=[{file:[]}];
                this.form.log=[];
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
                    let images=JSON.parse(res.images);
                    console.log(images,'json');
                    function deal_image(images) {
                        console.log(images,444);
                        if(images.length){
                            return images.map(image=>{
                                return {
                                    path:res.url_prefix+'/'+image.filePath,
                                    is_add:false,
                                    file_name:image.fileName,
                                    file_content:image.filePath
                                }
                            });
                        }else {
                            return [];
                        }
                    }
                    this.$set(res,'charter_url',deal_image(images.charter_url));
                    this.$set(res,'corporation_id_front',deal_image(images.corporation_id_front));
                    this.$set(res,'corporation_id_contrary',deal_image(images.corporation_id_contrary));
                    this.$set(res,'open_licence',deal_image(images.open_licence));
                    this.$set(res, 'business_term_st', res.business_term_st?res.business_term_st * 1000:'');
                    this.$set(res, 'business_term_nd', res.business_term_nd?res.business_term_nd * 1000:'');
                    this.$set(res, 'id_date_st', res.id_date_st?res.id_date_st * 1000:'');
                    this.$set(res, 'id_date_nd', res.id_date_nd?res.id_date_nd * 1000:'');
                    this.$set(res, 'company_time', res.company_time?res.company_time * 1000:'');
                    this.$set(res, 'open_date', res.open_date?res.open_date * 1000:'');
                    this.$set(res, 'vat_data', res.vat_data.length?res.vat_data:[{vat:'',code:'',type:2}]);
                    let vat_attachment=[{file:[]}];
                    if(res.vat_attachment.length){
                        res.vat_attachment.forEach(row=>{
                            row.file.forEach(file=>{
                                this.$set(file,'file_name',file.file_name);
                                this.$set(file,'path',res.url_prefix+'/'+file.file_content);
                                if(file)this.$set(file,'is_add',false);
                            })
                        });
                        vat_attachment=res.vat_attachment
                    }else {
                        vat_attachment=[{file:[]}]
                    }
                    this.$set(res,'vat_attachment',vat_attachment);
                    this.$set(res,'log',[]);
                    this.form=res;
                    this.dialogShow=true;
                }).catch(error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
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

