<template>
    <el-row class="c-test-slot">
        <span @click="ggg">{{gg}}</span>
        <span @click="event">event</span>
        <slot></slot>
        <slot name="ggg"></slot>
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
        methods:{
            event(){
                this.$emit('event', 'eventevent')
            }
        },
        watch:{
        },
        props:{
            gg:{
                required:true,
            },
            ggg:{
                required:true
            }
        },
        components:{

        }
    }
</script>