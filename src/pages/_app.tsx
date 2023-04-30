import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { makeStore } from "redux/store";
import { Analytics } from "@vercel/analytics/react";

import { useEffect } from "react";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorBoundary from "components/error/errorBoundary";

import "styles/globals.css";
import "styles/nprogress.css";

import NProgress from "nprogress";

import { Nunito_Sans } from "next/font/google";
import { useRouter } from "next/router";

const font = Nunito_Sans({
  subsets: ["cyrillic"],
  weight: ["400", "600", "700", "800"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SessionProvider session={session}>
      <ErrorBoundary>
        <Provider store={makeStore}>
          <ToastContainer
            position="top-center"
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
      </ErrorBoundary>
    </SessionProvider>
  );
};

export default MyApp;
