"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import AuthLayout from "@/components/AuthLayout"
import Link from "next/link"

export default function Dashboard() {
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth")
          return
        }
        setUser(user)

        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false })

        if (postsError) throw postsError

        setPosts(postsData || [])
      } catch (err) {
        console.error("Error:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndPosts()
  }, [router])

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-foreground">Loading...</p>
        </div>
      </AuthLayout>
    )
  }

  if (error) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-foreground/80">Welcome, {user.email}</p>
        <div className="mt-4">
          <Link
            href="/new-post"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Create New Post
          </Link>
        </div>
        <div className="mt-6 bg-card shadow-neo rounded-lg overflow-hidden">
          {posts.length === 0 ? (
            <p className="p-4 text-foreground/80">No posts yet. Create your first post!</p>
          ) : (
            <ul className="divide-y divide-border">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link href={`/edit-post/${post.id}`} className="block hover:bg-secondary/50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary truncate">{post.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary text-foreground">
                            {post.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-foreground/80">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

