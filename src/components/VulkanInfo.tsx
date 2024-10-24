import {
    Accordion, AccordionItem,
    Card,
    CardBody, Chip,
    Divider,
    Image,
    Select, Selection,
    SelectItem,
    Spacer, Spinner,
    Tab,
    Table, TableBody, TableCell, TableColumn,
    TableHeader, TableRow,
    Tabs
} from "@nextui-org/react";
import * as utils from "../utils.ts";
import {VulkanInfo as VkInfo, VulkanDeviceLayer, commands} from "../bindings";
import {useEffect, useState} from "react";
import {useTheme} from "next-themes";

interface DeviceProps {
    info: VkInfo;
    currentDevice: number;
}

interface LayerProps {
    layers: VulkanDeviceLayer[];
}

function Device(props: DeviceProps) {
    const {info, currentDevice} = props;

    return (
        <Card shadow="none">
            <CardBody>
                {info.devices.map(device => (
                    device.index === currentDevice ?
                        (<Table isStriped shadow="none" fullWidth>
                            <TableHeader>
                                <TableColumn>Property</TableColumn>
                                <TableColumn>Value</TableColumn>
                            </TableHeader>

                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Device
                                        Name</TableCell>
                                    <TableCell
                                        className="font-mono">{device.deviceName}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Vendor
                                        ID</TableCell>
                                    <TableCell
                                        className="font-mono">{device.vendorId}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Device
                                        ID</TableCell>
                                    <TableCell
                                        className="font-mono">{device.deviceId}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Device
                                        Type</TableCell>
                                    <TableCell
                                        className="font-mono">{device.deviceType}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">API
                                        Version</TableCell>
                                    <TableCell
                                        className="font-mono">{device.apiVersion}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Driver
                                        Version</TableCell>
                                    <TableCell
                                        className="font-mono">{device.driverVersion}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Pipeline Cache
                                        UUID</TableCell>
                                    <TableCell
                                        className="font-mono">{device.pipelineCacheUuid}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>)
                        : null
                ))}
            </CardBody>
        </Card>
    );
}

function Layers(props: LayerProps) {
    const {layers} = props;

    return (
        <Card shadow="none">
            <Accordion fullWidth defaultSelectedKeys="all">
                {layers.map(layer => (
                    <AccordionItem title={layer.layerName} className="font-bold text-sm">
                        <Table isStriped shadow="none" fullWidth>
                            <TableHeader>
                                <TableColumn>Property</TableColumn>
                                <TableColumn>Value</TableColumn>
                            </TableHeader>

                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Vulkan Version</TableCell>
                                    <TableCell className="font-mono">{layer.vulkanVersion}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Layer Version</TableCell>
                                    <TableCell className="font-mono">{layer.layerVersion}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Description</TableCell>
                                    <TableCell className="font-mono">{layer.description}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </AccordionItem>
                ))}
            </Accordion>
        </Card>
    );
}

function VulkanInfo() {
    const [vulkanInfo, setVulkanInfo] = useState<VkInfo>();
    const [currentDevice, setCurrentDevice] = useState<Selection>(new Set(["0"]));
    const [currentTheme, setCurrentTheme] = useState<utils.Variant>("light");
    const {theme} = useTheme();

    useEffect(() => {
        if (theme!.toLowerCase().includes("dark")) {
            setCurrentTheme("dark");
        } else {
            setCurrentTheme("light");
        }

        commands.getVulkanInfo().then(info => {
            setVulkanInfo(info);
            console.debug(info);
        }).catch(error => {
            console.error(error);
        });
    }, [theme]);

    if (!vulkanInfo) {
        return <Spinner label="Loading..." color="primary"/>
    }

    function getCurrentDeviceName(): string {
        for (const device of vulkanInfo!.devices) {
            if (Number([...currentDevice][0]) === device.index) {
                return device.deviceName;
            }
        }

        return "unknown"
    }

    function getCurrentDeviceLayers(): VulkanDeviceLayer[] {
        for (const device of vulkanInfo!.devices) {
            if (Number([...currentDevice][0]) === device.index) {
                return device.layers;
            }
        }

        return [];
    }

    return (
        <>
            <div className="flex items-center justify-center space-x-8">
                <Select
                    autoFocus
                    items={vulkanInfo.devices}
                    label={`Select Device (Total: ${vulkanInfo.totalDevices})`}
                    selectionMode="single"
                    disallowEmptySelection
                    onSelectionChange={setCurrentDevice}
                    selectedKeys={currentDevice}
                    variant="faded"
                    startContent={
                        <Image src={utils.getVendorIcon(getCurrentDeviceName(), currentTheme)}
                               width={16}
                               height={16}
                               radius="none"/>
                    }
                    className="max-w-md"
                >
                    {(device) => <SelectItem
                        key={device.index}
                        startContent={(
                            <Image src={utils.getVendorIcon(device.deviceName, currentTheme)} width={16}
                                   height={16}
                                   radius="none"/>
                        )}
                    >{`${device.index}: ${device.deviceName}`}</SelectItem>}
                </Select>

                <Image src={utils.getGpuIcon(getCurrentDeviceName(), currentTheme)} removeWrapper
                       width={100}
                       height={100}
                       radius="none"
                />
            </div>

            <Spacer y={4}/>
            <Divider/>

            <Tabs
                placement="end"
                color="primary"
                disabledKeys={["limits", "extensions"]}
                variant="underlined"
                disableAnimation
                className="mx-auto my-6"
            >

                <Tab key="device" title="Device" className="w-full">
                    <Device currentDevice={Number([...currentDevice][0])} info={vulkanInfo}/>
                </Tab>

                <Tab key="limits" title="Limits"/>
                <Tab key="extensions" title="Extensions"/>

                <Tab
                    key="layers"
                    title={(
                        <div className="flex items-center space-x-2">
                            <span>Layers</span>
                            <Chip size="sm" variant="faded" color="primary">{getCurrentDeviceLayers().length}</Chip>
                        </div>
                    )}
                    titleValue="Layers"
                    className="w-full"
                >
                    <Layers layers={getCurrentDeviceLayers()}/>
                </Tab>
            </Tabs>
        </>
    );
}

export default VulkanInfo;
