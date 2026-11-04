// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'expo-env.d.ts'],
  },
  {
    // Barrel imports bundle every icon or every font weight. See src/components/icons.ts.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/icons.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'lucide-react-native', message: "Import icons from '@/components/icons'." },
            { name: '@expo-google-fonts/inter', message: "Import a single weight, e.g. '@expo-google-fonts/inter/400Regular'." },
            { name: '@expo-google-fonts/dm-serif-display', message: 'Import a single weight subpath.' },
          ],
        },
      ],
    },
  },
]);
