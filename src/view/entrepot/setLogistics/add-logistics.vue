<template>
    <el-row class="p-add-logistics">
        <page-dialog title="添加物流方式" v-model="dialogVisible" :size="dialogSize" :close-on-click-modal="false">
            <el-form label-width="120px" :model="form" ref="form">
                <div class="el-row">
                    <el-col :span="12" :offset="4">
                        <el-form-item label="代码：" prop="code">
                            <el-input type="name" v-model="form.code"></el-input>
                        </el-form-item>
                    </el-col>
                </div>
                <div class="el-row">
                    <el-col :span="12" :offset="4">
                        <el-form-item label="简称：" prop="shortname">
                            <el-input type="name" v-model="form.shortname"></el-input>
                        </el-form-item>
                    </el-col>
                </div>
                <div class="el-row">
                    <el-col :span="12" :offset="4">
                        <el-form-item label="系统邮寄代码：" prop="system_code">
                            <el-input type="name" v-model="form.system_code"></el-input>
                        </el-form-item>
                    </el-col>
                </div>
                <div class="el-row">
                    <el-col :span="12" :offset="4">
                        <el-form-item label="时效类型：" prop="period_type">
                            <el-select v-model="form.period_type" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in periodType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </div>
                <div class="el-row">
                    <el-col :span="12" :offset="4">
                        <el-form-item label="是否有跟踪号：">
                            <el-radio-group v-model="form.has_tracking_number">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="confirm">确定</el-button>
                <el-button size="mini" @click.native="dialogVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
import {api_add} from '../../../api/unit';
import pageDialog from '../../../components/page-dialog.vue';
    export default{
        data(){
            return {
                dialogVisible:false,
                dialogSize:"small",
                periodType:[
                    {label:'无时效',value:0},
                    {label:'经济型物流',value:1},
                    {label:'标准型物流',value:2},
                    {label:'特快型物流',value:3},
                ]
            }
        },
        mounted(){
            this.dialogVisible=this.value;
        },
        methods:{
            confirm(){
                Object.keys(this.form).forEach(key => {
                    if (typeof this.form[key] === 'string') {
                        this.form[key] = this.form[key].trim();
                    }
                });
                this.$emit("confirm",this.form);
            }
        },
        watch:{
            dialogVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialogVisible=val;
            }
        },
        props:{
            form:{
                required:true,
                type:Object
            },
            value:{}
        },
        components: {
            pageDialog
        }
    }
</script>
