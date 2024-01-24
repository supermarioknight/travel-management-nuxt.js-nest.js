import type { ApolloError } from '@apollo/client';

export function isApolloError(err: unknown): err is ApolloError {
  return err instanceof Error && 'graphQLErrors' in err;
}
