"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import AuthLayout from "@/components/AuthLayout"

export default function EditPost({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase.from("posts").select("*").eq("id", params.id).single()

      if (error) {
        console.error("Error fetching post:", error)
        return
      }

      if (data) {
        setTitle(data.title)
        setContent(data.content)
      }

      setIsLoading(false)
    }

    fetchPost()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    const { data, error } = await supabase.from("posts").update({ title, content }).eq("id", params.id)

    setIsSaving(false)

    if (error) {
      console.error("Error updating post:", error)
    } else {
      console.log("Post updated successfully:", data)
      router.push("/dashboard")
    }
  }

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-foreground">Loading...</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Edit Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

