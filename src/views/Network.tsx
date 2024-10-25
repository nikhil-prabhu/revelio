import { useEffect, useState } from "react";
import { commands, NetworksInfo } from "../bindings";
import {
  Card,
  CardBody,
  CardHeader,
  Spacer,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer";

function Network() {
  let [networksInfo, setNetworksInfo] = useState<NetworksInfo>();

  useEffect(() => {
    commands
      .getNetworksInfo()
      .then((info) => {
        setNetworksInfo(info);
        console.info("Networks information retrieved successfully.");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!networksInfo) {
    return <Spinner label="Loading..." color="primary" />;
  }

  return (
    <ViewContainer title="Network Information">
      <p className="text-sm">
        Total network interfaces on system: {networksInfo.totalInterfaces}
      </p>

      <Spacer y={4} />

      {networksInfo.interfaces.map((itf) => (
        <>
          <Card>
            <CardHeader className="font-bold">{itf.itfName}</CardHeader>
            <CardBody>
              <Table hideHeader removeWrapper>
                <TableHeader>
                  <TableColumn>Field</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>

                <TableBody>
                  <TableRow key={1}>
                    <TableCell className="font-bold w-1/2">
                      MAC Address
                    </TableCell>
                    <TableCell>{itf.macAddr}</TableCell>
                  </TableRow>

                  <TableRow key={2}>
                    <TableCell className="font-bold w-1/2">
                      IP Networks
                    </TableCell>
                    <TableCell>{itf.ipNetworks.join(", ")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          <Spacer y={4} />
        </>
      ))}
    </ViewContainer>
  );
}

export default Network;
