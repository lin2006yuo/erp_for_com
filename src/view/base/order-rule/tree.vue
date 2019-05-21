<template>
    <ul>
        <template v-if="node">
            <li v-if="children.length > 0" @click="show_child">{{node.label}}</li>
            <li v-else>
                <input type="checkbox" :value="status" @change="change">
                <span @click="click">{{node.label}}</span>
            </li>
        </template>
        <template v-if="children.length > 0 && show">
            <tree v-for="child in children" :node="child"
                  :key="child"
                  :selected="selected" @node-click="$emit('node-click',$event)" :children="child.children"></tree>
        </template>
    </ul>
</template>
<style lang="stylus" scoped>
    ul{
        margin-left:20px;
        li{
            border-bottom: 1px solid gainsboro;
        }
    }
</style>
<script>

    export default{
        name:'tree',
        data(){
            return{
                show:true,
            }
        },
        methods:{
            show_child(){
                this.show = !this.show;
            },
            change(){
                if(this.info){
                    let index = this.selected.indexOfFun(this.node.value,function(old,val){
                        return old.id == val
                    });
                    let info = this.info;
                    info.status = !this.info.status;
                    this.selected.splice(index, 1, info);
                }else{
                    this.selected.push({id:this.node.value,status:true});
                }
            },
            click(){
                this.$emit('node-click', this.node);
            }
        },
        computed:{
            info(){
                for(let i = 0; i < this.selected.length; i++){
                    if(this.selected[i].id === this.node.value){
                        return this.selected[i];
                    }
                }
            },
            status(){
                this.info && this.info.status;
            }
        },
        props:{
            children:{},
            node:{},
            selected:{}
        },
        components:{
        }
    }
</script>