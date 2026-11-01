import { SettingsTabs } from "./tabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold sm:text-3xl">Settings</h1>
      <SettingsTabs />
      <div className="mt-6">{children}</div>
    </>
  );
}
