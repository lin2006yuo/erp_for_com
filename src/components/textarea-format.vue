<template>
    <div class="c-textarea-format">
        <div v-for="tag in tags" style="display: inline-block;margin: 5px 2px 2px 0;">
            <el-tag class="tag" type="success" closable :key="tag" @close="close(tag)">{{tag}}</el-tag>
        </div>
        <input class="tagstr" v-model="tagstr" @keyup.enter="key_enter"  :placeholder="placeholder"/>
    </div>
</template>
<style lang="stylus">
    .c-textarea-format{
        border: 1px solid #C0CCDA;
        border-radius: 5px;
        .tag{
            margin-left: 10px;
            height: 20px;
            line-height: 20px;
        }
        .tagstr{
            height:24px;
            width:100%;
            border:none;
            &:focus{
                border:none;
                outline: none;
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                tags:this.value,
                tagstr:'',
                tmpArr:[]
            }
        },
        methods:{
            close(tag){
                let removeIndex = this.tags.indexOf(tag);
                this.tags.splice(removeIndex, 1);
            },
            key_enter(){
                if(this.tagstr.trim() === ''){
                    return;
                }else{
                    this.tmpArr=[];
                    this.tmpArr.push(this.tagstr.trim());
                    for(var i=0; i<this.tmpArr.length; i++){//----------数组去重
                        if(this.tags.indexOf(this.tmpArr[i]) == -1){
                            this.tags.push(this.tmpArr[i]);
                        }else{
                            this.$message({
                                showClose: true,
                                message: this.error,
                                type: 'warning'
                            });
                        }

                    }
                    this.tagstr = ''
                }

            },
            /*key_delete(){
                this.$nextTick(function(){
                    if(this.tagstr === ''){
                        this.tags.pop();
                    }
                });
            }*/
        },
        mounted(){
        },
        watch:{
            tagstr(val){
                if(val.indexOf(this.sep) >= 0){
                    this.tags.push(val);
                    this.tagstr = '';
                }
            },
            tags(vals){
                this.$emit('input', vals);
            },
            value(val){
                this.tags = val;
            }
        },

        props:{
            value:{},
            placeholder:{
                type:String,
                default:'输入后按回车键确认...'
            },
            error:{
                type:String,
                default:'已经存在该属性值'
            },
            sep:{
                type:String,
                default:'；'
            }
        },

        components:{

        }
    }
</script>