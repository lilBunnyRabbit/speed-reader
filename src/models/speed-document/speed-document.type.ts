import { Token } from "../token";

export interface RawSpeedDocument {
  title: string;
  raw: string;
}


export interface SpeedDocument {
  __version: string;
  title: string;
  tokens: Token[];
}
