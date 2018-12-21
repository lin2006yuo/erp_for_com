<template>
    <svg t="1504661693027"
         class="icon"
         style=""
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="1047"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         width="18" height="18" @click="click" @mouseenter="enter" @mouseleave="leave" :class="{'active':isActive}"
    >
        <path :fill="newColor" d="M501.57056 111.15008c-253.254656 0-458.558464 171.877376-458.558464 383.898624 0 105.089024 50.43712 200.31488 132.150272 269.638656l-30.911488 148.16256 127.364096-85.588992c67.600384 32.866304 146.152448 51.6864 229.95456 51.6864 253.254656 0 458.55744-171.877376 458.55744-383.898624S754.825216 111.15008 501.57056 111.15008zM501.57056 835.913728c-91.138048 0-175.483904-23.64928-244.260864-63.811584l-43.958272 29.984768 9.688064-52.287488C136.73472 687.364096 82.368512 596.368384 82.368512 495.048704c0-188.254208 187.682816-340.865024 419.202048-340.865024s419.202048 152.610816 419.202048 340.865024S733.089792 835.913728 501.57056 835.913728z" p-id="1048"></path><path d="M308.685824 504.25856m-42.457088 0a41.462 41.462 0 1 0 84.914176 0 41.462 41.462 0 1 0-84.914176 0Z" p-id="1049"></path>
        <path :fill="newColor" d="M501.5808 504.25856m-42.457088 0a41.462 41.462 0 1 0 84.914176 0 41.462 41.462 0 1 0-84.914176 0Z" p-id="1050"></path><path d="M694.49728 504.25856m-42.457088 0a41.462 41.462 0 1 0 84.914176 0 41.462 41.462 0 1 0-84.914176 0Z" p-id="1051"></path>
    </svg>
</template>
<style lang="stylus">

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
        props:{
            color:{
                required:true
            },
        },
        components:{

        }
    }
</script>