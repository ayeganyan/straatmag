import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, Navigate, redirect, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AppTest from './pages/Vendors';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    action: () => {
      return redirect('/vendors');
    },
    errorElement: <ErrorPage />,

    children: [
      {
        path: '/',
        element: <Navigate to='/vendors' replace />,
      },
      {
        path: 'vendors/*',
        element: <AppTest />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
