import {MetalInfo as MTLInfo, commands, MetalCounterSet} from "../bindings";
import {useEffect, useState} from "react";
import {
    Card,
    CardBody,
    Select,
    Spinner,
    Selection,
    Image,
    SelectItem,
    Spacer,
    Divider,
    Tabs,
    Tab, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@nextui-org/react";
import * as utils from "../utils.ts";
import {useTheme} from "next-themes";

interface DeviceProps {
    info: MTLInfo;
    currentDevice: number;
}

interface CounterSetProps {
    counterSets: MetalCounterSet[];
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
                                    <TableCell className="font-bold w-1/3">Registry ID</TableCell>
                                    <TableCell className="font-mono">{device.registryId}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Location</TableCell>
                                    <TableCell className="font-mono">{device.location}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Location Number</TableCell>
                                    <TableCell className="font-mono">{device.locationNumber}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Max Threadgroup Memory Length</TableCell>
                                    <TableCell className="font-mono">{device.maxThreadgroupMemoryLength}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Max Threads Per Threadgroup</TableCell>
                                    <TableCell className="font-mono">{device.maxThreadsPerThreadgroup}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Is Low Power?</TableCell>
                                    <TableCell className="font-mono">{device.isLowPower ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Is Headless?</TableCell>
                                    <TableCell className="font-mono">{device.isHeadless ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Is Removable?</TableCell>
                                    <TableCell className="font-mono">{device.isRemovable ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports Raytracing?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supportsRaytracing ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Has Unified Memory?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.hasUnifiedMemory ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Recommended Max Working Set Size</TableCell>
                                    <TableCell
                                        className="font-mono">{device.recommendedMaxWorkingSetSize ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Max Transfer Rate</TableCell>
                                    <TableCell className="font-mono">{device.maxTransferRate}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports Barycentric Coordinates?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supportsBarycentricCoordinates ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports Function Pointers?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supportsFunctionPointers ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports Dynamic Libraries?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supportsDynamicLibraries ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Argument Buffers Support</TableCell>
                                    <TableCell className="font-mono">{device.argumentBuffersSupport}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Read-Write Texture Support</TableCell>
                                    <TableCell className="font-mono">{device.readWriteTextureSupport}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports 32-bit Float Filtering?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supports32bitFloatFiltering ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports 32-bit MSAA?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supports32bitMSAA ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports Query Texture LOD?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supportsQueryTextureLOD ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports BC Texture Compression?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supportsBCTextureCompression ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Supports Pull Model
                                        Interpolation?</TableCell>
                                    <TableCell
                                        className="font-mono">{device.supportsPullModelInterpolation ? "Yes" : "No"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Max Argument Buffer Sampler Count</TableCell>
                                    <TableCell className="font-mono">{device.maxArgumentBufferSamplerCount}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Current Allocated Size</TableCell>
                                    <TableCell className="font-mono">{device.currentAllocatedSize}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-bold w-1/3">Max Buffer Length</TableCell>
                                    <TableCell className="font-mono">{device.maxBufferLength}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>)
                        : null
                ))}
            </CardBody>
        </Card>
    );
}

function CounterSets(props: CounterSetProps) {
    const {counterSets} = props;

    return (
        <Card shadow="none">
            <Table isStriped shadow="none" fullWidth>
                <TableHeader>
                    <TableColumn>Name</TableColumn>
                </TableHeader>

                <TableBody>
                    {counterSets.map(counterSet => (
                        <TableRow>
                            <TableCell className="font-mono">{counterSet.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}

function MetalInfo() {
    const [metalInfo, setMetalInfo] = useState<MTLInfo>();
    const [currentDevice, setCurrentDevice] = useState<Selection>(new Set(["0"]));
    const [currentTheme, setCurrentTheme] = useState<utils.Variant>("light");
    const {theme} = useTheme();

    useEffect(() => {
        if (theme!.toLowerCase().includes("dark")) {
            setCurrentTheme("dark");
        } else {
            setCurrentTheme("light");
        }

        commands.getMetalInfo().then(info => {
            setMetalInfo(info);
            console.debug(info)
        }).catch(error => {
            console.error(error);
        });
    }, [theme]);

    if (!metalInfo) {
        return <Spinner label="Loading..." color="primary"/>
    }

    function getCurrentDeviceName(): string {
        for (const device of metalInfo!.devices) {
            if (Number([...currentDevice][0]) === device.index) {
                return device.deviceName;
            }
        }

        return "unknown"
    }

    function getCurrentDeviceCounterSets(): MetalCounterSet[] {
        for (const device of metalInfo!.devices) {
            if (Number([...currentDevice][0]) === device.index) {
                return device.counterSets;
            }
        }

        return [];
    }

    return (
        <>
            <div className="flex items-center justify-center space-x-8">
                <Select
                    autoFocus
                    items={metalInfo.devices}
                    label={`Select Device (Total: ${metalInfo.totalDevices})`}
                    selectionMode="single"
                    disallowEmptySelection
                    onSelectionChange={setCurrentDevice}
                    selectedKeys={currentDevice}
                    variant="faded"
                    startContent={
                        <Image src={utils.getVendorLogo(getCurrentDeviceName(), currentTheme)}
                               width={16}
                               height={16}
                               radius="none"/>
                    }
                    className="max-w-md"
                >
                    {(device) => <SelectItem
                        key={device.index}
                        startContent={(
                            <Image src={utils.getVendorLogo(device.deviceName, currentTheme)} width={16}
                                   height={16}
                                   radius="none"/>
                        )}
                    >{`${device.index}: ${device.deviceName}`}</SelectItem>}
                </Select>

                <Image src={utils.getGpuLogo(getCurrentDeviceName(), currentTheme)} removeWrapper
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
                    <Device currentDevice={Number([...currentDevice][0])} info={metalInfo}/>
                </Tab>

                <Tab
                    key="counterSets"
                    title={(
                        <div className="flex items-center space-x-2">
                            <span>Counter Sets</span>
                            <Chip size="sm" variant="faded"
                                  color="primary">{getCurrentDeviceCounterSets().length}</Chip>
                        </div>
                    )}
                    titleValue="Counter Sets"
                    className="w-full"
                >
                    <CounterSets counterSets={getCurrentDeviceCounterSets()}/>
                </Tab>
            </Tabs>
        </>
    );
}

export default MetalInfo;
