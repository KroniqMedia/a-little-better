import * as Application from 'expo-application';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Store-facing version, with build number when it differs. When the app runs
 * inside another binary (Expo Go, a browser), the native version belongs to
 * that host, so fall back to app.json.
 */
export function appVersion(): string {
  const config = Constants.expoConfig;
  const configVersion = config?.version ?? '1.0.0';
  const ownId = Platform.OS === 'ios' ? config?.ios?.bundleIdentifier : config?.android?.package;
  const isOwnBinary =
    Constants.executionEnvironment !== ExecutionEnvironment.StoreClient &&
    Boolean(ownId) &&
    Application.applicationId === ownId;
  if (!isOwnBinary) return configVersion;
  const version = Application.nativeApplicationVersion ?? configVersion;
  const build = Application.nativeBuildVersion;
  return build && build !== version ? `${version} (${build})` : version;
}
