<template>
    <div class="c-card-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <label-item label="账号用户名：">
                <el-input class="s-width-super"
                          v-model="searchData.username"
                          v-sf.snText></el-input>
            </label-item>
            <label-item label="联系邮箱：">
                <el-input class="s-width-super"
                          v-model="searchData.email"
                          v-sf.snText></el-input>
            </label-item>
            <label-item label="状态：" class="ml-sm">
                <el-select v-model="searchData.status"
                           class="s-width-small" v-sf.status
                           default-first-option filterable clearable>
                    <el-option
                            v-for="res in statusList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="有效期：" class="ml-sm">
                <el-date-picker
                        @keyup.enter.native="search"
                        type="date"
                        placeholder="开始时间"
                        v-sf.date_start
                        v-model="searchData.date_start"
                        class="date"
                        :picker-options="pickerStart"></el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                        @keyup.enter.native="search"
                        type="date"
                        placeholder="结束时间"
                        v-sf.date_end
                        v-model="searchData.date_end"
                        class="date mr-sm"
                        :picker-options="pickerEnd"></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                statusList:[
                    {label:'全部',value:''},
                    {label:'启用',value:0},
                    {label:'停用',value:1},
                ],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_end){
                            return time.getTime()>this.searchData.date_end;
                        }else{
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_start){
                            return time.getTime()<this.searchData.date_start;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        methods:{
            search(){
                this.$emit('search',this.searchData);
            },
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
            clears:{
                type:Object,
                required:true
            },
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>