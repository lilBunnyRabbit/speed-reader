import { useGlobalReader } from "@/contexts/global-reader";
import { Reader } from "@/lib/reader";
import React from "react";
import { Link } from "react-router";

export default function ReaderRoute(): React.ReactNode {
  const global = useGlobalReader();

  if (!global.document) {
    return (
      <div>
        No document...
        <Link to="/editor">Editor</Link>
      </div>
    );
  }

  return <Reader document={global.document} />;
}
