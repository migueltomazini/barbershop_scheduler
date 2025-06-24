// app/(pages)/login/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/components/sections/login/loginForm";

// 1. Importa a função 'cookies' diretamente
import { cookies } from "next/headers";

export default function LoginPage() {
  // 2. Lê o cookie diretamente no servidor
  const sessionCookie = cookies().get('session')?.value;

  // Se o cookie já existe, significa que o usuário está logado.
  // Então, redirecionamos para a página inicial para que ele não veja a tela de login novamente.
  if (sessionCookie) {
    redirect("/");
  }

  // O return contém apenas o conteúdo da página, sem Navbar ou Footer
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-8 mb-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-barber-brown">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Log in to your account to book appointments and purchase products.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-barber-cream">
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/signup">
                <span className="font-medium text-barber-brown hover:underline cursor-pointer">
                  Create one now
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
