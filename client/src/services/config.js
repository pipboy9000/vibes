const devConfig = {
    photos: {
        maxSize: 1000
    }
}

const prodConfig = {
    photos: {
        maxSize: 1000
    }
}

const config = process.env.NODE_ENV == 'production' ? prodConfig : devConfig;

export default {
    ...config
}