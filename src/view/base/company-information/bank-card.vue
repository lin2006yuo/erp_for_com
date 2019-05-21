<template>
    <div>
        <input  type="text"
                v-model="tempValue"
                class="el-input el-input--mini bank-card-item"
                @keyup="tempValue=tempValue.replace(/\s/g,'').replace(/[^\d]/g,'').replace(/(\d{4})(?=\d)/g,'$1 ')"
                onafterpaste="tempValue=tempValue.replace(/\s/g,'').replace(/[^\d]/g,'').replace(/(\d{4})(?=\d)/g,'$1 ')"
                :maxlength="maxlength">
    </div>
</template>

<style lang="stylus">
    .bank-card-item{
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
</style>

<script>
    export default {
        name: "bank-card",//银行卡号
        data() {
            return {
                tempValue:this.value,
            }
        },
        watch: {
            tempValue(val){
                this.$emit("input",val);
            },
            value(val){
                this.tempValue = val;
            }
        },
        props: {
            value:String,
            maxlength:{//控制位数，一般银行卡19位数字，信用卡16位
                type:Number,
                default:23,
            }
        },
    }
</script>

