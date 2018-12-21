<template>
    <ul class="node-tree" v-if="childs.length > 0">
        <li v-for="child in childs" @click="show(child)" @dblclick="dbselects(child)">
            <div :class="child.show ? 'show' : ''" :title="get_label(child)">{{get_label(child)}}</div>
            <node-tree @select="select" v-model="valueInner" @open="open(child)" @last="last" v-show="child.show" class="child" :child_ids="get_child(child)" :tree="tree"></node-tree>
        </li>
    </ul>
</template>
<style lang="stylus">
    .node-tree{
        background-color: #fff;
        width:100%;
        border:1px solid gainsboro;
        max-height: 200px;
        overflow-y: auto;
        position: relative;
        animation: move  .5s;
        li{

            font-size:12px;
            height:18px;
            line-height:18px;
            padding: 3px;
            >div{
                width: 120px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow:hidden;
            }
        }
        .child{
            position: absolute;
            top:0;
            left:120px;
        }
        .show{
            background-color: gainsboro;
        }
    }
    @keyframes move {
       from {height: 0}
        to{
            height: 200px;
        }
    }
</style>
<script>

    export default{
        name:'node-tree',
        data(){
            return{
                valueInner:this.value
            }
        },
        methods:{
            open(child){
                this.$set(child,'show',true);
                this.$emit('open');
            },
            get_label(child){
                return child.title;
            },
            get_child(child){
                return child.child_ids || [];
            },
            show(child){
                if(child.show === undefined){
                    this.$set(child, "show" ,false);
                }
                child.show = true;
                this.childs.forEach(row=>{
                    row.show && row.id !== child.id && (row.show = false)
                });
                this.select(child);
                if(this.get_child(child).length <= 0){
                    this.last(child);
                }
            },
            dbselects(child){
                this.$emit('last', child);
            },
            last(last){
                this.$emit('last', last);
            },
            select(select){
                this.$emit('select', select);
            }
        },
        computed:{
            childs(){
                if(this.child_ids){
                    let childs = this.child_ids.map(id=>{
                                let child = this.tree[id];
                                if(id === this.valueInner){
                                    this.$emit('open');
                                    this.$set(child, 'show', true);
                                }else{
                                    this.$set(child, 'show', false);
                                }
                                return child;
                            });
                    return childs;
                }else{
                    return [];
                }
            }
        },
        watch:{
            valueInner(val){
                this.$emit('input', val);
            },
            value(val){
                this.valueInner = val;
            }
        },
        props:{
            child_ids:{},
            tree:{},
            value:{}
        },
        components:{

        }
    }
</script>