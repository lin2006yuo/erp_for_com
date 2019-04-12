<template>
    <div class="input-group" :style="{width: `${groupWidth}px`}">
        <el-input 
            class="inline" 
            :style="{width: `${inputWidth}px`}"
            v-for="(input, index) in inputDomain" :key="`input_${index}`"
            v-model="input.value"
            ref="raInput"
            :disabled="!editable"
            @keyup.enter.native="handle_blur(input,index)"
            @blur="handle_blur(input,index)"
            ></el-input>
        <el-button v-if="editable" v-show="buttonVisible" icon="plus" type="primary" size="mini" @click="add_input"></el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            inputDomain: [],
            buttonVisible: true
        }
    },
    computed: {
        // inputGroupValue() {
        //     const value = this.inputDomain.map(input => {
        //         return input.value
        //     })
        //     this.$emit('input', value)
        // }
    },
    methods: {
        add_input() {
            const inputDomain = this.inputDomain
            if(inputDomain.length && !inputDomain[inputDomain.length - 1].value) {
                this.$message({type: 'info', message: this.message})
                return 
            } else {
                inputDomain.push({value: ''})
            }
            this.buttonVisible = false
            this.$nextTick(() => {
                // this.$refs.raInput.focus()
                const {length} = this.$refs.raInput
                this.$refs.raInput[length - 1].$refs.input.focus()
            })
        },
        handle_blur(input, index) {
            if(!input.value) {
                this.inputDomain.splice(index, 1)
            }
            const groupValue = this.inputDomain.map(i => i.value)
            // const groupValue = this.inputDomain.reduce((total, cur) => {
            //     const values = cur.value.split('-')
            //     // debugger
            //     console.log({total, cur})
            //     //如果没有-分隔符，直接返回
            //     if(values.length === 1) return [...total, ...values]
            //     //如果多于两个-分隔符，不合法
            //     if(values.length > 2) {
            //         this.$message({ type: 'warning', message: '输入不合法' })
            //         return [...total]
            //     } else {
            //     //包含分隔符-
            //         const span = _.range(Number(values[0]), Number(values[1]))
            //         return [
            //             ...total,
            //             ...span,
            //         ]
            //     }
            // }, [])
            this.buttonVisible = true
            this.$emit('group-value-blur', groupValue)
        }
    },
    props: {
        groupWidth: {
            default: 400
        },
        inputWidth: {
            default: 80
        },
        value: {
            default: () => []
        },
        data: {
            default: () => []
        },
        message: {
            default: '请输入内容'
        },
        editable: {
            default: false
        }
    },
    watch: {
        data: {
            immediate: true, 
            handler (inputData) {
                const inputDomain = []
                inputData.forEach((val) => {
                    inputDomain.push({value: val.toString()})
                    this.inputDomain = inputDomain
                })
            }
        }
    },
}
</script>
<style lang="stylus">
    .input-group {
        .el-input {
            margin-bottom: 5px;
            margin-right: 3px
        }
    }
</style>