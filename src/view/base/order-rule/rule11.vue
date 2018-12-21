<template>
    <div class="c-rule11">
        <el-select multiple filterable clearable
                   v-if="form.condition"
                   placeholder="请输入关键词（ 空格）（;分号）（,逗号）可多搜索"
                   remote :remote-method="remoteMethod"
                   v-model="logistics">
            <el-option v-for="(item,index) in condition"
                       :key="`${index}-${item.value}`"
                       :label="item.label"
                       :value="item.value"></el-option>
        </el-select>
        <div class="mt-lg">
            <el-tag v-if="tags&&tags.length>0" class="ml-sm mb-mini"
                    v-for="(tag,index) in tags" closable
                    @close="close_tags(tag.value)"
                    :key="tag.value">{{tag.label}}</el-tag>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-rule11{
        .el-select {
            width: 100%;
        }
        .el-select__tags span {
            display: none;
        }
        .ui-select-tag {
            margin-top: 5px;
            min-height: 50px;
            .el-tag {
                margin: 0 5px 5px 0;
                .el-icon-circle-close {
                    cursor: pointer;
                }
                .el-icon-circle-close:hover {
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
                logistics:this.value,
                condition:[],
            }
        },
        methods:{
            close_tags(value){
                let index = this.logistics.indexOf(value);
                if(index>-1){
                    this.logistics.splice(index,1)
                }
            },
            remoteMethod(query) {
                this.list = this.form.condition;
                this.$nextTick(_=>{
                    const values = query.split(/[;, ]/);
                    this.condition = this.list.filter(row=>{
                       return  values.find(res=>{
                            return row.label.toLowerCase().indexOf(res)>-1
                        })
                    });
                });
            },
        },
        computed:{
            tags(){
                if(!this.form.condition)return [];
                return this.form.condition.filter(row=>this.logistics.includes(row.value));
            }
        },
        watch:{
            logistics(val){
                this.$emit('input',val);
            },
            value(val){
                this.logistics = val;
            },
        },
        props:{
            form:{},
            value:{},
            operator:{}
        },
        components:{

        }
    }
</script>