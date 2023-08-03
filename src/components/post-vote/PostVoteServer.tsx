import { getAuthSession } from "@/lib/auth"
import { Post, Vote, VoteType } from "@prisma/client"
import { notFound } from "next/navigation"
import PostVoteClient from "./PostVoteClient"

interface PostVoteServerProps {
  postId: string
  initialVotesAmount: number
  initialVote: VoteType | null
  getData: () => Promise<(Post & { votes: Vote[] }) | null>
}

const PostVoteServer = async ({
  getData,
  initialVotesAmount,
  initialVote,
  postId,
}: PostVoteServerProps) => {
  const session = await getAuthSession()

  let _votesAmount: number = 0
  let _currentVote: VoteType | null | undefined = undefined

  if (getData) {
    const post = await getData()
    if (!post) return notFound()

    _votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1
      else if (vote.type === "DOWN") return acc - 1
      return acc
    }, 0)

    _currentVote = post.votes.find((vote) => vote.userId === session?.user.id)
      ?.type
  } else {
    _votesAmount = initialVotesAmount!
    _currentVote = initialVote
  }

  return (
    <PostVoteClient
      initialVotesAmount={_votesAmount}
      initialVote={_currentVote}
      postId={postId}
    />
  )
}

export default PostVoteServer
