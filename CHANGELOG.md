## [1.6.2](https://github.com/Morgbn/nuxt-csurf/compare/v1.6.1...v1.6.2) (2024-08-20)


### Bug Fixes

* :art: message on error ([2e928b7](https://github.com/Morgbn/nuxt-csurf/commit/2e928b79fc4c51c15f71c4606e01616d0bf43b7e))

## [1.6.1](https://github.com/morgbn/nuxt-csurf/compare/v1.6.0...v1.6.1) (2024-07-17)


### Bug Fixes

* :bug: defaults merge array ([0f756fc](https://github.com/morgbn/nuxt-csurf/commit/0f756fcdf15f4df3a60761ab5e67d1c110591474)), closes [#37](https://github.com/morgbn/nuxt-csurf/issues/37)

# [1.6.0](https://github.com/morgbn/nuxt-csurf/compare/v1.5.2...v1.6.0) (2024-07-17)


### Bug Fixes

* :bug: support uppercase methods ([1c3073b](https://github.com/morgbn/nuxt-csurf/commit/1c3073b5242214a0acd759eb0f2fe8d7cef82333)), closes [#39](https://github.com/morgbn/nuxt-csurf/issues/39)


### Features

* :sparkles: option to configure header name ([2e093cc](https://github.com/morgbn/nuxt-csurf/commit/2e093cc755b45e026c90cda7b96c9cf8a3d29388)), closes [#38](https://github.com/morgbn/nuxt-csurf/issues/38)

## [1.5.2](https://github.com/morgbn/nuxt-csurf/compare/v1.5.1...v1.5.2) (2024-04-21)


### Bug Fixes

* :bug: import missing useLazyCsrfFetch ([3343a9d](https://github.com/morgbn/nuxt-csurf/commit/3343a9d29fc1855e76a14710b721507e6586a6bd)), closes [#33](https://github.com/morgbn/nuxt-csurf/issues/33)
* opt in to `import.meta.*` properties ([377ce75](https://github.com/morgbn/nuxt-csurf/commit/377ce75af64de762912e9bb2977dfc5e41ecfc44))

## [1.5.1](https://github.com/morgbn/nuxt-csurf/compare/v1.5.0...v1.5.1) (2024-03-20)


### Bug Fixes

* :truck: mv utils/ in runtime ([e728ff2](https://github.com/morgbn/nuxt-csurf/commit/e728ff22db2d13f4deca2637193aba01824daedb)), closes [#30](https://github.com/morgbn/nuxt-csurf/issues/30)

# [1.5.0](https://github.com/morgbn/nuxt-csurf/compare/v1.4.2...v1.5.0) (2024-03-20)


### Features

* :sparkles: per-route configuration & ability to disable ([7550de1](https://github.com/morgbn/nuxt-csurf/commit/7550de143af2910a6b0df1db429dd67236ff4f60)), closes [#25](https://github.com/morgbn/nuxt-csurf/issues/25) [baroshem/nuxt-security#334](https://github.com/baroshem/nuxt-security/issues/334)

## [1.4.2](https://github.com/morgbn/nuxt-csurf/compare/v1.4.1...v1.4.2) (2024-02-22)


### Bug Fixes

* :label: declare plugin type ([87ad5fa](https://github.com/morgbn/nuxt-csurf/commit/87ad5fafd85312086f454577c8925e2b8f13f73c))

## [1.4.1](https://github.com/morgbn/nuxt-csurf/compare/v1.4.0...v1.4.1) (2024-02-21)


### Bug Fixes

* :adhesive_bandage: string-width error ([dcad5e8](https://github.com/morgbn/nuxt-csurf/commit/dcad5e88f70883161c92fe485cfa26f08093768f))
* :label: add types to $csrfFetch ([b3ffc49](https://github.com/morgbn/nuxt-csurf/commit/b3ffc490f488f55340afdefadc1ffcdc6bcaed00)), closes [#19](https://github.com/morgbn/nuxt-csurf/issues/19)

# [1.4.0](https://github.com/morgbn/nuxt-csurf/compare/v1.3.2...v1.4.0) (2023-12-15)


### Bug Fixes

* :rotating_light: extends ./.nuxt/tsconfig.json ([4b18bda](https://github.com/morgbn/nuxt-csurf/commit/4b18bda72f44ed3872293ea6353e39ec00827363))


### Features

* :sparkles: add `addCsrfTokenToEventCtx` option ([e4408fc](https://github.com/morgbn/nuxt-csurf/commit/e4408fc7d2e77b1be9746818d76ae86ad4e0f42f)), closes [#20](https://github.com/morgbn/nuxt-csurf/issues/20) [#22](https://github.com/morgbn/nuxt-csurf/issues/22)

## [1.3.2](https://github.com/morgbn/nuxt-csurf/compare/v1.3.1...v1.3.2) (2023-11-24)


### Bug Fixes

* :art: store token in meta tag ([7d770bb](https://github.com/morgbn/nuxt-csurf/commit/7d770bb6102c353158115feb5e05b313bd7ee59d))

## [1.3.1](https://github.com/morgbn/nuxt-csurf/compare/v1.3.0...v1.3.1) (2023-09-11)


### Bug Fixes

* :label: useCsrfFetch type ([ed77553](https://github.com/morgbn/nuxt-csurf/commit/ed7755398a70af52a835c106c019c1d7965c2fdf)), closes [#13](https://github.com/morgbn/nuxt-csurf/issues/13)

# [1.3.0](https://github.com/morgbn/nuxt-csurf/compare/v1.2.0...v1.3.0) (2023-09-09)


### Bug Fixes

* :bug: importEncryptSecret on runtime ([65c22c0](https://github.com/morgbn/nuxt-csurf/commit/65c22c0a358bdb16730c2080ed75f9d42288874c))
* :hammer: add playground scripts ([5a26b63](https://github.com/morgbn/nuxt-csurf/commit/5a26b633ec13f70c437be4162ac231ab6f201941))
* :rotating_light: change eslint config ([0c19252](https://github.com/morgbn/nuxt-csurf/commit/0c192525140bc94673a671df3808dc5165712bd2))


### Features

* :sparkles: add useLazyCsrfFetch ([b06beac](https://github.com/morgbn/nuxt-csurf/commit/b06beac48c3aaa5f581d40e2b955a28a34d036f8))
* :sparkles: support non ssr build ([7624ea1](https://github.com/morgbn/nuxt-csurf/commit/7624ea1acb8943fc158626c767093ae59a0a2663)), closes [#12](https://github.com/morgbn/nuxt-csurf/issues/12) [#9](https://github.com/morgbn/nuxt-csurf/issues/9) [#8](https://github.com/morgbn/nuxt-csurf/issues/8)
* :sparkles: support serverless ([4628f29](https://github.com/morgbn/nuxt-csurf/commit/4628f29d78cc17d668b0be68f5609f9b8fd121c6))

# [1.2.0](https://github.com/morgbn/nuxt-csurf/compare/v1.1.0...v1.2.0) (2023-03-07)


### Features

* :arrow_up: upgrade nuxt ([acc9921](https://github.com/morgbn/nuxt-csurf/commit/acc9921e304b91f079180a265a9a47b45afcd699)), closes [#5](https://github.com/morgbn/nuxt-csurf/issues/5)

# [1.1.0](https://github.com/morgbn/nuxt-csurf/compare/v1.0.1...v1.1.0) (2023-02-11)


### Features

* :sparkles: add a plugin that provide a $fetch wrapper with csrf automatically added ([bc302ab](https://github.com/morgbn/nuxt-csurf/commit/bc302ab293b0cbaca21786a2dfbf71dab7c9c957)), closes [#4](https://github.com/morgbn/nuxt-csurf/issues/4)

## [1.0.1](https://github.com/morgbn/nuxt-csurf/compare/v1.0.0...v1.0.1) (2023-01-27)


### Bug Fixes

* :art: copy useFetch signature ([beeb821](https://github.com/morgbn/nuxt-csurf/commit/beeb821890c68e2d3c63a42574ce85f8b6717615)), closes [#3](https://github.com/morgbn/nuxt-csurf/issues/3)

# 1.0.0 (2023-01-19)


### Features

* :sparkles: composables & server middleware ([d7eec56](https://github.com/morgbn/nuxt-csurf/commit/d7eec5653b5c221384452d539ca1339693328532))
* :white_check_mark: playground tests ([27d2725](https://github.com/morgbn/nuxt-csurf/commit/27d27252e0da17fe65d79e592d683564c4f95f90))
