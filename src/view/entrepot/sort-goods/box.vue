<template>
    <td :style="boxStyle">
        {{box.no}}
    </td>
</template>
<style lang="stylus">

</style>
<script>

    import {BOX_STATUS_FULL,BOX_STATUS_EMPTY,BOX_STATUS_FILL} from './const';
    export default{
        data(){
            return{

            }
        },
        computed:{
            boxStyle(){
                switch (this.box.status || BOX_STATUS_EMPTY){
                    case  BOX_STATUS_FULL:
                        return {
                            backgroundColor:'green'
                        };
                    case BOX_STATUS_EMPTY:
                        return {
                            backgroundColor:'gray'
                        };
                    case BOX_STATUS_FILL:
                        return {
                            backgroundColor:'red'
                        };
                }
            }
        },
        props:{
            box:{
                required:true,
                type:Object
            }
        },
        components:{

        }
    }
</script>