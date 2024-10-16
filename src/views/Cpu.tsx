import {useEffect, useState} from "react";
import {CpuInfo, commands} from "../bindings";
import * as utils from '../utils';
import {
    Image, Spacer,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer";

function Cpu() {
    let [cpuInfo, setCpuInfo] = useState<CpuInfo>();

    useEffect(() => {
        commands.getCpuInfo().then(info => {
            setCpuInfo(info);
            console.info("CPU information retrieved successfully.");
        }).catch(error => {
            console.error(error);
        })
    }, []);

    if (!cpuInfo) {
        return <Spinner label="Loading..." color="primary"/>
    }

    return (
        <ViewContainer title="CPU Information">
            <Table selectionMode="none">
                <TableHeader>
                    <TableColumn>Architecture</TableColumn>
                    <TableColumn>Vendor ID</TableColumn>
                    <TableColumn>Brand</TableColumn>
                    <TableColumn>Physical Core Count</TableColumn>
                </TableHeader>

                <TableBody>
                    <TableRow key="1">
                        <TableCell>{cpuInfo.arch}</TableCell>
                        <TableCell>
                            <div className="flex">
                                <Image src={utils.getVendorIcon(cpuInfo.vendorId)} radius="none" width={20}/>
                                <Spacer/>
                                {cpuInfo.vendorId}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex">
                                <Image src={utils.getBrandIcon(cpuInfo.brand)} radius="none" width={20}/>
                                <Spacer/>
                                {cpuInfo.brand}
                            </div>
                        </TableCell>
                        <TableCell>{cpuInfo.physicalCoreCount}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <h1 className="font-bold m-4">Logical Processors Information</h1>

            <Table selectionMode="none" isStriped>
                <TableHeader>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Frequency</TableColumn>
                </TableHeader>

                <TableBody items={cpuInfo.cpus}>
                    {(item) => (
                        <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.frequency}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ViewContainer>
    );
}

export default Cpu;
