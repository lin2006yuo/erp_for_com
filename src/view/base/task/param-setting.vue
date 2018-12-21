<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        methods:{
            input_val(Var, Val){
                this.$set(this.param, Var, Val);
            }
        },
        props:{
            rules:{
                required:true,
                type:[Object,Array]
            },
            param:{
                required:true,
                type:[Object,Array]
            }
        },
        components:{

        },
        render(createElement){
            let chils = [];
            for(let i = 0; i < this.rules.length; i++){
                const valid = this.rules[i];
                let child = null;
                let value =this.param[valid.key] || '';
                let required = !!valid.validate.require;
                switch (valid.type){
                    case 'input':
                        child = createElement('el-form-item', {props:{label:valid.name,required}},[
                            createElement('el-input',{props:{value:value},on:{
                                input:(val)=>this.input_val(valid.key,val)
                            }})
                        ]);
                        chils.push(child);
                        break;
                    case 'select':
                        child = createElement('el-form-item',{props:{label:valid.name,required}},[
                            createElement('el-select', {props:{value:value},on:{
                                input:(val)=>this.input_val(valid.key,val)
                            }},valid.options.map(opt=>{
                                return createElement('el-option',{props:{label:Object.keys(opt)[0],
                                    value:Object.values(opt)[0]}})
                            }))
                        ]);
                        chils.push(child);
                        break;
                    default:
                        child = createElement('el-form-item',{props:{label:valid.name,required}},[
                            createElement('el-input',{props:{value:value},on:{
                                input:(val)=>this.input_val(valid.key,val)
                            }})
                        ]);
                        chils.push(child);
                }
            }
            return createElement('el-form',{props:{labelWidth:'120px'}}, chils);
        }
    }
</script>