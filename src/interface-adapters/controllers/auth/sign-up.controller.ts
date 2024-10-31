/**
 * Sign Up Controller - Interface Adapter Layer (Clean Architecture)
 * 
 * This controller acts as an interface adapter in the clean architecture pattern,
 * sitting between the external world (like HTTP requests) and the application's use cases.
 * It handles input validation and data transformation, ensuring that the data passed to
 * the use case layer is properly formatted and validated.
 * 
 * The controller uses Zod for input validation and transforms external input into the
 * format expected by the use case. It also integrates with instrumentation for monitoring
 * and debugging purposes.
 */

import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';

const inputSchema = z
  .object({
    username: z.string().min(3).max(31),
    password: z.string().min(6).max(31),
    confirm_password: z.string().min(6).max(31),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['password'],
      });
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

export type ISignUpController = ReturnType<typeof signUpController>;

export const signUpController =
  (
    instrumentationService: IInstrumentationService,
    signUpUseCase: ISignUpUseCase
  ) =>
    async (
      input: Partial<z.infer<typeof inputSchema>>
    ): Promise<ReturnType<typeof signUpUseCase>> => {
      return await instrumentationService.startSpan(
        { name: 'signUp Controller' },
        async () => {
          const { data, error: inputParseError } = inputSchema.safeParse(input);

          if (inputParseError) {
            throw new InputParseError('Invalid data', { cause: inputParseError });
          }

          return await signUpUseCase(data);
        }
      );
    };
