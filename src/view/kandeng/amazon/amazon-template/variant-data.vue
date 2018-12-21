<template>
    <div class="c-variant-data">
        <el-table
            class="scroll-bar" 
            :data="form.variant"
            highlight-current-row
        >
            <el-table-column label="Variation Theme 名称" prop="name"></el-table-column>
            <el-table-column label="对应变体主题属性" inline-template align="left">
                <div>
                    <div v-for="(item,index) in row.relation_field" >
                        <el-select v-model="row.relation_field[index]"
                                   class="inline s-width-small">
                            <el-option v-for="item in comVariant"
                                       :key="item.node_tree"
                                       :label="item.name"
                                       :value="item.name"></el-option>
                        </el-select>
                        <span class="delete-icon inline"
                              v-if="row.relation_field.length>0"
                              style="z-index:1000"
                              @click="del_relation(row,index)"></span>
                        <span class="add-icon inline fr"
                              v-if="index===row.relation_field.length-1"
                              @click="add_relation(row)"></span>
                    </div>
                    <span class="add-icon  fr"
                          v-if="row.relation_field.length<=0"
                          @click="add_relation(row)"></span>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template width="100px">
                <el-button type='text' :disabled="form.variant.length<=1"
                      @click="delete_($index)" >删除</el-button>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            delete_(index){
                this.form.variant.splice(index,1);
            },
            del_relation(row,index){
                row.relation_field.splice(index,1);
            },
            add_relation(row){
                row.relation_field.push('');
            },
        },
        computed:{
            comVariant(){
                let list  = this.form.detail.filter(row=>row.sku);
                return list;
            }
        },
        props:{
            form:{
                required:true,
                type:Object
            }
        },
        components: {

        }
    }
</script>