const devConfig = {
    futureVibes: {
        pollingInterval: 1000,
        minTimeBeforeNextActivation: 1000 * 60 * 60 * 24, // 24 hours
    }
}

const prodConfig = {
    futureVibes: {
        pollingInterval: 1000 * 60 * 60, // one hour
        minTimeBeforeNextActivation: 1000 * 60 * 60 * 24, // 24 hours
    }
}

const config = process.env.NODE ? prodConfig : devConfig;

module.exports = {
    ...config
}