/**
 * Created by wuchuguang on 17-6-27.
 */
export const calc_item_context = function (type, configs, data){
    let strs = [];
    for (let i = 0; i < configs.length; i++) {
        let config = configs[i];
        let title = '';
        if (data[config.key]) {
            switch (config.type || type) {
                case 1:
                    if (data[config.key].value) {
                        let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                        childstr = childstr ? `:${childstr}` : '';
                        let unit = config.unit ? `(${config.unit})` : '';
                        title = `${config.title}${unit}${childstr}`;
                        if(objlength(config.condition)){
                            let keys=data[config.key].operator.sel;
                            title+=config.condition[keys]||''
                        }
                    }
                    break;
                case 2:
                    if (data[config.key].value) {
                        let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                        childstr = childstr ? `:${childstr}` : '';
                        title = `${config.title}${childstr}`;
                    }
                    break;
                case 3:
                    if (data[config.key].value) {
                        let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                        childstr = childstr ? `:${childstr}` : '';
                        title = `${config.title}${data[config.key].value}${childstr}`;
                    }
                    break;
                case 4:
                    if (data[config.key].value) {
                        let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                        childstr = childstr ? `:${childstr}` : '';
                        title = `${config.title}${data[config.key].value}${childstr}`;
                    }
                    break;
                case 5:
                    if (data[config.key].value) {
                        let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                        childstr = childstr ? `:${childstr}` : '';
                        title = `${config.title}${data[config.key].value}${childstr}`;
                    }
                    break;
                case 7:
                    if (data[config.key].value[0] !== "" && data[config.key].value[1] !== "") {
                        let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                        childstr = childstr ? `:${childstr}` : '';
                        title = `${config.title}${data[config.key].value}${childstr}`;
                    }
                    break;
                case 8:
                    let values  = null;
                    if(values = data[config.key].value){
                        if(!this.urlObject[config.url]){
                            let url = window.config.apiHost+config.url;
                            const resource = http('GET', url);
                            resource.then(res=>{
                                this.$set(this.urlObject, config.url, res);
                            }).catch(code=>{

                            });
                        }
                        values = values.mapExclude(row=>{
                            row = this.urlObject[config.url][row];
                            return row.name;
                        },exclude=>{
                            if(!this.urlObject[config.url]){
                                return true;
                            }
                            return !this.urlObject[config.url][exclude]
                        });
                        title = values.join(',');
                    }
                    break;
                case 11:
                    let value = data[config.key].value;
                    if(value){
                        title = config.condition.filter(row=>value.includes(row.value)).map(row=>row.label).join(',')
                    }
                default:
                    break;
            }
            title && strs.push(title);
        }

    }
    return strs;
}