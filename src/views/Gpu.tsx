import {useEffect, useState} from "react";
import {VulkanInfo, commands} from "../bindings";
import * as utils from "../utils";
import {
    Card,
    CardBody,
    Select, SelectItem, Selection, Spacer,
    Spinner,
    Tab,
    Table,
    TableBody, TableCell,
    TableColumn,
    TableHeader, TableRow,
    Tabs, Image, Divider
} from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer";

function Gpu() {
    const [vulkanInfo, setVulkanInfo] = useState<VulkanInfo>();
    const [currentDevice, setCurrentDevice] = useState<Selection>(new Set(["0"]));

    useEffect(() => {
        commands.getVulkanInfo().then(info => {
            setVulkanInfo(info);
            console.info("Vulkan information retrieved successfully.");
        }).catch(error => {
            console.error(error);
        });
    }, []);

    // TODO: improve loading indicator.
    if (!vulkanInfo) {
        return <Spinner label="Loading..." color="primary"/>
    }

    // TODO: add brand and vendor icons.
    // TODO: add advanced vulkan info (layers, limits, etc.).
    // TODO: move Vulkan, OpenGL, etc. to separate components.
    return (
        <ViewContainer title="GPU Information">
            <Card shadow="sm">
                <CardBody>
                    <Tabs disabledKeys={["opengl"]} className="self-center m-4">
                        <Tab key="vulkan" title="Vulkan">
                            <div className="flex items-center justify-center space-x-6">
                                <Select
                                    autoFocus
                                    items={vulkanInfo.devices}
                                    label="Select Device"
                                    selectionMode="single"
                                    disallowEmptySelection
                                    onSelectionChange={setCurrentDevice}
                                    selectedKeys={currentDevice}
                                    variant="faded"
                                    className="max-w-md"
                                >
                                    {(device) => <SelectItem
                                        key={device.index}
                                        startContent={(
                                            <Image src={utils.getBrandIcon("unknown")} width={16} height={16}/>
                                        )}
                                    >{`${device.index}: ${device.deviceName}`}</SelectItem>}
                                </Select>

                                <Image src={utils.getVendorIcon(currentDevice.toString())} removeWrapper width={64}
                                       height={64}/>
                            </div>

                            <Spacer y={4}/>
                            <Divider/>

                            <Tabs
                                placement="end"
                                color="primary"
                                disabledKeys={["limits", "extensions", "layers"]}
                                variant="underlined"
                                className="m-4">
                                <Tab key="device" title="Device" className="w-full">
                                    <Card shadow="none">
                                        <CardBody>
                                            {vulkanInfo.devices.map(device => (
                                                device.index === Number([...currentDevice][0]) ?
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
                                </Tab>

                                <Tab key="limits" title="Limits"/>
                                <Tab key="extensions" title="Extensions"/>
                                <Tab key="layers" title="Layers"/>
                            </Tabs>
                        </Tab>

                        <Tab key="opengl" title="OpenGL">
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
