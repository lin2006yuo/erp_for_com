<template>
    <transition name="page-fade">
        <div class="page-dialog"  v-show="show" @click="out_click">
            <transition name="bounce">
                <div class="inner"  @click.stop=""  v-if="show" ref="inner">
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
            height: 60.5vh
            >>> .el-tabs__content {
                overflow-y scroll
                height 55vh
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
<script>
    import elementResizeDetectorMaker from 'element-resize-detector';
    import {mapGetters} from 'vuex';
    let maker = elementResizeDetectorMaker();
    export default {
        data() {
            if(this.value){
                this.triggerOpen();
            }
            return {
                // use for $message  src/plugin/message.js
                isDialog:true,
                countDown:0,
                show: this.value,
                outer: {},
                addStyle: {},
                inner: {},
                innerPosition:{}
            }
        },
        methods: {
            showMessage(options){
                this.$message(options);
                let messages = document.getElementsByClassName('el-message');
                let bodyHeight = document.body.offsetHeight;
                let bodyWidth = document.body.offsetWidth;
                let pageEle = document.getElementById('n-content') || document.body;
                let nContent = window.getComputedStyle(pageEle);
                const innerStyle = window.getComputedStyle(this.$refs.inner);
                const emptyHeight = Math.max(parseInt(nContent.height) - parseInt(innerStyle.height),0);
                Object.keys(messages).forEach(key=>{
                    messages[key].style.top = `${bodyHeight-parseInt(nContent.height)+Math.floor(emptyHeight/this.top2)+20}px`;
                    messages[key].style.left = `${(bodyWidth+ this.leftWidth)/2}px`;
                });
            },
            reCenter() {
                // let pageEle = document.getElementById('n-content') || document.body;
                // let nContent = window.getComputedStyle(pageEle);
                // let rect = pageEle.getBoundingClientRect();
                // const innerStyle = window.getComputedStyle(this.$refs.inner);
                let modalRect = {}
                this.leftOpen ? modalRect = { left: 182, top: 95 } : modalRect = { left: 0, top: 0 }

                // this.$set(this.outer, 'width', nContent.width);
                // this.$set(this.outer, 'height', nContent.height);
                this.$set(this.outer, 'left', `${modalRect.left}px`);
                this.$set(this.outer, 'top', `${modalRect.top}px`);
                // const emptyWidth = Math.max(parseInt(nContent.width) - parseInt(innerStyle.width),0);
                // const emptyHeight = Math.max(parseInt(nContent.height) - parseInt(innerStyle.height),0);
                // this.$set(this.innerPosition, 'left', Math.floor(emptyWidth/2)+"px");
                // this.$set(this.innerPosition, 'top', Math.floor(emptyHeight/this.top2)+"px");
                // switch (this.size){
                //     case 'page':
                //         this.$set(this.addStyle, "max-height", `${parseFloat(nContent.height)}px`);
                //         break;
                //     case 'full':
                //         // this.$set(this.addStyle, "max-height", `${parseFloat(nContent.height) * 0.85}px`);
                //         break;
                //     case 'large':
                //         this.$set(this.addStyle, "max-height", `${parseFloat(nContent.height) * 0.8}px`);
                //         break;
                //     case 'small':
                //         this.$set(this.addStyle, 'max-height', `${parseFloat(nContent.height) * 0.85}px`);
                //         break;
                //     default:
                //         this.$set(this.addStyle, 'max-height', `${parseFloat(nContent.height) * 0.85}px`);
                // }
                // this.$forceUpdate();
            },
            /**
             * @private
             */
            triggerClose(){
                this.$emit('close');
            },
            /**
             * @private
             */
            triggerOpen(){
                this.$emit('open',this.innerPosition);
            },
            /**
             * @private
             */
            warning(message){
                this.$message({type:'warning',message});
            },
            startTimerClose(time){
                this.countDown = time;
                this.closeTime = setTimeout(() =>{
                    this.closeTime = null;
                    this.show = false;
                }, time * 1000);
                const countDown = () => {
                    this.closeTime__ = setTimeout(() =>{
                        this.closeTime__ = null;
                        this.countDown -=1;
                        if(this.countDown > 0){
                            countDown();
                        }
                    }, 1000);
                };
                countDown();

            },
            close() {
                if(this.closeTime){
                    return;
                }
                if(this.canClose){
                    switch (this.canClose.constructor.name)
                    {
                        case Boolean.prototype.constructor.name:
                            this.show = false;
                            break;
                        case Function.prototype.constructor.name:
                            const close = this.canClose();
                            if(close){
                                switch (close.constructor.name) {
                                    case Boolean.prototype.constructor.name:
                                        this.show = false;
                                        break;
                                    case String.prototype.constructor.name:
                                        this.warning(close);
                                        break;
                                    case Promise.prototype.constructor.name:
                                        close.then(() =>{
                                            this.show = false;
                                        }).catch(fail => {
                                            this.warning(fail || '禁止关闭对话框');
                                        });
                                        break;
                                    case Number.prototype.constructor.name:
                                        console.log(`countDown ${close}`)
                                        this.startTimerClose(close);
                                        break;
                                    default:
                                        console.log(`not match ${close.constructor.name}`)
                                }
                            }else{
                                this.warning('禁止关闭对话框');
                            }
                    }
                }else{
                    this.warning('禁止关闭对话框');
                }
                this.$emit('close');
            },
            out_click() {
                if(this.closeOnClickModal && this.outClose){
                    this.close();
                }
            },
        },
        computed: {
            ...mapGetters({
                'leftOpen':'menu-nav/leftOpen'
            }),
            leftWidth(){
                return  this.leftOpen?178:0;
            },
            innerSize(){
                return Object.assign(this.innerBoxSize, this.innerStyle);
            },
            top2(){
                if(typeof this.top === 'number'){
                    return this.top;
                }else{
                    return parseInt(this.top);
                }
            },
            innerBoxSize() {
                if (document.body.clientWidth > 1366) {
                    switch (this.size) {
                        case 'small':
                            return {
                                width: this.width || `550px`,
                                height: this.height || `auto;`,
                                minHeight: this.minHeight_
                            };
                        case 'large':
                            return {
                                width: this.width || '1100px',
                                height: this.height || `auto`,
                                minHeight: this.minHeight_
                            };
                        case 'full':
                            return {
                                width: this.width || `96%`,
                                height: this.height || `auto;`,
                                minHeight: this.minHeight_
                            };
                        case 'page':
                            return {
                                width: this.width || `100%`,
                                height: this.height || `auto;`,
                                minHeight: this.minHeight_
                            };
                        default:
                            return this.size
                    }
                } else {
                    switch (this.size) {
                        case 'small':
                            return {
                                width: this.width || `550px`,
                                height: this.height || `auto;`
                            };
                        case 'large':
                            return {
                                width: this.width || '1000px',
                                height: this.height || `auto`
                            };
                        case 'full':
                            return {
                                width: this.width || `96%`,
                                height: this.height || `auto;`
                            };
                        case 'page':
                            return {
                                width: this.width || `100%`,
                                height: this.height || `auto;`
                            };
                        default:
                            return this.size
                    }
                }
            },
            _nottitle(){
                return this.nottitle || this.nottitle === '';
            },
            minHeight_(){
                if(typeof this.minHeight === 'string'){
                    return parseInt(this.minHeight)+'px';
                }
                if(typeof this.minHeight === 'number'){
                    return this.minHeight + 'px';
                }
                return 'auto';
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
                if(val){
                    this.triggerOpen();
                }else{
                    this.triggerClose();
                }
            },
            value(val) {
                if (val) {
                    this.show = val;
                    this.$nextTick(() =>{
                        // maker.listenTo(this.$refs.inner, this.reCenter);
                    });
                } else {
                    // maker.removeListener(this.$refs.inner, this.reCenter);
                    // this.$refs.inner&&(this.$refs.inner.toggleClass('showIn showOut'));
                    // setTimeout(()=>{
                        this.show = val;
                    // },200)
                }
                this.$emit('change', val);
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
            closeOnClickModal: {
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            size: {
                type: [String,Object],
                default: 'small',//small|large|full
            },
            makeSureClose: {
                default: function () {
                    return true;
                }
            },
            width: {
                type: String
            },
            height: {
                type: String
            },
            minHeight:{
                type: [String,Number]
            },
            left: {
                type: String
            },
            tag: {
                default() {
                    return '';
                }
            },
            top:{
                default(){
                    return 3;
                }
            },
            nottitle:{
                default(){
                    return false;
                }
            },
            innerStyle:{
                default(){
                    return {

                    }
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
            /**
             * return Number:倒计秒数，Promise：成功关闭，失败不关闭，String:不关闭的提示语 Boolean：true关闭，false不关闭
             */
            canClose: {
                type:[Function, Boolean],
                default:true,
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
