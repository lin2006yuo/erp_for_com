<template>
    <div class="c-statistics">
        <table class="template" v-if="statisticsData.length>0">
            <tr>
                <th>刊登平台</th>
                <th v-for="(item,index) in statisticsData" :keys="`${item.title}${index}`">{{item.title}}</th>
            </tr>
            <tr>
                <th>已刊登数</th>
                <td v-for="(item,index) in statisticsData" :keys="`${item.title}${index}`">{{item.publish_count}}</td>
            </tr>
        </table>
        <div  class="no-data-hints" v-else>
            暂无数据......
        </div>
    </div>
</template>
<style lang="stylus">
    .c-statistics{
        margin-top:10px;
        .no-data-hints{
            box-sizing:border-box;
            width:100%;
            height:500px;
            padding-top:100px;
            vertical-align:middle;
            text-align:center;
        }
    }
</style>
<script>

    export default {
        data() {
            return {}
        },
        mounted(){
            console.log('this.statisticsData',this.statisticsData);
        },
        props:{
            /*列表数据源
            * */
            statisticsData:{
                type:Array,
                required:true,
            }
        },
        components: {}
    }
</script>