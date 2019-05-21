<template>
    <svg t="1502702485146"
         class="icon icon-help"
         style=""
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="4377" xmlns:xlink="http://www.w3.org/1999/xlink"
         width="18" height="18" @click="click" @mouseenter="enter" @mouseleave="leave" :class="{'active':isActive}">
        <path d="M512.445071 0.849215C229.912213 0.849215 0.849215 229.901981 0.849215 512.424608c0 282.532858 229.062998 511.585624 511.595856 511.585624 282.502163 0 511.554929-229.052766 511.554929-511.585624 0-282.522626-229.042535-511.575392-511.554929-511.575393z m0.685511 832.947054L183.440704 311.447099h166.10853l246.51795 390.618507-82.936602 131.730663z m119.268687-191.411049l-83.918828-129.950381L675.340907 311.447099h166.077835L632.399269 642.38522z" :fill="newColor" p-id="4378"></path>
    </svg>
</template>
<style lang="stylus">
    .active{
        cursor pointer
    }
</style>
<script>
    export default{
    	data(){
    		return{
    			oldColor:this.color,
    			newColor:this.color,
                isActive:false
            }
        },
        methods:{
            click(){
                this.newColor="#aaa";
                console.log("版本信息")
            },
            enter(){
                this.newColor="#ccc";
                this.isActive = true
            },
            leave(){
                this.newColor=this.oldColor
                this.isActive = false
            }
        },
        watch:{
        },
        props:{
    		color:{
    			required:true
            },
        }
    }
</script>
