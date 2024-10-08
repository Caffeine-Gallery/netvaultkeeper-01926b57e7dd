import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Config { 'name' : string, 'versions' : Array<ConfigVersion> }
export interface ConfigVersion { 'content' : string, 'timestamp' : Time }
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : Config } |
  { 'err' : string };
export type Result_2 = { 'ok' : null } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'addConfig' : ActorMethod<[string, string], Result_2>,
  'getAllConfigNames' : ActorMethod<[], Array<string>>,
  'getConfig' : ActorMethod<[string], Result_1>,
  'getDiff' : ActorMethod<[string, bigint, bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
