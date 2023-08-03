import { Vote } from "@prisma/client"

export type CachedPost = {
  id: string
  title: string
  authorUsername: string
  content: string // editorjs blocks
  currentVote: Vote["type"] | null
  createdAt: Date
}
