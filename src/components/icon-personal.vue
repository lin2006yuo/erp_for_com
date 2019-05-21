<template>
    <svg
        t="1502691156008"
        class="icon"
        style=""
        viewBox="0 0 1025 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="19795" xmlns:xlink="http://www.w3.org/1999/xlink"
        width="18" height="18" @click="click" @mouseenter="enter" @mouseleave="leave" :class="{'active':isActive}">
        <path d="M679.855 374.005c0-91.806-75.038-166.224-167.605-166.224s-167.605 74.418-167.605 166.224c0 91.796 75.038 166.214 167.605 166.214S679.855 465.801 679.855 374.005z" p-id="19796" :fill="newColor"></path>
        <path d="M512.152 0C229.921 0 0.25 229.691 0.25 512c0 282.25 229.671 512 511.902 512 282.368 0 512.098-229.691 512.098-512C1024.25 229.75 794.52 0 512.152 0zM786.013 856.015l-36.569 0c0.985-8.704 1.575-17.526 1.575-26.486 0-130.757-106.91-236.82-238.769-236.82-131.879 0-238.789 105.984-238.789 236.82 0 8.96 0.611 17.782 1.595 26.486l-36.569 0c-0.847-8.724-1.359-17.546-1.359-26.466 0-131.742 94.11-241.625 219.254-267.244-84.795-24.084-146.885-101.356-146.885-193.182 0-111.104 90.801-201.137 202.791-201.137 111.97 0 202.732 90.033 202.732 201.137 0 91.806-62.07 169.098-146.845 193.182 125.125 25.62 219.195 135.502 219.195 267.264C787.371 838.489 786.859 847.291 786.013 856.015z" p-id="19797"  :fill="newColor"></path>
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
                let param = {key:this.connd,value:this.conndValue};
                this.$open('/test',param);
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
