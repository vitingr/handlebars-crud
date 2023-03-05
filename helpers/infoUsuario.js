module.exports = {

    infoUsuario: (usuario) => {

        const usuarioLogado = {
            id: usuario._id,
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            senha: usuario.senha,
            pais: usuario.pais,
            estado: usuario.estado,
            cidade: usuario.cidade,
            escola: usuario.escola,
            faculdade: usuario.faculdade,
            foto: usuario.foto,
            area: usuario.area,
            seguidores: usuario.seguidores 
        }

        return usuarioLogado

    }


}
