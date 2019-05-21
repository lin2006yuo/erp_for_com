<template>
    <search-card :params="searchData"
                 @search="$emit('search')"
                 @enter="$emit('search')"
                 :clears="clears">
        <el-row>
            <label-buttons class='inline'
                           label="注册状态："
                           :max="11"
                           v-sf.status
                           :buttons="buttons"
                           @select="select">
            </label-buttons>
        </el-row>
        <label-item label="公司法人：" class="inline">
            <el-input v-model.trim="searchData.corporation"
                      class='width-super' v-sf.corporation></el-input>
        </label-item>
        <label-item label="法人身份证号：" class="inline ml-sm">
            <el-input v-model.trim="searchData.corporation_identification"
                      class='width-super' v-sf.corporation_identification></el-input>
        </label-item>
        <label-item label="添加时间：" class="inline ml-sm">
            <el-date-picker
                    v-model="searchData.create_time_st"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.create_time_st
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.create_time_nd"
                    type="date"
                    placeholder="选择日期"
                    class="inline date mr-sm"
                    v-sf.create_time_nd
                    :picker-options="inputTimeEnd">
            </el-date-picker>
        </label-item>
    </search-card>
</template>

<script>
    export default {
        name: "search",
        data() {
            return {
                inputTimeStart:{
                    disabledDate: (time)=> {
                        if(this.searchData.create_time_nd){
                            return time.getTime() > this.searchData.create_time_nd;
                        }else {
                            return false
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.create_time_st){
                            return time.getTime() < this.searchData.create_time_st;
                        }else {
                            return false
                        }
                    }
                },
            }
        },
        methods: {
            select(index,item){
                this.searchData.status=item.value;
                this.$emit('search');
            }
        },
        props: {
            buttons:Array,
            searchData:Object,
            clears:Object,
        },
        components: {
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>

