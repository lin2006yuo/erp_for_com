<template>
        <el-row class="c-card-color-box" >
            <el-col :span="24">
                <label class="box-label">{{label}}</label>
            </el-col>
            <el-col :span="5" v-for="(item,i) in colorF" style="margin-top:2px;">
                <el-checkbox-group v-model="colorF[i].status" style="padding-left:60px">
                    <el-checkbox>
                        <span class="color-box" :style="{backgroundColor:item.value}"></span>
                        <span>{{item.name}}</span>
                    </el-checkbox>
                </el-checkbox-group>
            </el-col>
        </el-row>
    </template>
    <style lang="stylus">
        .color-box{
            width:24px;
            height:24px;
            display:inline-block;
            border:1px solid #ddd;
            vertical-align: middle;
        }
    </style>
    <script>
        export default{
            data(){
                return{

                }
            },
            props:{
                colorF:{
                    required:true,
                    type:Array
                }
            },
            components:{

            }
        }
    </script>