import UserNameForm from "@/components/UserNameForm"
import { authOptions, getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Settings",
  description: "Manage acocunt and website settings.",
}

const Page = async () => {
  const session = await getAuthSession()

  if (!session?.user) redirect(authOptions.pages?.signIn || "/sign-in")

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
      </div>

      <div className="grid gap-10 mt-4">
        <UserNameForm
          user={{
            id: session.user.id,
            username: session.user.username || "",
          }}
        />
      </div>
    </div>
  )
}

export default Page
