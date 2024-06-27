/// <reference types="cypress" />
import contrato from '../contratos/usuarios.contrato'

describe('Testes da Funcionalidade Usuários', () => {

    beforeEach(() => {
        cy.fixture('usuarios').then((usuarios) => {
            cy.wrap(usuarios).as('dadosUsuario');
        })
    });

    it.only('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
          })
    });
  
    it.only('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios' 
        }).should( response => {
            expect(response.status).equal(200)
            expect(response.body).to.have.property('usuarios')
        })
    });
  
    it.only('Deve cadastrar um usuário com sucesso', () => {

        cy.get('@dadosUsuario').then((dadosUsuarios) => {
            let usuario = dadosUsuarios.usuarios[0].nome
            let email = dadosUsuarios.usuarios[0].email
            let password = dadosUsuarios.usuarios[0].password
            let administrador = dadosUsuarios.usuarios[0].administrador

            cy.cadastrarUsuario(usuario, email, password, administrador)
            .should(response => {
                expect(response.body.message).equal('Cadastro realizado com sucesso')
                expect(response.status).equal(201)
            })
        })
        
       
    });
  
    it('Deve validar um usuário com email inválido', () => {
        let usuario = "Yasmin " + Math.floor(Math.random() * 1000)
        let password = Math.floor(Math.random() * 1000)
        let administrador = 'true'
        cy.cadastrarUsuario(usuario, 'teste3@email.com', password, administrador
            ).should((response) => {
                expect(response.status).equal(400)
                expect(response.body.message).equal('Este email já está sendo usado')
            })
    });
  
    it('Deve editar um usuário previamente cadastrado', () => {
        let usuario = "Fulano " + Math.floor(Math.random() * 1000)
        let email = 'teste'+ Math.floor(Math.random() * 1000) + '@email.com'
        let password = Math.floor(Math.random() * 1000)
        let administrador = 'true'
        let usuarioEditado = "Fulano Editado " + Math.floor(Math.random() * 1000)
        cy.cadastrarUsuario(usuario, email, password, administrador)
          .then(
            response => {
              let id = response.body._id
              cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                body: {
                    "nome": usuarioEditado,
                    "email": email,
                    "password": password,
                    "administrador": administrador
                }
              }).should(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
                expect(response.status).equal(200)
              })
            }
          )
    });
  
    it('Deve deletar um usuário previamente cadastrado', () => {
        let usuario = "Fulano " + Math.floor(Math.random() * 1000)
        let email = 'teste'+ Math.floor(Math.random() * 1000) + '@email.com'
        let password = Math.floor(Math.random() * 1000)
        let administrador = 'true'
        cy.cadastrarUsuario(usuario, email, password, administrador)
          .then(response => {
            let id = response.body._id
  
            cy.request({
              method:'DELETE',
              url: `usuarios/${id}`,
            }).should(resp => {
              expect(resp.body.message).equal('Registro excluído com sucesso')
              expect(resp.status).equal(200)
            })
          })
    });
  
  
  });