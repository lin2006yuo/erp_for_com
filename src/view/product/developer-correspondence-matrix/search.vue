<template>
    <search-card @search="search"
                 @enter="search"
                 :params="searchData"
                 :clears="clears">
        <label-item :labelWidth="60" label="开发员：" class="inline">
            <div class="label-width">
                <super-select v-model="searchData.developer_id"
                              storage-key="development" placeholder="全部"
                              :options="developerOptions"></super-select>
            </div>
        </label-item>
        <label-item :labelWidth="60" label="摄影师：" class="inline">
            <div class="label-width">
                <super-select v-model="searchData.grapher"
                              storage-key="grapher" placeholder="全部"
                              :options="grapherOptions"></super-select>
            </div>
        </label-item>
        <label-item :labelWidth="60" label="翻译员：" class="inline">
            <div class="label-width">
                <super-select v-model="searchData.translator"
                              storage-key="translator" placeholder="全部"
                              :options="translatorOptions"></super-select>
            </div>

        </label-item>
        <label-item :labelWidth="70" label="添加时间：" class="inline">
            <el-date-picker class="date inline"
                            v-model="searchData.create_time_st"
                            type="date"
                            :picker-options="inputTimeStart"
                            placeholder="开始时间"></el-date-picker>
            <span> -- </span>
            <el-date-picker class="date inline mr-sm"
                            v-model="searchData.create_time_nd"
                            type="date"
                            :picker-options="inputTimeEnd"
                            placeholder="结束时间"></el-date-picker>
        </label-item>
    </search-card>
</template>

<script>
    import {api_developer,api_grapher,api_translator} from "@/api/developer-correspondence-matrix.js"
    export default {
        name: "search",
        data(){
            return{
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.create_time_nd) {
                            return time.getTime() > this.searchData.create_time_nd;
                        } else {
                            return false
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.create_time_st) {
                            return time.getTime() < this.searchData.create_time_st;
                        } else {
                            return false
                        }
                    }
                },
                developerOptions:[],
                translatorOptions:[],
                grapherOptions:[]
            }
        },
        created(){
            this.getDeveloperList();
            this.getTranslatorList();
            this.getGrapherList();
        },
        methods:{
            getDeveloperList(){
                this.$http(api_developer).then(res=>{
                    this.developerOptions = res.map((val)=>{
                        return {
                            label:val.realname,
                            value:val.id
                        }
                    });
                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                });
            },
            getTranslatorList(){
                this.$http(api_translator).then(res=>{
                    this.translatorOptions = res.map((val)=>{
                        return {
                            label:val.realname,
                            value:val.id
                        }
                    })

                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||code});
                })
            },
            getGrapherList(){
                this.$http(api_grapher).then(res=>{
                    this.grapherOptions = res.map((val)=>{
                        return {
                            label:val.realname,
                            value:val.id
                        }
                    })

                }).catch((error)=>{
                    this.$message({type:'error',message:error.message||error});
                })
            },
            search(){
                this.$emit("search")
            }
        },
        props:{
            searchData:{},
            clears:{}
        },
        components:{
            "label-item":require("@/components/label-item.vue").default,
        }
    }
</script>

<style lang="stylus" scoped>
    .label-width{
        display:inline-block;
        width:120px;
    }
</style>
