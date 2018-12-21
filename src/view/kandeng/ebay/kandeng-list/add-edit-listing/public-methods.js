import{api_pricing_rules,api_get_specifics}from '@/api/ebay-kandeng-public-module';
export const ref_price = function (skuList){
    let params = {
        site_code:this.form.list.site_code,
        category_id:this.form.list.primary_categoryid,
        account_id:this.accountId,
        channel_id:1,
        sku_id:skuList.filter(row=>!!row),
    };
    this.$http(api_pricing_rules,params).then(res=>{
        if(!res||(res instanceof Array)){
            this.showRef=false;
            this.$forceUpdate();
            return
        }
        this.showRef=true;
        for(let key in res){
            const find = this.form.reference.find(ref=>{
                return Number(ref.sku_id) === Number(key);
            });
            this.grossProfit = res[key].gross_profit;
            this.reduction=res[key].reduction;
            (!res[key].reduction)&&(!res[key].gross_profit)&&(this.showRef=false);
            if(!find){
                this.form.reference.push(Object.assign(res[key],{
                    channel_id:1,
                    account_id:this.accountId,
                    sku_id:key,
                }))
            }
        }
    }).catch(code=>{
        this.$message({type:"warning",message:code.message||code});
    })
}
export const get_reference = function(sku_id){
    if(!sku_id){
        return '';
    }
    return this.form.reference.find(ref=>{
        return ref.channel_id === 1
            && ref.account_id === this.accountId
            && Number(ref.sku_id) === Number(sku_id);
    });
};

export const caluc_reference_sale_price = function(row){
    let ref = null;
    if(ref = this.get_reference(row.sku_id)){
        return ref.total_price;
    }else{
        return ''
    }
};

/*获取联动属性*/
export const get_specifics = function (category_id,site,getDefault) {
    if(!category_id||site==="")return;
    /*sku设置页面数据*/
    let params = {
        category_id:category_id,
        site:site,
    };
    return  this.$http(api_get_specifics,params).then(res=>{
        let returnData = {
            mappingspec:[],
            specificsList:[],
        };
        if(res.length<=0){
            // this.form.mappingspec = [];
            let params = {
                category_specific_name:"",
                specific_value:"",
                custom:1,
            };
            res.push(params);
            this.$set(returnData,'specificsList',res);
        }else{
            res.forEach((row,index)=>{
                if(row.max_values>1){
                    this.$set(row,'specific_value',[]);
                }else{
                    this.$set(row,'specific_value','');
                }
                this.$set(row,'custom',0);
                //max_values>1属性值类型为多选
                if(row.max_values>1&&(row.selection_mode='FreeText')){
                    this.$set(row,'add_new','');
                }
            });
            /*未刊登页面&&编辑页面中的更换分类，都为Brand和MPN设置默认值；
            * */
            if(this.param.isAdd||getDefault){
                res.forEach(row=>{
                    row.category_specific_name==='Brand'&&(row.specific_value = 'Unbranded');
                    row.category_specific_name==='MPN'&&(row.specific_value = 'Does Not Apply');
                    row.category_specific_name==='Manufacturer Part Number'&&(row.specific_value = 'Does Not Apply');
                })
            };
            if(this.param.isAdd){
                res.forEach(row=>{
                    let value = '';
                    if (row.specific_value instanceof Array) {
                        value = row.specific_value.length > 0 ? row.specific_value[0] : '';
                    } else {
                        value = row.specific_value;
                    }
                    let curRow = {
                        is_check: false,
                        custom: row.custom,
                        channel_spec: row.category_specific_name,
                        combine_spec: "",
                        selection_mode: row.selection_mode ? row.selection_mode : '',
                        min_values: row.min_values ? row.min_values : '',
                        specific_value: value,
                        detail: row.detail ? row.detail : [],
                        relationship: row.relationship ? row.relationship : '',
                    };
                    returnData.mappingspec.push(curRow);
                })
            };
            returnData.specificsList = res;
        }
        return Promise.resolve(returnData);
    }).catch(code=>{
        console.log(code);
    })
}