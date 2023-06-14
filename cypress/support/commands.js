// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... }

// 登入帳號
Cypress.Commands.add('loginViaUi', (user) => {
    cy.session(
      user,
        () => {
            cy.visit('https://nbps.ubpg.com.tw/nbps/login')
            cy.get('input[name="帳號"]').type(user.userName)
            cy.get('input[name="密碼"]').type(user.pwd)
            cy.get('button').contains("登入").click({force: true})
        },
        {
             validate: () => {
                 cy.get('button').contains("登出").should('exist')
               }
         }
        )
  })

//   登出帳號
  Cypress.Commands.add('logOut', () => {
    cy.get(".btn-light").click()
    cy.wait(3000)
    cy.get(".swal2-confirm").contains("登出").click()
  })