<template>
    <span>
        <el-checkbox name="rule2" v-model="checkbox" :label="form.title"></el-checkbox>
        <p class="rule-desc" v-if="form.desc">{{form.desc}}</p>
    </span>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                checkbox:this.value,
            }
        },
        watch:{
            value(val){
                this.checkbox = val;
            },
            checkbox(val){
                this.$emit('input',val);
            }
        },
        props:{
            form:{},
            value:{}
        },
        components:{

        }
    }
</script>