<template>
    <div class="c-integer-input">
        <input :class="[disabled?'disable':'','el-input__inner',error?'el-input-red':'']" @focus="focus" @change="change" :readonly="disabled?true:false" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
               @blur="blur" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
                type="text" v-model="value_" :min="min" :max="max" name="points" ref="input" @keyup="key_updown($event)">
    </div>
</template>
<style lang="stylus">
.el-input-red{
    border-color:red;
}
</style>
<script>

    export default {
        data() {
            return {
                value_:this.value,
            }
        },
        watch:{
            value_(val){
                this.$emit("input",val);
            },
            value(val){
                this.value_ = val;
            },
        },
        methods:{
            change(){
                this.$emit("change");
            },
            blur(){
                console.log('blur');
                this.$emit("blur");
            },
            focus(){
                this.$emit("focus");
            },
            key_updown(ev){
                this.$emit("key-updown", ev);
            }
        },
        props:{
            min:{
                type:Number,
            },
            max:{
                type:Number,
            },
            value:{},
            disabled:{
                type:Boolean,
                default(){
                    return false
                },
            },
            error:{
                type:Boolean,
                default(){
                    return false
                },
            }
        },
        components: {}
    }
</script>
