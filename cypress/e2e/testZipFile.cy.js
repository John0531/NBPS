describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://upay-beta.ubpg.com.tw/nbps-dev/login')

    // 執行自動產製壓縮檔Node.js程式
    cy.exec('node compress.js')

  })
})