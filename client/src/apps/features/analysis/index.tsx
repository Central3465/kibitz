import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";

import * as styles from "./index.module.css";

const Analysis = lazy(() => import("./pages/Analysis"));

import "@/i18n";
import "@/index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

function App() {
    return <BrowserRouter>
        <PageWrapper
            className={styles.wrapper}
            footerClassName={styles.footer}
        >
            <Suspense fallback={<LoadingPlaceholder/>}>
                <Routes>
                    <Route path="/analysis" element={<Analysis/>} />
                </Routes>
            </Suspense>
        </PageWrapper>
    </BrowserRouter>;
}

root.render(<App/>);
