<template>
    <div :class="[isAppear?'':'off-appear','c-decimal-input']">
        <input  type="number"
                name="points"
                v-model="inputVal"
                :step="step"
                :min="min"
                :max="max"
                ref="input"
                class="el-input el-input--mini c-decimal-input-item"
                @focus="$emit('focus')"
                @change="$emit('change')"
                @blur="blur(inputVal)"
                @keyup="$emit('keyup',$event)"
                :disabled="disabled"
                onkeyup="this.value=this.value.match(/\d+(\.\d{0,2})?/)?this.value.match(/\d+(\.\d{0,2})?/)[0]:''"
                onafterpaste="this.value=this.value.match(/\d+(\.\d{0,2})?/)?this.value.match(/\d+(\.\d{0,2})?/)[0]:''">
    </div>
</template>

<style lang="stylus">
    .c-decimal-input{
        .c-decimal-input-item{
            width :inherit;
            border: 1px solid ;
            border-color :#C0CCDA;
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
    export default {
        name: "decimal-input",//可保留两位小数
        data() {
            return {
                inputVal:this.value
            }
        },
        watch: {
            inputVal(val){
                this.$emit("input",val);
            },
            value(val){
                this.inputVal = val;
            }
        },
        methods:{
            blur(val){
                if(Number(val)>=this.max){
                    return this.inputVal=this.max;
                }
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

