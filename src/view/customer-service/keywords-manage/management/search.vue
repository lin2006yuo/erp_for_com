<template>
    <div>
        <search-card @search="search" @enter=search :params="searchData" :clears="clears">
            <el-row>
                <label-buttons label="类型："
                               class="inline mr-sm"
                               @select="selectType"
                               :buttons="typeList">
                </label-buttons>
                <label-buttons label="平台："
                               class="inline mr-sm"
                               @select="selectPlatform"
                               :buttons="platformList">
                </label-buttons>
                <label-buttons label="状态："
                               class="inline"
                               @select="selectStatus"
                               :buttons="statusList"
                               :default-index="1">
                </label-buttons>
            </el-row>
            <label title="请输入关键词">关键词：</label>
            <el-input class="s-width-default inline" type="text" v-model="searchData.keyword"></el-input>
            <label title="请选择开始结束时间" class="ml-sm">添加时间：</label>
            <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model="searchData.start_date"
                v-sf.start_date
                class="inline date"
                :picker-options="pickerStart">
            </el-date-picker>&nbsp;--
            <el-date-picker type="date"
                            placeholder="结束时间"
                            v-model="searchData.end_date"
                            v-sf.end_date
                            :picker-options="pickerEnd"
                            class="inline mr-sm date">
            </el-date-picker>
        </search-card>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                pickerStart: {
                    disabledDate: (time) => {
                        console.log('0', time.getTime());
                        if (this.searchData.end_date) {
                            return time.getTime() >this.searchData.end_date;
                        } else {
                            return time.getTime()> Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        console.log('1', time.getTime());
                        if (this.searchData.start_date) {
                            return time.getTime() < this.searchData.start_date ||time.getTime() > Date.now();
                        }else {
                            return false;
                        }
                    }
                },
            }
        },
        filters:{},
        mounted(){},
        methods:{
            search(){
                this.$emit("search")
            },
            selectType(item){
                this.$emit('select-type', item);
            },
            selectStatus(item){
                this.$emit('select-status', item);
            },
            selectPlatform(item){
                this.$emit('select-platform', item);
            },
        },
        computed:{},
        props: {
            typeList: {required: true, type: Array},
            platformList: {required: true, type: Array},
            statusList: {required: true, type: Array},
            searchData: {required: true, type: Object},
            clears: {required: true, type: Object}
        },
        components:{
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
        }
    }
</script>

<style lang="stylus">

</style>
