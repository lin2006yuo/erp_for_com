import {api_pack_getSupplier} from '@/api/pack';
import {api_get_publish} from '@/api/procurement-plan';
import {api_get_development} from '@/api/product-library';
export default {
    key:(page, pageSize, query) =>{

    },
    supplierList(){
        return api_pack_getSupplier().then(data =>{
            return Promise.resolve({data:data.map(row=>{
                return {
                    label:row.company_name,
                    value:row.id
                }
                }), count:data.length});
        })
    },
    purchaserList(){
        return api_get_publish().then(data =>{
            return Promise.resolve({data:data.map(row=>{
                    return {
                        label:row.realname,
                        value:row.id
                    }
                }), count:data.length})
        })
    },
    developmentList(){
        return api_get_development().then(data =>{
            return Promise.resolve({data:data.map(row =>{return {
                    label:row.realname,
                    value:row.id
                }}), count:data.length})
        })
    }
}
