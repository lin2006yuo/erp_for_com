<template>
        <el-row class="c-card-size-box">
            <!--<card-size v-for="size in sizes" :size="size"></card-size>-->
            <el-col :span="6" v-for="(item,i) in sizeList">
                <el-checkbox-group v-model="sizeList[i].status" style="padding-left:60px;">
                    <el-checkbox>
                        <span>{{item.name}}</span>
                    </el-checkbox>
                </el-checkbox-group>
            </el-col>
        </el-row>
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
                sizeList:{
                    required:true,
                    type:Array
                }
            },
            components:{

            }
        }
    </script>