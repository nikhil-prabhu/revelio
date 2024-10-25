import { useEffect, useState } from "react";
import { commands, PlatformInfo } from "../bindings";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer";

function Platform() {
  let [platformInfo, setPlatformInfo] = useState<PlatformInfo>();

  useEffect(() => {
    commands
      .getPlatformInfo()
      .then((info) => {
        setPlatformInfo(info);
        console.info("Platform information retrieved successfully.");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!platformInfo) {
    return <Spinner label="Loading..." color="primary" />;
  }

  return (
    <ViewContainer title="Platform Information">
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
    </ViewContainer>
  );
}

export default Platform;
