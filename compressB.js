
// 自動產生當日的A~C交易壓縮檔(已加密)

// 加載Node.js 讀檔,壓縮&加密 相關套件
const fs = require('fs')
const archiver = require('archiver')
const encrypted = require('archiver-zip-encrypted')
archiver.registerFormat('zip-encrypted', encrypted)

// 建立壓縮檔案的函數
function createZipWithPassword(inputFile, zipFilePath, pwd) {
  const output = fs.createWriteStream(zipFilePath)
  const archive = archiver('zip-encrypted', {
    zlib: { level: 8 }, // 壓縮級別，數字越大壓縮率越高
    encryptionMethod: 'aes256', // 加密方法
    password: pwd
  });

  output.on('close', function () {
    console.log('壓縮檔案已創建：', zipFilePath)
  })

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err
    }
  });

  archive.on('error', function (err) {
    throw err
  })

  archive.pipe(output);

  // 將文本檔案添加到壓縮檔案中
  const fileContent = fs.readFileSync(inputFile)
  archive.append(fileContent, { name: inputFile })

  archive.finalize()
}

const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0')
const day = String(today.getDate()).padStart(2, '0')
const initFile = '092301568.txt'
oriFile = initFile

// 65 = A , 90 = Z
for (let i = 65; i <= 67; i++) {

inputFile = '092301568.'+`${year}${month}${day}.` + String.fromCharCode(i) + '.txt'

fs.rename(oriFile, inputFile, (err) => {
  if (err) throw err
})

oriFile = inputFile
zipFilePath = '092301568.'+`${year}${month}${day}.` + String.fromCharCode(i) + '.zip'
const pwd = 'Ubot!'+`${month}`

createZipWithPassword(inputFile, zipFilePath, pwd)

}

// 用非同步,最後執行把檔案改回初始名稱
async function renameFile(){
  fs.rename(inputFile, initFile, (err) => {
    if (err) throw err
    console.log('檔案已改回初始名')
  })
}

renameFile();