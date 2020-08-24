import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMH+iKg2R9NjNEjyz+dB5Bu5CsXgFscWlMDqiUAIIJ2MzCsHMsD2qIPTEsQd+U0nI5oVDSsAHF9LbYEIDohqyNECAwEAAQ=='

const privateKey = 'MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAoMmotm6OTGV\n' +
  'jCfIUb/KWbzswXMzmJSqVgw9mQpJv3sht/mFDBlpnsbgOHfncBapnvoRXQJqMJwmxJgGPzkJwDQI\n' +
  'DAQABAkAd7IoGsdqv4yqkfjZJg2d1+hkNHGE0x5Ed3C7W8vP5DR61qttArlOllpR/Ibye5GU3Xc0s\n' +
  'kt/SHEKDggTajcJNAiEA1YULYcQG5iD6RVWcQ/sadqcmE754RQ5QxBC0d6EHyC8CIQDAxuCIjJ1A9ri\n' +
  'TysY/xTGtzmkwAHw6MFVCInMudGkAgwIhALxbr9zBJyzgLqf3i/DUlVXSwl5sioCwzkMIUYuu/MR1Ai\n' +
  'EAodRSGU8xk5+KQ0cuNcpsceOdGdbOcmqwp9wTpSPEIdECIEF4fSIP32s183AX4l2GphGGigSWzhZt+wayY8HM4e3r'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}

