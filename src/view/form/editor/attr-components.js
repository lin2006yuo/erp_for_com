
export default {
    data(){
        return {
            selected: 0,
            dialogShow: false,
            dialogContent: {}
        }
    },
    props:{
        component:{
            required:true,
            type:Array
        }
    },
    methods:{
        dragdown(com){
            this.dialogContent = com;
            this.dialogShow = true;
        },
        submit_dialog(){
            this.$emit('build-component', this.dialogContent);
            this.dialogContent = {};
            this.dialogShow = false;
        }
    },
    render(h){
        let dialogContent = null;
        switch (this.dialogContent.type){
            case 'text':
                dialogContent =
                    <div>
                        标题:<input on-input={(val)=>{
                        console.log(...arguments);
                        this.dialogContent.label = val}} value={this.dialogContent.label}/>
                        默认值:<input on-input={(val)=>{this.dialogContent.default = val}} value={this.dialogContent.default}/>
                        条件:<select>
                        <option value="reg">正则</option>
                        <option value="none">无</option>
                            </select>
                            <input/>
                    </div>;
                break;
            case 'sin-select':
                dialogContent =
                    <div>

                    </div>;
                break;
            case 'mui-select':
                dialogContent =
                    <div>

                    </div>;
                break;
        }
        let dialog = <el-dialog title="添加" on-input={val=>{this.dialogShow = val}} value={this.dialogShow}>
            {dialogContent}
            <span slot="footer" class="dialog-footer">
                <el-button nativeOn-click={()=>{this.dialogShow=false}}>取 消</el-button>
                <el-button type="primary" nativeOn-click={this.submit_dialog}>确 定</el-button>
            </span>
        </el-dialog>;
        let childs = this.component.map(com=>{
            switch (com.type){
                case 'text':
                    return (
                        <el-input v-drag={{func:this.dragdown,params:com}}></el-input>
                    );
                case 'sin-select':
                    return (
                        <el-select v-drag={{func:this.dragdown,params:com}}>
                            {com.options.map(option=>{
                                return (
                                    <el-option label={option.label} value={option.value}></el-option>
                                )
                            })}
                        </el-select>
                    );
                case 'mui-select':
                    return (
                        <el-select v-drag={{func:this.dragdown,params:com}}>
                            {com.options.map(option=>{
                                return (
                                    <el-option label={option.label} value={option.value}></el-option>
                                )
                            })}
                        </el-select>
                    );
            }
        });
        childs.push(dialog);
        return (
            <el-radio-group value={this.selected} on-input={(val)=>this.selected = val}>
                {childs}
            </el-radio-group>
        )
    }
};