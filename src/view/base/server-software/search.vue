<template>
    <search-card @search="$emit('search')"
                 @enter="$emit('search')"
                 :params="searchData"
                 :clears="clears">
        <el-row>
            <label-buttons label="状态："
                           :buttons="types"
                           class="inline"
                           @select="select_type">
            </label-buttons>
            <label-buttons class="inline ml-xs"
                           label="是否升级："
                           :buttons="levels"
                           @select="select_level">
            </label-buttons>
        </el-row>
        <label-item label="服务器名：">
            <el-input type="text"
                      clearable
                      v-sf.corporation
                      v-model="searchData.name"
                      class="s-width-middle">
            </el-input>
        </label-item>
        <label-item label="更新升级时间：" class="ml-xs">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            class="inline date"
                            v-sf.time_start
                            :picker-options="inputTimeStart"
                            v-model="searchData.time_start">
            </el-date-picker>
            <label> -- </label>
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

<style lang="stylus" >

</style>

<script>
    import {api_get_server_software_type} from '@/api/server-software'
    export default {
        name: "search",
        data() {
            return {
                types:[],
                levels:[
                    {label:'全部',value:''},
                    {label:'是',value:0},
                    {label:'否',value:1},
                ],
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
        mounted(){
            this.$http(api_get_server_software_type).then(res=>{
                this.types=[{label:'全部',value:''},...res.map(row=>{
                    return {label:row.label,value:row.value}
                })];
            }).catch( error =>{
                console.log(error);
            });
        },
        methods: {
            select_type(index,item){
                this.$emit('select-type',item)
            },
            select_level(index,item){
                this.$emit('select-level',item)
            }
        },
        props: {
            searchData:{
                type:Object,
                required:true
            },
            clears:{}
        },
        components: {
            labelButtons:require('@/components/label-buttons').default,
            labelItem:require('@/components/label-item').default
        },
    }
</script>

