<template>
    <li class="c-filter-config">
        {{config.name}}：
        <template v-if="['select','multiple-select'].includes(config.type)">
            <el-radio-group v-if="optionsCount <= 5"
                            :value="value"
                            @input="change">
                <el-radio v-for="option in options"
                          :key="option.value"
                          :label="option.value">
                    {{option.label}}
                </el-radio>
            </el-radio-group>
            <el-select v-else :value="value"
                       style="width:380px; height:40px;display:inline-block"
                       placeholder="输入可搜索更多..."
                       @input="change"
                       multiple filterable
                       clearable remote
                       :remote-method="fetchMethod">
            <!--<el-select v-else :value="value"-->
                       <!--style="width:380px;display:inline-block"-->
                       <!--placeholder="输入可搜索更多222..."-->
                       <!--@input="change"-->
                       <!--multiple filterable clearable>-->
                <el-option v-for="option in selectOptions"
                           :label="option.label"
                           :key="option.value"
                           :value="option.value"
                ></el-option>
            </el-select>
        </template>
    </li>
</template>
<style lang="stylus">
    .c-filter-config{
        margin:3px;
        height:50px
        .el-select__tags{
            height: 40px!important;
            width: 350px;
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                query:''
            }
        },
        methods:{
            change(val){
                this.$emit('change',this.config.class, val);
            },
            fetchMethod(query){
                console.log(query,'query');
                this.query = query;
            },
            filter_query(){
                return this.options.filter(row=>{
                    return row.label.toLowerCase()
                        .indexOf(this.query.toLowerCase()) > -1;
                })
            },
            filter_value(){
                // return this.options.filter(row=>{
                //     return this.value.includes(row.value);
                // })
                // 上面会导致这个变成截取只剩下选择的那一条和自己。
                return this.options.slice(0, 50);
            }
        },
        computed:{
            options(){
                switch (this.config.options.constructor.name){
                    case 'Array':
                        return this.config.options;
                    case 'Object':
                    //  .map 的是key 也就是索引形成的list.
                        let options = Object.keys(this.config.options).map(label=>{
                            return {
                                label,
                                value:this.config.options[label]
                            }
                        });
                        return options;
                    default:
                        return []
                }
            },
            ridioOptions(){
                const headers = [{label:'关闭过滤器',value:''},{label:'本/自已',value:0}];
                return [...headers, ...this.options];
            },
            selectOptions(){
                let ret = [{label:'关闭过滤器',value:''},{label:'本/自已',value:0}];
                let options = [];

                if(this.query!==''&&this.value&&this.value.length>0){
                    options = this.options.filter(row=>{
                        return row.label.toLowerCase()
                            .indexOf(this.query.toLowerCase()) > -1||this.value.includes(row.value);
                    });
                }else if(this.query===''&&this.value&&this.value.length>0){
                    options = this.filter_value();

                }else if(this.query&&(!this.value||this.value.length<=0)){
                    options = this.filter_query();
                }else{
                    if(this.options&&this.options.length){
                        options = this.options.slice(0,50);
                    }else{
                        options = this.options;
                    }
                }
                return [...ret, ...options];
            },
            optionsCount(){
                return this.options.length;
            }
        },
        watch:{
            'config.value'(val){
                console.log(val)
            },
        },
        props:{
            config:{},
            value:{}
        },
        components:{

        }
    }
</script>
