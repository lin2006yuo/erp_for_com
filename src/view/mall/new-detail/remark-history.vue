<template>
        <el-row class="c-remark-history">
            <el-col :span="24" v-for="h in history">
                <div>
                    <span>{{h.author}}</span>
                    <span>{{h.dtime}}</span>
                </div>
                <div>
                    {{h.msg}}
                </div>
            </el-col>
        </el-row>
    </template>
    <style lang="stylus">
        .c-remark-history{
            font-size:1.2rem;
        }
    </style>
    <script>

        export default{
            data(){
                return{

                }
            },
            props:{
                history:{
                    required:true,
                    type:Array
                }
            },
            components:{

            }
        }
    </script>