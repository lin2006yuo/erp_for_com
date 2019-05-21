<template>
    <page-dialog v-model="dialog" @open="open_dialog"
                 size="large" :close-on-click-modal="false"
                 title="批量设置成员考核目标">
        <el-form :model="form" ref='form' :rules='rules' label-width="200px">
            <el-form-item label="下载部门与成员组成表：">
                <el-button type="primary" size="mini"
                           @click.native="get_down"
                           class="inline" >点击下载成员考核目标模板</el-button>
                <span>（下载各部门与成员组成表格，填写完整后，上传该表格）</span>
            </el-form-item>
            <el-form-item label="选择考核月份：" prop="date">
                <el-date-picker
                        v-model="form.date"
                        type="month"
                        placeholder="选择月">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="上传成员考核目标：">
                <el-button type="primary" size="mini"
                           @click.native="upload"
                           class="inline">点击上传成员考核目标</el-button>
                <input type="file" ref="file" hidden @change="file_change">
                <el-button type="primary" size="mini"
                           class="inline ml-sm" @click.native="clear">清空列表</el-button>
            </el-form-item>
        </el-form>
        <el-table
            class="scroll-bar" 
            :data='form.data'
            height="450"
            highlight-current-row>
            <el-table-column label="部门ID" prop="department_id"></el-table-column>
            <el-table-column label="部门名称" prop="department"></el-table-column>
            <el-table-column label="用户ID" prop="user_id"></el-table-column>
            <el-table-column label="姓名" prop="realname"></el-table-column>
            <el-table-column label="工号" prop="job_number"></el-table-column>
            <el-table-column label="考核目标金额" prop="target_amount"></el-table-column>
        </el-table>
        <div slot="footer">
            <el-button type="primary" size="mini"
                       class="inline" @click.native="submit">确定</el-button>
            <el-button size="mini" class="inline"
                       @click.native="dialog = false">取消</el-button>
        </div>

    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_export_target_amount,
        api_develop_export_amount,
        api_import_target_amount,
        api_develop_save_import,
        api_develop_import_amount,
        api_save_import} from '@/api/target-configure';
    import {downloadFile} from '@/lib/http';
    export default {
        data() {
            return {
                form:{
                    date:'',
                    data:[]
                },
                dialog:this.value,
                files:[],
                rules:{
                    date:[
                        {required:true,message:'月份为必填项',type:'date',trigger:'change'}
                    ]
                }
            }
        },
        methods:{
            clear(){
                this.$confirm('您将清空表格内的考核目标数据，确认进行此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.form.data = [];
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            get_down(){
                let url = this.curPage==='seller'?api_export_target_amount:api_develop_export_amount;
                this.$http(url).then(res => {
                    let url = config.apiHost + 'downloadFile/downExportFile';
                    let params = {
                        file_code: res.file_code,
                    };
                    downloadFile({
                        url: url,
                        get: params,
                        fileName: res.file_name,
                        suffix: '.xls',
                    });
                    this.$message({type: "success", message: '导出成功' || res});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            upload(){
                this.$refs.file.click();
            },
            file_change(){
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
                    this.files.push({file:file,result:'', errors:[]});
                    let data = {
                        extension: /\.([\d\w]+)$/.exec(file.name)[1],
                        content: '',
                        name: file.name
                    };
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        data.content = e.target.result;
                        let url = this.curPage==='seller'?api_import_target_amount:api_develop_import_amount;
                        this.$http(url,data).then(res => {
                            this.form.data = res.data;
                            this.$message({type:'success',message:res.message||res})
                        }).catch(code => {
                            this.$message({type:'success',message:code.message||code})
                        });
                    };
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            submit(){
                this.$refs.form.validate((b)=>{
                    if(!b)return;
                    let t = new Date(this.form.date);
                    let params = {
                        year:t.getFullYear(),
                        monthly:t.getMonth()+1,
                        data:this.form.data
                    };
                    let url = this.curPage==='seller'?api_save_import:api_develop_save_import;
                    this.$http(url,params).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        this.dialog = false;
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code})
                    })
                });
            },
            open_dialog(){
                this.form = {
                    date:'',
                    data:[]
                }
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val
            },
        },
        props:{
            value:{},
            curPage:{},
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>