<template>
    <table class="template">
        <tr>
            <th>时间</th>
            <th>队列</th>
            <th>元素</th>
        </tr>
        <tr v-for="log in logs" :key="log.time">
            <td>{{log.time|fdatetimes}}</td>
            <td>{{log.worker}}</td>
            <td></td>
        </tr>
    </table>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        props:{
            logs:{}
        },
        components:{

        }
    }
</script>