<template>
    <div class="c-plus-minus inline">
        <i @click="show_detail" :class="[show? 'minus':'plus','fl']" :title="!show?title:''"></i>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            show_detail(){
                this.$emit("show-detail")
            },
        },
        props:{
            title:{
                required:true
            },
            show:{
                required:true
            }
        },
        components: {}
    }
</script>