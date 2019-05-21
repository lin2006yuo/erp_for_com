<template>
        <el-row class="c-remark-history">
            <el-table
                    height="300"
                    class="scroll-bar"
                    border
                    :data="history"
                    style="width: 100%">
                <el-table-column inline-template label="操作时间" width="180">
                    <div>
                        {{row.create_time|timeFilter}}
                    </div>
                </el-table-column>
                <el-table-column prop="operator" label="操作人"  width="180"></el-table-column>
                <el-table-column label="操作类型" prop="process" width="180" align="center" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="操作信息" inline-template align="left">
                    <template v-for="item in row.remark">
                        <div class="ml-sm">{{item}}</div>
                    </template>

                </el-table-column>
            </el-table>
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
            filters:{
                timeFilter(val){
                    return datef('YYYY-MM-dd HH:mm:ss',val);
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