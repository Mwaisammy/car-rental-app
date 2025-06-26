import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistedStore, store } from "./app/store.ts";
import AuthLoading from "./components/Loading/AuthLoading.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<AuthLoading />} persistor={persistedStore}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
