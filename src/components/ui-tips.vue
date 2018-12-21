<template>
    <div class="p-ui-tips inline">
        <span v-if="isShow" ref="content" :class="[isLink?'imitation-link':'','textline']" @click="cur_click">{{content}}</span>
        <el-tooltip placement="top" v-else>
            <div slot="content" :style="tooltipWidth" @click="cur_click">{{content}}</div>
            <div class="under" :style="isHidden">
                       <span ref="content" :class="[isLink?'imitation-link':'','textline']" @click="cur_click">
                           {{content}}
                       </span>
            </div>
        </el-tooltip>
    </div>
</template>
<style lang="stylus">
    .p-ui-tips {
        .under {
            height: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .textline {
            /*line-height:26px;*/
            white-space: nowrap;
        }
        .tool-width {
            width: 500px;
        }
        .imitation-link {
            cursor: pointer;
            font-size: 1.2rem;
            color: #6699FF;
            &:hover {
                text-decoration: underline;
            }
            &:active {
                color: #397180;
            }
        }
    }

</style>
<script>

    export default{
        data(){
            return {
                length: 0,
                parentWidth: 0
            }
        },
        mounted(){
            this.look();
        },
        computed: {
            isShow(){
                if (this.isTips) {
                    return false
                } else {
                    this.getLength();
                    this.look();
                    let flag;
                    let width = this.parentWidth * this.width / 100;
                    if (this.length > width) {
                        flag = true
                    } else {
                        flag = false
                    }
                    return !flag
                }
            },
            isHidden(){
                let width = this.parentWidth * this.width / 100;
                if (this.length > width) {
                    return {
                        width: width + "px"
                    }
                } else {
                    return {
                        width: this.width + "%"
                    }
                }
            },
            tooltipWidth(){
                if (this.toolWidth) {
                    return {width: `500px`}
                }
            }
        },
        methods: {
            cur_click(){
                this.$emit("cur-click");
            },
            getLength(){
                this.$nextTick(() => {
                    let el = this.$refs.content.getBoundingClientRect();
                    this.length = parseInt(el.width);
                })
            },
            look(){
//                setTimeout(()=>{
//                },10)
                this.$nextTick(() => {
                    let style = window.getComputedStyle(this.$el.parentNode)
                    this.parentWidth = parseInt(style.width)
                })
            }

        },
        watch: {},
        props: {
            width: {
                type: Number,
                default(){
                    return 80;
                },
            },
            isTips: {
                type: Boolean,
                default(){
                    return false;
                },
            },
            content: {
                required: true,
            },
            toolWidth: {
                type: Boolean,
                default(){
                    return false;
                },
            },
            isLink: {
                type: Boolean,
                default(){
                    return false;
                },
            }
        },
        components: {}
    }
</script>