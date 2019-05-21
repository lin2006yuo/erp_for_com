<template>
    <div class="class">
        <check-status :value="controller_value"
                      @input="$emit('change',$event)"
                      class="class-name">
            {{title}}
        </check-status>
        <span class="actions">
            <slot></slot>
        </span>
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
        },
        computed:{
            controller_value(){
                const has = this.controller.find(node=>{
                    return this.selected[node.id];
                });
                const not = this.controller.find(node=>{
                    return !this.selected[node.id];
                });
                if(has && !not){
                    return 2;
                }
                if(has || not){
                    return 1;
                }
                return 0;
            },
        },
        props: {
            title:{},
            controller: {},
            selected: {}
        },
        components: {
            checkStatus: require('../../../components/check-status.vue').default,
        }
    }
</script>