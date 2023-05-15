describe('template spec', () => {
  it ('登入admin', () => {
    cy.loginViaUi({ pwd: 'P@ssw0rd', userName: 'admin' })
    cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/F1')
    cy.get('button').contains('新增帳號').click()
    cy.get('.modal-content:contains("新增帳號")').within(() => {
      cy.get('input[name="帳號"]').type('testCypress')
      cy.get('input[name="名稱"]').type('Cypress測試帳1')
      cy.get('input[type="radio"][name="選項名稱"]').check('選項值')
    })

  })
})
