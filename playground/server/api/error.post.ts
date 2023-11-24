import { defineEventHandler, createError } from 'h3'

let i = 0
export default defineEventHandler(() => {
  if (!(i++ % 2)) {
    throw createError({ status: 418 })
  }
  return "I'm a coffee maker"
})
