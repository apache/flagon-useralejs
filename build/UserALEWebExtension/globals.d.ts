/// <reference types="firefox-webext-browser" />
import type { Logging } from "@/types";
export declare var browser: typeof globalThis.browser;
export declare function rerouteLog(log: Logging.Log): boolean;
