import React from "react";
import { Link } from "react-router";

export default function LandingPageRoute(): React.ReactNode {
  return (
    <div className="p-4">
      <h1>[WIP] Speed Reader</h1>
      <ul className="list-disc list-inside mt-6">
        <li>
          <Link to="editor">Editor</Link>
        </li>
        <li>
          <Link to="reader">Reader</Link>
        </li>
      </ul>
    </div>
  );
}
