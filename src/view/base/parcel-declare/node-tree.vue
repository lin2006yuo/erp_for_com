<template>
    <ul>
        <li v-for="item in lists">
            <span>
                <el-checkbox :value="item.check" @change="check(item)"></el-checkbox>
                <label @click="show_child(item)">
                    <template v-if="hasChild(item)">
                        <span v-if="item.show" class="el-icon-caret-bottom"></span>
                        <span v-else class="el-icon-caret-right"></span>
                    </template>
                    {{item.title}}
                </label>
            </span>
            <node-tree v-if="item.show" @change="change" ref="child" :select="select" class="sub-node-tree" :data="data" :child="item"></node-tree>
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
            show_child(item){
                if(item.show === undefined){
                    this.$set(item, 'show',false);
                }
                item.show = !item.show;
            },
            hasChild(item){
                return item.child_ids.length > 0
            },
            check(item){
                this.data[item.id].check = !this.data[item.id].check;
                let check = this.data[item.id].check;
                if(this.data[item.id].child_ids.length > 0){
                    this.data[item.id].child_ids.forEach(row=>{
                        if(this.data[row].check === undefined){
                            this.$set(this.data[row], "check", false);
                        }
                        this.data[row].check = check;
                    })
                }
                let pid = this.data[item.id].pid;
                if(pid){
                    let parent = this.data[pid];
                    if(check){
                        let hasNotCheck = parent.child_ids.find(row=>{
                            return !this.data[row].check
                        });
                        if(hasNotCheck){
                            parent.check = false
                        }else{
                            parent.check = true;
                        }
                    }else{
                        parent.check = false
                    }
                }
                this.$emit('change');
            },
            change(){
                this.$emit('change');
            }
        },
        computed:{
            lists(){
                console.log(this.child);
                console.log(this.data);
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
        watch:{

        },
        props:{
            child:{},
            data:{},
            select:{}
        },
        components:{

        }
    }
</script>