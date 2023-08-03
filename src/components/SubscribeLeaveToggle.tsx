"use client"
import { useMutation } from "@tanstack/react-query"
import { Button } from "./ui/Button"
import { SubscriveToSubredditPayload } from "@/lib/validators/subreddit"
import { FC, startTransition } from "react"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface SubscribeLeaveToggleProps {
  subredditId: string
  subredditName: string
  isSubscribed: boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToast()

  const router = useRouter()

  const { mutate: subscribeToSubreddit, isLoading: isSubLoading } = useMutation(
    {
      mutationFn: async () => {
        const payload: SubscriveToSubredditPayload = { subredditId }

        const { data } = await axios.post("/api/subreddit/subscribe", payload)
        return data as string
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return loginToast()
        }

        return toast({
          title: "There was an problem",
          description: "Something went wrong, please try again later.",
          variant: "destructive",
        })
      },

      onSuccess: () => {
        startTransition(router.refresh)

        return toast({
          title: "Subscribed!",
          description: `You are now subscribed to r/${subredditName}`,
          variant: "successfull",
        })
      },
    },
  )

  const { mutate: unSubscribeToSubreddit, isLoading: isUnsubLoading } =
    useMutation({
      mutationFn: async () => {
        const payload: SubscriveToSubredditPayload = { subredditId }

        const { data } = await axios.post("/api/subreddit/unsubscribe", payload)
        return data as string
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return loginToast()
        }

        return toast({
          title: "There was an problem",
          description: "Something went wrong, please try again later.",
          variant: "destructive",
        })
      },

      onSuccess: () => {
        startTransition(router.refresh)

        return toast({
          title: "Unsubscribed!",
          description: `You are now unsubscribed from r/${subredditName}`,
          variant: "successfull",
        })
      },
    })

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => unSubscribeToSubreddit()}
      isLoading={isUnsubLoading}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => subscribeToSubreddit()}
      isLoading={isSubLoading}
    >
      Join to post
    </Button>
  )
}

export default SubscribeLeaveToggle
