<template>
    <el-row>
        <slot></slot>
        <div v-for="slot in slots2">{{slot}}</div>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return {}
        },
        mounted(){
            console.log(this.$slots);
            this.$children.forEach(child=>{

            });
        },
        watch:{
            'slots'(){
                console.log('ssslot')
            }
        },
        computed:{
            slots2(){
                console.log('slotsssss');
                return this.$slots;
            }
        },
        components: {}
    }
</script>
