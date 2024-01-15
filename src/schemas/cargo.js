import z from 'zod'
const numericRegex = /^[0-9]+$/
const codeRegex = /^[A-Z0-9_]+$/

const cargoSchema = z.record(
  z.string().refine((val) => codeRegex.test(val)),
  z.string().refine((val) => numericRegex.test(val))
)
export function validateCargo(input) {
  const result = cargoSchema.safeParse(input)
  if (!result.success) return false
  return true
}
