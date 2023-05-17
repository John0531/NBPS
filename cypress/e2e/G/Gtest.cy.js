describe("template spec", () => {
  it("登入admin", () => {
    cy.viewport(1500, 1000);
    // 登入帳號
    cy.loginViaUi({ pwd: "P@ssw0rd", userName: "leolee" });
    //拜訪A1
    cy.visit("https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/G2");

    // goG2AndUpload();

    // cy.wait(60000);

    cy.visit("https://upay-beta.ubpg.com.tw/nbps-dev/nbps-system/G1");
    
    goG1AndCheck();

    cy.logOut();
  });

  //upload;
  function goG2AndUpload() {
    const fileName = "000100010100999.20230517.01.OK";

    

    //上傳檔案
    cy.get("#batchFile").selectFile(fileName);

     //使用 選取作業類型. <input id="batchFile" type="file" >
     cy.get("select#batchStoreType").select("PUBLIC_UTILITIES");


    //使用 選取特店代號. <input id="batchFile" type="file" >
    cy.get("select#batchStoreId").select("000100010100999");

    //上傳檔案
    cy.get("form > .btn-primary").click();

    cy.wait(60000);

    // 選擇最後一頁
    cy.get(".next-item").prev().click();


    //選擇送出"確認送出授權"
    cy.get("tbody > tr:last > td:nth-child(8)>button:last").click();

    //彈出視窗 確認送出授權
    cy.get(".swal2-confirm").click();
  }

  function goG1AndCheck() {
  //   //設定起日
  //   cy.get('div.input-group')
  //   .contains('起日')
  //   .siblings('Datepicker')
  //   .find('input')
  //   .select("2023-05-17 00:00:00");
  
  // // 設定迄日
  // cy.get('div.input-group')
  //   .contains('迄日')
  //   .siblings('Datepicker')
  //   .find('input')
  //   .select("2023-05-17 23:59:59");

    //按下搜尋
    cy.get("div.card-body > button").contains('搜尋').click();

    cy.wait(5000);

    // 選擇最後一頁
    cy.get(".next-item").prev().click();


    //選擇檢視明細
    cy.get("tbody > tr:last > td:nth-child(8)>button:last").click();
    //關閉視窗
    cy.get("div.modal-footer > button").contains('Close').click();

   
  }
}
)