describe("template spec", () => {
  it("登入admin", () => {
    cy.viewport(1500, 1000);
    // 登入帳號
    cy.loginViaUi({ pwd: "P@ssw0rd", userName: "joefangC" });
    //拜訪A1
    cy.visit("https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/A1");

    goA2AndSelect();
  });
});

function goA2AndSelect() {
  // //go to A2
  cy.get(
    "#A > .accordion-body > .list-unstyled > :nth-child(2) > .fs-6"
  ).click();
  cy.get(
    ':nth-child(2) > .dp__main > [aria-label="Datepicker input"] > .dp__input_wrap > .dp__pointer'
  ).click();

  cy.get(
    '[data-test="Mon May 01 2023 00:00:00 GMT+0800 (台北標準時間)"] > .dp__cell_inner'
  ).click();

  // cy.wait(3000);
  for (let i = 0; i < 100; i++) {
    //選擇交易處理狀態:全部
    cy.get(":nth-child(3) > .form-select").select("全部");

    //選取特店代號:000100150100147 (交易驗證特店(四))
    cy.get(":nth-child(5) > .form-select").select("000100150100147");

    //按下查詢
    cy.get(".card-body > .btn").click();

    cy.wait(2000);
    cy.get(":nth-child(3) > .form-select").select("全部");

    //選取特店代號:000100150100147 (交易驗證特店(四))
    cy.get(":nth-child(5) > .form-select").select("000101010101101");

    //按下查詢
    cy.get(".card-body > .btn").click();
   
    cy.wait(2000);
  }
}
