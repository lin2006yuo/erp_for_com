<template>
    <el-popover
            placement="bottom"
            ref="parent"
            @mouseleave.stop="mouseLeave"
            @mouseenter.stop="mouseEnter"
            @show="showPopper=true"
            @hide="showPopper=false"
            :disabled="disabled"
            trigger="click">
        <el-button slot="reference" ref="reference"
                   @mouseleave.stop="mouseLeave"
                   @mouseenter.stop="mouseEnter"
                   :disabled="disabled" size="mini" type="primary">
            <span @click.stop.prevent="click">{{title}}</span>
            <i @click="!disabled && (showActions = true)"
               :class="showPopper ? 'el-icon-arrow-down' :'el-icon-arrow-right'"></i>
        </el-button>
        <ul class="down-list">
            <li v-for="(action, index) in actions" :key="action.name"
                @click="clickAction(action, index)"
                :title="action.title || action.name || action.label"
                :class="{disabled: action.disabled}">
                {{action.name || action.label}}
            </li>
        </ul>
    </el-popover>
</template>

<script>
    export default {
        name: "dropdown",
        data() {
            return {
                showActions: false,
                current: this.value,
                showPopper: false,
                time: null,
            }
        },
        mounted() {
            // 添加鼠标离开展开选项收起效果
            this.initMouse();
        },
        methods: {
            click() {
                if (this.actions[this.current]) {
                    this.$emit('action', this.actions[this.current]);
                } else {
                    this.$refs.parent.doShow();
                }
            },
            clickAction(action, index) {
                if (action.disabled) {
                    return;
                }
                this.current = index;
                this.click();
                this.$refs.parent.doClose();
            },
            initMouse() {
                let reference = this.$refs.parent.reference || this.$refs.parent.$refs.reference;
                const popper = this.$refs.parent.popper || this.$refs.parent.$refs.popper;
                if (!reference && this.$refs.parent.$slots.reference && this.$refs.parent.$slots.reference[0]) {
                    reference = this.$refs.parent.referenceElm = this.$refs.parent.$slots.reference[0].elm;
                }
                this.addEvent(reference, 'mouseleave', (e) => {this.mouseLeave(e)});
                this.addEvent(reference, 'mouseenter', (e) => {this.mouseEnter(e)});
                this.addEvent(popper, 'mouseleave', (e) => {this.mouseLeave(e)});
                this.addEvent(popper, 'mouseenter', (e) => {this.mouseEnter(e)});
            },
            mouseEnter(e) {
                e.stopPropagation();
                if(this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    this.$refs.parent.doShow();
                }
            },
            mouseLeave(e) {
                e.stopPropagation();
                if(this.showPopper) {
                    this.timer = setTimeout(() => {
                        this.$refs.parent.doClose();
                        clearTimeout(this.timer);
                        this.timer = null;
                    }, 200)
                }
            },
            addEvent(element, event, handler) {
                if (element && event && handler) {
                    document.addEventListener ?
                        element.addEventListener(event, handler, false) :
                        element.attachEvent('on' + event, handler);
                }
            }
        },
        computed: {
            title() {
                const action = this.actions[this.current] || {};
                return action.name || action.label || this.placeholder;
            },
        },
        props: {
            /**
             * 触发点击时，抛出这个事件
             * @action(action)
             *
             * /

             /**
             * 初始第几个action
             */
            value: {},
            /**
             * 事件列表 [{
             * name:名字,
             * disabled:是否可点
             * title:'提示语'
             * }]
             */
            actions: {
                type: Array
            },
            placeholder: {
                type: String,
                default() {
                    return '---';
                }
            },
            /**
             * 是否可用
             */
            disabled: {}
        }
    }
</script>

<style lang="stylus">
    .down-list {
        li {
            border-bottom: 1px solid #00a0e9;
            text-align center;
            cursor: pointer;
            line-height: 28px;
            &:hover {
                background-color: #00b7ee;
                color: #FFF;
            }
            &:last-child {
                border-bottom: none;
            }
            + .disabled {
                cursor: not-allowed;
            }
        }
    }
</style>
