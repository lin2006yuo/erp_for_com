<template>
    <el-row>
product...........dddd
    </el-row>
</template>
<style lang="stylus">
    .options{
        padding-top: 10px;
        padding-left: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid gray;
    }
</style>
<script>

    export default{
        name:'product',
        data(){
            return {
                input5: '',
                select: 1,
                tableData:[
                    {date:'234214112',name:'ggggfff',address:'address1a'},
                    {date:'234214112',name:'ggggsss',address:'address1ddddddddddd   '},
                    {date:'234214112',name:'gggggaa',address:'address1aaaaaa'},
                ]
            }
        },
        mounted(){
            console.log('product mounted');
        },
        activated(){
            console.log('activated')
        },
        methods:{
            formatter(row, column){
                return row.address;
            },
            handleSizeChange(sizeChange){
                console.log('sizeChange');
            },
            handleCurrentChange(pageChange){
                console.log('pageChange');
            }
        },
        components: {}
    }
</script>
