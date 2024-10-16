import "react-native-get-random-values"
import "fast-text-encoding"

import { Buffer } from "@credo-ts/core"

// @ts-ignore
global.Buffer = Buffer

export * from "./agent"
export * from "./requestPermissions"
