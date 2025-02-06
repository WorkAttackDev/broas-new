export const toKnownError = (message: string) =>
  new Error(`[known] ${message}`);

export const parseKnownError = ({
  fallbackMessage,
  error,
}: {
  error: Error;
  fallbackMessage: string;
}) => {
  if (error.message.startsWith("[known]")) {
    return error.message.replace("[known] ", "");
  }
  return fallbackMessage;
};
