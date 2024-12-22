import { Route, Routes } from "react-router";

import { GlobalReaderProviderOutlet } from "@/contexts/global-reader";
import EditorRoute from "./editor.route";
import LandingPageRoute from "./landing-page.route";
import ReaderRoute from "./reader.route";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<LandingPageRoute />} />
      <Route element={<GlobalReaderProviderOutlet />}>
        <Route path="editor" element={<EditorRoute />} />
        <Route path="reader" element={<ReaderRoute />} />
      </Route>
    </Routes>
  );
}
