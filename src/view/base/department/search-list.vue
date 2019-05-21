<template>
    <div class="p-search-list">
        <el-col :span="5" style="width:215px">
            <label-buttons label="状态：" :buttons="buttons" @select="changeSelect"></label-buttons>
        </el-col>
        <el-input  class="inline" placeholder="请输入部门/组名称..." v-model="keyword" @input="snText"></el-input>
        <el-button type="primary"  class="inline  ml-sm" size="mini" style="margin:0" @click.native="search()">搜索</el-button>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import labelButtons from '../../../components/label-buttons.vue';
    export default{
        data(){
            return {
                keyword:''
            }
        },
        methods:{
            changeSelect(val){
                console.log(val);
                this.$emit('changeSelect',val)
            },
            search(){
                this.$emit('search',this.keyword)
            },
            snText(){
                this.keyword=this.keyword.replace(/\s*/g,'')
            }
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