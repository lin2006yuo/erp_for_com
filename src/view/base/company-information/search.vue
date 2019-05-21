<template>
    <search-card @search="$emit('search')"
                 @enter="$emit('search')"
                 :params="searchData"
                 :clears="clears">
        <el-row>
            <label-buttons label="公司类型："
                           class="inline"
                           :buttons="companyType"
                           @select="select_company_type">
            </label-buttons>
            <label-buttons label="状态："
                           class="inline"
                           :buttons="status"
                           @select="select_status">
            </label-buttons>
        </el-row>
        <label-item label="公司名称：" >
            <super-select v-model="searchData.id"
                          v-sf.id
                          :options="companyName"
                          :storage-key="`companyInfoCompany`"
                          class="width-super">
            </super-select>
        </label-item>
        <label-item label="公司法人：" class="ml-sm">
            <el-input v-sf.corporation
                      v-model="searchData.corporation"
                      class="s-width-middle">
            </el-input>
        </label-item>
        <label-item label="资料来源：" class="ml-sm">
            <el-select class="width-md"
                       v-sf.source
                       v-model="searchData.source"
                       filterable
                       clearable
                       placeholder="请选择">
                <el-option
                        v-for="item in dataSource"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="注册账号数：" class="ml-sm">
            <natural-number-input v-model.number="searchData.account_count_st"
                                  v-sf.account_count_st
                                  :min="0"
                                  :is-appear="false"
                                  style="width:80px">
            </natural-number-input>
            <label>~</label>
            <natural-number-input v-model.number="searchData.account_count_nd"
                                  v-sf.account_count_nd
                                  :min="Number(searchData.account_count_st)"
                                  :is-appear="false"
                                  style="width:80px">
            </natural-number-input>
        </label-item>
        <label-item label="添加时间：" class="ml-sm">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            class="inline date"
                            v-sf.time_start
                            :picker-options="inputTimeStart"
                            v-model="searchData.time_start">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker type="date"
                            placeholder="选择日期"
                            class="inline date mr-sm"
                            v-sf.time_end
                            :picker-options="inputTimeEnd"
                            v-model="searchData.time_end">
            </el-date-picker>
        </label-item>
    </search-card>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import labelButtons from '@/components/label-buttons.vue';
    import labelItem from '@/components/label-item.vue'
    import {api_get_company_name,api_get_company_type,api_get_company_source} from '@/api/company-info';
    import {integer} from '@/define/validator_reg';
    import naturalNumberInput from '@/view/base/server-management/natural-number-input'
    export default {
        name: "search",
        data() {
            return {
                companyType:[],
                status:[
                    {label:'全部',value:''},
                    {label:'正常',value:0},
                    {label:'异常',value:1},
                    {label:'注销',value:2},
                ],
                companyName:[],
                dataSource:[],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.time_end) {
                            return time.getTime() > this.searchData.time_end;
                        } else {
                            return false
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.time_start) {
                            return time.getTime() < this.searchData.time_start;
                        } else {
                            return false
                        }
                    }
                },
            }
        },
        mounted() {
            this.get_company_type();
            this.get_company_name();
            this.get_company_source();
        },
        methods: {
            select_company_type(index,item){
                this.searchData.type=item.value;
                this.$emit('search');
            },
            select_status(index,item){
                this.searchData.status=item.value;
                this.$emit('search');
            },
            get_company_type(){
                let CompanyType = JSON.parse(localStorage.getItem('companyType'));
                if(!CompanyType||!CompanyType.length){
                    this.$http(api_get_company_type).then(res=>{
                        this.companyType=[{label:'全部',value:''},...res.data];
                        localStorage.setItem('companyType',JSON.stringify(res.data));
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }else {
                    this.companyType=[{label:'全部',value:''},...CompanyType];
                }
            },
            get_company_name(){
                this.$http(api_get_company_name).then(res=>{
                    this.companyName=res.data.map(row=>{
                        return {label:row.company,value:row.id}
                    });
                }).catch((error) =>{
                    error&&this.$message({type:'error', message:error});
                });
            },
            get_company_source(){
                let CompanySource=JSON.parse(localStorage.getItem('companySource'));
                if(!CompanySource||!CompanySource.length){
                    this.$http(api_get_company_source).then(res=>{
                        this.dataSource=[{label:'全部',value:''},...res.data];
                        localStorage.setItem('companySource',JSON.stringify(res.data));
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }else {
                    this.dataSource=[{label:'全部',value:''},...CompanySource];
                }
            },
        },
        props: {
            searchData:{
                required:true,
                type:Object
            },
            clears:{
                required:true,
                type:Object
            }
        },
        components: {
            labelButtons,
            labelItem,
            naturalNumberInput,
        },
    }
</script>

