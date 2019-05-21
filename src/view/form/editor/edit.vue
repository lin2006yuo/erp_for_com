<template>
    <div class="edit" :style="{width:setting.width,height:setting.height}">
        <form-components :component="component"></form-components>
    </div>
</template>
<style lang="stylus">
    .edit{
        border: 1px solid #908158;
    }
</style>
<script>

    import formComponents from './form-components';
    export default{
        data(){
            return{

            }
        },
        props:{
            setting:{
                required:true,
                type:Object
            },
            component:{
                required:true,
                type:Array
            }
        },
        components:{
            formComponents
        }
    }
</script>