<template>
    <div class="c-condition-components">
        <el-row :gutter="8">
            <el-col :span="12">
                <div class="condition-box">
                    <!--第一个条件需要展示头部-->
                    <div class="condition-header" v-if="showTitle">刷单条件</div>
                    <div class="condition-content">
                        <el-input v-if="sourceData.type===0" class="inline width-xs"></el-input>
                        <el-radio v-model="radio" v-if="sourceData.type===1">备选项</el-radio>
                        <el-checkbox v-model="checked" v-if="sourceData.type===2">备选项</el-checkbox>
                        {{sourceData.name}}
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="condition-box">
                    <!--第一个条件需要展示头部-->
                    <div class="condition-header" v-if="showTitle">指定参数</div>
                    <!--1-复选 2-单选 3-文本框 4-多文本框 5-复选+文本框输入  6-单选+文本框输入 7-复选+2个文本框 8-分类树 9-两个文本框 4.前后文本框-->
                    <div class="condition-content">
                        <type1 v-if='sourceData.detail.type===1'  :source-data="sourceData.detail.data"></type1>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<style lang="stylus">
    .c-condition-components{
        .condition-box{
            .condition-header{
                padding-left:10px;
                line-height:35px;
                background-color:#33B2FC;
                font-size:1.3rem;
                border:1px solid #33B2FC;
                border-bottom:0;
                color:#fff;
            }
            .condition-content{
                padding:20px 10px;
                border:1px solid #ddd;
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {}
        },
        mounted(){
            console.log(this.sourceData,'sourceData');
        },
        props:{
            sourceData:{},
            showTitle:{}
        },
        components: {
            type1:require('./type1.vue').default,
        }
    }
</script>