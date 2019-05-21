<template>
    <el-row class="c-role-list">
        <el-checkbox-group  class="row-role-list card" v-model="roleList1" @change="xxx">
            <el-checkbox class="role-list" v-for="item in roleList" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
    </el-row>
</template>
<style lang="stylus">
    .c-role-list{
        .role-list{
            box-sizing: border-box;
            width:15%;
            height:30px;
            line-height:30px;
            padding-left:10px;
        }
        .row-role-list{
            margin-bottom:5px;
            border:1px solid #ccc;
            .el-checkbox{
                margin-left:0;
            }
        }
    }
</style>
<script>
    export default{
        data(){
            return {
                roleList1:[],
            }
        },
        props:{
            roleList:{
                required:true,
                type:Array
            }
        },
        components: {}
    }
</script>

