import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalContext } from "@/context/appContext";
import { HelmetProvider } from 'react-helmet-async';
import Layout from './Layout';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalContext>
      <HelmetProvider>
        <Layout />
      </HelmetProvider>
    </GlobalContext>
  </React.StrictMode>
);
