export default {
    install(Vue, options) {
        options = options || {global:{url:'http://localhost:10093'}};
        // options = options || {global:{url:'http://172.18.8.43:10093'}};
        // initGlobalPrinters(Vue, options);
        Vue.mixin({
            created() {
                this.$printersInit = () =>{
                    initGlobalPrinters(Vue, options);
                };
                this.$printer = (printer, data) => {
                    if(!printer){
                        initGlobalPrinters(Vue, options);
                        return this.$message({type:'warning',message:'请指定打印机，再打印'});
                    }
                    printer = JSON.parse(printer);
                    const printData = Object.assign({}, data, {PrintName:printer.name});
                    return printUsePrinter.call(this, url_printer(printer.url), printData);
                };
                this.$printerOverlap = (printer, data) =>{
                    if(!printer){
                        initGlobalPrinters(Vue, options);
                        return this.$message({type:'warning',message:'请指定打印机，再打印'});
                    }
                    printer = JSON.parse(printer);
                    const printData = Object.assign({}, data, {PrintName:printer.name});
                    return printUsePrinter.call(this, url_printerOverlap(printer.url), printData);
                };
                this.$printers = (type) =>{
                    return this.$store.getters[`printer/${type}`] || [];
                };
            }
        })
    }
}

function initGlobalPrinters(Vue, options) {
    if (options.global) {
        console.log(`global printer ${options.global.url}`);
        let timer = setInterval(() =>{
            request_print_list(options.global.url).then(prints =>{
                $$VUE_GLOBAL.$store.dispatch('printer/globals', prints)
                clearInterval(timer);
            }).catch(_ =>{
                clearInterval(timer);
            })
        }, options.interval || 500);
    }
}

function url_printer(url) {
    return `${url}/print`;
}
function url_printerOverlap(url){
    return `${url}/overlappingPrint`;
}

function url_printers(url) {
    return `${url}/getPrintList`
}

function request_print_list(url) {
    return new Promise((sucess, fail) => {
        let req = new Request(`${url}/getPrintList`, {
            method: "get",
            headers: {},
            mode: 'cors'
        });
        fetch(req).then(res => {
            if (200 === res.status) {
                res.json().then(json => {
                    sucess(json.pintList.map(row => {
                        return {
                            label:row,
                            key:`${url}/${row}`,
                            value:JSON.stringify({
                                url,
                                name:row
                            }),
                        }
                    }));
                }).catch(code => {
                    console.error('200json()error', code);
                });
            } else {
                res.json().then(json => {
                    fail(json, res.status);
                }).catch(code => {
                    console.error(code);
                });
            }
        }).catch(error => {
            fail(error)
        });
    });
}
