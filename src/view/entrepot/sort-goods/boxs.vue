<template>
    <table class="template box">
        <tr v-for="c in columns" :key="c">
            <box v-for="r in rows" :key="r" :box="boxs[r+(c-1)*row+used-1] || {no:r+(c-1)*row+used}"></box>
        </tr>
    </table>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        methods:{
        },
        computed:{
            columns(){
                return [].seq(1, this.column);
            },
            rows(){
                return [].seq(1, this.row);
            }
        },
        props:{
            boxs:{
                required:true,
                type:Array
            },
            column:{
                required:true,
                type:Number
            },
            row:{
                required:true,
                type:Number
            },
            used:{
                type:Number,
                default(){
                    return 0
                }
            }
        },
        components:{
            box:require('./box.vue').default
        }
    }
</script>