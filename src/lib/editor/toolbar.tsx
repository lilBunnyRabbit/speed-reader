import { PopNotification } from "@/components/pop-notification";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlignCenterVerticalIcon,
  AlignStartVerticalIcon,
  FilterXIcon,
  Redo2Icon,
  SaveIcon,
  TestTubeIcon,
  TimerOffIcon,
  TrashIcon,
  Undo2Icon,
  WrapTextIcon,
} from "lucide-react";
import React from "react";
import { SpeedDocumentBuilder } from "@/models/speed-document";
import { useEditor } from "@/contexts/editor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const EditorToolbar: React.FC = () => {
  const { rawDocument, settings, history, actions, editType, setEditType } = useEditor();

  return (
    <div className="flex items-center justify-between gap-1 bg-foreground px-2 h-fit rounded-md drop-shadow-md">
      <div className="flex items-center gap-1 py-1">
        <PopNotification value={history.undoCount} hidden={!history.undoCount}>
          <Button size="editor" variant="editor" disabled={!history.undoCount} onClick={() => history.undo()}>
            <Undo2Icon />
          </Button>
        </PopNotification>

        <PopNotification value={history.redoCount} hidden={!history.redoCount}>
          <Button size="editor" variant="editor" disabled={!history.redoCount} onClick={() => history.redo()}>
            <Redo2Icon />
          </Button>
        </PopNotification>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="editor" variant="editor">
              <FilterXIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" alignOffset={-8}>
            <DropdownMenuItem onClick={() => actions.removeTimestamps()}>
              <TimerOffIcon /> Timestamps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.removeNewLines()}>
              <WrapTextIcon /> Newlines
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.clearAll()}>
              <TrashIcon /> All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="editor"
          variant="editor"
          onClick={() => {
            const document = SpeedDocumentBuilder.build(rawDocument);
            console.log("document", document);

            const rebuild = SpeedDocumentBuilder.rebuild(document).raw;
            console.log("rebuild", rebuild === rawDocument.raw, rebuild);
          }}
        >
          <TestTubeIcon />
        </Button>

        <Button size="editor" variant="editor" onClick={() => settings.set("fullWidth", !settings.values.fullWidth)}>
          {settings.values.fullWidth ? <AlignCenterVerticalIcon /> : <AlignStartVerticalIcon />}
        </Button>

        <Button size="editor" variant="editor">
          <SaveIcon />
        </Button>

        <Tabs value={editType} onValueChange={(v) => setEditType(v as "raw" | "tokens")}>
          <TabsList className="p-0 h-7 rounded-md gap-1 bg-background">
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
