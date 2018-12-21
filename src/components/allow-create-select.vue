<template>
    <div class="c-allow-create-select">
        <el-select
                v-model="model"
                ref="model"
                v-mouse-side.mousewheel="()=>{$refs.model.visible=false}"
                filterable
                clearable
                allow-create
                @change="chang_select"
                placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                <span>{{item.label}}</span>
                <i class="el-icon-close fr"  style="margin-top:8px; " v-if="item.clearable" @click.stop="clearable(item)"></i>
            </el-option>
        </el-select>
    </div>
</template>
<style lang="stylus" scoped>
</style>
<script>
    import {getItem,setItem} from "../lib/localStorage"
    import {http } from '../lib/http-plus'
    export default{
        data(){
            return {
                model:this.value,
                local:[],
                ajaxData:[]
            }
        },
        created(){
            this.local=(getItem(this.localStr)||[]);
            this.local.forEach(row=>{
                row.clearable=true;
            })
            this.$http(http(this.url,this.param)).then(res=>{
                this.ajaxData=this.fixResult(res);
            }).catch(code=>{
                this.$message({type: "error", message: code.message || code})
            })
        },
        methods:{
            chang_select(val){
                let find=this.ajaxData.find(row=>{
                    return row.value===val
                });
                if(!find){
                        let loaclfind=this.local.find(row=>{
                            return row.value===val;
                        })
                        if(!loaclfind&&val){
                            this.local.push({value:val,label:val,clearable:true});
                            setItem(this.localStr,this.local)
                        }
                }
            },
            clearable(item){
                if(this.model===item.value){
                    this.model=''
                }
                this.$nextTick(()=>{
                    let index=this.local.findIndex(row=>{
                        return  item.value===row.value
                    });
                    this.local.splice(index,1);
                    setItem(this.localStr,this.local);
                })
            }
        },
        computed:{
            options(){
                    return this.ajaxData.concat(this.local)
            }
        },
        watch:{
            value(val){
                this.model=val;
            },
            model(val){
                this.$emit('input',val)
            }
        },
        props:{
            localStr:{
                type:String,
                default:"express"
            },
            url:{
                type:String,
                default:"get|express"
            },
            param: {
                type: Object,
                default() {
                    return {}
                }
            },
            fixResult:{
                type: Function,
                default(res) {
                    return res.map(row => {
                        return {
                            label: row.company,
                            value: row.company
                        }
                    })
                }
            },
            value:{}
        },
        components: {}
    }
</script>
