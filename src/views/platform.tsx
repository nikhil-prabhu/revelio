import {useEffect, useState} from "react";
import * as bindings from "../bindings";
import {
    Spinner,
    Table, TableBody, TableCell, TableColumn, TableHeader, TableRow,
} from "@nextui-org/react";

function Platform() {
    let [platformInfo, setPlatformInfo] = useState<bindings.PlatformInfo>();

    useEffect(() => {
        bindings.getPlatformInfo().then(info => {
            setPlatformInfo(info);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    if (!platformInfo) {
        return <Spinner label="Loading..." color="primary"/>
    }

    return (
        <div className="w-full flex-row text-center items-center mb-4 ml-2 mr-2">
            <h1 className="font-bold m-4">Platform Information</h1>

            <Table selectionMode="none" hideHeader>
                <TableHeader>
                    <TableColumn>Field</TableColumn>
                    <TableColumn>Value</TableColumn>
                </TableHeader>

                <TableBody>
                    <TableRow key={1}>
                        <TableCell className="font-bold">Platform</TableCell>
                        <TableCell>{platformInfo.platform}</TableCell>
                    </TableRow>

                    <TableRow key={2}>
                        <TableCell className="font-bold">Hostname</TableCell>
                        <TableCell>{platformInfo.hostname}</TableCell>
                    </TableRow>

                    <TableRow key={3}>
                        <TableCell className="font-bold">OS Architecture</TableCell>
                        <TableCell>{platformInfo.osArch}</TableCell>
                    </TableRow>

                    <TableRow key={4}>
                        <TableCell className="font-bold">Kernel</TableCell>
                        <TableCell>{platformInfo.kernel}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default Platform;
