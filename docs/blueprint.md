# **App Name**: Sentinel

## Core Features:

- Password Generation: Generate passwords with customizable length, complexity (uppercase/lowercase, numbers, symbols), and exclusion of ambiguous characters.
- Entropy Meter: Display a visual indicator of password strength (entropy) using animated meter and associated messages such as 'very weak', 'weak', 'strong', 'very strong'
- Passphrase Mode: Generate multiple random words from a dictionary, as a more secure but memorable option for passwords; utilizes a tool to avoid blacklisted and easily-guessed word sequences.
- Clipboard Auto-Clear: Automatically wipe the copied password from the clipboard after a set duration to prevent unintended exposure.
- Local Encrypted Vault with Google Sign-In: Securely store generated passwords locally in an encrypted vault using the user's Google account for authentication and key derivation to provide passwordless vault encryption.
- One-Click Copy & QR Code Export: Enable easy password sharing across devices with one-click copy to clipboard functionality and QR code export.

## Style Guidelines:

- Primary color: Darker shade of blue (#306998) to convey security and trust, reminiscent of classic encryption tools.
- Background color: Dark grey (#333333) to provide a professional and secure feel.
- Accent color: Soft, slightly lighter blue (#6093BA) for interactive elements, offering visual contrast and guiding the user.
- Body and headline font: 'Inter', a grotesque-style sans-serif, to promote a modern, machined, neutral and objective feel.
- Use clean, minimalist icons to represent security features like locking, encryption, and clipboard access.
- Implement smooth transitions and loading animations to enhance the user experience, specifically animating the password strength indicator with a subtle color change and movement based on the entropy score.
- Use a clear and intuitive layout to allow for easy password viewing