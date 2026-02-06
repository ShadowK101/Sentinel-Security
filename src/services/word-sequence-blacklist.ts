/**
 * Checks if a generated passphrase contains blacklisted or easily guessed patterns.
 */
export async function isWordSequenceBlacklisted(passphrase: string): Promise<boolean> {
  const lowercase = passphrase.toLowerCase();
  
  // Basic list of common/obvious patterns
  const forbiddenPatterns = [
    'password',
    'qwerty',
    '123456',
    'admin',
    'login',
    'test',
    'sentinel'
  ];

  return forbiddenPatterns.some(pattern => lowercase.includes(pattern));
}