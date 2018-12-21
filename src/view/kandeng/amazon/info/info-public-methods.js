import {api_publish_templatelist,api_publish_amazon_template} from '../../../../api/product-category-api';
export const get_product_attribute = function(type,site){//分类1，产品2；
    let params = {
        site:site,
        type:type,
        page:1,
        pageSize:1000
    };
    return this.$http(api_publish_templatelist,params).then(res=>{
        if(type===1){
            return Promise.resolve(res);
        }else{
            let defaultData = res.filter(row=>row.default===1);
            let id = 0;
            if(defaultData.length>0){
                id = defaultData[0].value;
            }
            return Promise.resolve(id);
        }
    }).catch(code=>{
        console.log(code);
    })
};
export const get_edit_data = function(type,site,id1,id2){//分类1，产品2；
    let params = {
        site:site,
    };
    if(type===1){
        this.$set(params,'category_template_id',id1);
    }else if(type===2){
        this.$set(params,'product_template_id',id1);
    }else{
        this.$set(params,'category_template_id',id1);
        this.$set(params,'product_template_id',id2);
    }
    return this.$http(api_publish_amazon_template,params).then(res=>{
        return Promise.resolve(res);
    }).catch(code=>{
        this.$message({type:'error',message:code.message||code});
    })
};



