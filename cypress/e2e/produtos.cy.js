/// <reference types="cypress"/>
import contrato from '../contratos/produtos.contrato'

describe('Teste de API - Produtos', () => {

    let token

    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then( tkn => {
            token = tkn
        })
    });

    it.only('Deve validar contrato de produtos', () => {
      cy.request('produtos').then(response => {
        return contrato.validateAsync(response.body)
      })
    });

    it('Listar produtos', () => {
      cy.request({
        method: 'GET',
        url: 'produtos'
      }).should((response) => {
        expect(response.status).equal(200)
        expect(response.body).to.have.property('produtos')
      })
    });

    it('Cadastrar produtos', () => {
        let produto = "Produto EBAC " + Math.floor(Math.random() * 1000)
        cy.cadastrarProduto(token, produto, 100, 'teste desc', 10
        ).should((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })
    });

    it('Cadastrar produto já existente', () => {
        cy.cadastrarProduto(token, 'Iphone 13', 10, 'celular', 10
        ).should((response) => {
            expect(response.status).equal(400)
            expect(response.body.message).equal('Já existe produto com esse nome')
        })
    });

    it.only('Deve editar um produto com sucesso', () => {
      let produto = "Produto EBAC " + Math.floor(Math.random() * 1000)
      let editado = "Produto EBAC Editado " + Math.floor(Math.random() * 1000)
      cy.cadastrarProduto(token, produto, 100, 'teste desc', 10)
        .then(
          response => {
            let id = response.body._id
            cy.request({
              method: 'PUT',
              url: `produtos/${id}`,
              headers: { authorization:token },
              body: {
                "nome": editado,
                  "preco": 500,
                  "descricao": "Mouse",
                  "quantidade": 300
              }
            }).should(response => {
              expect(response.body.message).to.equal('Registro alterado com sucesso')
              expect(response.status).equal(200)
            })
          }
        )
      
    });

    it.only('Deve deletar um produto com sucesso', () => {
      let produto = "Produto EBAC pra deletar " + Math.floor(Math.random() * 1000)
      cy.cadastrarProduto(token, produto, 100, 'teste desc', 10)
        .then(response => {
          let id = response.body._id

          cy.request({
            method:'DELETE',
            url: `produtos/${id}`,
            headers: {authorization: token}
          }).should(resp => {
            expect(resp.body.message).equal('Registro excluído com sucesso')
            expect(resp.status).equal(200)
          })
        })
    });

  });

  