describe('template spec', () => {
  it('登入使用者帳號,創建特店資料與帳號', () => {

    // 設定瀏覽器的視窗大小
    cy.viewport(1500, 1000);

    cy.visit('https://nbps.ubpg.com.tw/nbps/login')
    cy.get('input[name="帳號"]').type('testCypressUser')
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
          cy.loginViaUi({ pwd: 'Ubot123456!', userName: 'testCypressUser' })
        }
    })
    
    cy.wait(2000)
    cy.reload()

    // 測試 C1 - 創建"特店" 
    cy.visit('https://nbps.ubpg.com.tw/nbps/nbps-system/C1')
    cy.get('button').contains('新增').click()
    cy.wait(2000)
    cy.get('.modal-content:contains("新增特店資料")').within(() => {
      cy.get('input[name="特店代碼"]').type('000101010101101')
      cy.get('input[name="特店名稱"]').type('Cypress特店')
      cy.get('select[name="特店作業類型"]').select('自行上傳(收單流程)')
      cy.get('#SALE').check()
      cy.get('#AUTH').check()
      cy.get('#REFUND').check()
      cy.get('#callBank2').check()
      // cy.get('#idNo2').check()
      cy.get('select[name="作業時間"]').select('營業日09:00 - 17:30')
      cy.get('#uploadPd').type('Ubot!')
      cy.get('#tidCnt').type('2')
      cy.get('select[name="合作狀態"]').select('合作中')
      cy.get('textarea').type('Cypress特店測試')
      cy.get('button').contains('新增').click()
    })
     
    cy.wait(3000)
    cy.reload()

    // 測試 C3 - 創建"特店"群組 (Merchant Level)
    cy.visit('https://nbps.ubpg.com.tw/nbps/nbps-system/C3')
    cy.get('button').contains('新增群組').click()
    cy.wait(2000)
    cy.get('.modal-content:contains("新增群組權限")').within(() => {
      cy.get('input[name="群組代號"]').type('testCY_MERCHANT')
      cy.get('input[name="群組名稱"]').type('testCY_MERCHANT_GP')
      cy.get('input[id="description"]').type('測試自動建立MERCHANT群組')
      cy.get('[id="B1"]').check()
      cy.get('[id="B2"]').check()
      cy.get('[id="B3"]').check()
      cy.get('[id="B4"]').check()
      cy.get('button').contains('新增').click()
    })

    cy.wait(3000)
    cy.reload()

     // 測試 C2 - 創建"特店"帳號 (User Level)
     cy.visit('https://nbps.ubpg.com.tw/nbps/nbps-system/C2')
     cy.get('button').contains('新增帳號').click()
     cy.wait(2000)
     cy.get('.modal-content:contains("新增特店資料")').within(() => {
       cy.get('input[name="帳號"]').type('testCypressMerchant')
       cy.get('input[name="名稱"]').type('Cypress測試帳Merchant')
       cy.get('select[name="所屬特店"]').select('000101010101101(Cypress特店)')
       cy.get('input[name="Email"]').type('ubotMerchant@utic.com.tw')
      //  cy.get(':nth-child(7) > .col-sm-10 > #shop').select('testCY_MERCHANT_GP - testCY_MERCHANT')
       cy.get('select[name="群組"]').select('testCY_MERCHANT_GP - testCY_MERCHANT')
       cy.get('button').contains('新增').click()
     })

    cy.wait(3000)
    cy.reload()

    // 登出帳號
    cy.logOut()

    // 登入創建的特店帳號 & 初次登入改密碼
    cy.visit('https://nbps.ubpg.com.tw/nbps/login')
    cy.get('input[name="帳號"]').type('testCypressMerchant')
    cy.get('input[name="密碼"]').type('UBot123456!')
    cy.get('button').contains("登入").click({force: true})
    cy.wait(2000)
    cy.get('input[name="修改密碼"]').type('Ubot123456!')
    cy.get('input[name="確認密碼"]').type('Ubot123456!')
    cy.get('button').contains('更改密碼').click()    

    cy.wait(3000)
    cy.reload()




  })
})