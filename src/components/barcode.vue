<template>
    <img :src="src" alt="">
</template>

<script>
    export default {
        name: "barcode",
        data(){
            return {
                dom:false,
                src:'',
            }
        },
        mounted(){
            this.dom = true;
            this.draw();
        },
        methods:{
            draw(){
                if(this.dom){
                    JsBarcode(this.$el, this.value, {
                        displayValue: true,
                        fontSize:this.fontSize,
                        height:this.height
                    });
                    this.$nextTick(_=>{
                        this.src = this.$el.getAttribute('src');
                    })
                }
            }
        },
        watch:{
            value(){
                this.draw();
            },
            fontSize(){
                this.draw();
            },
            height(){
                this.draw();
            },
        },
        props:{
            value:{},
            fontSize:{
                default:22
            },
            height:{
                default:50
            }
        }
    }
</script>

<style scoped>

</style>