<template>
    <div class="c-limit-input">
        <el-row>
            <el-col :span="curSpan">
                <el-input v-if="!isTextarea"
                          v-model="inputValue"
                          @input="judge_input"
                          @blur="blur_change"
                          :maxlength="maxlength"></el-input>
                <el-input v-else
                          v-model="inputValue"
                          type="textarea"
                          :autosize="customAutosize"
                          @input="judge_input"
                          @blur="blur_change"
                          :maxlength="maxlength"></el-input>
                <span v-if="isRed" style="color:red">(注意：超出最大字数限制)</span>
            </el-col>
            <el-col v-if="!isTextarea&&showNumber" :span="surplusSpan">
                <div class="ml-mini">
                    <span><span :class="{'is-red':isRed}">{{comLength}}</span>/{{maxlength}}</span>
                    <span v-if="otherRemark">{{otherRemark}}</span>
                </div>
            </el-col>
        </el-row>
        <div v-if="isTextarea&&showNumber">
            <span>{{comLength}}/{{maxlength}}</span>
            <span v-if="otherRemark">{{otherRemark}}</span>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-limit-input{
        .limit-number{
            vertical-align:baseline;
        }
        .is-red{
            color:red;
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                inputValue:this.value,
            }
        },
        computed:{
            comLength(){
                let len = 0;
                if(this.inputValue==null||this.inputValue==="") return len;
                len = this.inputValue.length;
                return len;
            },
            surplusSpan(){
                return 24-this.curSpan;
            },
            isRed(){
                return this.comLength>this.maxlength
            }
        },
        watch:{
            inputValue(val){
                this.$emit("input",val);
            },
            value(val){
                this.inputValue = val;
            }
        },
        methods:{
            judge_input(){
                return this.comLength>this.maxlength?false:true;
            },
            blur_change(){
                this.$emit('blur-change',this.isRed);
            },
        },
        props:{
            value:{},
            showNumber:{
                type:Boolean,
                default(){
                    return true
                }
            },
            isTextarea:{
                required:true,
                type:Boolean
            },
            maxlength:{
                required:true,
                type:Number
            },
            customAutosize:{
                type:Object,
                default(){
                    return {minRows: 6, maxRows: 8}
                }
            },
            otherRemark:{
                type:String
            },
            curSpan:{
                default(){
                    return 20
                }
            }
        },
        components: {}
    }
</script>
