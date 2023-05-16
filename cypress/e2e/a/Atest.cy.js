describe("template spec", () => {
  it("登入admin", () => {
    cy.viewport(1500, 1000);
    // 登入帳號
    cy.loginViaUi({ pwd: "@Fanggogo44", userName: "joefang" });
    //拜訪A1
    cy.visit("https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/A1");

    // goA1AndUpload();

    // cy.wait(60000);

    goA2AnduSelect();

    // logout();
  });

  //upload;
  function goA1AndUpload() {
    const firstfileName = "150100147.20230516.A.txt.zip";
    const lastfileName = "000100150100147.20230516.A.zip";

    //使用 選取特店代號. <input id="batchFile" type="file" >
    cy.get("select#batchStoreId").select("000100150100147");

    //上傳檔案
    cy.get("#batchFile").selectFile(firstfileName);

    //總比數:2
    cy.get("#totalCount")
      .clear({ force: true })
      .type("2", { force: true })
      .should("have.value", "2");

    //總金額:3240
    cy.get("#totalAmt")
      .clear({ force: true })
      .type("3240", { force: true })
      .should("have.value", "3240");

    //上傳檔案
    cy.get("form > .btn-primary").click();

    cy.wait(60000);

    // 選擇最後一頁
    cy.get(".next-item").prev().click();

    //選擇<tbody>的第8個<tr>的第三 個<td>的值value() 是不是 'lastfileName'
    cy.get("tbody > tr:last > td:nth-child(3)")
      .invoke("text")
      .should("eq", lastfileName);

    //選擇送出"確認送出授權"
    cy.get("tbody > tr:last > td:nth-child(12)>button:last").click();

    //彈出視窗 確認送出授權
    cy.get(".swal2-confirm").click();
  }

  function goA2AnduSelect() {
    //go to A2
    cy.get(
      "#A > .accordion-body > .list-unstyled > :nth-child(2) > .fs-6"
    ).click();

    //選擇交易處理狀態:全部
    cy.get(":nth-child(3) > .form-select").select("全部");

    //選取特店代號:000100150100147 (交易驗證特店(四))
    cy.get(":nth-child(5) > .form-select").select("000100150100147");

    //按下查詢
    cy.get(".card-body > .btn").click();

    //查詢最後一筆的明細
    cy.get("tbody > tr:last-child > td:nth-child(9)")
      .contains("檢視明細")
      .click();

    //查詢明細第一筆的卡號是不是:5241150362919608
    cy.get(
      ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > th"
    )
      .invoke("text")
      .should("eq", "5241150362919608");

    //查詢明細第一筆的類別是不是:授權
    cy.get(
      ".tbl-container > .table > tbody > :nth-child(1) > :nth-child(2) > span"
    )
      .invoke("text")
      .should("eq", "(A)授權");

    //查詢明細第一筆的金額是不是:1,620
    cy.get(
      ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > :nth-child(3)"
    )
      .invoke("text")
      .should("eq", "1,620");

    //查詢明細第一筆的回應碼是不是:00
    cy.get(
      ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > :nth-child(5)"
    )
      .invoke("text")
      .should("eq", "00");

    //按下 "close"
    cy.get(".modal-footer > .btn").click();

    //按下 "下載回覆檔"
    cy.get("tbody > tr:last-child > td:nth-child(9)")
      .contains("下載回覆檔")
      .click();

    //檢查狀態是不是"已下傳回覆檔"
    cy.get(
      ".col-12 > .mt-5 > .tbl-container > .table > tbody > tr > :nth-child(5)"
    )
      .invoke("text")
      .should("eq", "已下傳回覆檔");

    //按下 "下載總計EXCEL"
    cy.get("tbody > tr:last-child > td:nth-child(9)")
      .contains("下載總計EXCEL")
      .click();

    let filePath = "cypress/downloads/總計excel.xlsx";

    cy.wait(5000);
    const XlsxPopulate = require("xlsx-populate");
    //用require('xlsx-populate')讀取filePath excel的檔案  轉成 string 並且用'/n'分開 並且存成array
    cy.readFile(filePath, "binary").then((fileContent) => {
      console.log(fileContent);
    });
  }
  function logout() {
    cy.get(".btn-light").click();
    cy.wait(3000);
    cy.get(".swal2-confirm").contains("登出").click();
  }
});
