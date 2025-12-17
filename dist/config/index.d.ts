export declare const config: {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    redisUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    supabase: {
        url: string;
        serviceKey: string;
        storageBucket: string;
    };
    momo: {
        baseUrl: string;
        subscriptionKey: string;
        apiUser: string;
        apiKey: string;
        environment: string;
        callbackUrl: string;
    };
    twilio: {
        accountSid: string;
        authToken: string;
        phoneNumber: string;
    };
    email: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
        from: string;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        pass: string;
        fromName: string;
        fromEmail: string;
    };
    whatsapp: {
        enabled: boolean;
        from: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    google: {
        clientId: string;
        clientSecret: string;
        webClientId: string;
    };
    corsOrigin: string;
    corsOrigins: string[];
    maxFileSize: number;
    maxImagesPerProduct: number;
    defaultCurrency: string;
    currencySymbol: string;
};
export default config;
//# sourceMappingURL=index.d.ts.map