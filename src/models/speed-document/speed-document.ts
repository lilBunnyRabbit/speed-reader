import { Token } from "../token/token.type";
import { RawSpeedDocument, SpeedDocument } from "./speed-document.type";

// @msgpack/msgpack - encoding

export class SpeedDocumentBuilder {
  static build({ title, raw }: RawSpeedDocument): SpeedDocument {
    const regex = /([^\s]+)|(\s+)/g; // Match words or whitespace
    const tokens: Token[] = [];

    let match: RegExpExecArray | null;
    while ((match = regex.exec(raw)) !== null) {
      if (match[1]) {
        // Word
        const lastToken = tokens[tokens.length - 1];
        if (lastToken && !lastToken.v && lastToken.p) {
          // Override start with whitespace
          lastToken.v = match[1];
          lastToken.i = match.index;
        } else {
          tokens.push({ v: match[1], i: match.index });
        }
      } else if (match[2]) {
        // Whitespace
        const lastToken = tokens[tokens.length - 1];
        if (lastToken) {
          lastToken.s = match[2];
        } else {
          // Override the value if at least one word exists
          tokens.push({ v: "", p: match[2] });
        }
      }
    }

    return {
      __version: "0.0.0",
      title,
      tokens,
    };
  }

  static fromTokens(title: string, tokens: Token[]): SpeedDocument {
    return { __version: "0.0.0", title, tokens };
  }

  static rebuild(document: SpeedDocument): RawSpeedDocument {
    let output: string = "";
    for (const token of document.tokens) {
      if (token.p) {
        output += token.p;
      }

      output += token.v;

      if (token.s) {
        output += token.s;
      }
    }

    return {
      title: document.title,
      raw: output,
    };
  }
}
