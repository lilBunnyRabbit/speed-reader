import { Token } from "@/models/token";
import React from "react";
import { cn } from "../utils";

interface TokenComponentProps {
  token?: Token;
  className?: string;
}

export const TokenComponent: React.FC<TokenComponentProps> = ({ token, className }) => {
  return <span className={cn("font-mono", className)}>{token?.v}</span>;
};

interface GhostWordsComponentProps {
  tokens: Token[];
  index: number;
  count: number;
  type: "prefix" | "suffix";
  className?: string;
}

export const GhostWordsComponent: React.FC<GhostWordsComponentProps> = ({ tokens, index, count, type, className }) => {
  const visibleTokens = React.useMemo(() => {
    const start = type === "prefix" ? Math.max(0, index - count) : index + 1;
    const end = type === "prefix" ? index : Math.min(tokens.length, index + count + 1);
    return tokens.slice(start, end);
  }, [tokens, index, count, type]);

  return (
    <div className={cn("space-x-1.5", className)}>
      {visibleTokens.map((token, i) => (
        <TokenComponent key={i} token={token} />
      ))}
    </div>
  );
};
