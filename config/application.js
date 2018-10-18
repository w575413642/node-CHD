exports.config = {
    session: {

        /**
         * @param name - session名称
         */

        name: "nodeNice",

        /**
         * @param secret - session签名
         */

        secret: "772e17",

        /**
         * @param saveUninitialized - session初始状态
         */

        saveUninitialized: false,

        /**
         * @param resave - session重刷
         */

        resave: false,

        /**
         * @param cookie - session有效期，单位毫秒
         */
        cookie: {
            maxAge: 5* 60* 1000 
            // maxAge: 2000
        },
        
    },

    /**
     * @param Access - 跨域
     */

    Access: true
}