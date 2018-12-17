const devConfig = {
    futureVibes: {
        pollingInterval: 1000 * 10, // ten seconds
        minTimeBeforeNextActivation: 1000 * 60 * 60 * 24, // 24 hours
    },
    cache: {
        // vibeTimeout: 1000 * 60 * 60 * 24
    }
}

const prodConfig = {
    futureVibes: {
        pollingInterval: 1000 * 60, // one minute
        minTimeBeforeNextActivation: 1000 * 60 * 60 * 24, // 24 hours
    },
    cache: {
        vibeTimeout: 1000 * 60 * 60 * 24
    }
}

const config = process.env.NODE ? prodConfig : devConfig;

module.exports = {
    ...config
}