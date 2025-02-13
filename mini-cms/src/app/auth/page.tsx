"use client"

import { useEffect, useState } from "react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/dashboard")
      }
    })

    checkUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-neo p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Welcome to Mini CMS</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(var(--primary))",
                  brandAccent: "hsl(var(--primary))",
                  inputBackground: "hsl(var(--secondary))",
                  inputText: "hsl(var(--foreground))",
                  inputBorder: "hsl(var(--border))",
                  inputBorderFocus: "hsl(var(--ring))",
                  inputBorderHover: "hsl(var(--ring))",
                },
              },
            },
            style: {
              button: {
                borderRadius: "var(--radius)",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
              },
              input: {
                borderRadius: "var(--radius)",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
              },
              anchor: {
                color: "hsl(var(--primary))",
                textDecoration: "none",
              },
            },
          }}
          theme="default"
          providers={["google"]}
          view="magic_link"
          showLinks={false}
          localization={{
            variables: {
              sign_up: {
                email_label: "Email address",
                password_label: "Create a Password",
                button_label: "Sign up",
                loading_button_label: "Signing up ...",
                social_provider_text: "Sign in with {{provider}}",
                link_text: "Don't have an account? Sign up",
              },
              sign_in: {
                email_label: "Email address",
                password_label: "Your Password",
                button_label: "Sign in",
                loading_button_label: "Signing in ...",
                social_provider_text: "Sign in with {{provider}}",
                link_text: "Already have an account? Sign in",
              },
            },
          }}
        />
      </div>
    </div>
  )
}

