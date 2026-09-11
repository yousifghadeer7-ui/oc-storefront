import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { ToastProvider } from "@/lib/toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" manifest="/manifest.json"> {/* ✅ تمت الإضافة هنا */}
      <head>
        {/* هذه الأسطر ستجعل المتصفح يقترح تثبيت التطبيق */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      
      <body className="bg-paper text-ink antialiased flex flex-col min-h-screen">
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <CartDrawer />
              <main className="flex-grow">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
