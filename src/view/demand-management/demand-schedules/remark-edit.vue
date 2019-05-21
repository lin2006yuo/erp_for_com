<template>
    <div class="c-demand-schedules-remark-edit">
        <el-card style="position: absolute;right:40px;bottom:75px;z-index: 99999;"
                 class="el_card_remark">
            <div class="remark-sale-look" style="position: inherit;">
                <label class="remark-sale-header">{{title}}</label>
                <el-form class="remark-sale-body">
                    <el-form-item>
                        <el-input type="textarea" v-model="remark" :maxlength="225"
                                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                </el-form>
                <div class="remark-sale-footer">
                    <div class="fr mb-xs">
                        <button class="small-button submit" type="button" @click="submit_remark">提交</button>
                        <button class="small-button cancel" type="button" @click="closeMark">取消</button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<style lang="stylus">
    .c-demand-schedules-remark-edit{
        .el_card_remark {
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 140px;
                position: absolute;
                top: 67px;
                right: 7px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #fff;
                padding: 0 5px;
                z-index: 999;
                .remark-sale-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 25px;
                    padding-left: 10px;
                    padding-top: 5px;
                    background-color: #fff;
                }
                .remark-sale-body {
                    overflow-y: auto;
                    position: absolute;
                    top: 30px;
                    left: 0;
                    right: 0;
                    bottom: 30px;
                    padding: 0 5px;
                }
                .remark-sale-footer {
                    position: absolute;
                    height: 25px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    background-color: #fff;
                }
            }
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                remark:this.value
            }
        },
        methods:{
            submit_remark(){
            	if(this.remark.trim()==='')return this.$message({type:'warning',message:'请填写备注！'});
                this.$emit('submit-remark');
            },
            closeMark(){
            	console.log(1)
                this.$emit('close-remark');
            }
        },
        watch:{
            remark(val){
                this.$emit('input',val);
            },
            value(val){
                this.remark = val;
            }
        },
        props:{
            value:{
                required:true,
                type:String,
            },
            title:{
                required:true,
                type:String,
            },
        },
        components: {}
    }
</script>
