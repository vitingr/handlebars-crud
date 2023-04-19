module.exports = {

    infoUsuario: (usuario) => {

        const usuarioLogado = {
            id: usuario._id,
            tipoConta: usuario.tipoConta,
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            senha: usuario.senha,
            endereco: usuario.endereco,
            ultimo_cargo: usuario.ultimo_cargo,
            ultima_empresa: usuario.ultima_empresa,
            ultimo_contrato: usuario.ultimo_contrato,
            preferencia_emprego: usuario.preferencia_emprego,
            procurando_emprego: usuario.procurando_emprego,
            area: usuario.area,
            escola: usuario.escola,
            amigos: usuario.amigos,
            amigos_pendentes: usuario.amigos_pendentes,
            foto: usuario.foto,
            seguidores: usuario.seguidores,
            paginas: usuario.paginas,
            resumo: usuario.resumo,
            cargo_atual: usuario.cargo_atual,
            telefone: usuario.telefone,
            website: usuario.website,
            formacao: usuario.formacao
        }

        return usuarioLogado

    }


}
