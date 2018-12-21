<template>
    <div class="nav-item" :class="{active: nav.active}" :item-id="nav.id"
    @click="$emit('nav-click',nav.index)" @dblclick="$emit('nav-dbclick', nav.index)">
        {{nav.name}}
        <i v-if="close" class="close"
           @click.stop="$emit('nav-close',nav.router, index)"></i>
    </div>
</template>
<style lang="stylus">
    .nav-item{
        border-right :1px solid #eee;
        &:first-child{
            margin-left:52px;
        }
        &:last-child{
            margin-right:52px;
        }
        cursor: pointer;
        /*margin-top:4px;*/
        padding: 0 40px;
        font-size:1.3rem;
        /*line-height:30px;*/
        position: relative;
        /*border-style: solid;*/
        /*border-color: #dddaff;*/
        display: inline-block;
        background-color:#fff;
        border-width: 1px 1px 1px 0;
        color: #000;
        /*border-top-left-radius:5px;*/
        /*border-top-right-radius:5px;*/
        &.active {
            /*border-bottom: none;*/
            background-color: #00acac;
            color:#fff;
        }
        .close {
            position: absolute;
            top: 10px;
            right: 10px;
            width:14px;
            height:14px;
            border:1px solid transparent;
            display:inline-block;
            background:url(../../images/close.png) no-repeat;
            &:hover{
                border-radius:8px;
                background-color:#FF9340;
                background-image:url(../../images/close-hover.svg);
                background-size:12px 12px;
                background-position:center center;
            }
        }

    }
</style>
<script>

    export default{
        data(){
            return{
                selfStyle:{}
            }
        },
        computed:{
            close(){
                return this.nav.router.indexOf("/dashboard") <= -1;
            }
        },
        mounted(){
            this.emit_style();
        },
        updated(){
            this.emit_style();
        },

        methods:{
            emit_style(){
                this.$nextTick(()=>{
                    let style = window.getComputedStyle(this.$el);
                    this.$set(this.selfStyle,'border-left-width', style['border-left-width']);
                    this.$set(this.selfStyle,'border-right-width', style['border-right-width']);
                    this.$set(this.selfStyle,'margin-left', style['margin-left']);
                    this.$set(this.selfStyle,'margin-right', style['margin-right']);
                    this.$set(this.selfStyle,'padding-left', style['padding-left']);
                    this.$set(this.selfStyle,'padding-right', style['padding-right']);
                    this.$set(this.selfStyle,'width', style['width']);
                    this.$emit('style-update',this.nav.index, this.selfStyle);
                });
            }
        },

        props:{
            nav:{
            },
            index:{}
        },
        components:{

        }
    }
</script>
