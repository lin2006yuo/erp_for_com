<template>
    <div class="c-tree-dialog">
        <el-input @focus="focus"  v-model="lastName" placeholder="placeholder" :title="lastName" :disabled="isLook"></el-input>
        <page-dialog :title="title" v-model="dialogTableVisible" :size="dialogSize" :close-on-click-modal="false" @change="change_dialog" >
            <categories v-model="values"
                        @last="last"
                        :tree="tree"
                        :styles="styles"
                        :dbclick="dbclick"></categories>
            <span slot="footer" class="dialog-footer">
                 <el-button size="mini" type="primary"  @click.native="skip" :disabled="!values" >选择并继续下一步</el-button>
                 <el-button size="mini"  @click.native="close">关闭</el-button>
            </span>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    export default{
        data(){
            return {
                values:this.value,
                dialogTableVisible:false,
                temp:'',
            }
        },
        computed:{
            lastName:{
                get(){
                    let names = [];
                    let caluc = (pid) =>{
                        let child = this.tree[pid];
                        if(child){
                            names.push((child.title||child.name));
                            child.pid > 0 && caluc(child.pid)
                        }
                    };
                    caluc(this.values);
                    return names.reverse().join('>>') || "请选择";
                }
            }
        },
        methods:{
            focus(){
                this.dialogTableVisible = true;
            },
            skip(){
                this.dialogTableVisible = false;
                this.$emit('skip',this.values);
            },
            last(val){
                this.$emit('last',val);
            },
            close(){
                    this.dialogTableVisible=false;
                    this.values=this.temp;
            },
            change_dialog(val){
                if(val){
                    this.temp=this.values;
                }
            }

        },
        watch:{
            value(val){
                this.values=val;
            },
            values(val){
                this.$emit('input',val)
            }
        },
        props:{
            placeholder:{
                type:String,
                default:'请选择'
            },
            title:{
                type:String,
                default:'title'
            },
            dialogSize:{
                type:String,
                default:'small'
            },
            tree:{
                type:Object,
                required:true
            },
            value:{},
            styles:{
                type:Object,
                default(){
                    return {minHeight:'300px'}
                }
            },
            dbclick:{
                type:Boolean,
                default(){
                    return false
                }
            },
            isLook:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components: {
            categories:require("../view/product/manager/categories.vue").default,
            pageDialog:require("../components/page-dialog.vue").default
        }
    }
</script>
