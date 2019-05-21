<template>
    <div class="p-ui-select">
        <el-select ref="select" class="inline"
                   v-model="select"
                   filterable
                   remote
                   :loading="loading"
                   :remote-method="remoteMethod"
        >
            <el-option v-for="opt in options"
                       :key="opt.value"
                       :label="opt.label"
                       :value="opt.value">
            </el-option>
        </el-select>
        <div class="ui-select-tag">
            <el-tag v-for="tag in tags">
                {{tag.label}}
                <i class="el-icon-circle-close" @click="remove(tag)"></i>
            </el-tag>
        </div>
    </div>
</template>
<style lang="stylus">
    .p-ui-select{

        .ui-select-tag{
            margin-top: 5px;
            .el-tag{
                margin-right: 5px;
                .el-icon-circle-close{
                    cursor: pointer;
                }
                .el-icon-circle-close:hover{
                    color: red;
                }
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                tags:[],
                select:'',
                loading:false,
                options:[],
                query:''
            }
        },
        computed:{

        },
        methods:{
            remoteMethod(query){
                this.query = query;
                this.loading = true;
                let req = this.$http(http('GET',config.apiHost+this.request, {keyword:query}));
                req.then(res=>{
                    let temp = [];
                    res.forEach(row=>{
                        temp.push(this.fixResult(row));
                    });
                    this.options = temp;
                    this.loading = false;
                }).catch(code=>{
                    this.loading = false;
                })
            },
            remove(tag){
                let index = this.tags.indexOf(tag);
                this.tags.splice(index, 1);
            }
        },
        watch:{
            select(val){
                if(val !== ''){
                    let find = this.options.find(row=>row.value === val);
                    if(find){
                        this.tags.push(find)
                    }
                    this.$nextTick(()=>{
                        this.select = '';
                    });
//                    console.log(this.tags)
//                    this.$emit('input', this.tags);
                }
            },

            tags(tags){
                let tag=tags.map(tag=>{return tag.value});
               this.$emit('input', tag.join(','));
            },
            value(val){


            }
        },
        props:{
            request:{
                type:String
            },

            multiple:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            fixResult:{
                type:Function,
                default(row){
                    return {
                        label:row,
                        value:row
                    };
                }
            },
            value:{

            }
        },
        components:{

        }
    }
</script>