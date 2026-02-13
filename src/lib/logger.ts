export function logEvent(event: string, payload: Record<string, unknown>) {
  const entry = {
    event,
    timestamp: new Date().toISOString(),
    ...payload
  };
  console.log(JSON.stringify(entry));
}
