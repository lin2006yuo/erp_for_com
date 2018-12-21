/**
 * Create by zhangzhiyong on 18-08-24
 */
import {api_get_baidu_token} from "@/api/delivery-check";

import {authorization} from '../auth';

export default {
    install(Vue, options) {
        options = options || {global: {url: 'http://localhost:10093'}};
        get_token(Vue);
        Vue.mixin({
            created() {
                this.$audio = (text, token, speed) => {
                    let audio = document.getElementById('audio');
                    if (!audio) {
                        audio = create_audio();
                    }

                    let audioData = this.$store.getters['audio/voice'](text);
                    console.log(`audio`, audioData);
                    if (!!audioData) {
                        play(audio, audioData.url);
                        return;
                    }

                    if (token === '') {//token不存在时，再次获取后再播放
                        get_token();
                        this.$nextTick(() => {
                            this.$audio(text, token, speed);
                        });
                        return;
                    }

                    const audioUrl = "http://tsn.baidu.com/text2audio";
                    let option = {
                        tex: '',
                        tok: token,
                        cuid: authorization(),
                        ctp: 1,
                        lan: 'zh',
                        spd: 5,
                        pit: 5,
                        vol: 15,
                        per: 1,
                        aue: 3,
                    };
                    option.tex = text;
                    speed && (option.spd = speed);
                    console.log('speed', speed);
                    let formData = Object.keys(option).map(key => `${key}=${key === 'tex' ?
                        encodeURIComponent(encodeURIComponent(option[key])) :
                        encodeURIComponent(option[key])}`);

                    let xhr = new XMLHttpRequest();
                    xhr.open("POST", audioUrl, true);

                    // 用来处理blob数据
                    let frd = new FileReader();
                    xhr.responseType = "blob";
                    xhr.send(formData.join("&"));

                    let timer = setTimeout(function () {
                        xhr.abort();
                    }, 60000);

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState == 4) {
                            clearTimeout(timer);
                            if (xhr.status == 200) {
                                if (xhr.response.type === "audio/mp3") {
                                    // 在body元素下apppend音频控件
                                    document.body.append(audio);
                                    let url = URL.createObjectURL(xhr.response);
                                    this.$store.dispatch({
                                        type: 'audio/set_voice',
                                        voice: text,
                                        url: url
                                    });
                                    play(audio, url);
                                }

                                // 用来处理错误
                                if (xhr.response.type === "application/json") {
                                    frd.onload = function () {
                                        var text = frd.result;
                                        this.$message({
                                            type: 'error',
                                            message: text.message || text,
                                        })
                                    };
                                    frd.readAsText(xhr.response);
                                }
                            } else if (xhr.status == 502) {
                                get_token();
                                this.$nextTick(() => {
                                    this.$audio(text, this.$store.getters['audio/token']);
                                });
                            }
                        }
                    };
                };
            },
        })
    }
}

function play(audio, url) {
    audio.setAttribute("src", url);
    audio.play();
}

function create_audio() {
    let audio = document.createElement('audio');
    audio.id = 'audio';
    audio.style.display = "none";
    audio.volumne = 15;
    window.document.body.appendChild(audio);
    return audio;
}

function get_token() {
    console.log(`GET token`, config.apiHost);
    let url = config.apiHost + 'delivery-check/get-baidu-token';
    let timer = setInterval(() => {
        request_print_list(url).then(token => {
            $$VUE_GLOBAL.$store.dispatch('audio/set_token', token)
            clearInterval(timer);
        }).catch(_ => {
            clearInterval(timer);
        })
    }, 500);
    setTimeout(() => {
        timer && clearInterval(timer)
    }, 2000);

}

function request_print_list(url) {
    return new Promise((sucess, fail) => {
        let req = new Request(url, {
            method: "get",
            headers: {
                'Authorization': authorization()
            },
            mode: 'cors'
        });
        fetch(req).then(res => {
            if (200 === res.status) {
                res.json().then(json => {
                    sucess(json.token);
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
