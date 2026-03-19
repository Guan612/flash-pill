import { z } from 'zod'

export const capsuleStatusSchema = z.enum([
  'SEALED',
  'FERMENTING',
  'OPENED',
  'ARCHIVED',
])
export const capsuleTypeSchema = z.enum(['IDEA', 'TODO', 'MEMO', 'INSIGHT'])

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const attachmentSchema = z.object({
  id: z.string(),
  type: z.enum(['IMAGE', 'AUDIO', 'FILE']),
  url: z.string().url(),
  fileName: z.string().optional(),
  duration: z.number().optional(),
})

export const capsuleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  rawContent: z.string(),
  refinedContent: z.string().optional(),
  status: capsuleStatusSchema,
  type: capsuleTypeSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  openAt: z.string().datetime().optional(),
  attachments: z.array(attachmentSchema),
  mood: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(tagSchema),
})

export type CapsuleStatus = z.infer<typeof capsuleStatusSchema>
export type CapsuleType = z.infer<typeof capsuleTypeSchema>
export type Tag = z.infer<typeof tagSchema>
export type Attachment = z.infer<typeof attachmentSchema>
export type Capsule = z.infer<typeof capsuleSchema>
