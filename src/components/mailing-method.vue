<template>
    <div>
        <div class="butoon-part mb-sm" style="overflow:hidden;margin-top:10px">

            <div class="butoon-down" style="margin:0 0 0 10px;" :title="leftControllerTitle" v-show="show"
                 @click="show = false;">
                <i class="white-down"></i>
            </div>
            <span v-show="!show">&nbsp;</span>

            <div style="float:left;overflow:hidden;">
                <slot name="button-list"></slot>
            </div>
            <slot name="other" style="float:right;"></slot>

        </div>
        <el-row>
            <el-col :span="leftSpan" v-show="!show" style="padding-right:4px;">
                <slot name="mailling-tree"></slot>
            </el-col>
            <el-col :span="rightSpan" style="padding:0 4px;">
                <slot name="goods-tabel"></slot>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                show: false,
            }
        },
        computed: {
            rightSpan() {
                return this.show ? 24 : this.rightMinSpan;
            }
        },
        methods: {
            showLeft(val) {
                this.show = val;
            },
        },
        watch: {
            show(val) {
                this.$emit('left-show-change',val)
            }
        },
        props: {
            defaultShowLeft: {
                default() {
                    return false;
                }
            },
            rightMinSpan: {
                default() {
                    return 21;
                }
            },
            leftControllerTitle: {
                default() {
                    return '显示左边运输方式'
                }
            },
            leftSpan: {
                default() {
                    return 3;
                }
            },
        }
    }
</script>
