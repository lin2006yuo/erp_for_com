<template>
    <div :class="[isAppear?'':'off-appear','c-natural-number-input']">
        <input  type="number"
                name="points"
                v-model="inputVal"
                :step="step"
                ref="input"
                class="el-input el-input--mini c-natural-number-input-item"
                @focus="$emit('focus')"
                @change="$emit('change')"
                @blur="$emit('blur')"
                @keyup="$emit('keyup',$event)"
                :disabled="disabled"
                autoComplete="off"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[\D]/g,'')}else{this.value=this.value.replace(/^[^1-9]*|\D/g,'')}"
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[\D]/g,'')}else{this.value=this.value.replace(/^[^1-9]*|\D/g,'')}"
                :min="min"
                :max="max">
    </div>
</template>

<style lang="stylus" >
    .c-natural-number-input{
        .c-natural-number-input-item{
            border: 1px solid ;
            border-color :#C0CCDA;
            width :inherit;
            height: 26px;
            border-radius: 3px;
            box-sizing: border-box;
            display: inline-block;
            font-size: inherit;
            padding: 0 10px;
            &:focus{
                border-color :#33B2FC;
                outline :none;
            }
        }
    }
    .off-appear{
        input::-webkit-inner-spin-button,input::-webkit-outer-spin-button{
            -webkit-appearance: none;
        }
        input[type="number"] {
            -moz-appearance: textfield;
        }
    }
</style>

<script>
    //setp 点击问题，小数点四舍五入问题,number类型的小数点
    export default {
        name: "natural-number-input",//自然数输入框
        data() {
            return {
                inputVal:this.value,
            }
        },
        watch: {
            inputVal(val){
                let index = String(val).indexOf('.');
                if(index!==-1){
                    let num=String(val).slice(0,index)+String(val).slice(index+1,String(val).length);
                    val=Number(num);
                }
                this.$emit("input",val);
            },
            value(val){
                this.inputVal = val;
            }
        },
        props: {
            value:{},
            step:{
                type: Number,
                default: 1
            },
            isAppear:{//按钮是否出现
                type:Boolean,
                default:true
            },
            disabled:{
                type:Boolean,
                default:false
            },
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: Infinity
            },
        },
    }
</script>

