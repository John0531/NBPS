describe("Btest", () => {

  const fileName = "010100916.20230815.B.zip";

  const localfileName = "cypress/"+fileName;


  beforeEach(() => {
    // 在所有測試方法執行之前進行登入操作
    cy.viewport(1500, 1000);
    cy.loginViaUi({ pwd: "P@ssw0rd", userName: "leoleeStore" });
    cy.visit("https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/B1");
  });

  afterEach(() => {
    cy.logOut(); 
  });

  it("批次交易檔上傳作業", () => {
    goB1AndUpload(fileName,localfileName);
  });

  it("批次交易查詢作業", () => {
    goB2AndSelect();
  });

  it("批次交易取消作業", () => {
    goB3AnDelete(fileName);
  });

  it("分析報表下載作業", () => {
    goB4AndDownload();
  });
});

function goB1AndUpload(fileName,localfileName) {
  //上傳檔案
  cy.get("#batchFile").selectFile(localfileName);

  //總比數:20
  cy.get("#totalCount")
    .clear({ force: true })
    .type("20", { force: true })
    .should("have.value", "20");

  //總金額:200
  cy.get("#totalAmt")
    .clear({ force: true })
    .type("200", { force: true })
    .should("have.value", "200");

  //上傳檔案
  cy.get(".btn-primary").contains("上傳").click();

  cy.wait(80000);
  cy.reload();

  // 選擇最後一頁
  cy.get(".next-item").prev().click();

  //送出授權
  cy.contains("th", fileName)
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .contains("確認送出授權", { timeout: 80000 })
    .click({ timeout: 80000 });

  //彈出視窗 確認送出授權
  cy.get(".swal2-confirm", { timeout: 60000 }).click();
}

function goB2AndSelect() {
  //go to B2
  cy.get("#B > .accordion-body > .list-unstyled > :nth-child(2) > .fs-6")
    .contains("批次交易查詢作業")
    .click();

  //選擇狀態
  cy.get(".col-xxl-5 > .form-select").select("全部");

  //搜尋
  cy.get(".card-body > .btn").contains("搜尋").click();

  //查詢最後一頁
  cy.get(".next-item").prev().click();

  cy.reload();

  cy.wait(40000);

  cy.reload();

  //查詢最後一筆的明細
  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item", {
    timeout: 65000,
  })
    .prev()
    .click({ multiple: true });
  //查詢明細
  cy.get("tbody > tr:last-child > td:nth-child(9)")
    .contains("檢視明細", {
      timeout: 65000,
    })
    .click({ multiple: true });

  //查詢明細第一筆的類別是不是:授權
  cy.get(
    ".tbl-container > .table > tbody > :nth-child(1) > :nth-child(2) > span"
  )
    .invoke("text")
    .should("eq", "(A)授權");

  //查詢明細第一筆的金額是不是:10
  cy.get(
    ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > :nth-child(3)"
  )
    .invoke("text")
    .should("eq", "10");

  //查詢明細第一筆的回應碼是不是:00
  cy.get(
    ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > :nth-child(5)"
  )
    .invoke("text")
    .should("eq", "00");

  //按下 "close"
  cy.get(".modal-footer > .btn").click();

  cy.reload();

  cy.wait(40000);

  cy.reload();

  //按下 "下載回覆檔"
  cy.get("tbody > tr:last-child > td:nth-child(9)")
    .contains("下載回覆檔", { timeout: 120000 })
    .click();

  cy.wait(3000);

  cy.reload();

  //檢查狀態是不是"已下傳回覆檔"
  cy.get("tbody > tr:last-child > td:nth-child(5)")
    .invoke("text")
    .should("include", "已下傳回覆檔");

  //按下 "下載總計EXCEL"
  cy.get("tbody > tr:last-child > td:nth-child(9)")
    .contains("下載總計EXCEL", { timeout: 120000 })
    .click();

  let filePath = "cypress/downloads/總計excel.xlsx";

  cy.wait(15000);

  //用require('xlsx')讀取filePath excel的檔案  轉成 string 並且用'/n'分開 並且存成array
  const XLSX = require("xlsx");

  cy.readFile(filePath, "binary").then((fileContent) => {
    const workbook = XLSX.read(fileContent, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const dataString = JSON.stringify(data);
    //過濾條件是保留不等於 0、(0) 和 '0' 的儲存格。
    const dataArray = data.map((row) =>
      row.filter((cell) => cell !== 0 && cell !== "(0)" && cell !== "0")
    );

    cy.wrap(dataArray[1][1]).should("eq", "20");
    cy.wrap(dataArray[2][1]).should("eq", "200");
  });
}

function goB3AnDelete(fileName) {
  //go to A3
  cy.get("#B > .accordion-body > .list-unstyled > :nth-child(3) > .fs-6")
    .contains("批次交易取消作業")
    .click();
  cy.wait(2000);

  cy.reload();
  //查詢最後一頁
  cy.get(".next-item").prev().click({ multiple: true });

  //按下檢視明細
  cy.contains("th", fileName)
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .contains("檢視明細", { timeout: 60000 })
    .click();

  //按下單筆取消
  cy.get(
    ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > :nth-child(8)"
  )
    .contains("單筆取消", { timeout: 60000 })
    .click();

  cy.wait(2000);

  //彈出視窗 確認單筆取消
  cy.get(".swal2-confirm").click();

  cy.wait(5000);

  //驗證取消成功
  cy.get(
    ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > :nth-child(8)"
  )
    .invoke("text")
    .should("include", "取消成功");

  cy.wait(2000);

  //close
  cy.get(".modal-footer > .btn").click();

  cy.reload();

  cy.wait(3000);

  //選擇最後一頁
  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item")
    .prev()
    .click({ multiple: true });

  cy.wait(2000);

  //按下整批取消
  cy.contains("th", fileName)
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .contains("整批取消", { timeout: 80000 })
    .click({ timeout: 60000 });

  //彈出視窗 確認整批取消
  cy.get(".swal2-confirm").click();

  cy.wait(65000);

  cy.reload();

  //選擇最後一頁
  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item")
    .prev()
    .click({ multiple: true });


  //按下檢視明細
  cy.contains("th", fileName)
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .contains("檢視明細", { timeout: 60000 })
    .click();

  //彈出視窗 驗證取消成功
  cy.get(
    ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > :nth-child(8)"
  )
    .invoke("text")
    .should("include", "取消成功");
  cy.get(
    ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(2) > :nth-child(8)"
  )
    .invoke("text")
    .should("include", "取消成功");

  //close
  cy.get(".modal-footer > .btn").click();

  cy.wait(2000);
}

function goB4AndDownload() {
  //go to B4
  cy.get("#B > .accordion-body > .list-unstyled > :nth-child(4) > .fs-6")
    .contains("月結請款對帳單")
    .click();

    cy.get('.form-select').select("依月份");

    //用 new Date 找尋前月月份 轉成英文
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const previousMonth = currentDate.toLocaleString("en-us", { month: "short" });
    console.log(previousMonth);
    cy.get('.dp__pointer').click();
  
    //找到month 含有的 的元素 並且點擊
    cy.contains(previousMonth).click();
  
    //下載當月的報表

  cy.wait(2000);
  cy.get('.card-body > .btn').contains("搜尋").click();

  //按下下載
  cy.get("tbody > tr > :nth-child(4)").contains("下載").click();
}
