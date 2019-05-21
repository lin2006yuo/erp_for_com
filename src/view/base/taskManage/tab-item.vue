<template>
    <div class="c-tab-item">
        <slot v-show="show"></slot>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {
                show:false,
            }
        },
        created(){
            this.$parent.$forceUpdate();
        },
        components: {}
    }
</script>