
export default {
    data(){
        return {
            selected:0
        }
    },
    props:{
        component:{
            required:true,
            type:Array
        }
    },
    render(h){
        let childs = this.component.map(com=>{
            switch (com.type){
                case 'text':
                    return (
                        <el-input v-drag></el-input>
                    );
                case 'sin-select':
                    return (
                        <el-select>
                            {com.options.map(option=>{
                                return (
                                    <el-option label={option.label} value={option.value}></el-option>
                                )
                            })}
                        </el-select>
                    );
                case 'mui-select':
                    return (
                        <el-select>
                            {com.options.map(option=>{
                                return (
                                    <el-option label={option.label} value={option.value}></el-option>
                                )
                            })}
                        </el-select>
                    );
            }
        });
        return (
            <el-radio-group value={this.selected} on-input={(val)=>this.selected = val}>
                {childs}
            </el-radio-group>
        )
    }
};