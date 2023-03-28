module.exports = {

    infoUsuario: (usuario) => {

        const usuarioLogado = {
            id: usuario._id,
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
            faculdade: usuario.faculdade,
            foto: usuario.foto,
            seguidores: usuario.seguidores,
            resumo: usuario.resumo,
            cargo_atual: usuario.cargo_atual,
            website: usuario.webiste,
            formacao: usuario.formacao
        }

        return usuarioLogado

    }


}
