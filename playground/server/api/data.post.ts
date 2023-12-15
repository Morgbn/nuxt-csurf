import { defineEventHandler, readBody } from 'h3'
export default defineEventHandler(async (event) => ['some', (await readBody(event)).d,'data'])
