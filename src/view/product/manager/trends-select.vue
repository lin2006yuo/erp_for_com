<template>
    <el-row class="c-trends-select trends-select">
        <el-dropdown size="mini" width="300px" v-if="selects.length > 0" type="warning" split-button  @click="handleClick" trigger="click">
            {{title}}
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in selects" v-model="current" @click.native="selectMenu(index)"   >{{item.name}}</el-dropdown-item>
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
    .trends-select{
        margin-top: 3px;
        animation:showSelect .3s;
        -webkit-animation:showSelect .3s;
        .el-dropdown-menu{
            min-width:70px;
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
            handleClick(){
                if(this.current===-1){
                    this.$message('请选择操作')
                }else {
                    this.$emit('trigger', this.selects[this.current],this.numdata);
                }

            },
            selectMenu(index){
                this.current = index;
                this.$emit('trigger', this.selects[this.current],this.numdata);
            }
        },
        computed:{
            title(){
                if(this.current === -1 || this.selects.length < this.current){
                    return this.name;
                }
                return this.selects[this.current].name;
            }
        },
        components: {},
        props:{
            selects:{},
            name:{
                type:String,
                default:"请选择",
            },
            numdata:{
                type:Number,
                default:0,
            }
        }
    }
</script>

