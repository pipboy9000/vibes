const devConfig = {
    photos: {
        maxWidth: 1000,
        thumbnailMaxWidth: 150
    }
}

const prodConfig = {
    photos: {
        maxWidth: 1000,
        thumbnailMaxWidth: 150
    }
}

const config = process.env.NODE_ENV == 'production' ? prodConfig : devConfig;

export default {
    ...config
}