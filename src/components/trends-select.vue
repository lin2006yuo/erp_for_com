<template>
    <el-row class="c-trends-select">
        <dropdown v-model="current" v-if="selects.length > 0"
                  @action="selectMenu"
                  placeholder="请选择"
                  :actions="selects"></dropdown>
        <el-button size="mini" v-else :plain="true" type="primary">没有操作</el-button>
    </el-row>
</template>
<style lang="stylus">
    .c-trends-select {
        @keyframes showSelect {
            from {opacity: 0;}
            to {opacity: 1;}
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                current:0
            }
        },
        methods:{
            selectMenu(item){
                this.$emit('trigger', item);
            }
        },
        computed:{
        },
        components: {},
        props:{
            dropdownWidth:{

            },
            selects:{
                type: Array,
                default() {
                    return [];
                }
            },
            type:{
                default(){
                    return "warning"
                }
            },
        }
    }
</script>

