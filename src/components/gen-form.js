/**
 * Created by wuchuguang on 16-10-25.
 */
import Vue from 'vue';
export default {
    name:'gen-form',
    data(){
        return {
        }
    },
    props:{
        formItems:{
            required:true,
            type:Object
        }
    },
    render(h){
        let inputs = this.formItems.inputs || [];
        let props = {
            model:this.formItems.model,
            labelWidth:"100px"
        };
        let children = inputs.map(input=>{
            console.log(`input ${input.type}`);
            let child;
            switch (input.type){
                case 'text':
                    child = <el-input on-input={(val)=>{Vue.set(this.formItems.model,input.name,val)}} value={this.formItems.model[input.name]}></el-input>;
                    break;
                case 'select':
                    child = <el-select on-change={(val)=>Vue.set(this.formItems.model,input.name,val)} value={this.formItems.model[input.name]}>
                        {input.options.map(option=>{
                            let props = {props:{
                                label:option.label,
                                value:option.value
                            }};
                            return <el-option {...props}></el-option>
                        })}
                    </el-select>
            }
            return <el-form-item label={input.name } required={input.required}>
                {child}
            </el-form-item>
        });
        return (
            <el-form {...props} class="demo-ruleForm">
                {children}
            </el-form>
        );
    }
};
