/**
 * Created by wuchuguang on 16-11-4.
 */


export default {
    props:{
        component:{
            required:true,
            type:Array
        }
    },
    methods:{

    },
    render(h){
        return (
            <div>
                {this.component.map(com=>{
                    console.log(com.default);
                    switch (com.type){
                        case 'text':
                            return (
                                <div>
                                    <label>{com.label}</label><input value={com.default}/>
                                </div>
                            );
                        case 'sin-select':
                            return (
                                <select>
                                    {com.options.map(opt=>{
                                        return (
                                            <option value={opt.value}>{opt.label}</option>
                                        )
                                    })}
                                </select>
                            );
                        case 'mui-select':
                            return (
                                <select>
                                    {com.options.map(opt=>{
                                        return (
                                            <option value={opt.value}>{opt.label}</option>
                                        )
                                    })}
                                </select>
                            );
                    }
                })}
            </div>
        )
    }
};