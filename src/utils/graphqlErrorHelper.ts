import { graphqlErrorCodes } from '../types/enums/graphqlEnums';

export const isErrorCode = (error: any, errorCode: graphqlErrorCodes): boolean => {
  const hasErrors = error?.graphQLErrors && error.graphQLErrors.length > 0;

  return hasErrors ? error.graphQLErrors[0].extensions.code === errorCode : false;
};
