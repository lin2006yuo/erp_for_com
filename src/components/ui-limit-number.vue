<template>
    <div class="c-ui-limit-number">
        <el-input v-model="number"
                  :placeholder="placeholder"
                  @change.native="change"
                  @keyup.enter.native="enter_down"
                  @keyup.native="keyups()"
                  :type="type"
                  :disabled="disabled"
                  @focus="focus"
                  @blur="blur" ref="input"></el-input>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    export default{
        data(){
            return {
                number:this.value,
            }
        },
        computed:{
        },
        methods: {
            enter_down(){
                this.$emit('keyup.enter.native');
            },
            change(){
                this.$emit('change');
            },
            focus(){
                this.$emit('focus');
            },
            blur(){
                this.minNum();
                this.$emit("blur");
            },
            keyups(){
                if (!isNaN(this.number)){
                    //开始出现多个0时
                    let  zeromore=/^([\-])?[0]{1,}(\d+$)/;
                    if(zeromore.test(this.number)){
                        let matchZ = this.number.match(zeromore);
                        if(!!matchZ[1]&&Number(matchZ[2]>0)){
                            this.number = matchZ[1] + matchZ[2];
                        }else{
                            this.number = matchZ[2];
                        }
                        return ;
                    }
                    if(this.number===""){
                        this.number="";
                        return ;
                    }
                    //数据处理
                    let data=Number(this.number);
                    let regStr = `${this.nagetive ? '([\\-])?' : ''}([\\d]*)${this.limit>0?`([\\.]?)([\\d]{0,${this.limit}})?`:''}`;
                    let reg=new RegExp(`^${regStr}$`,"g");
                    if(reg.test(data)){
                        if(this.number.toString().indexOf(".")!==-1){
                            let match2=this.number.match(regStr);
                            this.number="";
                            this.$nextTick(()=>{
                                this.number=match2[0];
                                this.minNum();
                            })
                        }
                    }else {
                        let match=this.number.match(regStr);
                        this.number="";
                        this.$nextTick(()=>{
                            this.number=match[0];
                        })
                    }
                }else {
                    this.number!=='-'&&(this.number=parseInt(this.number)||'0');
                }
                this.$emit("keyup")
            },
            minNum(){
                if(this.min||this.min==="0"){
                    if(Number(this.number)<Number(this.min)){
                        this.number = this.min;
                    }
                }
                if(this.max){
                    if(Number(this.number)>Number(this.max)){
                        this.number = this.max;
                    }
                }
            }
        },
        watch:{
          value(val){
                this.number=val+"";
          },
            number(val){
              this.$emit("input",val)
            },

        },
        props: {
            value: {},
            limit: {
                type: Number,
                default: 0,
            },
            disabled:{
                default(){
                    return false;
                }
            },
            nagetive:{
                type: Boolean,
                default(){
                    return false;
                }
            },
            min:{
                default(){
                    return "";
                }
            },
            max:{
                default(){
                    return "";
                }
            },
            placeholder:{
                type:String,
                default(){
                    return '';
                },
            },
            type:{
                type:String,
                default(){
                    return '';
                }
            }
        },
        components: {}
    }
</script>
