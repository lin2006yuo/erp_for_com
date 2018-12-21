<template>
    <el-select style='width:15%'
               v-model="source.attribute_value"
               remote :remote-method="remote_method"
               placeholder="输入搜索更多..."
               default-first-option filterable clearable>
        <el-option
                v-for="res in queryOptions"
                :label="res"
                :value="res"
                :key="res"
        ></el-option>
    </el-select>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                queryOptions:[],
            }
        },
        methods:{
            remote_method(query){
                if(query==='')return;
                this.queryOptions = this.source.options.filter(row=>{
                    return row.toLowerCase()
                        .indexOf(query.toLowerCase())>-1
                })
            },
        },
        props:{
            source:{
                required:true,
                type:Object,
            }
        },
        components: {}
    }
</script>