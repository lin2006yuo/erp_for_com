<template>
    <div class="c-warehouse-message">
        <label class="inline bold-font"><span class="red mr-xs" v-if="showRequired">*</span>请选择仓库：</label>
        <el-select class="inline" v-model="form.warehouse_id" filterable clearable @change="warehouse_change">
            <el-option v-for="item in warehouseList"
                       :key="item.value"
                       :label="item.label" :value="item.value"></el-option>
        </el-select>
    </div>
</template>
<style lang="stylus">

</style>
<script>
import {api_get_warehouse} from '../../../api/handwork';
    export default{
        data(){
            return {
                warehouseList:[]
            }
        },
        created(){
            this.api_get_warehouse();
        },
        methods:{
            api_get_warehouse(){
                this.$http(api_get_warehouse).then(res=>{
                    this.warehouseList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
          warehouse_change(){
                this.$emit('warehouse-change')
          }
        },
        props:{
            form:{
                required:true,
                type:Object
            },
            showRequired:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components: {}
    }
</script>
