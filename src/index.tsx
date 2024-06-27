import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserAuthContextProvider } from './context/UserAuthContext';
import { PostsContextProvider } from './context/PostsContext';
import { BrowserRouter } from 'react-router-dom';
import { ReviewsContextProvider } from './context/ReviewsContext';
import { SearchResultContextProvider } from './context/SearchResultContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserAuthContextProvider>
        <PostsContextProvider>
          <ReviewsContextProvider>
            <SearchResultContextProvider>
              <App />
            </SearchResultContextProvider>
          </ReviewsContextProvider>
        </PostsContextProvider>
      </UserAuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
