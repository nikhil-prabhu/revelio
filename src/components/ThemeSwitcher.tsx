import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function handleThemeSwitch(isSelected: boolean) {
    if (isSelected) {
      setTheme("dark");
    } else {
      setTheme("light");
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
