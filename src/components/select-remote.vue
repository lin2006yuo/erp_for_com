<template>
    <el-select class="inline"
               :filterable="filterable"
               :clearable="clearable"
               v-model="model"
               :disabled="disabled"
               :placeholder="title"
               :multiple="multiple">
        <template v-for="opt in options">
            <el-option v-if="opt.value !== undefined"
                       :label="opt.label"
                       :value="opt.value"
            ></el-option>
            <el-option-group v-else :label="opt.label">
                <el-option
                        v-for="item in opt.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-option-group>
        </template>
    </el-select>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                model:this.value,
                options:[],
                load:false,
            }
        },
        mounted(){
            this.do_remote();
        },
        methods:{
            do_remote(){
                const callback = (options, headers = [{label:'全部',value:0}]) =>{
                    this.options = this.all?[...headers,...options]:[...options];
                    this.$emit('load',this.options);
                    this.load = true;
                };
                this.remote(callback);
            }
        },
        watch:{
            value(val){
                this.model = val;
            },
            model(val){
                this.$emit('input',val);
            },
            remote(val){
                this.do_remote();
            }
        },
        computed:{
            title(){
                if(this.load){
                    return this.placeholder;
                }else{
                    return "加载数据...";
                }
            }
        },
        props:{
            remote:{
                required:true,
                type:Function
            },
            value:{},
            placeholder:{
                type:String,
                default:"请选择"
            },
            all:{
                type:Boolean,
                default(){
                    return true
                }
            },
            multiple:{
                default(){
                    return false;
                }
            },
            filterable:{
                default(){
                    return true;
                }
            },
            clearable:{
                default(){
                    return true;
                }
            },
            disabled:{
                type:Boolean,
                default:false
            }
        },
        components:{

        }
    }
</script>
