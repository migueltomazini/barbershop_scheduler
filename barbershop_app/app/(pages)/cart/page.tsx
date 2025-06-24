// app/(pages)/cart/page.tsx
import React from 'react';
import CartClientPage from '@/app/components/sections/cart/CartClientPage';

// A lógica para buscar a sessão do usuário continua aqui, pois é necessária para o conteúdo da página.
async function getUserSession() {
  // Em um app real, use NextAuth.js ou outra solução de auth.
  return {
    isAuthenticated: true, 
    user: {
      _id: "66763a81282136e3c8332f14" // EXEMPLO - USE UM _ID VÁLIDO
    }
  };
}

/**
 * @page CartPage (Server Component)
 * @description A página agora busca a sessão e retorna apenas o componente principal do carrinho.
 * A Navbar e o Footer são renderizados pelo layout.tsx.
 */
export default async function CartPage() {
  const session = await getUserSession();

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CartClientPage 
        isAuthenticated={session.isAuthenticated}
        userId={session.user?._id}
      />
    </main>
  );
}
