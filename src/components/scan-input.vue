<template>
    <el-input type="text" :readonly="readonly" v-model="name"
              @keyup.native.enter="enter"
              ref="scan"
              :icon="icon"
              @focus="select" :min="min">
        <template v-if="append" slot="append">{{append}}</template>
    </el-input>
</template>
<style lang="stylus" scoped>

</style>
<script>
    export default {
        data(){
            return{
                name:this.value,
            }
        },
        methods:{
            enter(val){
                this.blur();
                this.$nextTick(_=>{
                    this.name=val.target.value;
                    setTimeout(()=>{
                        this.$emit('enter');
                        this.isFocus&&this.focus();
                    },300)
                })
            },
            focus(){
                this.$refs.scan.$refs.input.focus()
            },
            select(){
                this.$refs.scan.$refs.input.select()
            },
            blur(){
                this.$emit('blur');
                this.$refs.scan.$refs.input.blur();
            }
        },
        watch:{
            value(val){
                this.name=val;
            },
            name(val){
                if(/([\d\w])+(\.enter){2}$/.test(val)){
                    this.name=val.target.value;
                    return this.$emit('enter');
                }
                this.$emit("input",val);
                this.$emit('change', val);
            }
        },
        props:{
            value:{},
            isFocus:{
                default:false
            },
            min:{},
            icon:{},
            readonly:{},
            append:{}
        }
    }
</script>
