<template>
    <div class="p-order-input">
        <div tabindex="0" v-if="isInput" @focus="focus" :class="['tab-div',show?'visable-no':'visable-yes']"
             :title="textarea">
            <span class="light-gray-order" v-if="!textarea">{{placeholder}}</span>
            {{textarea}}
        </div>
        <el-input
            @blur="blur"
            :autosize="{minRows: 5, maxRows:10}"
            v-if="isInput"
            :class="['textarea',show?'visable-yes':'visable-no']"
            ref="textarea"
            type="textarea"
            @keydown.native="key_down_event"
            :placeholder="$t('common.please_enter')"
            v-model="textarea">
        </el-input>
        <el-input
            @blur="blur"
            :rows=5
            v-if="!isInput"
            class="textarea visable-yes width-full"
            ref="textarea"
            type="textarea"
            :placeholder="placeholder"
            v-model="textarea">
        </el-input>
    </div>
</template>
<style lang="stylus">
    .p-order-input {
        height: 26px;
        position: relative;
        display: inline-block;
        .tab-div {
            width: 100%;
            height: 26px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            outline: none;
            padding: 5px;
            box-sizing: border-box;
            border-radius: 4px;
            border: 1px solid #C0CCDA;
        }
        .textarea {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0
        }
        .visable-no {
            visibility: hidden;
            z-index: -1;
        }
        .visable-yes {
            z-index: 5;
            visibility: visible;
        }
        .light-gray-order {
            color: #8492a6;
        }
        > div {
            line-height: 1;
        }
        .width-full {
            width: 100%;
            [type="textarea"] {
                resize: none;
                height: 105px;
            }
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                show: false,
                textarea: this.value
            }
        },
        methods: {
            focus() {
                this.show = true;
                this.$nextTick(() => {
                    this.$refs.textarea.$refs.textarea.select()
                })
            },
            blur(e) {
                this.$emit("input", e.target.value);
                this.show = false;
            },
            key_down_event(e) {
                if (e.shiftKey && !event.altKey && !e.ctrlKey && event.keyCode === 13) {//shift+enter按下
                    e.preventDefault();
                    let start = e.target.selectionStart;
                    let end = e.target.selectionEnd;
                    if (start === end) {//如果相等，就是未选择内容
                        //先替换e.target.value里面的内容并设置光标的位置，在blue()中再对this.textarea文本进行赋值
                        e.target.value = e.target.value.slice(0, start) + '\n' + e.target.value.slice(end);
                        e.target.selectionStart = end + 1;
                        e.target.selectionEnd = end + 1;
                    } else {//否则就是选择了内容
                        //先替换e.target.value里面的内容并设置光标的位置，在blue()中再对this.textarea文本进行赋值
                        e.target.value = e.target.value.replace(e.target.value.slice(start, end), '\n');
                        e.target.selectionStart = start + 1;
                        e.target.selectionEnd = start + 1;
                    }
                }
                if (!e.shiftKey && !e.altKey && !e.ctrlKey && event.keyCode === 13) {//enter按下
                    e.preventDefault();
                    this.$emit("input", e.target.value);
                    this.blur(e);
                    this.$emit('keydown');
                }
            },
        },
        watch: {
            value(val) {
                this.textarea = val;
            },
            textarea(val) {
                this.$emit("input", val)
            }
        },
        props: {
            value: {},
            placeholder: {
                default() {
                    return '可批量搜索，Shift+回车换行...';
                }
            },
            isInput: {
                default() {
                    return true;
                }
            }
        },
        components: {
            uiTip: require("./ui-tip.vue").default
        }
    }
</script>
