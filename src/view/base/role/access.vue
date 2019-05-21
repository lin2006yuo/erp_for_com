<template>
    <div class="c-access">
        <div>
            <el-checkbox v-model="access.selected" @change="change" :label="access.title"></el-checkbox>
            <rule v-show="access.type === 1 && access.selected" :rules="access.rules"></rule>
        </div>
        <access class="c-access-child" @selected="selected"
                v-for="(child,child_i) in access.childs" :key="child_i" :access="child"></access>
    </div>
</template>
<style lang="stylus">
    .c-access{
        border-bottom:1px solid #bcfff0;
        margin-bottom:15px;
    }
    .c-access-child{
        display: inline-block;
        padding-left:10px;
        padding-right:10px;
        vertical-align: top;
    }
</style>
<script>

    export default{
        name:'access',
        data(){
            return{

            }
        },
        methods:{
            change(){
                if(this.access.selected === undefined){
                    this.$set(this.access,'selected', true);
                }
                this.access.selected && this.$emit('selected');
            },
            selected(){
                if(this.access.selected === undefined){
                    this.$set(this.access,'selected', false);
                }
                this.access.selected = true;
            }
        },
        props:{
            access:{
                required:true,
            }
        },
        components:{
            rule:require('./rule')
        }
    }
</script>