<template>
    <page-dialog :title="`${title}选择公司`"
                 v-model="show"
                 width="70%"
                 @change="open_dialog">
        <el-row class="mt-sm mb-sm">
            <label-item label="公司类型：">
                <el-select v-model="searchData.type"
                           class="s-width-default "
                           @change="companyTypeChange">
                    <el-option v-for="type in companyType"
                               class="s-width-default"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="公司名称：" class="ml-sm">
                <super-select v-model="searchData.id"
                              :options="companyName"
                              :storage-key="`checkCompanyNameTestCompany`"
                              class="width-super">
                </super-select>
            </label-item>
            <el-button size="mini" type="primary" @click.native="init">搜索</el-button>
        </el-row>
        <el-table :data="companyData"
                  v-loading="loading"
                  border
                  height="550"
                  highlight-current-row
                  element-loading-text="玩命加载中"
                  @row-click="row_click">
            <el-table-column label="单选" width="60">
                <template slot-scope="scope">
                    <el-radio class="radio"
                              v-model="singleCheck"
                              :label="scope.row.id"
                              @change.native="change(scope.row)">&nbsp</el-radio>
                </template>
            </el-table-column>
            <el-table-column label="公司名称"
                             prop="company"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    label="公司类型"
                    prop="type">
            </el-table-column>
            <el-table-column label="资料来源"
                             prop="source">
            </el-table-column>
            <el-table-column label="公司法人/姓名"
                             prop="corporation">
            </el-table-column>
            <el-table-column label="注册账号数"
                             prop="account_count">
            </el-table-column>
        </el-table>
        <el-pagination
                class="mt-sm fr"
                @size-change="size_change"
                @current-change="page_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <el-row slot="footer" class="dialog-footer">
            <el-button size="mini"
                       type="primary"
                       @click.native="submit">确 定
            </el-button>
            <el-button size="mini" @click.native="show=false">关 闭
            </el-button>
        </el-row>
    </page-dialog>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_get_company_name,api_get_company_info_list} from '@/api/company-info'
    export default {
        name: "select-company",
        data() {
            return {
                show:this.value,
                companyType:[
                    {label:'企业',value:0},
                    {label:'个人',value:1}
                ],
                searchCompanyType: {type: 0},
                companyName:[],
                searchData:{
                    type:0,
                    id:'',
                    page:1,
                    pageSize:20
                },
                companyData:[],
                total:0,
                singleCheck:'',
                selectedObj:{},
                loading: false,
            }
        },
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            }
        },
        methods: {
            open_dialog(isOpen){
                if(isOpen){
                    this.searchData={
                        type:0,
                        id:'',
                        page:1,
                        pageSize:20
                    };
                    this.singleCheck='';
                    this.selectedObj={};
                    this.get_company(this.searchCompanyType);
                    this.init();
                }
            },
            get_company(companyType){
                this.loading = true;
                this.$http(api_get_company_name,companyType).then(res=>{
                    this.loading = false;
                    this.companyName=res.data.map(row=>{
                        return {label:row.company,value:row.id}
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            init(){
                this.$http(api_get_company_info_list,this.searchData).then(res=>{
                    this.companyData=res.data;
                    this.total=res.count;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            companyTypeChange() {
                this.searchCompanyType.type = this.searchData.type;
                this.get_company(this.searchCompanyType)
            },
            change(row){
                this.singleCheck=row.id;
                this.selectedObj=row;
            },
            row_click(row){
                this.singleCheck=row.id;
                this.selectedObj=row;
            },
            size_change(size){
                this.$set(this.searchData,'pageSize',size);
                this.init();
            },
            page_change(page){
                this.$set(this.searchData,'page',page);
                this.init();
            },
            submit(){
                if(!this.singleCheck)return this.$message({type:'warning',message:'请先选择公司'});
                this.$emit('export-company',this.selectedObj);
            }
        },
        props: {
            value:Boolean,
            title:String
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>

