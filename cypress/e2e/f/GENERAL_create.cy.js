describe('template spec', () => {
  it('登入權限管理人員帳號,創建使用者帳號與群組', () => {

    // 設定瀏覽器的視窗大小
    cy.viewport(1500, 1000)

    // cy.loginViaUi({ pwd: 'Ubot123456!', userName: 'testCypress' })

    cy.visit('https://nbps.ubpg.com.tw/nbps/login')
    cy.get('input[name="帳號"]').type('userCY2')
    cy.get('input[name="密碼"]').type('Ubot123456!')
    cy.get('button').contains("登入").click({force: true})

    cy.get('.swal2-popup').should('exist').then(($e) => {
      const title = $e.find('.swal2-title').text()
        // 初次登入後要修改密碼
        if (title === '帳號或密碼錯誤'){
          cy.get('.swal2-confirm').click()
          cy.get('input[name="密碼"]').clear()
          cy.get('input[name="密碼"]').type('UBot123456!')
          cy.get('button').contains("登入").click({force: true})
          cy.wait(2000)
          cy.get('input[name="修改密碼"]').type('Ubot123456!')
          cy.get('input[name="確認密碼"]').type('Ubot123456!')
          cy.get('button').contains('更改密碼').click()    

          // 登出帳號
          cy.logOut()
          cy.reload()

          // 再次登入
          cy.loginViaUi({ pwd: 'Ubot123456!', userName: 'userCY2' })
        }
    })
    
    cy.wait(2000)
    cy.reload()

     // 測試 F2 - 創建"使用者"群組 (User Level)
     cy.visit('https://nbps.ubpg.com.tw/nbps/nbps-system/F2')
     cy.get('button').contains('新增群組').click()
     cy.wait(2000)
     cy.get('.modal-content:contains("新增群組權限")').within(() => {
       cy.get('input[name="群組代號"]').type('userCY2')
       cy.get('input[name="群組名稱"]').type('Cypress User Group')
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
     cy.visit('https://nbps.ubpg.com.tw/nbps/nbps-system/F1')
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