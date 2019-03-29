//派发事件   v-number指令辅助函数
const trigger = (el, type) => {
    const e = document.createEvent('HTMLEvents')
    e.initEvent(type, true, true)
    el.dispatchEvent(e)
}
export default {
    directives: {
        // 校验是否数字,不符合自动删除
        // v-number:int  校验自然数
        // v-number:fixed="arg"  格式化小数，arg保留的小数位，小数位数校验在blur事件触发
        number: {
            bind: function (el, binding) {
                const input = el.getElementsByTagName('input')[0]
                input.onkeyup = function (e) {
                    const arg = binding.arg
                    if(arg === 'int') {
                        if (input.value.length === 1) {
                            input.value = input.value.replace(/[^\d]/g, '')
                        } else {
                            input.value = input.value.replace(/[^\d]|(^[0]+)/g, '')
                        }
                    } else if(arg === 'fixed') {
                        if (input.value.length === 1) {
                            input.value = input.value.replace(/[^\d]/g, '')
                        } else if(input.value.length === 2){
                            input.value = input.value.replace(/[^(\d.)]|(00)/g, '')
                        } else {
                            input.value = input.value.replace(/[^\d.]/g, '')
                        }
                    }
                    trigger(input, 'input')
                }
                //blur事件再次检验，防止暴力输入
                input.onblur = function (e) {
                    if(input.value === "") {
                        return
                    }
                    const arg = binding.arg
                    if(arg === 'int') {
                        if (input.value.length === 1) {
                            input.value = input.value.replace(/[^\d]/g, '')
                        } else {
                            input.value = input.value.replace(/[^\d]|(^[0]+)/g, '')
                        }
                    } else if(arg === 'fixed') {
                        const fixedLength = binding.expression
                        if (input.value.length === 1) {
                            input.value = input.value.replace(/[^\d]/g, '')
                        } else if(input.value.length === 2){
                            input.value = input.value.replace(/[^(\d)]|(00)/g, '')
                        } else {
                            const val = input.value.replace(/[^\d.]/g, '')
                            if(fixedLength) {
                                const ret_value = Number(val).toFixed(fixedLength)
                                input.value = ret_value === 'NaN' ? 0 : ret_value
                            }else {
                                input.value = val
                            }
                        }
                    }
                    trigger(input, 'input')
                }
            }
        },
    },
}