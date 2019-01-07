
//alias.config.js
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    resolve: {
        alias: {
            '@': resolve('src'),
            'common': resolve('src/common'),
            'api': resolve('src/api'),
            'xxx': resolve('src/xxxx')
        }
    }
};
