// CookieSerializeOptions from cookie-es
// can't do "import type { CookieSerializeOptions } from 'cookie-es'"
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
  https?: boolean,
  cookie?: CookieSerializeOptions,
  cookieKey?: string,
  methodsToProtect?: Array<string>, // the request methods we want CSRF protection for
  excludedUrls?: Array<string|[string, string]>, // any URLs we want to exclude from CSRF protection
  encryptSecret?: string,
  encryptAlgorithm?: string
}
