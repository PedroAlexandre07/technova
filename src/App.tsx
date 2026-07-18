import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ClientAreaPage from './pages/ClientAreaPage';
import AdminPanelPage from './pages/AdminPanelPage';
import BlogPage from './pages/BlogPage';

function AppContent() {
  const { currentNav } = useStore();

  const renderPage = () => {
    switch (currentNav.page) {
      case 'home':
        return <HomePage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'category':
      case 'search-results':
        return <CategoryPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'client-area':
        return <ClientAreaPage />;
      case 'admin':
        return <AdminPanelPage />;
      case 'blog':
      case 'blog-post':
        return <BlogPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans flex flex-col justify-between">
      <Header />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
