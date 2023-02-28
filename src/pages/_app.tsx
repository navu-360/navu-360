import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { makeStore } from "redux/store";
import { Analytics } from "@vercel/analytics/react";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorBoundary from "components/extra/errorBoundary";

import "styles/globals.css";

import { Nunito_Sans } from "@next/font/google";

const font = Nunito_Sans({
  subsets: ["cyrillic"],
  weight: ["400", "600", "700", "800"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <Provider store={makeStore}>
          <ToastContainer
            position="top-right"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            transition={Slide}
            className={"toast-styles"}
          />
          <style jsx global>{`
            html {
              font-family: ${font.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
          <Analytics />
        </Provider>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default MyApp;
