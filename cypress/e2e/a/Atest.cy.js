describe("template spec", () => {
  it("登入admin", () => {
    cy.viewport(1500, 1000);
    // 登入帳號
    cy.loginViaUi({ pwd: "@Fanggogo44", userName: "joefang" });
    //拜訪A1
    cy.visit("https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/A1");

    const fileName = "150100147.20230601.D.zip";

    // goA1AndUpload(fileName);

    // goA2AndSelect();

    // goA3AndDelete(fileName);

    goA4AndDownload();
  });
});

//upload;
function goA1AndUpload(fileName) {
  // 使用 選取特店代號. <input id="batchFile" type="file" >
  cy.get("select#batchStoreId").select("000100150100147");

  //上傳檔案
  cy.get("#batchFile").selectFile(fileName);

  cy.wait(3000);

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

  cy.wait(80000);
  cy.reload();

  cy.wait(3000);

  // 選擇最後一頁
  cy.get(".next-item").prev().click();



  //選擇<tbody>的第8個<tr>的第三 個<td>的值value() 是不是 'fileName'
  cy.get("tbody > tr:last > td:nth-child(3)")
    .contains(fileName)
    .should("be.visible");
  //選擇送出"確認送出授權"
  cy.get("tbody > tr:last > td:nth-child(12)")
    .contains("確認送出授權", { timeout: 80000 })
    .click({ timeout: 60000 });

  //彈出視窗 確認送出授權
  cy.get(".swal2-confirm", { timeout: 60000 }).click();
}

function goA2AndSelect() {
  // //go to A2
  cy.get("#A > .accordion-body > .list-unstyled > :nth-child(2) > .fs-6")
    .contains("批次交易查詢作業")
    .click();

  //選擇交易處理狀態:全部
  cy.get(":nth-child(3) > .form-select").select("全部");

  //選取特店代號:000100150100147 (交易驗證特店(四))
  cy.get(":nth-child(5) > .form-select").select("000100150100147");

  //按下查詢
  cy.get(".card-body > .btn").click();

  cy.reload();

  cy.wait(40000);

  cy.reload();

  //查詢最後一筆的明細
  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item", {
    timeout: 65000
  })
    .prev()
    .click({ multiple: true });

  cy.get("tbody > tr:last-child > td:nth-child(9)")
    .contains("檢視明細", { timeout: 65000 })
    .click({ multiple: true });

  //查詢明細第一筆的卡號是不是:5241150362919608
  cy.get(
    ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > th", { timeout: 65000 }
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

  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item")
    .prev()
    .click({ multiple: true }, { timeout: 60000 });

  //按下 "下載回覆檔"
  cy.get("tbody > tr:last-child > td:nth-child(9)")
    .contains("下載回覆檔", { timeout: 120000 })
    .click();

  //檢查狀態是不是"已下傳回覆檔"
  cy.get("tbody > tr:last-child > td:nth-child(5)")
    .invoke("text")
    .should("include", "已下傳回覆檔");

  //按下 "下載總計EXCEL"
  cy.get("tbody > tr:last-child > td:nth-child(9)")
    .contains("下載總計EXCEL")
    .click();

  let filePath = "cypress/downloads/總計excel.xlsx";

  cy.wait(10000);

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

    cy.wrap(dataArray[1][1]).should("eq", "2");
    cy.wrap(dataArray[2][1]).should("eq", "3,240");
  });
}

function goA3AndDelete(fileName) {
  // //go to A3
  cy.get("#A > .accordion-body > .list-unstyled > :nth-child(3) > .fs-6")
    .contains("批次交易取消作業")
    .click();
  cy.wait(2000);

  //選取特店代號:000100150100147 (交易驗證特店(四))
  cy.get(".col-xxl-5 > .form-select", { timeout: 60000 }).select(
    "000100150100147"
  );

  cy.wait(2000);

  //按下搜尋
  cy.get(".card-body > .btn").contains("搜尋").click();

  cy.wait(2000);

  cy.reload();

  //選擇最後一頁
  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item")
    .prev()
    .click({ multiple: true });

  cy.wait(2000);

  //按下檢視明細
  cy.contains("td", fileName)
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
    .click({ timeout: 60000 });

  cy.wait(2000);

  //彈出視窗 確認單筆取消
  cy.get(".swal2-confirm").click();

  cy.wait(2000);

  //彈出視窗 驗證取消成功
  cy.get(
    ".modal-body > .mt-5 > .tbl-container > .table > tbody > :nth-child(1) > :nth-child(8)"
  )
    .invoke("text")
    .should("include", "取消成功");

  cy.wait(2000);

  //close
  cy.get(".modal-footer > .btn").click();

  cy.wait(3000);

  cy.reload();

  //選擇最後一頁
  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item")
    .prev()
    .click({ multiple: true });

  cy.wait(3000);

  //按下整批取消
  cy.get(
    ".col-12 > .mt-5 > .tbl-container > .table > tbody >  tr:last > :nth-child(12)"
  )
    .contains("整批取消", { timeout: 60000 })
    .click({ timeout: 60000 });

  //彈出視窗 確認整批取消
  cy.get(".swal2-confirm", { timeout: 60000 }).click();

  cy.wait(35000);

  cy.reload();

  cy.wait(35000);

  cy.reload();

  //選取特店代號:000100150100147 (交易驗證特店(四)
  cy.get(".col-xxl-5 > .form-select").select("000100150100147");

  cy.wait(2000);

  //按下搜尋
  cy.get(".card-body > .btn").contains("搜尋").click();

  cy.reload();
  //選擇最後一頁
  cy.get(".col-12 > .mt-5 > .justify-content-end > .pagination > .next-item")
    .prev()
    .click({ multiple: true }, { timeout: 60000 });

  cy.reload();

  //按下檢視明細
  cy.contains("td", fileName, { timeout: 60000 })
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .next()
    .contains("檢視明細")
    .click();

  cy.wait(2000);

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
}

function goA4AndDownload() {
  //got to A4
  cy.get("#A > .accordion-body > .list-unstyled > :nth-child(4) > .fs-6")
    .contains("分析報表下載作業", { timeout: 60000 })
    .click();

  cy.get(".dp__pointer").click();

  //用 new Date 找尋前月月份 轉成英文
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  const previousMonth = currentDate.toLocaleString("en-us", { month: "short" });
  console.log(previousMonth);
 
  //找到month 含有的 的元素 並且點擊
  cy.contains(previousMonth).click();

  //下載當月的報表
  cy.get(".card-body > .btn").contains("下載").click();
}
