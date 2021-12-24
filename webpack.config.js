module.exports = {
    entry: `${__dirname}/js/loader.mjs`,
    output: {
        path: `${__dirname}/js/dist`,
        filename: 'dist.js',
        clean: true
    },
    mode: "production",
    devtool: "source-map"
};