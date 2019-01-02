var appId, appSecret;

if (process.env.NODE_ENV === 'production') {
    //prod
    appId = '1033690713453013';
    appSecret = 'e8408dd116c7abe3d6242969b9bf4b6c';
} else {
    //dev
    appId = '2192681937654200';
    appSecret = '3c8b296e0176f363c28ceb3eef97c36d';
}

console.log(appId, appSecret);

module.exports = {
    appId,
    appSecret
}