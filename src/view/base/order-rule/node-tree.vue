<template>
    <ul>
        <li v-for="item in lists">
            <node-tree-leaf :item="item"
                            :data="data"
                            @change="$emit('change')"
            ></node-tree-leaf>
            <node-tree v-if="item.show"
                       @change="$emit('change')"
                       ref="child"
                       :select="select"
                       class="sub-node-tree"
                       :data="data"
                       :child="item">
            </node-tree>
        </li>
    </ul>
</template>
<style lang="stylus">
    .sub-node-tree{
        padding-left:15px;
    }
</style>
<script>

    export default{
        name:'node-tree',
        data(){
            return{
            }
        },
        methods:{

        },
        computed:{
            lists(){
                if(!this.child.child_ids){
                    return [];
                }
                return this.child.child_ids.map(id=>{
                    let item = this.data[id];
                    if(item.check === undefined){
                        let childs_select = (id) =>{
                            let childs = this.data[id].child_ids;
                            if(childs.length > 0){
                                let ret = true;
                                for(let i = 0; i < childs.length; i++){
                                    ret = this.select.one(childs[i]) || childs_select(childs[i]);
                                    if(!ret){
                                        return false;
                                    }
                                }
                                return true;
                            }else{
                                return false;
                            }
                        };
                        let check = this.select.one(id) || childs_select(id);
                        this.$set(item,"check",check);
                    }
                    return item;
                })
            },

        },
        props:{
            child:{},
            data:{},
            select:{}
        },
        components:{
            nodeTreeLeaf:require('./node-tree-leaf.vue').default
        }
    }
</script>