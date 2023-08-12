const { object, string } = require("yup")

class Usuarios {
    async store(req, res, next) {

        let usuarioSchema = object({
            usu_nome: string().required("Entre com um nome de usuário"),
            usu_email: string()
            .email("Entre cim um e-mail válido")
            .required("entre com o e-mail"),
        usu_senha: string().min(6, "A senha tem que ter no minimo 6 digitos").required("Entre com a senha")

        })

        !req.body?.usu_nivel && (req.body = { ...req.body, usu_nivel: "comum"})
        !req.body?.usu_celular && (req.body = { ...req.body, usu_celular: ""})
        !req.body?.usu_cpf && (req.body ={ ...req.body, usu_cpf: ""})

        req.body = {
            ...req.body, 
            usu_foto: "",
            usu_chave: "",
            usu_emailconfirmado: false,
            usu_cadastroativo: false,
            created_at: new Date(), 
            updated_at: ""
        }

        try {
            await usuarioSchema.validate(req.body)
        } catch (error) {
            return res.status(400).end(error.message)
        }

        next() // Certifique-se de chamar o próximo middleware ou rota após manipular req.body
    }

    async update(req, res, next) {
        // Lógica para a função update
    }
}

module.exports = new Usuarios()
