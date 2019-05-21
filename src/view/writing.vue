<template>
    <page class="test-page">
        <h1 style="font-size:28px">{{text1}}</h1>
        <h1 style="margin-left: 170px;font-size:28px;color:#00acac">{{text2}}</h1>
    </page>
</template>
<style lang="stylus">
</style>

<script>
    import Vue from 'vue';
    export default{
        permission: {
        },
        data(){
            return {
                str1:"创国际一流电商企业",
                str2:"塑全球卓越电商品牌",
                text1:"",
                text2:"",
                time1:'',
                time2:'',
                speed:200
            }
        },
        created(){
            this.prints()
        },
        mounted(){
        },
        methods: {
            prints(){
                this.time1=setInterval(this.print,this.speed)
            },
            print(){
                if(this.text1.length===0){
                    this.text1=this.str1.substring(0,this.text1.length+1)+'|'
                } else  if(this.text1.length<this.str1.length&&this.text1.length!==0){
                    this.text1=this.str1.substring(0,this.text1.length)+'|'
                }else {
                    this.text1=this.str1;
                    clearInterval(this.time1);
                    this.time1=null;
                    setTimeout(()=>{
                        this.time2=setInterval(this.print2,this.speed)
                    },this.speed)
                }
            },
            print2(){
                if(this.text2.length===0){
                    this.text2=this.str2.substring(0,this.text2.length+1)+'|'
                } else  if(this.text2.length<this.str2.length&&this.text2.length!==0){
                    this.text2=this.str2.substring(0,this.text2.length)+'|'
                }else {
                    this.text2=this.str2;
                    clearInterval(this.time2);
                    this.time2=null;
                }
            },
        },
        computed: {

        },
        components: {

        }
    }
</script>
