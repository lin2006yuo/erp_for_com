<template>
    <div class="c-ui-pagination">
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="data.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="data.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="data.count">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {}
        },
        methods:{
            size_change(val){
                this.$emit("size-change",val)
            },
            current_change(val){
                this.$emit("current-change",val)
            }
        },
        props:{
            data:{
                type:Object,
                required:true
            }
        },
        components: {}
    }
</script>