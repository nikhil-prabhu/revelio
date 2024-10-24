import {useEffect, useState} from "react";
import * as utils from "../utils";
import {
    Card,
    CardBody,
    Tab, Tabs, Image,
} from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer";
import {useTheme} from "next-themes";
import VulkanInfo from "../components/VulkanInfo.tsx";

function Gpu() {
    const [currentTheme, setCurrentTheme] = useState<utils.Variant>("light");
    const {theme} = useTheme();

    useEffect(() => {
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
                    <Tabs disabledKeys={["opengl"]} className="self-center m-4">
                        <Tab
                            key="vulkan"
                            title={
                                <Image src={utils.getGraphicsLibLogo("vulkan", currentTheme)} width={64} height={64}
                                       radius="none"/>
                            }
                            titleValue="Vulkan"
                        >
                            <VulkanInfo/>
                        </Tab>

                        <Tab
                            key="opengl"
                            title={
                                <Image src={utils.getGraphicsLibLogo("opengl", currentTheme)} width={64} height={64}
                                       radius="none"/>
                            }
                            titleValue="OpenGL"
                        >
                            <Card>
                                <CardBody>TODO</CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </ViewContainer>
    );
}

export default Gpu;
