const nodemailer = require("nodemailer")
const configMail = require("../config/mail")
const transporter = nodemailer.createTransport(configMail)

class MailService {
    async sendMail(message) {
        let resultado
        try {
            resultado = transporter,sendMail({
                ...consifgMail.default,
                ...message
            })
        } catch(error) {
            return error
        }
        return resultado
    }

    async sendActivation({ usu_nome, usu_email, usu_chave}) {
        let output = `
            Olá, ${usu_nome}, <br/><br/>
            <a href="https://localhost:8080/ativacao/${usu_chave}">Chave</a>` 

        try {
            await this.sendMail({
                to: `${usu_nome} <${usu_email}>`,
                subject: "Confirmação de cadastro",
                html: output
            })
        } catch (error) {
            return error
        }
        return true
    }
}

module.export = new MailService()