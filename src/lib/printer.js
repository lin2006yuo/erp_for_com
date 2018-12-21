//调用打印接口
//url：打印的接口
//data：传给打印接口的参数
window.localPrint = function (url, data) {
    if (!data.PrintName) {
        getPrintList().then((res) => {
            let options = res.pintList.map((row, index) => {
                return {
                    value: row,
                    label: row,
                }
            });
            data.PrintName = options[0].value;
            this.set_printerList(options);
            return printUsePrinter(url, data);
        }).catch(code => {
            this.$message({type: "error", message: '当前计算机上未启动打印服务'});
        });
    } else {
        return printUsePrinter(url, data);
    }
};


window.printUsePrinter = function (url, data) {
    return new Promise((success, fail) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: obj2url(data)
        }).then(res => {
            if (200 === res.status) {
                res.json().then(json => {
                    if (json.status === 'Success') {
                        this.$message({type: "success", message: json.message || json});
                        success(true);
                    } else {
                        this.$message({type: "error", message: json.message || json});
                        success(false);
                    }
                }).catch(json => {
                    console.error('200json()error', json);
                });
            } else {
                res.json().then(json => {
                    this.$message({type: "error", message: json.message || json});
                }).catch(json => {
                    console.error(json);
                });
            }
        }).catch(error => {
            this.$message({type: "error", message: json.message || json});
        });
    })
}

function getPrintList() {
    let url = `http://localhost:10093/getPrintList`;
    return new Promise((sucess, fail) => {
        let req = new Request(url, {
            method: "get",
            headers: {
//                            'Authorization': authorization()
            },
            mode: 'cors'
        });
        fetch(req).then(res => {
            console.log('res', res);
            if (200 === res.status) {
                res.json().then(json => {
                    sucess(json);
                    console.log("json", json);
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