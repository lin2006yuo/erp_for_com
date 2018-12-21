/**
 * Created by wuchuguang on 16-11-17.
 */

export default {
    props:{
        resource:{
            required:true,
            type:Array
        }
    },
    data(){
        return {
            rows:[
                {cols:[{span:12,content:11},{span:12,content:11}]},
                {cols:[{span:12,content:111},{span:12,content:111}]}
            ],
            title:'请给我取个好名字呗',
            isShowRowDialog:false,
            isShowColDialog:false,
            rowDialog:[24],
            colDialog:{
                row:0,
                col:0,
                span:0,
            }
        }
    },

    methods:{
        add_row(){
            this.isShowRowDialog = true;
        },
        affirm_row(){
            this.rows.push({
                cols:this.rowDialog.map(col=>{return {span:parseInt(col)}})
            });
            this.isShowRowDialog = false;
        },
        add_col_input(){
            let sum = this.rowDialog.sum();
            if(sum >= 24){
                this.$message({
                    type:'error',
                    message:'Col >= 24'
                })
            }
            this.rowDialog.push(Math.max(1, 24 - sum));
        },
        click_col(row,col){
            this.isShowColDialog = true;
            this.colDialog.span = this.rows[row].cols[col].span;
            this.colDialog.col = col;
            this.colDialog.row = row;
        },
        affirm_col(){
            this.rows[this.colDialog.row].cols[this.colDialog.col].span = parseInt(this.colDialog.span);
            this.isShowColDialog = false;
        }
    },

    render(h){
        let self = this;
        function gen_row(row,rind){
            return (
                <el-row>
                    {row.cols.map((col, cind)=>{
                        return gen_col(rind, cind, col.span,col.content);
                    })}
                </el-row>
            )
        }
        function gen_col(row, col, span, content){
            return (
                <gen-page-col on-click={self.click_col} row={row} col={col} span={span}>{content}</gen-page-col>
            )
        }
        function add_row() {
            return (
                <el-row>
                    <el-dialog value={self.isShowRowDialog} on-input={(val)=>{
                        self.isShowRowDialog = val;
                    }}>
                        {[...self.rowDialog.map((col,ind)=>{
                            return <el-input value={self.rowDialog[ind]} on-input={(val)=>{
                                self.$set(self.rowDialog,ind,val);
                            }}></el-input>
                        })]}
                        <el-button nativeOn-click={self.add_col_input}>+</el-button>
                        <span slot="footer">
                            <el-button nativeOn-click={self.affirm_row}>确定</el-button>
                        </span>
                    </el-dialog>
                    <el-dialog value={self.isShowColDialog} on-input={(val)=>{
                        self.isShowColDialog = val;
                    }}>
                        {[<el-input value={self.colDialog.span} on-input={val=>{self.colDialog.span = val}}></el-input>]}
                        <span slot="footer">
                            <el-button nativeOn-click={self.affirm_col}>确定</el-button>
                        </span>
                    </el-dialog>
                    <el-col span={24} nativeOn-click={self.add_row}>添加行</el-col>
                </el-row>
            )
        }
        return (
            <div>
                <el-row>
                    <h2 class="t-center">{this.title}</h2>
                </el-row>
                {[...this.rows.map(gen_row),add_row()]}
            </div>
        )
    },
    components:{
        genPageCol:require('./gen-page-col')
    }
};