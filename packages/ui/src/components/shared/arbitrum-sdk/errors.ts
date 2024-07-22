/*
 * Copyright 2021, Offchain Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-env node */
"use strict";

/**
 * Errors originating in Arbitrum SDK
 */
export class ArbSdkError extends Error {
  constructor(
    message: string,
    public readonly inner?: Error
  ) {
    super(message);

    if (inner) {
      this.stack += "\nCaused By: " + inner.stack;
    }
  }
}

/**
 * Thrown when a signer does not have a connected provider
 */
export class MissingProviderArbSdkError extends ArbSdkError {
  constructor(signerName: string) {
    super(
      `${signerName} does not have a connected provider and one is required.`
    );
  }
}
