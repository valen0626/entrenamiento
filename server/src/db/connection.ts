const config = {
    user: 'sa',
    password: '123',
    server: 'PYC-IT11506',
    database: 'productos_db',
    port: 1433,
    parseJSON: true,
    requestTimeout: 100000000,
    options: {
        "encrypt": true,
        "enableArithAbort": true,
        "trustServerCertificate": true,
    },
    pool: {
        max: 500,
        min: 0,
    }
}
export default config