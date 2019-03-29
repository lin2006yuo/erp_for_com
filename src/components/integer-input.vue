\<template>
    <div class="c-integer-input">
        <input :class="[disabled?'disable':'','el-input__inner',error?'el-input-red':'']"
               @focus="focus"
               :readonly="!!disabled"
               onkeyup="if(this.value.length==1){this.value=this.value.replace(this.regRule,'')}else{this.value=this.value.replace(this.regRule,'')}"
               @blur="blur"
               onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
               v-model="value_"
               :min="min" :max="max" name="points" ref="input" @input="change($event)" @keyup="key_updown($event)">
    </div>
</template>
<style lang="stylus" scoped>
    .c-integer-input {
        .el-input-red {
            border-color: red;
            -webkit-appearance: none !important;
            margin: 0;
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                value_: this.value,
            }
        },
        watch: {
            value_(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.value_ = val;
            },
        },
        methods: {
            blur() {
                this.$emit("blur");
            },
            focus() {
                this.$emit("focus");
            },
            inputSelect() {
                this.$refs.input.select();
            },
            key_updown(ev) {
                this.$emit("key-updown", ev);
            },
            change(ev) {
                let value = ev.target.value;
                this.$emit("change", value);
            }
        },
        props: {
            min: {
                required: true,
                type: Number,
            },
            max: {
                type: Number,
            },
            value: {},
            disabled: {
                type: Boolean,
                default() {
                    return false
                },
            },
            error: {
                type: Boolean,
                default() {
                    return false
                },
            },
            regRule:{
                type:RegExp,
                default(){
                    return /[^0-9]/g
                }
            }
        },
        components: {}
    }
</script>
