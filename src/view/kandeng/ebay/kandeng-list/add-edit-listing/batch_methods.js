import {api_edit_combList} from '../../../../../api/ebay-kandeng-public-module';
export const change_proceeds = function (val) {
    this.form.list.mod_receivables = !!val?val:"";
    if(val==='')return;
    let params = {
        type:"receivables",
        id:val,
    }
    this.$http(api_edit_combList,params).then(res=>{
        this.form.set.payment_method = JSON.parse(res.pay_method);
        this.form.list.autopay = res.auto_pay===1?true:false;
        this.form.set.payment_instructions = res.payment_instructions;
    }).catch(code=>{
        console.log(code);
    })
};
/*选择已有模板*/
export const change_refuse_model = function(val){
    this.form.list.mod_refuse = !!val?val:'';
    let params ={
        type:"refuse",
        id:val
    };
    this.$http(api_edit_combList,params).then(res=>{
        this.$set(this.form.list,"disable_buyer",res.refuse);
        this.$set(this.form.set,'buyer_requirment_details',[]);
        this.$nextTick(()=>{
            console.log(res,'refuse');
            this.form.list.disable_buyer=res.refuse;
            let obj = {
                link_paypal:res.link_paypal===1?true:false,
                registration:res.registration===1?true:false,
                violations:res.violations===1?true:false,
                violations_count:res.violations_count,
                violations_period:res.violations_period,
                strikes:res.strikes===1?true:false,
                strikes_count:res.strikes_count,
                strikes_period:res.strikes_period,
                credit:res.credit===1?true:false,
                requirements_feedback_score:res.requirements_feedback_score,
                requirements:res.requirements===1?true:false,
                requirements_max_count:res.requirements_max_count,
                minimum_feedback:res.minimum_feedback,
                minimum_feedback_score:res.minimum_feedback_score,
            };
            this.form.set.buyer_requirment_details = clone(obj);
        })
    }).catch(code=>{
        console.log(code);
    })
}
export const get_choice_time = function (val) {
    let params = {
        type:"choice",
        id:val
    }
    this.$http(api_edit_combList,params).then(res=>{
        this.form.list.dispatch_max_time = res.choice_date;
    }).catch(code=>{
        console.log(code,'code');
    })
};

