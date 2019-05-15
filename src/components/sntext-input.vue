<!-- 
    说明： 1. 封装order-input，v-model直接返回数组，不用再处理
           2.搜索条数超过300条提示并禁止回车搜索
-->
<template>
    <order-input 
        class="inline s-width-large"
        v-model="inputValue"
        @keydown="handleKeydown"
    />
</template>
<script>
import orderInput from '@/components/order-input'
export default {
    data() {
        return {
            canRequest: true
        }
    },
    computed: {
        inputValue: {
            get() {
                if(this.value === '') return ''
                return this.value.join('\n')
            },
            set(val) {
                let inputValue = ''
                if(!Array.isArray(val) && val !== '') {
                    inputValue = [].concat(val)
                }
                if (val !== '') {
                    let ret = val.replace(' ', '\n')
                    inputValue = ret.split('\n').filter(row => !!row).map(row => row.trim());
                }
                console.log(inputValue.length)
                if(inputValue.length > 5 && this.canRequest === true) this.canRequest = false
                else if(inputValue.length < 5 && this.canRequest === false) this.canRequest =  true
                this.$emit('input', inputValue)
            }
        }
    },
    methods: {
        handleKeydown() {
            if(!this.canRequest) this.$message({ type: 'warning', message: '批量搜索只支持300条数据！' })
            else this.$emit('keydown')
        }
    },
    props: ['value'],
    components: {
        orderInput
    },
}
</script>