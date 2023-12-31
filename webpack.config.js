/** @format */

const SentryWebpackPlugin = require('@sentry/webpack-plugin')

module.exports = {
    // other configuration
    plugins: [
        new SentryWebpackPlugin({
            include: '.',
            ignoreFile: '.sentrycliignore',
            ignore: ['node_modules', 'webpack.config.js'],
            configFile: 'sentry.properties',
        }),
    ],
}
