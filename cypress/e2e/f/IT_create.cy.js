describe('template spec', () => {
  it ('登入admin,創建權限管理者帳號與群組', () => {

    // 設定瀏覽器的視窗大小
    cy.viewport(1500, 1000);

    // 登入帳號
    cy.loginViaUi({ pwd: 'P@ssw0rd!', userName: 'admin' })

    // 測試 F2 - 創建"權限管理人員"群組
    cy.visit('https://nbps.ubpg.com.tw/nbps/nbps-system/F2')

    cy.wait(1000)

    cy.get('#F > .accordion-body > .list-unstyled > :nth-child(2) > .fs-6').click()
    cy.get('button').contains('新增群組').click()
    cy.wait(2000)
    cy.get('.modal-content:contains("新增群組權限")').within(() => {
      cy.get('input[name="群組代號"]').type('Cypress IT')
      cy.get('input[name="群組名稱"]').type('Cypress IT Group')
      cy.get('input[id="description"]').type('測試自動建立IT群組2')
      cy.get('[id="F"]').check()
      cy.get('[id="I6"]').check()
      cy.get('button').contains('新增').click()
    })
    
    // 等待 3000ms(3秒) 與 重新整理頁面
    cy.wait(3000)
    cy.reload()

    // 測試 F1 - 創建"權限管理人員"帳號 (IT Level)
    cy.visit('https://nbps.ubpg.com.tw/nbps/nbps-system/F1')
    cy.get('button').contains('新增帳號').click()
    cy.wait(2000)
    // 彈窗後的動作
    cy.get('.modal-content:contains("新增帳號")').within(() => {
      cy.get('input[name="帳號"]').type('itCY2')
      cy.get('input[name="名稱"]').type('CypressIT2')
      cy.get('input[type="radio"][name="是否為AD使用者"]#adType1').check()
      cy.get('select[name="群組"]').select('Cypress IT Group - Cypress IT')
      cy.get('button').contains('新增').click()
    })

    // 登出帳號
    cy.logOut()

  })
})
