import axios from 'axios'
import forge from 'node-forge'

const Forge = {
  async getPublicKey () {
    const url = `${process.env.VUE_APP_BASE_API}/z1/env`
    const res = await axios.post(url, {})
    if (res == null || res.data == null) {
      return null
    }
    return res.data.pk
  },
  async encrypt (pd) {
    const publicKey = await Forge.getPublicKey()
    const ubPublicKey = '-----BEGIN PUBLIC KEY-----\n' + publicKey + '-----END PUBLIC KEY-----'
    // ? 將 PEM 格式的公鑰轉換為 Forge 公鑰
    const ubEDEPublicKey = forge.pki.publicKeyFromPem(ubPublicKey)
    // ? 使用公鑰加密密碼，並用 base64 編碼
    const encryptedPd = forge.util.encode64(ubEDEPublicKey.encrypt(pd, 'RSAES-PKCS1-V1_5'))
    return encryptedPd
  },
  decrypt () {

  }
}

export default Forge
