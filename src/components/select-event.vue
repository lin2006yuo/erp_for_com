<template>
    <el-select :placeholder="placeholder">
        <el-option v-for="i in options" :key="i.value" @click.native="click(i.action)" :label="i.label" :value="i.value"></el-option>
    </el-select>
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
            placeholder:{
                default:'请选择'
            },
            options:{
                required:true,
                type:Array
            }
        },
        methods:{
            click(action){
                action && action.call(this.$parent);
            }
        },
        components:{

        }
    }
</script>