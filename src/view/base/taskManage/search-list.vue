<template>
    <page class="p-search-list">
        <label-buttons label="状态:" :buttons="buttons" @select="changeSelect"></label-buttons>
        <div>
            <label class="inline ml-sm">筛选条件：</label>
            <el-select v-model="snType" placeholder="任务名称"  class="inline" style="width: 120px;">
                <el-option
                        :key="item.value"
                        v-for="item in options"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="snText" class="inline"></el-input>
                <label class="inline ml-sm">创建日期：</label>
                <el-date-picker type="date" placeholder="开始时间" v-model="date_b"   class="inline"></el-date-picker>&nbsp;至&nbsp;
                <el-date-picker type="date" placeholder="结束时间" v-model="date_e"   class="inline"></el-date-picker>
            <el-button type="primary" @click="search_list"  class="inline  ml-sm" size="mini">搜索</el-button>
        </div>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import labelButtons from '../../../components/label-buttons.vue';

    export default{
        data(){
            return {
                options:[
                    {
                        value: '执行时间',
                        label: '1'
                    }, {
                        value: '执行周期',
                        label: '2'
                    },
                ]
            }
        },
        methods:{
            changeSelect(select){
                console.log(select)
            },
            search_list(){

            },
        },
        props:{
            buttons:{
                required:true,
                type:Array
            }
        },
        components: {
            labelButtons
        }
    }
</script>