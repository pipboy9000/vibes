const devConfig = {
    futureVibes: {
        pollingInterval: 1000
    }
}

const prodConfig = {
    futureVibes: {
        pollingInterval: 1000 * 60 * 60
    }
}

const config = process.env.NODE ? prodConfig : devConfig;

module.exports = {
    ...config
}