<template>
    <!-- requestInput组件 -->
    <el-input :type="type"
              ref="requestInput"
              :placeholder="canEnter ? '' : loadingText"
              class="request-input"
              :autofocus="autofocus"
              :icon="icon"
              :readonly="readonly"
              :size="size"
              :class="canEnter? '': 'disabled'"
              v-model="name"
              :disabled="!canEnter || disabled"
              @keyup.native.enter="enter"
              @focus="inputSelect">
        <!-- 后置内容，请求时请求图标代替后置内容，请求完成后再还原 -->
        <div slot="append" v-if="!canEnter || $slots.append">
            <span v-if="!canEnter" class="el-icon-loading"></span>
            <slot name="append"></slot>
        </div>
        <!-- 输入框前置内容 -->
        <div slot="prepend" v-if="$slots.prepend">
            <slot name="prepend"></slot>
        </div>
    </el-input>
</template>
<style lang="stylus">
    .request-input {
        display: inline-table;
        vertical-align: top;
    }
</style>
<script>
    /**
     * 自定义requestInput组件
     *
     */
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: 'request-input',
        data() {
            return {
                minWait: false,
                timeoutStatus: false,
                name: this.value,
            }
        },
        created() {
        },
        methods: {
            /**
             * 通过vuex保存request key的状态
             */
            ...mapActions({
                setReqKey__: 'request-api-state/setReqKey'
            }),
            /**
             * 改变reqKey的状态
             * @param bool
             * @private
             */
            setReqKey(bool) {
                this.setReqKey__({key: this.rkey, val: bool});
            },
            /**
             * 输入框回车键触发事件句柄
             * @private
             */
            enter() {
                if (this.canEnter) {
                    this.setReqKey(true);
                    if (this.request) {
                        let res = this.request();
                        if (res !== undefined) {
                            switch (res.constructor.name) {
                                case 'Promise':
                                    res.then(res => {
                                        this.setReqKey(false);
                                    }).catch(fail => {
                                        this.setReqKey(false);
                                    });
                                    break;
                                default:
                                    console.error(`request-button :request not result Promise`);
                                    console.error(res)
                            }
                        } else {
                            console.warn(`request-button :request return undefined`);
                            this.setReqKey(false);
                        }
                    } else {
                        this.$emit('enter');
                    }
                }
            },
            /**
             *  清除请求时间设置
             *  @private
             */
            clearTime() {
                if (this.timeout__) {
                    clearTimeout(this.timeout__);
                    this.timeout__ = null;
                }
                if (this.minTimeout__) {
                    clearTimeout(this.minTimeout__);
                    this.minTimeout__ = null;
                }
            },
            /**
             * 选中输入框
             * @public
             */
            inputSelect() {
                this.$refs.requestInput.inputSelect();
            },
            /**
             * 输入框聚焦
             * @public
             */
            focus() {
                this.$refs.requestInput.$refs.input.focus()
            },
            /**
             * 输入框失焦事件句柄
             * @private
             */
            blur() {
                this.$emit('blur');
                this.$refs.requestInput.$refs.input.blur();
            }
        },
        computed: {
            ...mapGetters({
                getReqKey__: 'request-api-state/getReqKey'
            }),
            getReqKey() {
                return this.getReqKey__(this.rkey);
            },
            rkey() {
                return this.reqKey || this._uid;
            },
            canEnter() {
                return !this.minWait && (!this.getReqKey || this.timeoutStatus);
            }
        },
        watch: {
            value(val) {
                this.name = val;
            },
            name(val) {
                // 是否做双enter过滤处理
                /*if(/([\d\w])+(\.enter){2}$/.test(val)){
                    this.name=val.target.value;
                    return this.$emit('enter');
                }*/
                this.$emit('input', val);
                this.$emit('change', val);
            },
            getReqKey(val) {
                // this.$emit('input', val);
                if (val) {
                    if (this.minTime) {
                        this.minWait = true;
                        this.minTimeout__ = setTimeout(() => {
                            this.minTimeout__ = null;
                            this.minWait = false;
                        }, this.minTime)
                    }
                    if (this.timeout) {
                        this.timeoutStatus = false;
                        this.timeout__ = setTimeout(() => {
                            this.timeoutStatus = true;
                            this.timeout__ = null;
                        }, this.timeout);
                    }
                }
            }
        },
        beforeDestroy() {
            this.clearTime();
        },
        props: {
            /**
             * 输入框绑定值，双向绑定
             * @model
             */
            value: {},
            //点击请求的回调函数，函数返回Promse
            /**
             * 输入框类型，参照element-ui的el-input组件type属性
             * 默认值为text
             */
            //el-input type
            type: {
                default() {
                    return 'text';
                }
            },
            /**
             * 请求方法，该方法必须返回一个Promise对象
             */
            request: {
                type: Function
            },
            /**
             * api请求时文字显示，只有输入框内容清空的时候才会显示
             */
            loadingText: {
                default() {
                    return '请求中...'
                }
            },
            /**
             * 同el-input的autofocus属性
             */
            autofocus: {
              type: Boolean,
              default() {
                  return false;
              }
            },
            /**
             * 同el-input的disabled属性
             */
            disabled: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            /**
             * 请求状态标识，若传入request方法则可不传该属性
             */
            reqKey: {
                type: String
            },
            /**
             * 请求状态保持最短时间
             */
            minTime: {
                type: Number
            },
            /**
             * 请求状态保持最长时间
             */
            timeout: {
                type: Number
            },
            /**
             * 输入框图标
             */
            icon: {
                type: String
            },
            /**
             * 输入框是否为只读
             */
            readonly: {
                type: Boolean
            },
            /**
             * 输入框尺寸大小
             */
            size: {
                type: String
            }
        }
    }
</script>

