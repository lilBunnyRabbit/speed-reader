import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SpeedDocumentBuilder } from "@/models/speed-document";
import { isUndefined } from "@lilbunnyrabbit/utils";
import React from "react";
import { cn } from "../utils";

interface TokenPreviewProps {
  value?: string;
  selection?: [from: number, to: number] | null;
}

export const TokenPreview: React.FC<TokenPreviewProps> = ({ value }) => {
  const tokens = React.useMemo(
    () => (!isUndefined(value) ? SpeedDocumentBuilder.build({ title: "Test", raw: value }).tokens : []),
    [value]
  );

  return (
    <div className="flex flex-wrap gap-1">
      {tokens.map((token, i) => {
        // const isSelected =
        //   !isUndefined(token.i) && !isNull(selection)
        //     ? (token.i >= selection[0] && token.i < selection[1]) ||
        //       (selection[0] >= token.i && selection[1] <= token.i + token.v.length)
        //     : false;

        return (
          <React.Fragment key={`token-${i}`}>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "bg-primary rounded-md px-2 py-1 data-[state=open]:bg-info text-sm text-background hover:bg-info/60"
                    // isSelected && "bg-success"
                  )}
                >
                  {token.v}
                </button>
              </PopoverTrigger>
              <PopoverContent className="rounded-md w-fit">
                <pre className="text-sm">
                  "{token.p && <span className="text-error bg-error/10">{token.p.replace(/\s/g, ".")}</span>}
                  {<span className="text-primary">{token.v}</span>}
                  {token.s && <span className="text-error bg-error/10">{token.s.replace(/\s/g, ".")}</span>}"
                </pre>
              </PopoverContent>
            </Popover>

            {token.s?.includes("\n") && <div className="basis-full h-4" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
