<template>
    <div class="c-input-tag">
        <div class="tag-input-footer">
            <input v-model="input" ref="inputData"
                   class="inline enter"
                   @blur="add_tag"
                   @keyup.enter="add_tag"
                   :placeholder="placeholder">
            <span class="inline length">( <span :class="[input.length>128 ? 'red-color' : '']">{{input.length}}</span> / 128 )</span>
        </div>
        <div style="min-height: 50px;" class="contants">
            <drag-drop tag="ul" class="inline" v-model="tags">
                <li v-for="(tag,i) in tags"
                    :key="i"
                    class="mr-xs mb-xs cursor-class el-tag el-tag--success">{{tag}}
                    <i class="el-tag__close el-icon-close" @click="handle_close(i)"></i>
                </li>
            </drag-drop>
        </div>
    </div>
</template>
<style lang="stylus" scoped>
    .c-input-tag{
        border: 1px solid #cccccc;
        border-radius: 4px;
        .contants{
            padding:5px 5px 0 5px;
        }
        .cursor-class{
            cursor: move
        }
        .type-default{

        }
        .type-success{
            background-color: rgba(18,206,102,.1);
            border-color: rgba(18,206,102,.2);
            color: #13ce66;
        }
        .tag-input-footer{
            margin-top: 5px;
            display: flex;
            .enter{
                flex: 1;
                padding: 10px 5px;
                outline: #cccccc;
                color: #1f2d3d;
                border-top: 1px solid transparent;
                border-left: 1px solid transparent;
                border-bottom: 1px dotted #aaa;
                border-right: 1px solid transparent;
                border-radius: 4px;
                &:disabled{
                    background: #eef1f6;
                    color: #bbb;
                    cursor: not-allowed;
                }
            }
            .length{
                border-bottom: 1px dotted #aaa;
                padding-right: 5px;
            }
        }
        .red-color{
            color: red;
            font-weight: bolder;
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                input: "",
            }
        },
        mounted(){
            this.input = window.clone(this.title);
        },
        computed:{
        	tags: {
        		get(){
                    return this.tag;
                },
                set(val){
                    this.input = val.join(" ");
                }
            }
        },
        methods:{
            init(){
            },
            get_focus(){//用于组件获取焦点
                this.$refs.inputData.focus();
            },
            add_tag(){
                if(!this.input){
                    this.$message({type: "info", message:'请输入标题'})
                }
                this.tags = this.input.split(this.step);
                this.$emit("get-title",this.input)
            },
            handle_close(i){
                this.tags.splice(i,1);
            },
        },
        watch:{
            tag(val){
                this.init();
            },
        },
        props:{
            type:{
                type:String,
                default(){
                    return "success"
                },
            },
            placeholder:{
                type:String,
                default:'请输入，并按Enter键添加，多个以逗号分隔。'
            },
            tag:{
            },
            disabled:{
                type:Boolean,
                default:false
            },
            step:{ //多个标签 时，切割符号
                type:String,
                default(){
                    return ' '
                }
            },
            title:{
                type:String,
                default(){
                    return ''
                }
            },
        },
        components: {
            dragDrop:require('./drag-drop').default,
        },
    }
</script>
