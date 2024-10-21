import {useEffect, useState} from "react";
import {CpuInfo, commands} from "../bindings";
import {
    Accordion, AccordionItem,
    Card, CardBody, Divider,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer";

function Cpu() {
    const [cpuInfo, setCpuInfo] = useState<CpuInfo>();

    useEffect(() => {
        commands.getCpuInfo().then(info => {
            setCpuInfo(info);
            console.info("CPU information retrieved successfully.");
        }).catch(error => {
            console.error(error);
        })
    }, []);

    // TODO: improve loading indicator.
    if (!cpuInfo) {
        return <Spinner label="Loading..." color="primary"/>
    }

    // TODO: add brand and vendor icons.
    return (
        <ViewContainer title="CPU Information">
            <Card shadow="sm">
                <CardBody>
                    <Table isStriped shadow="none">
                        <TableHeader>
                            <TableColumn>Property</TableColumn>
                            <TableColumn>Value</TableColumn>
                        </TableHeader>

                        <TableBody>
                            <TableRow>
                                <TableCell className="font-bold w-1/3">Architecture</TableCell>
                                <TableCell className="font-mono">{cpuInfo.arch}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-bold w-1/3">Vendor ID</TableCell>
                                <TableCell className="font-mono">{cpuInfo.vendorId}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-bold w-1/3">Brand</TableCell>
                                <TableCell className="font-mono">{cpuInfo.brand}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-bold w-1/3">Physical Core Count</TableCell>
                                <TableCell className="font-mono">{cpuInfo.physicalCoreCount}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Divider/>

                    <Accordion isCompact fullWidth aria-label="Logical Processors Details">
                        <AccordionItem title="Logical Processors Details"
                                       className="font-bold text-sm">
                            <Table selectionMode="none" isStriped removeWrapper>
                                <TableHeader>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Frequency</TableColumn>
                                </TableHeader>

                                <TableBody items={cpuInfo.cpus}>
                                    {(item) => (
                                        <TableRow key={item.name}>
                                            <TableCell className="font-bold">{item.name}</TableCell>
                                            <TableCell className="font-mono">{item.frequency}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </AccordionItem>
                    </Accordion>
                </CardBody>
            </Card>
        </ViewContainer>
    );
}

export default Cpu;
