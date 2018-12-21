<template>
    <div class="input-format">
        <ul>
            <li v-for="tag in tags">
                {{tag_label(tag)}}
                <i v-if="close" class="el-icon-circle-cross" @dblclick.stop="" @click="click(tag)"></i>
            </li>
            <li>
                <input v-model="input">
            </li>
        </ul>

    </div>
</template>
<style lang="stylus">
    .input-format {
        *{
            box-sizing: border-box;
        }
        ul{
            border:1px solid rgb(192, 204, 218);
            float: left;
            line-height:24px;
            padding:5px;
            li{
                color: #45acf8;
                float: left;
                margin-right:5px;
                height:100%;
                &:not(:last-child):after{
                    content: ',';
                    display: inline-block;
                    height:100%;
                }
            }
        }
        i{
            &:hover{
                color: #818181;
            }
            &:active{
                color: #000;
            }
        }
        input{
            display: block;
            border:none;
            height:100%;
            width:100%;
            list-style: none;
            &:target,&:active{
                border:none;
            }
            &:focus{
                padding-left:5px;
                outline: none;
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                tags:(this.value || []),
                input:'',
            }
        },
        methods:{
            click(tag){
                let index = this.tags.indexOf(tag);
                this.tags.splice(index, 1);
            }
        },
        watch:{
            value(val){
                this.tags = val;
            },
            tags(vals){
                this.$emit('input', vals);
            },
            input(new_, old_){
                if(new_.indexOf(this.seg) > 0) {
                    new_ = new_.substring(0,new_.length-1);
                    if(!this.repeat(new_)){
                        this.check(new_).then((res) =>{
                            this.tags.push(res);
                            this.$nextTick(()=>this.input='');
                        }).catch(code=>{
                            this.$message({
                                type:'error',
                                message:code.message || code
                            });
                            this.$nextTick(()=>this.input=old_);
                        })
                    }else{
                        this.$message({
                            type:'error',
                            message:'已存在'
                        });
                        this.$nextTick(()=>this.input=old_);
                    }



                }
            }
        },
        props:{
            value:{
            },
            tag_label:{
                default(){
                    return (tag) => tag;
                }
            },
            close:{
                default(){
                    return true;
                }
            },
            seg:{
                default(){
                    return ';'
                }
            },
            check:{
                default(){
                    return (val) => Promise.resolve(val);
                }
            },
            repeat:{
                default(){
                    return (rep) => this.tags.indexOf(rep) >= 0;
                }
            }
        },
        components:{

        }
    }
</script>