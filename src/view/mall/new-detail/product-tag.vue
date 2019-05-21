<template>
    <div class="c-product-tag.vue">
        <div class="tag-box">
            <div class="tag-box-child">
                <el-tag
                        class="mr-sm"
                        type="success"
                        v-for="(tag,i) in form.tags"
                        :key="i"
                        :closable="descEdit"
                        @close="handle_close(form.tags,i)"
                >{{tag}}</el-tag>
                <el-button type="primary"
                           v-if="form.tags&&form.tags.length>0"
                           size="mini"
                           @click.native="clear_all"
                           class="inline">清空所有</el-button>
            </div>
            <el-input
                    :disabled="!descEdit"
                    class="input-box"
                    v-model="newTags"
                    @keyup.enter.native="add_new_tag(form)"
                    placeholder="请在此区域内输入，并按Enter键添加新产品标签">
            </el-input>
        </div>
    </div>
</template>
<style lang="stylus">
    .tag-box{
        border:1px solid #ddd;
        height:120px;
        .tag-box-child{
            padding:10px 5px;
            margin:0 5px;
            border-bottom:1px dotted #ddd;
            height:70px;
            overflow-y: auto;
        }
        .input-box{
            &.el-input{
                >.el-input__inner{
                    border-radius: 0 !important;
                    border: none !important;
                }
            }
        }

    }
</style>
<script>

    export default {
        data() {
            return {
                newTags:"",
            }
        },
        methods:{
            clear_all(){
                this.form.tags.length=0;
                this.form.tags=[];
            },
            handle_close(val,index){
                val.splice(index,1);
            },
            add_new_tag(item){
                let cur = this.newTags.replace(/\s/,"");
                if(!cur) return this.$message({type:"warning",message:"请输入内容后再点击添加"});
                if(item.tags.indexOf(cur)!==-1){
                    return this.$message({type:"warning",message:"该标签已添加，请重新输入！"});
                }
                item.tags.push(cur);
                this.newTags = '';
            },
        },
        props:{
            form:{},
            descEdit:{
                type:Boolean
            },
        },
        components: {}
    }
</script>