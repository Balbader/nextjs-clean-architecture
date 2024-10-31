/**
 * Sign In Controller - Interface Adapter Layer (Clean Architecture)
 * 
 * This controller acts as an interface adapter in the clean architecture pattern,
 * sitting between the outer framework/UI layer and the inner application layer.
 * It handles the validation and transformation of incoming sign-in data before
 * passing it to the use case. The controller:
 * 1. Validates input using Zod schema
 * 2. Transforms external data into the format expected by the use case
 * 3. Handles input validation errors
 * 4. Provides instrumentation/monitoring of the sign-in process
 */

import { z } from 'zod';

import { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

const inputSchema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(31),
});

export type ISignInController = ReturnType<typeof signInController>;

export const signInController =
  (
    instrumentationService: IInstrumentationService,
    signInUseCase: ISignInUseCase
  ) =>
    async (input: Partial<z.infer<typeof inputSchema>>): Promise<Cookie> => {
      return await instrumentationService.startSpan(
        { name: 'signIn Controller' },
        async () => {
          const { data, error: inputParseError } = inputSchema.safeParse(input);

          if (inputParseError) {
            throw new InputParseError('Invalid data', { cause: inputParseError });
          }

          const { cookie } = await signInUseCase(data);
          return cookie;
        }
      );
    };
