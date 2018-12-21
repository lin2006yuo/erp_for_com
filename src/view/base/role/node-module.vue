<template>
    <label-panel class="module">
            <span slot="label">
                {{title}}
            </span>
        <slot></slot>
    </label-panel>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        props:{
            title:{},
            module:{
            }
        },
        components:{
            labelPanel: require('../../../components/label-panel.vue').default,
        }
    }
</script>