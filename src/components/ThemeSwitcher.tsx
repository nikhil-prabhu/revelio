import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { getCurrentWindow, Theme } from "@tauri-apps/api/window";

function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  async function setWindowTheme(theme: string) {
    getCurrentWindow()
      .setTheme(theme as Theme)
      .then(() => {
        console.debug(`Successfully set window theme to ${theme}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleThemeSwitch(isSelected: boolean) {
    if (isSelected) {
      setTheme("dark");
      setWindowTheme("dark").then();
    } else {
      setTheme("light");
      setWindowTheme("light").then();
    }
  }

  return (
    <div className="fixed bottom-8">
      <Switch
        size="lg"
        color="secondary"
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <FaMoon className={className} />
          ) : (
            <FaSun className={className} />
          )
        }
        onValueChange={handleThemeSwitch}
      />
    </div>
  );
}

export default ThemeSwitcher;
