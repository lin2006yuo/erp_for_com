<template>
    <el-form ref="vatInfo"
             :model="form"
             label-width="135px"
             class="c-vat-info">
        <el-form-item label="Vat："
                      prop="vat">
            <!--<el-input-number v-model="form.vat"-->
            <!--v-if="flag!==1"-->
            <!--:controls="false">-->
            <!--<template slot="append">%</template>-->
            <!--</el-input-number>-->
            <el-input v-model.number="form.vat"
                      v-if="!flag||(flag===2&&edit)">
                <template slot="append">%</template>
            </el-input>
            <span v-else>{{form.vat}}%</span>
        </el-form-item>
        <el-form-item label="" v-if="flag!==1">
            <el-button size="mini"
                       v-if="!flag||(flag===2&&edit)"
                       :disabled="disabled"
                       @click.native="submit"
                       type="primary">确 定
            </el-button>
            <el-button size="mini"
                       v-if="!flag||(flag===2&&edit)"
                       @click.native="restore">取 消
            </el-button>
            <el-button size="mini"
                       v-if="(flag===2&&!edit)"
                       @click.native="edit=true"
                       type="primary">编 辑
            </el-button>
        </el-form-item>
    </el-form>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        name: "tax-rate",
        data(){
            return {
                disabled:false,
                edit:true
            }
        },
        methods: {
            submit(){
                this.disabled=true;
                this.$emit('vat');
                this.disabled=false;
                this.edit=false;
            },
            restore(){
                if(!this.flag){
                   this.$set(this.form,'vat',0)
                }else {
                    this.$set(this.form,'vat',this.originalForm.vat);
                }
            }
        },
        props: {
            form:{},
            flag:{},
            originalForm:{}
        },
    }
</script>

