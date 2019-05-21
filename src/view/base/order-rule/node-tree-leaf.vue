<template>
    <span>
        <el-checkbox :value="item.check" @change="check(item)"></el-checkbox>
        <label @click="show_child(item)">
            <template v-if="hasChild">
                <span v-if="item.show" class="el-icon-caret-bottom"></span>
                <span v-else class="el-icon-caret-right"></span>
            </template>
            {{item.title}}
        </label>
    </span>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            show_child(item){
                if(item.show === undefined){
                    this.$set(item, 'show',false);
                }
                item.show = !item.show;
            },

            check(item){
                this.data[item.id].check = !this.data[item.id].check;
                let check = this.data[item.id].check;
                const set_childs_check = (child_ids, check) => {
                    if(child_ids && child_ids.length > 0){
                        child_ids.forEach(id=>{
                            let row = this.data[id];
                            set_childs_check(row.child_ids, check);
                            if(row.check === undefined){
                                this.$set(row, "check", check);
                            }else{
                                row.check = check;
                            }
                        })
                    }
                };
                set_childs_check(this.data[item.id].child_ids, check);
                let pid = this.data[item.id].pid;
                if(pid){
                    let parent = this.data[pid];
                    if(check){
                        let hasNotCheck = parent.child_ids.find(row=>{
                            return !this.data[row].check
                        });
                        console.log(hasNotCheck);
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
        },
        computed:{
            hasChild(){
                return this.item.child_ids.length > 0
            },
        },
        props:{
            item:{
                requied:true,
                type:Object
            },
            data:{}
        },
        components: {}
    }
</script>
