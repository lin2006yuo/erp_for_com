<template>
    <page-dialog size="small" v-model="dialog" :close-on-click-modal="false" :title="title">
        <div class="check_edit" style="text-align: center;margin-top: 20px;">
            <label-item label="采购员 : " v-if="title.includes('查看分类')">
                <el-select  v-model="purchaser" :disabled="title.includes('查看分类')">
                    <el-option v-for="res in list"
                               :label="res.label"
                               :value="res.value"
                               :key="res.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="采购员: "  v-else>
                <el-select  v-model="copypurchaser" filterable clearable>
                    <el-option v-for="item in purchasing"
                               :label="item.realname"
                               :value="item.id"
                               :key="item.id"
                    ></el-option>
                </el-select>
            </label-item>
            <div slot="footer" v-if="title.includes('修改')" class="foot">
                <el-button @click="sure" type="primary" size="mini">确定</el-button>
                <el-button @click="channel" type="primary" size="mini">取消</el-button>
            </div>
        </div>
    </page-dialog>
</template>

<script>
    import {api_edit_categories} from '../../../api/sort-bind-purchasers';
    export default {
        data() {
            return {
                dialog: this.value,
                list:[],
                copypurchaser:this.purchaser,
            }
        },
        methods: {
            close(){

            },
            sure() {
                let id = this.resId;
                let purchaser_id=this.copypurchaser
                this.$http(api_edit_categories,id,{purchaser_id:purchaser_id}).then(res=>{
                    this.$emit('search')
                    this.$message({
                        type: 'success',
                        message: res.message || res,
                        duration:1000
                    });
                    setTimeout(()=>{
                        this.dialog= false;
                        this.copypurchaser = ''
                    },1000)
                })
            },
            channel(){
                this.dialog=false;
                this.copypurchaser = ''
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;

            },
            purchaser(val){
                this.copypurchaser = val;
            }
        },
        props:{
          purchaser:{},
          title:{},
          value:{},
          resId:{},
          purchasing:{},
        purchaser_id:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item').default,
        }
    }
</script>

<style scoped>
.foot{
    position: absolute;
    right: 10px;
    bottom: 10px;
}
</style>