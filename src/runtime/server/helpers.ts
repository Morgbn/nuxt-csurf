import { importEncryptSecret } from 'uncsrf'
import type { ModuleOptions } from '../../types'

let secretKey: Awaited<ReturnType<typeof importEncryptSecret>>
export const useSecretKey = async (options: ModuleOptions) => secretKey
  ? secretKey
  : (secretKey = await importEncryptSecret(options.encryptSecret, options.encryptAlgorithm))
