import {useEffect, useState} from "react";
import {DisksInfo, commands} from "../bindings";
import {
    Card,
    CardBody,
    CardHeader,
    Spacer,
    Spinner,
    Table,
    TableBody, TableCell,
    TableColumn,
    TableHeader, TableRow
} from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer";

function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

function Storage() {
    let [storageInfo, setStorageInfo] = useState<DisksInfo>();

    useEffect(() => {
        commands.getDisksInfo().then(info => {
            setStorageInfo(info);
            console.info("Storage information retrieved successfully.");
        }).catch(error => {
            console.error(error);
        });
    }, []);

    if (!storageInfo) {
        return <Spinner label="Loading..." color="primary"/>
    }

    return (
        <ViewContainer title="Storage Information">
            <p className="text-sm">Total disks on system: {storageInfo.count}</p>

            <Spacer y={4}/>

            {storageInfo.disks.map((disk) => (
                <>
                    <Card>
                        <CardHeader className="font-bold">{disk.name}</CardHeader>
                        <CardBody>
                            <Table hideHeader removeWrapper>
                                <TableHeader>
                                    <TableColumn>Field</TableColumn>
                                    <TableColumn>Value</TableColumn>
                                </TableHeader>

                                <TableBody>
                                    <TableRow key={1}>
                                        <TableCell className="font-bold w-1/2">Filesystem</TableCell>
                                        <TableCell>{disk.fileSystem}</TableCell>
                                    </TableRow>

                                    <TableRow key={2}>
                                        <TableCell className="font-bold w-1/2">Mount Point</TableCell>
                                        <TableCell>{disk.mountPoint}</TableCell>
                                    </TableRow>

                                    <TableRow key={3}>
                                        <TableCell className="font-bold w-1/2">Total Space</TableCell>
                                        <TableCell>{formatBytes(disk.totalSpace)}</TableCell>
                                    </TableRow>

                                    <TableRow key={4}>
                                        <TableCell className="font-bold w-1/2">Available Space</TableCell>
                                        <TableCell>{formatBytes(disk.availableSpace)}</TableCell>
                                    </TableRow>

                                    <TableRow key={5}>
                                        <TableCell className="font-bold w-1/2">Disk Kind</TableCell>
                                        <TableCell>{disk.kind}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>

                    <Spacer y={4}/>
                </>
            ))}
        </ViewContainer>
    )
}

export default Storage;
