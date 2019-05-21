<template>
    <page-dialog v-model="show"
                 size="large"
                 :title="title"
                 @change="open_log">
        <el-table :data="logs"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  empty-text="暂无数据"
                  align="center">
            <el-table-column label="时间" inline-template width="140">
                <span>{{row.t | fmsdatetime}}</span>
            </el-table-column>
            <el-table-column label="元素" inline-template>
                <span>{{row.e}}</span>
            </el-table-column>
            <el-table-column label="类型"
                             width="60"
                             prop="type">
            </el-table-column>
            <el-table-column label="结果" inline-template>
                <span>{{row.r}}</span>
            </el-table-column>
        </el-table>
        <span slot="footer">
                <el-button @click.native="init_data"
                           size="mini"
                           type="primary">刷新
                </el-button>
                <el-button @click.native="show=false"
                           size="mini">关闭
                </el-button>
            </span>
    </page-dialog>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_logs} from '@/api/queue';
    export default {
        name: "operation-log",
        data() {
            return {
                show:this.value,
                logs:[],
                loading:false
            }
        },
        computed: {},
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            }
        },
        methods: {
            open_log(isOpen){
                if(isOpen){
                    console.log(this.logKey,'open');
                    this.init_data();
                }
            },
            init_data(){
                this.loading=true;
                this.$http(api_logs,this.logKey).then(res=>{
                    console.log(res,12213);
                    res.forEach(row=>{
                        switch (row.c){
                            case 0:
                               return this.$set(row,'type','成功');
                            case 1:
                                return this.$set(row,'type','失败');
                            case 2:
                                return this.$set(row,'type','异常');
                            case 3:
                                return this.$set(row,'type','错误');
                        }
                    })
                    this.logs=res;
                    this.loading=false;
                }).catch( error =>{
                    this.logs=[];
                    this.loading=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            }
        },
        props: {
            value:{},
            title:String,
            logKey:{}
        },
        components: {},
    }
</script>

