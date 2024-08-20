import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(event => ['some', getQuery(event).d, 'data'])
