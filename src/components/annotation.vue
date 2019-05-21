<template>
    <div>
        <!--header slot是做什么的-->
        <slot name="header"></slot>
        <!--slot是做什么的-->
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "annotation",
        methods:{
            /**
             * @private 外部不能调用,ref
             */
            trigger_event(){
                // 完成什么事触发这个事件
                this.$emit('event-name');
            },
            /**
             *  外部可调用，refs.annotation.public_method()
             */
            public_method(){

            },

        },
        props:{
            // 参数做什么的
            prop1:{
                type:Number
            }
        }
    }
</script>

<style scoped>

</style>