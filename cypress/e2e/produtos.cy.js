/// <reference types="cypress"/>

describe('Teste de API - Produtos', () => {

    let token

    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then( tkn => {
            token = tkn
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
  })