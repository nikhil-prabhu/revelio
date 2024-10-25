import { useEffect, useState } from "react";
import { commands, OsType } from "../bindings";
import * as utils from "../utils";
import { Card, CardBody, Image, Spacer, Tab, Tabs } from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer";
import { useTheme } from "next-themes";
import VulkanInfo from "../components/VulkanInfo.tsx";
import MetalInfo from "../components/MetalInfo.tsx";

function Gpu() {
  const [osType, setOsType] = useState<OsType>();
  const [currentTheme, setCurrentTheme] = useState<utils.Variant>("light");
  const { theme } = useTheme();

  useEffect(() => {
    commands
      .getOsType()
      .then((osType) => {
        console.debug(osType);
        setOsType(osType);
      })
      .catch((error) => {
        console.error(error);
      });

    if (theme!.toLowerCase().includes("dark")) {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }
  }, [theme]);

  return (
    <ViewContainer title="GPU Information">
      <Card shadow="sm">
        <CardBody>
          {osType != "MacSilicon" ? (
            <Tabs disabledKeys={["opengl"]} className="self-center m-4">
              <Tab
                key="vulkan"
                title={
                  <Image
                    src={utils.getGraphicsLibLogo("vulkan", currentTheme)}
                    width={64}
                    height={64}
                    radius="none"
                  />
                }
                titleValue="Vulkan"
              >
                <VulkanInfo />
              </Tab>

              <Tab
                key="opengl"
                title={
                  <Image
                    src={utils.getGraphicsLibLogo("opengl", currentTheme)}
                    width={64}
                    height={64}
                    radius="none"
                  />
                }
                titleValue="OpenGL"
              >
                <Card>
                  <CardBody>TODO</CardBody>
                </Card>
              </Tab>

              {osType == "MacIntel" ? (
                <Tab
                  key="metal"
                  title={
                    <div className="flex items-center justify-center space-x-2">
                      <Image
                        src={utils.getGraphicsLibLogo("metal", currentTheme)}
                        width={32}
                        height={32}
                        radius="none"
                      />

                      <span className="font-bold">Metal</span>
                    </div>
                  }
                >
                  <MetalInfo />
                </Tab>
              ) : null}
            </Tabs>
          ) : (
            <div className="self-center w-full">
              <div className="mt-4">
                <div className="flex items-center justify-center w-full">
                  <Image
                    src={utils.getGraphicsLibLogo("metal")}
                    width={64}
                    height={64}
                    radius="none"
                  />
                </div>

                <Spacer />

                <h1 className="font-bold text-lg text-center">Metal</h1>
              </div>

              <Spacer />

              <MetalInfo />
            </div>
          )}
        </CardBody>
      </Card>
    </ViewContainer>
  );
}

export default Gpu;
