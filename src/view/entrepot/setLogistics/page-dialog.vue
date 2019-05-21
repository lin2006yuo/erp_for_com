<template>
    <transition name="page-fade">
        <div class="page-dialog"  :style="outer" v-show="value" @click="close">
            <transition name="bounce">
                <div class="inner"  @click.stop=""  v-if="value" ref="inner">
                    <div v-if="!_nottitle" :class="{'dialog-header':true,'title-center':titleCenter}">
                        <span :class="`title${showRequired?` is-required`:``} ${titleCenter?`titleFont`:``}`">{{title}}</span>
                        <span class="tag">{{tag}}</span>
                        <template v-if="showCloseIcon">
                            <i v-if="countDown" class="close close-text" :title="`${countDown}秒后关闭`" @click="close">{{countDown}}</i>
                            <i v-else class="close close-icon" @click="close"></i>
                        </template>
                    </div>
                    <div class="dialog__body" v-loading="loading" :style="addStyle" :element-loading-text="loadingText">
                        <slot></slot>
                    </div>
                    <div v-if="$slots.footer" class="dialog__footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
                // use for $message  src/plugin/message.js
                isDialog:true,
                countDown:0,
                addStyle: {},
                inner: {},
                outer: {},
                innerPosition:{}
            }
        },
        methods: {
            close() {
                this.$emit('input', false)
                this.$emit('change', false)
            },
        },
        computed: {
            ...mapGetters({
                'leftOpen':'menu-nav/leftOpen',
                'viewMode':'ui/viewMode'
            }),
            _nottitle(){
                return this.nottitle || this.nottitle === '';
            },
        },
        watch: {
            value(val) {
                if(!val) this.$emit('change', false)
            },
            leftOpen(open) {
                if(open && (this.outer.left || this.outer.top)) {
                    this.$delete(this.outer, 'left')
                    this.$delete(this.outer, 'top')
                } else {
                    if(this.viewMode) {
                        this.$set(this.outer, 'left', '0px')
                        this.$set(this.outer, 'top', '92px')
                    } else {
                        this.$set(this.outer, 'left', '0px')
                        this.$set(this.outer, 'top', '0px')
                    }
                }
            }
        },
        props: {
            value: {},
            title: {
                type: String,
                default: 'title'
            },
            outClose: {
                type: Boolean,
                default: function () {
                    return true;
                },
            },
            showCloseIcon:{// 是否显示右上关闭的图标？ 默认显示
                type: Boolean,
                default: function () {
                    return true;
                },
            },
            tag: {
                default() {
                    return '';
                }
            },
            nottitle:{
                default(){
                    return false;
                }
            },
            loading:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            loadingText:{
                type:String,
                default(){
                    return "加载中，请稍等...";
                }
            },
            showRequired:{
                type:Boolean,
                default(){
                    return false
                }
            },
            titleCenter:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components: {}
    }
</script>
<style lang="stylus" scoped>


    .page-dialog {
        position: fixed;
        z-index: 1002;
        background-color: rgba(0.0.0.0.5);
        right: 0
        bottom: 0
        left 182px;
        top: 95px;
        .tag {
            color: #F00;
            float: right;
            padding-right: 20px;
        }
        span.title.is-required:before{
            content: '*';
            color: #FF6A3C;
            margin-right: 4px;
        }
        .inner {
            border-radius: 4px;
            box-sizing border-box;
            background-color: #FFF;
            position: relative;
            margin 5vh auto auto
            overflow: hidden;
            padding-bottom:45px;
            width: 96%
        }
        .dialog-header {
            box-sizing: border-box;
            padding: 0 20px;
            height: 36px;
            line-height: 36px;
            margin-bottom: 5px;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04);
            i.close {
                box-sizing:border-box;
                position: absolute;
                top: 6px;
                right: 12px;
                width:26px;
                height:26px;
                padding:4px;
                background-color:rgba(255,255,255,1);

                background-size:contain;
                &:hover{
                    background-size:contain;
                    background-color:rgba(0,0,0,.1);
                    border-radius:3px;
                }
            }
            i.close-icon{
                background:url('~@/assets/close-icon-default.png') no-repeat center center;
                &:hover{
                    background:url('~@/assets/close-icon-active.png') no-repeat center center;
                    cursor:pointer;
                }
            }
            i.close-text{
                color: #8c8c8c;
                font-weight: 900;
                line-height: 18px;
                text-align: center;
                border:2px solid #CCCCCC;
                border-radius :50%;
            }
        }
        .title {
            line-height: 1;
            font-size: 14px;
            font-weight: 500;
            color: #1f2d3d;
        }
        .titleFont {
            font-size: 16px !important;
            font-weight:bolder !important;
        }
        .close {
            float: right;
            line-height: 36px;
        }
        .dialog__body {
            padding:0px 10px 5px 10px;
            color: #475669;
            font-size: 1.2rem;
            overflow hidden
            box-sizing: border-box;
            height: 65.5vh
            >>> .el-tabs__content {
                overflow-y scroll
                height 62vh
            }
        }
        .dialog__footer {
            position: absolute;
            bottom:12px;
            right:30px;
        }
        .title-center {
            text-align:center;
        }


    }
    .page-fade-enter-active, .page-fade-leave-active {
        transition: opacity .2s
    }
    .page-fade-enter, .fade-leave-to {
        opacity: 0
    }




    .bounce-enter-active {
        animation: showIn .25s ease
    }
    .bounce-leave-active {
        animation: showOut .25s;
    }
    @keyframes showIn {
        0% {
            -webkit-transform: scale(0.7);
            -ms-transform: scale(0.7);
            transform: scale(0.7);
        }
        100% {
            -webkit-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
        }
    }
    @keyframes showOut {
        0% {
            opacity:1;
        }
        100% {
            opacity:0;
        }
    }
</style>

