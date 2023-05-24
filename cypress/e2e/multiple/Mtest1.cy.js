describe("template spec", () => {
  it("登入admin", () => {
    cy.viewport(1500, 1000);
    // 登入帳號
    cy.loginViaUi({ pwd: "P@ssw0rd", userName: "joefangA" });
    //拜訪A1
    cy.visit("https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/A1");

    goA2AndSelect();
  });
});

function goA2AndSelect() {
 // //go to A3
 cy.get("#A > .accordion-body > .list-unstyled > :nth-child(3) > .fs-6",{ timeout: 5000 })
 .contains("批次交易取消作業")
 .click();


//選取特店代號:000100150100147 (交易驗證特店(四))
cy.get("select[data-v-3102c76f]").select("000100150100147");


for (let i = 0; i < 1000; i++) {
//按下搜尋
cy.get(".card-body > .btn",{ timeout: 5000 }).contains("搜尋").click();


}

}
