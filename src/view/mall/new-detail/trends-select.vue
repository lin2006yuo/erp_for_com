<template>
    <el-row class="c-trends-select">
        <el-dropdown size="mini" width="120px" v-if="selects.length > 0" :type="type" split-button>
            添加语种
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in selects"
                                  v-model="current"
                                  :key="index"
                                  @click.native="selectMenu(index)"
                                  :disabled="item.disabled">{{item.name||item.label}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini"  v-else :plan="true" type="warning">没有操作</el-button>
    </el-row>
</template>
<style lang="stylus">
    @keyframes showSelect
    {
        from {opacity: 0;}
        to {opacity: 1;}
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
            selectMenu(index){
                this.current = index;
                this.$emit('trigger', this.selects[this.current]);
            }
        },
        computed:{
            title(){
                if(this.current === -1 || this.selects.length < this.current){
                    return "请选择";
                }
                return this.selects[this.current].name || this.selects[this.current].label;
            }
        },
        components: {},
        props:{
            selects:{},
            type:{
                default(){
                    return "warning"
                }
            },
        }
    }
</script>

