describe('template spec', () => {
  it ('登入admin', () => {
    // 登入帳號
    cy.loginViaUi({ pwd: 'P@ssw0rd', userName: 'admin' })
    // 測試 F1 - 創建"權限管理人員"帳號 (IT Level)
    cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/F1')
    cy.get('button').contains('新增帳號').click()
    // 彈窗後的動作
    cy.get('.modal-content:contains("新增帳號")').within(() => {
      cy.get('input[name="帳號"]').type('testCypress')
      cy.get('input[name="名稱"]').type('Cypress測試帳1')
      cy.get('input[type="radio"][name="是否為AD使用者"]#adType1').check()
      cy.get('select[name="群組"]').select('資訊科傳用群組 - IT_SECTION_01')
      cy.get('button').contains('新增').click()
    })
    // 測試 F2 - 創建群組
    cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/F2')
    cy.get('button').contains('新增群組').click()
    cy.get('.modal-content:contains("新增群組權限")').within(() => {
      cy.get('input[id="account"]').type('測試')
      cy.get('input[id="name"]').type('Cypress')
      cy.get('input[id="description"]').type('Cypress測試創立群組')
      // cy.get('input[type="radio"][name="是否為AD使用者"]#adType1').check()
      // cy.get('select[name="群組"]').select('資訊科傳用群組 - IT_SECTION-01')
      // cy.get('button').contains('新增').click()
    })

  })
})
