<template>
    <el-pagination
            :class="[fixed?'fixed-pagination':'']"
            @size-change="size_change"
            @current-change="page_change"
            :current-page="page"
            :page-sizes="sizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
</template>
<style lang="stylus" scoped>
</style>
<script>

    export default{
        data(){
            return {
                page:1,
                pageSize:50
            }
        },
        methods:{
            size_change(val){
                this.$emit('size',val)
            },
            page_change(val){
                this.$emit('page',val)
            }
        },
        props:{
            sizes:{
                type:Array,
                default:()=>{
                    return [10, 20, 30, 40]
                }
            },
            total:{
                required:true,
                type:Number
            },
            fixed:{
                type:Boolean,
                default:true
            }
        },
        components: {}
    }
</script>