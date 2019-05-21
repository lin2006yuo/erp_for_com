<template>
    <div class="ui-mui-select">
        <div class="mui-item">
            <el-tag v-for="tag in tags" :key="tag">
                {{tag.label || tag}}
                <i class="el-icon-circle-close" @click="remove(tag)"></i>
            </el-tag>
        </div>
        <el-select ref="select" class="inline"
                   v-model="select"
                   filterable
                   remote
                   :loading="loading"
                   :remote-method="remoteMethod"
        >
            <el-option v-for="opt in options"
                       :label="opt.label"
                       :value="opt.value" :key="opt.value">
            </el-option>
        </el-select>
    </div>
</template>
<style lang="stylus">
    .ui-mui-select{
        overflow: auto;
        .mui-item{
            display: inline-block;
        }
    }
</style>
<script>

    export default{
        data(){
            let tags = this.value.split(',');
            tags = tags.filter(row=>row);
            return{
                tags:tags,
                select:'',
                loading:false,
                options:[],
                query:''
            }
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
                        this.tags.push(find.label)
                    }
                    this.$nextTick(()=>{
                        this.select = '';
                    });
                    this.$emit('input', this.tags.join(','));
                }
            },
            value(val){
                this.tags = val.split(',');
            },
            tags(tags){
                let tag=tags.map(tag=>{return tag.value || tag});
                this.$emit('input', tag.join(','));
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
                        value:row,
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