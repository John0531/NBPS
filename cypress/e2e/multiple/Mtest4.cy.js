describe("template spec", () => {
  it("登入admin", () => {
    cy.viewport(1500, 1000);
    // 登入帳號
    cy.loginViaUi({ pwd: "P@ssw0rd", userName: "leoleeStore" });
    //拜訪A1
    cy.visit("https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/B2");

    goA2AndSelect();
  });
});

function goA2AndSelect() {
  cy.get(
    ':nth-child(2) > .dp__main > [aria-label="Datepicker input"] > .dp__input_wrap > .dp__pointer'
  ).click();

  cy.get(
    '[data-test="Mon May 01 2023 00:00:00 GMT+0800 (台北標準時間)"] > .dp__cell_inner'
  ).click();


    //選擇交易處理狀態:全部
    cy.get(":nth-child(3) > .form-select").select("全部");

    cy.get('.card-body > .btn').click();


      //查詢最後一筆的明細
  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item")
  .prev()
  .click({ multiple: true },{ timeout: 5000 });
  for (let i = 0; i < 1000; i++) {
    cy.get("tbody > tr:last-child > td:nth-child(9)")
      .contains("檢視明細")
      .click({ multiple: true },{ timeout: 10000 });
     

    //按下 "close"
    cy.get('.modal-footer > .btn',{ timeout: 20000 }).contains("Close").click({ multiple: true },{ timeout: 20000 });
   


  }
}
