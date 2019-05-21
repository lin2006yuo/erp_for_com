<template>
    <div class="c-tree-dialog">
        <page-dialog title="批量添加成员" v-model="dialogTableVisible"
                     size="large" :close-on-click-modal="false"
                     @change="change_dialog">
            <categories v-model="values"
                        @last="last"
                        :tree="superior"
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
    import {depart_list} from '@/api/department'
    export default{
        data(){
            return {
                values:'',
                dialogTableVisible:this.value,
                temp:'',
                superior:{},
            }
        },
        computed:{
            lastName:{
                get(){
                    let names = [];
                    let caluc = (pid) =>{
                        let child = this.superior[pid];
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
            },
            get_department(){
                this.superior={};
                //部门类型：type=1 组
                let params = {
                    type:1,
                    is_superior:1,
                };
                this.$http(depart_list,params).then(res=>{
                    if(res instanceof Array) return;
                    this.superior=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
        },
        watch:{
            dialogTableVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialogTableVisible=val;
                if(val){
                    this.get_department();
                }
            },
//            values(val){
//                this.$emit('input',val)
//            }
        },
        props:{
            value:{},
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
            categories:require("@/view/product/manager/categories.vue").default,
            pageDialog:require("@/components/page-dialog.vue").default
        }
    }
</script>
