<template>
    <search-card @search="$emit('search')"
                 @enter="$emit('search')"
                 :params="searchData"
                 :clears="clears">
        <el-row>
            <label-buttons label="状态："
                           :buttons="status"
                           @select="select_status">
            </label-buttons>
        </el-row>
        <label-item label="公司名称：" >
            <el-select class="width-md"
                       v-sf.id
                       v-model="searchData.id"
                       filterable
                       clearable
                       placeholder="请选择">
                <el-option
                        v-for="item in companyName"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="公司法人：" class="ml-xs">
            <el-input type="text"
                      clearable
                      v-sf.corporation
                      v-model="searchData.corporation"
                      class="s-width-middle">
            </el-input>
        </label-item>
        <label-item label="添加时间：" class="ml-xs">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            class="inline date"
                            v-sf.time_start
                            :picker-options="inputTimeStart"
                            v-model="searchData.time_start">
            </el-date-picker>
            --
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
    import {api_get_company_name} from '@/api/company-info';
    export default {
        name: "search",
        data() {
            return {
                status:[
                    {label:'全部',value:''},
                    {label:'已启用',value:0},
                    {label:'已停用',value:1},
                ],
                companyName:[],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.time_end) {
                            return time.getTime() > this.searchData.time_end;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.time_start) {
                            return time.getTime() < this.searchData.time_start;
                        } else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted() {
            this.get_company_name();
        },
        computed: {},
        watch: {},
        methods: {
            select_status(index,item){
                this.searchData.status=item.value;
                this.$emit('search');
            },
            get_company_name(){
                this.$http(api_get_company_name).then(res=>{
                    this.companyName=res.data.map(row=>{
                        return {label:row.company,value:row.id}
                    });
                }).catch(({fail, error}) =>{
                    fail&&this.$message({type:'warning',message:fail});
                    error&&this.$message({type:'error', message:error});
                });
            }
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
            labelItem
        },
    }
</script>

