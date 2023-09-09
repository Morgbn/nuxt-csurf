import type { ModuleOptions } from '../../types'
import { importEncryptSecret } from 'uncsrf'

let secretKey: Awaited<ReturnType<typeof importEncryptSecret>>
export const useSecretKey = async (options: ModuleOptions) => secretKey
  ? secretKey
  : (secretKey = await importEncryptSecret(options.encryptSecret, options.encryptAlgorithm))
