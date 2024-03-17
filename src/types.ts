// CookieSerializeOptions from cookie-es
// can't do "import type { CookieSerializeOptions } from 'cookie-es'"
import type { EncryptAlgorithm } from 'uncsrf'

//  probably due to https://github.com/unjs/unbuild/issues/135
interface CookieSerializeOptions {
  domain?: string | undefined;
  encode?(value: string): string;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  path?: string | undefined;
  sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean | undefined;
}

export interface ModuleOptions {
  https?: boolean
  cookie?: CookieSerializeOptions
  cookieKey?: string
  methodsToProtect?: Array<string> // the request methods we want CSRF protection for
  encryptSecret?: string // for non serverless runtime
  encryptAlgorithm?: EncryptAlgorithm
  addCsrfTokenToEventCtx?: boolean // to run useCsrfFetch on server
  enabled?: boolean // disabled module server middleware/plugin when `enabled` is set to `false` (you will still have access to `useCsrf`/`useCsrfFetch` client composables)
}
