<template>
    <svg t="1502690727067"
         class="icon"
         style=""
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="16488" xmlns:xlink="http://www.w3.org/1999/xlink"
         width="18" height="18" @click="click" @mouseenter="enter" @mouseleave="leave" :class="{'active':isActive}">
        <path d="M512.018063 6.990439c-278.913106 0-505.027624 226.114518-505.027624 505.027624s226.114518 505.06375 505.027624 505.06375c278.913106 0 505.027624-226.150644 505.027624-505.06375S790.93117 6.990439 512.018063 6.990439L512.018063 6.990439zM512.018063 218.817005c98.173223 0 178.265232 91.670489 182.510072 189.229564l-52.274757 0c-4.190651-68.585782-60.89088-136.810302-130.235315-136.810302-61.450838 0-112.966943 42.665161-126.821379 100.087917-1.968883 7.369765-3.32362 28.901041-3.991956 36.722385l-51.696737 0C333.752831 310.487493 413.84484 218.817005 512.018063 218.817005L512.018063 218.817005zM780.111342 785.078709l-25.523232 0L274.505698 785.078709l-25.523232 0L248.982466 410.503158l25.523232 0 480.100476 0 25.505168 0L780.111342 785.078709 780.111342 785.078709 780.111342 785.078709zM306.983242 460.953537l416.301429 0 0 272.518751L306.983242 733.472288 306.983242 460.953537 306.983242 460.953537zM306.983242 460.953537" p-id="16489" :fill="newColor"></path>
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
//                this.newColor="#aaa";
//                this.$open('/modifypwd');
                this.$emit('click');
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
