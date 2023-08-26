export default function isTestEnv() {
  return process.env.NODE_ENV === 'test';
}
