import {useEffect, useState} from "react";
import {VulkanInfo, commands} from "../bindings";
import {
    Accordion, AccordionItem,
    Card,
    CardBody,
    CardHeader, Spacer,
    Spinner,
    Tab,
    Table,
    TableBody, TableCell,
    TableColumn,
    TableHeader, TableRow,
    Tabs
} from "@nextui-org/react";

function GPU() {
    let [vulkanInfo, setVulkanInfo] = useState<VulkanInfo>();

    useEffect(() => {
        commands.getVulkanInfo().then(info => {
            setVulkanInfo(info);
            console.info("Vulkan information retrieved successfully.");
        }).catch(error => {
            console.error(error);
        });
    }, []);

    if (!vulkanInfo) {
        return <Spinner label="Loading..." color="primary"/>
    }

    return (
        <div className="w-full flex-row text-center items-center mb-4 ml-2 mr-2">
            <h1 className="font-bold m-4">GPU Information</h1>

            <Tabs color="primary" disabledKeys={["opengl"]}>
                <Tab key="vulkan" title="Vulkan">
                    <Card>
                        <CardHeader className="font-bold">Vulkan Information</CardHeader>
                        <CardBody>
                            <p className="text-sm">Total identified Vulkan devices: {vulkanInfo.totalDevices}</p>

                            <Spacer y={4}/>

                            <Accordion variant="splitted" defaultExpandedKeys="all">
                                {vulkanInfo.devices.map((device, idx) => (
                                    <AccordionItem key={idx} title={device.deviceName} className="font-bold">
                                        <Table hideHeader removeWrapper>
                                            <TableHeader>
                                                <TableColumn>Field</TableColumn>
                                                <TableColumn>Value</TableColumn>
                                            </TableHeader>

                                            <TableBody>
                                                <TableRow key={1}>
                                                    <TableCell className="font-bold">Vendor ID</TableCell>
                                                    <TableCell>{device.vendorId}</TableCell>
                                                </TableRow>
                                                <TableRow key={2}>
                                                    <TableCell className="font-bold">Device ID</TableCell>
                                                    <TableCell>{device.deviceId}</TableCell>
                                                </TableRow>
                                                <TableRow key={3}>
                                                    <TableCell className="font-bold">Device Type</TableCell>
                                                    <TableCell>{device.deviceType}</TableCell>
                                                </TableRow>
                                                <TableRow key={4}>
                                                    <TableCell className="font-bold">API Version</TableCell>
                                                    <TableCell>{device.apiVersion}</TableCell>
                                                </TableRow>
                                                <TableRow key={5}>
                                                    <TableCell className="font-bold">Driver Version</TableCell>
                                                    <TableCell>{device.driverVersion}</TableCell>
                                                </TableRow>
                                                <TableRow key={6}>
                                                    <TableCell className="font-bold">Pipeline Cache UUID</TableCell>
                                                    <TableCell>{device.pipelineCacheUuid}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardBody>
                    </Card>
                </Tab>

                <Tab key="opengl" title="OpenGL">
                    <Card>
                        <CardBody>TODO</CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}

export default GPU;
