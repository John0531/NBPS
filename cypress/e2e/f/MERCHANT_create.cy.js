describe('template spec', () => {
  it('登入權限管理人員', () => {
    cy.visit(Cypress.env('CYPRESS_BASE_URL'))
    // cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/login')
    cy.get('input[name="帳號"]').type('testCypressUser')
    cy.get('input[name="密碼"]').type('UBot123456!')
    cy.get('button').contains("登入").click({force: true})

    // 初次登入後要修改密碼
    cy.get('input[name="修改密碼"]').type('Ubot12346!')
    cy.get('input[name="確認密碼"]').type('Ubot12346!')
    cy.get('button').contains('更改密碼').click()

    // 如果已修改過密碼
    // cy.loginViaUi({ pwd: 'Ubot12346!', userName: 'testCypress' })

     // 測試 F2 - 創建"特店"群組
     cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/C3')
     cy.get('button').contains('新增群組').click()
     cy.get('.modal-content:contains("新增群組權限")').within(() => {
       cy.get('input[name="群組代號"]').type('testCY_MERCHANT')
       cy.get('input[name="群組名稱"]').type('testCY_MERCHANT_GP')
       cy.get('input[id="description"]').type('測試自動建立MERCHANT群組')
       cy.get('[id="B"]').check()
       cy.get('button').contains('新增').click()
     })
     
     // 測試 F1 - 創建"特店"帳號 (User Level)
     cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/C2')
     cy.get('button').contains('新增帳號').click()
     // 彈窗後的動作
     cy.get('.modal-content:contains("新增帳號")').within(() => {
       cy.get('input[name="帳號"]').type('testCypressMerchant')
       cy.get('input[name="名稱"]').type('Cypress測試帳Merchant')
       cy.get('input[type="radio"][name="是否為AD使用者"]#adType1').check()
       cy.get('select[name="群組"]').select('testCY_MERCHANT_GP - testCY_MERCHANT')
       cy.get('button').contains('新增').click()
     })

  })
})