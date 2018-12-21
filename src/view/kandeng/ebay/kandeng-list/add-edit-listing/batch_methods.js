import {api_edit_model} from '../../../../../api/ebay-kandeng-public-module';
export const change_proceeds = function (val) {
    this.form.list.mod_receivables = !!val?val:"";
    if(val==='')return;
    let params = {
        model_type:"receivables",
        id:val,
    }
    this.$http(api_edit_model,params).then(res=>{
        this.form.set.payment_method = JSON.parse(res.data.pay_method);
        this.form.list.autopay = res.data.auto_pay===1?true:false;
        this.form.set.payment_instructions = res.data.payment_instructions;
    }).catch(code=>{
        console.log(code);
    })
};
/*选择已有模板*/
export const change_refuse_model = function(val){
    this.form.list.mod_refuse = !!val?val:'';
    let params ={
        model_type:"refuse",
        id:val
    };
    this.$http(api_edit_model,params).then(res=>{
        this.$set(this.form.list,"disable_buyer",res.data.refuse);
        this.$set(this.form.set,'buyer_requirment_details',[]);
        this.$nextTick(()=>{
            this.form.list.disable_buyer=res.data.refuse;
            let obj = {
                link_paypal:res.data.link_paypal===1?true:false,
                registration:res.data.registration===1?true:false,
                violations:res.data.violations===1?true:false,
                violations_count:res.data.violations_count,
                violations_period:res.data.violations_period,
                strikes:res.data.strikes===1?true:false,
                strikes_count:res.data.strikes_count,
                strikes_period:res.data.strikes_period,
                credit:res.data.credit===1?true:false,
                requirements_feedback_score:res.data.requirements_feedback_score,
                requirements:res.data.requirements===1?true:false,
                requirements_max_count:res.data.requirements_max_count,
                minimum_feedback:res.data.minimum_feedback===1?true:false,
                minimum_feedback_score:res.data.minimum_feedback_score,
            };
            this.form.set.buyer_requirment_details.push(obj);
        })
    }).catch(code=>{
        console.log(code);
    })
}
export const get_choice_time = function (val) {
    let params = {
        model_type:"choice",
        id:val
    }
    this.$http(api_edit_model,params).then(res=>{
        this.form.list.dispatch_max_time = res.data.choice_date;
    }).catch(code=>{
        console.log(code,'code');
    })    
};

