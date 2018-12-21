<template>
    <div class="colleague">
        <el-row>
            <el-col :span="24">
                <el-input class="center" placeholder="请输入内容" v-model="input5" style="width: 200px;">
                    <el-button @click.native="search" slot="append" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="24">
                ssss
            </el-col>
        </el-row>
    </div>
</template>
<style lang="stylus">
    .colleague{
        position: fixed;
        top: 0;
        right:0;
        border-left: 2px solid gray;
        margin-right:20px;
        box-shadow: 0 0 10px ;
        width:250px;
        height:100%;
        text-align: center;
    }
    .center{
        margin: 0 auto;
        border-radius: 20px;
    }
</style>
<script>

    export default{
        data(){
            return {
                input5:''
            }
        },
        methods:{
            search(){
                console.log("searchsearchsearchsearch");
            }
        },
        components: {}
    }
</script>
