describe('template spec', () => {
  it('登入權限管理人員', () => {

    // 設定瀏覽器的視窗大小
    cy.viewport(1500, 1000);

    
    // 初次登入後要修改密碼
    // cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/login')
    // cy.wait(1000)
    // cy.get('input[name="帳號"]').type('testCypress')
    // cy.get('input[name="密碼"]').type('UBot123456!')
    // cy.get('button').contains("登入").click({force: true})

    

    // cy.get('input[name="修改密碼"]').type('Ubot123456!')
    // cy.get('input[name="確認密碼"]').type('Ubot123456!')
    // cy.get('button').contains('更改密碼').click()

    // cy.wait(1000)
    // cy.reload()


    // 如果修改過密碼
    cy.loginViaUi({ pwd: 'Ubot123456!', userName: 'testCypress' })

     // 測試 F2 - 創建"使用者"群組 (User Level)
     cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/F2')
     cy.get('button').contains('新增群組').click()
     cy.wait(2000)
     cy.get('.modal-content:contains("新增群組權限")').within(() => {
       cy.get('input[name="群組代號"]').type('testCY_USER')
       cy.get('input[name="群組名稱"]').type('testCY_USER_GP')
       cy.get('input[id="description"]').type('測試自動建立USER群組')
       cy.get('[id="A"]').check()
       cy.get('[id="C"]').check()
       cy.get('[id="G"]').check()
       cy.get('[id="H"]').check()
       cy.get('button').contains('新增').click()
     })

     // 等待 2000ms(2秒) 與 重新整理頁面
     cy.wait(2000)
     cy.reload()
     
     // 測試 F1 - 創建"使用者"帳號 (User Level)
     cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/F1')
     cy.get('button').contains('新增帳號').click()
     cy.wait(2000)
     // 彈窗後的動作
     cy.get('.modal-content:contains("新增帳號")').within(() => {
       cy.get('input[name="帳號"]').type('testCypressUser')
       cy.get('input[name="名稱"]').type('Cypress測試帳User')
       cy.get('input[type="radio"][name="是否為AD使用者"]#adType1').check()
       cy.get('select[name="群組"]').select('testCY_USER_GP - testCY_USER')
       cy.get('button').contains('新增').click()
     })
  
      // 登出帳號
      cy.logOut()

  })
})