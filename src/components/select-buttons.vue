<template>
    <el-select v-if ="options.length>0" class="select-buttons" v-model="selected">
        <el-option
                :key="item.value"
                v-for="item in buttons"
                :label="item.label"
                :value="item.value"
        ></el-option>
    </el-select>
</template>
<style lang="stylus">
    .select-buttons{
        *{
            text-align: center !important;
        };
    }
</style>
<script>

    export default{
        data(){
            return{
                selected:"",
            }
        },
        watch:{
            selected(new_,old_){
                if(new_){
                    this.$emit('action',new_, old_);
                    setTimeout(()=>{
                        this.selected  = old_;
                    },0)
                }
            }
        },
        computed:{
            options(){
                return [{label:'更多操作',value:0},...this.buttons];
            }

        },
        props:{
            buttons:{
                required:true,
                type:Array
            }
        },
        components:{

        }
    }
</script>