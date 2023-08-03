import { formatTimeToNow } from "@/lib/utils"
import { Post, User, Vote } from "@prisma/client"
import { MessageSquare } from "lucide-react"
import { FC, useRef } from "react"
import EditorOutput from "./EditorOutput"
import Link from "next/link"
import PostVoteClient from "./post-vote/PostVoteClient"

type PartialVote = Pick<Vote, "type">

interface PostProps {
  subredditName: String
  post: Post & {
    author: User
    votes: Vote[]
  }
  commentAmount: number
  votesAmount: number
  currentVote?: PartialVote
}

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmount,
  votesAmount,
  currentVote,
}) => {
  const postRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rounded-md shadow bg-white">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          initialVotesAmount={votesAmount}
          postId={post.id}
          initialVote={currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="hover:underline text-zinc-900 text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>
                {/* normal link because we need hard reset. next/link doesnt perform hard refresh*/}
                <span className="px-1">•</span>
              </>
            ) : null}
            <Link href={`/u/${post.author.id}`} className="hover:underline">
              Posted by u/{post.author.username}
            </Link>
            {" " + formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold leading-6 text-gray-900 py-2">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={postRef}
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center ga-2"
        >
          <MessageSquare className="h-4 w-4 mr-2" />{" "}
          {` ${commentAmount} comments`}
        </a>
      </div>
    </div>
  )
}

export default Post
