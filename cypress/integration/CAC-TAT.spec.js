/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  const THREE_SECONDS = 3000;

  beforeEach(() => {
    cy.visit('./src/index.html');
  });

  it('verifica o título da aplicação', function() {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT');
  });

  it('preenche os campos obrigatórios e envia o formulário', function() {
    cy.clock();
    cy.get('[data-cy="firstName"]').type('Pedro');
    cy.get('[data-cy="lastName"]').type('Esteves');
    cy.get('[data-cy="email"]').type('pedro@hotmail.com');
    cy.get('[data-cy="comoPodemosAjudar"]').type('teste teste teste teste teste teste teste teste', {delay: 0});
    cy.get('[data-cy="enviar"]').click();
    cy.get('[class="success"]').should('be.visible');
    cy.tick(THREE_SECONDS)
    cy.get('[class="success"]').should('not.be.visible');
  });

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
    cy.clock();
    cy.get('[data-cy="firstName"]').type('Pedro');
    cy.get('[data-cy="lastName"]').type('Esteves');
    cy.get('[data-cy="email"]').type('pedro.com');
    cy.get('[data-cy="comoPodemosAjudar"]').type('teste teste teste teste teste teste teste teste', {delay: 0});
    cy.get('[data-cy="enviar"]').click();
    cy.get('.error').should('be.visible');
    cy.tick(THREE_SECONDS);
    cy.get('.error').should('not.be.visible');
  });

  it('campo telefone continua vazio quando preenchido com valor não numérico', function() {
    cy.get('#phone')
      .type('abcdefg')
      .should('have.value', '');
  });

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
    cy.clock();
    cy.get('[data-cy="firstName"]').type('Pedro');
    cy.get('[data-cy="lastName"]').type('Esteves');
    cy.get('[data-cy="email"]').type('pedro@hotmail.com');
    cy.get('#phone-checkbox').check();
    cy.get('[data-cy="comoPodemosAjudar"]').type('teste teste teste teste teste teste teste teste', {delay: 0});
    // cy.get('[data-cy="enviar"]').click();
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
    cy.tick(THREE_SECONDS);
    cy.get('.error').should('not.be.visible');
  });

  it('preenche e limpa os campos nome, sobrenome e email', function () {
    cy.get('[data-cy="firstName"]')
      .type('Pedro')
      .should('have.value', 'Pedro')
      .clear()
      .should('have.value', '');

    cy.get('[data-cy="lastName"]')
      .type('Esteves')
      .should('have.value', 'Esteves')
      .clear()
      .should('have.value', '');

    cy.get('[data-cy="email"]')
      .type('pedro@hotmail.com')
      .should('have.value', 'pedro@hotmail.com')
      .clear()
      .should('have.value', '');
  });

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
    cy.clock();
    cy.get('[data-cy="enviar"]').click();
    cy.get('.error').should('be.visible');
    cy.tick(THREE_SECONDS);
    cy.get('.error').should('not.be.visible');
  });

  it('envia o formulário com sucesso usando um comando customizado', function() {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get('[class="success"]').should('be.visible');
    cy.tick(THREE_SECONDS);
    cy.get('[class="success"]').should('not.be.visible');
  });

  it('seleciona um produto (Youtube) por seu texto', function() {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube');
  });

  it('seleciona um produto (Mentoria) por seu valor (value)', function() {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria');
  });

  it('seleciona um produto (Blog) por seu índice', function() {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog');
  });

  it('marca o tipo de atendimento "Feedback"', function() {
    cy.get('[type="radio"]')
      .check('feedback')
      .should('have.value', 'feedback');
  });

  it('marca cada tipo de atendimento', function() {
    cy.get('[type="radio"]')
      .should('have.length', 3)
      .each(function($radio) {
        cy.wrap($radio).check();
        cy.wrap($radio).should('be.checked');
      });
  });

  it('marca ambos checkboxes, depois desmarca o último', function() {
    cy.get('[type="checkbox"]')
      .check()
      .should('be.checked')
      .last().uncheck()
      .last().should('not.be.checked')
  });

  it('seleciona um arquivo da pasta fixtures', function() {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json')
      .should(function($input) {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('seleciona um arquivo simulando um drag-and-drop', function() {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
      .should(function($input) {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
    cy.fixture('example.json').as('sampleFile');
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('@sampleFile')
      .should(function($input) {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
    cy.get('#privacy a').should('have.attr', 'target', '_blank');
  });

  it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
    cy.get('#privacy a').invoke('removeAttr', 'target').click();
    cy.contains('Talking About Testing').should('be.visible');
  });

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', function() {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible');
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible');
  });

  it('preenche a area de texto usando o comando invoke', function() {
    const LONG_TEXT = Cypress._.repeat('teste ', 30);

    cy.get('[data-cy="comoPodemosAjudar"]')
      .invoke('val', LONG_TEXT)
      .should('have.value', LONG_TEXT);
  });

  it('faz uma requisição HTTP', function() {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function(response) {
        const {status, statusText, body} = response;
        expect(status).to.equal(200);
        expect(statusText).to.equal('OK');
        expect(body).to.include('CAC TAT');
      });
  });

  it.only('encontra o gato', function() {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible');
  });
});