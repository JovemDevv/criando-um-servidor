const { object, string, mixed } = require("yup")
const { apiEndpoints } = require("../../api/index")
const MailService = require("../../services/mail")

const criarChave = (n, r="") => {
    while (n--) {
        r += String.fromCharCode(
            ((r = Math.random()* 62) | 0),
            (r += r > 9 ? (r < 36 ? 55 : 61) : 48)
        )
    }
    return r
}

class Usuarios {
    async store(req, res, next) {

        let usuarioSchema = object({
            usu_nome: string().required("Entre com um nome de usuário"),
            usu_email: string()
            .email("Entre cim um e-mail válido")
            .required("entre com o e-mail"),
        usu_senha: string()
            .required("Entre com a senha")
            .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
          "A senha precisa ter no minimo 6 carcteres, sendo, uma maiúscula, uma minúscula, um número e um caracter especial"
        ),
        usu_nivel: mixed(["admin", "comum"], "Tipo de usu[ario incorreto")
    })

        !req.body?.usu_nivel && (req.body = { ...req.body, usu_nivel: "comum"})
        !req.body?.usu_celular && (req.body = { ...req.body, usu_celular: ""})
        !req.body?.usu_cpf && (req.body ={ ...req.body, usu_cpf: ""})

        const usu_chave = criarChave(10)
        const { usu_nome, usu_email } = req.body
        await MailService.sendActivation({
            usu_nome,
            usu_email,
            usu_chave
        }) 

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
            return res.status(400).end(JSON.stringify({ error: error.message }));
        }
        
        const usuario = apiEndpoints.db
        .get("usuarios")
        .find({ usu_email: req.body.usu_email })
        .cloneDeep()
        .value()

        if (usuario) {
            return res.status(400).end(JSON.stringify({ error: "Usuário já cadastrado" }));
        }
        

        next() // Certifique-se de chamar o próximo middleware ou rota após manipular req.body
    }

    async update(req, res, next) {
        req.body = { ...req.body, update_at: new DataView()}
        next()
    }

    async active (req,res, next) {
        const {chave} = req.params

        let usuario = apiEndpoints.db
        .get("usuarios")
        .find({usu_chave: chave})
        .value()

        if (!usuario) {
            return res.status(400).send({error: "key not finded"}).end()
        }

        usuario.usu_chave = ""
        usuario.usu_cadastroativo = true
        usuario.usu_emailconfirmado = true
        apiEndpoints.db.write()

        return res.status(200).send({ response: "Use activated"}).end
    }

}

module.exports = new Usuarios()
