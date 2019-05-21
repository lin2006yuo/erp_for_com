<template>
    <svg t="1502441135905"
         class="icon icon-help"
         style=""
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="3914" xmlns:xlink="http://www.w3.org/1999/xlink"
         width="18" height="18" @click="click" @mouseenter="enter" @mouseleave="leave" :class="{'active':isActive}" >
        <path d="M512 1024c-282.794667 0-512-229.205333-512-512s229.205333-512 512-512 512 229.205333 512 512S794.794667 1024 512 1024zM455.111111 853.333333l113.777778 0 0-113.777778L455.111111 739.555556 455.111111 853.333333zM538.567111 171.064889c-128.568889 0-253.667556 63.658667-253.667556 227.157333L398.222222 398.620444c0-55.864889 36.010667-114.972444 112.924444-114.972444 45.909333 0 112.526222 18.602667 112.526222 86.698667 0 62.691556-20.366222 75.434667-81.806222 120.32-59.278222 40.334222-89.6 93.070222-87.438222 158.094222 0 13.425778 0 24.689778 0 33.621333l115.598222 0c0-102.968889 72.760889-115.370667 128.398222-200.248889 30.037333-43.861333 41.130667-82.261333 41.130667-136.192C739.498667 261.063111 659.285333 171.064889 538.567111 171.064889z" p-id="10741" :fill="newColor"></path>
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
                this.$open('/help');
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
