<template>
    <div class="c-check-status">
        <span class="button" @click="click" :style="style"></span>
        <span class="slot"><slot></slot></span>
    </div>
</template>
<style lang="stylus">
.c-check-status{
    vertical-align: middle;
    .button{
        box-sizing border-box;
        display: inline-block;
        width:16px;
        height:16px;
        border:1px solid #474e62;
        border-radius 2px;
        vertical-align: middle;
        &:active{
            border-color: #7287a1;
        }
    }
    .slot{
        vertical-align: middle;
    }
}
</style>
<script>

    export default{
        data(){
            return{
                status:this.value
            }
        },
        methods:{
            click(){
                this.$emit('input',this.status);
            }
        },
        computed:{
            style(){
                switch (this.status){
                    case 0:
                        return {
                            borderWidth:`1px`
                        };
                    case 1:
                        return {
                            borderWidth: `4px`
                        };
                    case 2:
                        return {
                            borderWidth: `8px`
                        }
                }
            }
        },
        watch:{
            value(val){
                this.status = val;
            }
        },
        props:{
            value:{
                default(){
                    return 2;
                }
            }
        },
        components:{

        }
    }
</script>