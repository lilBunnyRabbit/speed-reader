import { SpeedDocument } from "@/models/speed-document";
import { isNull, isString, isUndefined } from "@lilbunnyrabbit/utils";

export class WordRenderer<TElement extends HTMLElement> {
  readonly channel = new MessageChannel();

  private _index = 0;

  public get index() {
    return this._index;
  }

  public set index(index: number) {
    this._index = index;

    this.channel.port1.postMessage(`port1 index - ${this._index}`);
  }

  public setIndex(index: number) {
    this.index = index;

    this.render();
  }

  public document: SpeedDocument | null = null;

  public setDocument(document: SpeedDocument | null) {
    this.document = document;
  }

  private _wpm: number | undefined;

  public get wpm() {
    return this._wpm;
  }

  public setWpm(wpm: typeof this._wpm) {
    this._wpm = wpm;

    if (this.hasInterval(this.interval)) {
      this.start();
    }
  }

  private ghostWords: number | undefined;

  public setGhostWords(ghostWords: number | undefined) {
    this.ghostWords = ghostWords;

    if (!this.hasInterval(this.interval)) {
      this.render();
    }
  }

  private element: TElement | null = null;
  private elements: {
    ghost1: HTMLElement;
    word: HTMLElement;
    ghost2: HTMLElement;
  } | null = null;

  public setElement(element: TElement | null) {
    this.element = element;
    if (this.element) {
      this.elements = {
        ghost1: this.element.querySelector("#ghost-1") as HTMLElement,
        word: this.element.querySelector("#word") as HTMLElement,
        ghost2: this.element.querySelector("#ghost-2") as HTMLElement,
      };
    } else {
      this.elements = null;
    }

    console.log(this);

    if (this.element) {
      this.render();
    }
  }

  private interval: NodeJS.Timeout | null = null;

  constructor(element: TElement | null) {
    console.log(this);

    this.setElement(element);
  }

  private hasInterval(interval: NodeJS.Timeout | null): interval is NodeJS.Timeout {
    return !isUndefined(interval) && !isNull(interval);
  }

  public isPlaying(): boolean {
    return this.hasInterval(this.interval);
  }

  public start() {
    console.log("start", this);

    this.stop();

    if (!this.document) return;

    if (isUndefined(this.wpm) || this.index >= this.document.tokens.length - 1) {
      return;
    }

    this.render();
    this.interval = setInterval(() => {
      if (!this.document || this.index >= this.document.tokens.length - 1) {
        return this.stop();
      }

      this.index++;
      this.render();
    }, 60000 / this.wpm);
  }

  public stop() {
    console.log("stop", this);

    if (this.hasInterval(this.interval)) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  public toggle() {
    if (this.hasInterval(this.interval)) {
      return this.stop();
    }

    return this.start();
  }

  private render() {
    // console.log("render");

    if (!this.document || !this.elements) return;

    const lastN =
      this.ghostWords &&
      Array(this.ghostWords)
        .fill(0)
        .map((_, i) => this.document!.tokens[this.index - (this.ghostWords! - i)]?.v)
        .filter(isString)
        .join(" ");

    const nextN =
      this.ghostWords &&
      Array(this.ghostWords)
        .fill(0)
        .map((_, i) => this.document!.tokens[this.index + i + 1]?.v)
        .filter(isString)
        .join(" ");

    this.elements.ghost1.innerText = lastN || "";

    this.elements.word.innerText = this.document.tokens[this.index]?.v;

    this.elements.ghost2.innerText = nextN || "";
  }
}
