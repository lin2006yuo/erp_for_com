<template>
    <el-row class="c-trends-select">
        <el-dropdown size="mini" width="120px" v-if="selects.length > 0" :type="type" split-button  @click="handleClick">
            {{title}}
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in selects" :disabled="item.disabled"
                                  :key="index"
                                  v-model="current" @click.native="selectMenu(index)">{{item.name||item.label}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini"  v-else :plan="true" type="primary">没有操作</el-button>
    </el-row>
</template>
<style lang="stylus">
    @keyframes showSelect {
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
            handleClick(){
                if(this.selects[this.current].disabled){
                    return false;
                }
                this.$emit('trigger', this.selects[this.current]);
            },
            selectMenu(index){
                this.current = index;
                this.$emit('trigger', this.selects[this.current]);
            }
        },
        computed:{
            title(){
                if(this.current === -1 || this.selects.length < this.current||!this.selects[this.current]||(this.selects[this.current].hasOwnProperty("disabled")&&this.selects[this.current].disabled)){
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

