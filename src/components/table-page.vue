<template>
    <el-row class="c-table-page">
        <el-table
                :data="lists"
                :height="height"
                border
                style="width: 100%">
            <slot></slot>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=this.table.page
                :page-sizes="[20,50,100,200,500]"
                :page-size=this.table.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total="this.table.total"
        ></el-pagination>
    </el-row>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        methods:{
            handleSizeChange(size){
                this.table.size = size;
            },
            handleCurrentChange(page){
                this.table.page = page;
            }
        },
        props:{
            table:{
                required:true,
                type:Object
            },
            action:{
                required:true,
                type:String
            }
        },
        components:{

        }
    }
</script>