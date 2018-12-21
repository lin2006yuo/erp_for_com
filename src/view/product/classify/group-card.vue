<template>
    <draggable :list="items">

    </draggable>
</template>
<style lang="stylus">

</style>
<script>

    import draggable from '../../../components/drag-drop';
    export default{
        data(){
            return{

            }
        },
        props:{
            items:{
                required:true,
                type:Array
            }
        },
        components:{
            draggable
        }
    }
</script>