<template>
    <div class="c-whole-sale">
        <table class="template">
            <tr>
                <th>优惠区间</th>
                <th>最小数量</th>
                <th>最大数量</th>
                <th>单价[RM]</th>
                <th>操作</th>
            </tr>
            <tr v-for="(item,index) in form.wholesales">
                <td>优惠区间{{index+1}}</td>
                <td>
                    <el-input v-model="item.min" :disabled="index!==0"></el-input>
                </td>
                <td class="el-input">
                    <input v-model="item.max" @blur="blur_max(item)" class="el-input__inner">
                </td>
                <td>
                    <el-input v-model="item.unit_price"></el-input>
                </td>
                <td>
                    <el-button type="text" @click.native="cur_delete(index)">删除</el-button>
                </td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            cur_delete(index){
                this.form.wholesales.splice(index,1);
            },
            blur_max(item){
                if(Number(item.max)<=Number(item.min)){
                    item.max = Number(item.min)+1;
                }
            },
        },
        props:{
            form:{
                type:Object,
                required:true,
            },
        },
        components: {}
    }
</script>