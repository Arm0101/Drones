import z from 'zod'
const numericRegex = /^[0-9]+(\.[0-9]*)?$/
const droneSchema = z.object({
  serialNumber: z
    .string()
    .max(100, { message: 'Serial number must be a maximum of 100 characters.' }),

  model: z.string(),

  state: z.string(),

  weightLimit: z
    .string()
    .refine((val) => numericRegex.test(val) && parseFloat(val) >= 0 && parseFloat(val) <= 500, {
      message: 'The weight limit must be between 0 and 500.'
    }),

  batteryCapacity: z
    .string()
    .refine((val) => numericRegex.test(val) && parseFloat(val) >= 0 && parseFloat(val) <= 100, {
      message: 'The battery capacity must be between 0 and 100.'
    })
})
export function validateDrone(input) {
  const result = droneSchema.safeParse(input)
  if (!result.success) {
    const err = []
    result.error.issues.forEach((element) => {
      err.push(element.path.toString() + ': ' + element.message)
    })
    return { Ok: false, msg: err }
  }
  return { Ok: true, msg: 'ok' }
}
