<template>
    <div>
        <div class="c-rainbow-header">
            <div>
                <span :style="headerStyle">{{title}}</span>
                <slot name="header-right"></slot>
            </div>
        </div>
        <div :style="boxStyle">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-rainbow-header{
        background: #FAECE7;
    }
</style>
<script>

    export default {
        data() {
            return {
                headerStyle:{
                    color: '#FFF',
                    fontWeight:'bold',
                    padding:'5px 10px',
                    fontSize:'1.7rem',
                    background:this.backgroundColor,
                    display:'inline-block',
                },
                boxStyle:{
                    padding: '20px',
                    borderLeftWidth:'3px',
                    borderLeftStyle:'solid',
                    borderLeftColor:this.backgroundColor,
                    position:'relative'
                }
            }
        },
        props:{
            backgroundColor:{
                type:String,
                default(){
                    return '#FCC900'
                }
            },
            title:{
                type:String,
                default(){
                    return '请添加一个title'
                }
            }
        },
        components: {}
    }
</script>