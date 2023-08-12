const configMail = {
    host: "sntp.gmail.com",
    port: "465",
    secure: true,
    auth: {
        user: "ksa@gmail.com",
        pass: ""// ele gerara um codigo para seu email acima
    },
    default: {
        from: "no-reply <noreply@acompanhatcc.com.br>"// seu email
    }
}


module.exports = configMail