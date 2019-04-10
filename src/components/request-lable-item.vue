<template>
    <div class="c-request-label-item">
        <label class="request-label" v-if="label" :style="labelStyle">{{label}}</label>
        <template v-if="$slots.label" class="request-label" :style="labelStyle">
            <slot name="label"></slot>
        </template>
        <div class="request-content" :style="slotStyle">
            <!-- 此插槽只能用于request-input组件 -->
            <slot></slot>
            <!-- 附加内容如操作成功和报错提示，元素必须是内联级元素 -->
            <div v-if="$slots.additional_message" class="additional-message">
                <slot name="additional_message"></slot>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-request-label-item {
        &:before {
            display: table;
            content: "";
        }
        &:after {
            clear: both;
            display: table;
            content: "";
        }
        .request-label {
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 1.2rem;
            color: #1f2d3d;
            height: 26px;
            line-height: 26px;
            box-sizing: border-box;
        }
        .request-content {
            vertical-align: middle;
            .additional-message {
                display: inline-table;
            }
            &:before {
                display: table;
                content: "";
            }
            &:after {
                clear: both;
                display: table;
                content: "";
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {}
        },
        computed: {
            labelStyle() {
                let style = {
                    textAlign: this.labelAlign || 'right'
                };
                if (this.labelWidth) {
                    style.width = `${this.labelWidth}px`
                }
                return style;
            },
            slotStyle() {
                return {
                    marginLeft: `${this.labelWidth}px`
                }

            }
        },
        props: {
            label: {
                type: String
            },
            labelWidth: {
                type: Number,
                default() {
                    return 80;
                }
            },
            labelAlign: {}
        },
        components: {}
    }
</script>
