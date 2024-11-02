import { commands, USBInfo } from "../bindings";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  Divider,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import ViewContainer from "../components/ViewContainer.tsx";

function USB() {
  const [usbInfo, setUSBInfo] = useState<USBInfo>();

  useEffect(() => {
    commands
      .getUSBInfo()
      .then((info) => {
        console.debug(info);
        setUSBInfo(info);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!usbInfo) {
    return <Spinner label="Loading..." color="primary" />;
  }

  return (
    <ViewContainer title="USB Information">
      <Card shadow="sm">
        <CardBody>
          <Accordion isCompact>
            {usbInfo.devices.map((device) => (
              <AccordionItem
                key={device.index}
                title={`${device.index}: ${device.productString || "Unknown"}`}
                className="font-bold"
              >
                <Table isStriped shadow="none">
                  <TableHeader>
                    <TableColumn>Property</TableColumn>
                    <TableColumn>Value</TableColumn>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Bus Number
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.busNumber}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Device Address
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.deviceAddress}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Vendor ID
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.vendorId}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Product ID
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.productId}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Device Version
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.deviceVersion}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">Class</TableCell>
                      <TableCell className="font-mono">
                        {device.class}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Subclass
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.subclass}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Protocol
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.protocol}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">Speed</TableCell>
                      <TableCell className="font-mono">
                        {device.speed || "Unknown"}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Manufacturer String
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.manufacturerString || "Unknown"}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Product String
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.productString || "Unknown"}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Serial Number
                      </TableCell>
                      <TableCell className="font-mono">
                        {device.serialNumber || "Unknown"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Divider className="mt-4 mb-4" />

                <h1>Interfaces</h1>

                <Accordion isCompact>
                  {device.interfaces.map((itf) => (
                    <AccordionItem
                      key={itf.interfaceNumber}
                      title={`${itf.interfaceNumber}: ${itf.interfaceString || "Unknown"}`}
                    >
                      <Table isStriped shadow="none">
                        <TableHeader>
                          <TableColumn>Property</TableColumn>
                          <TableColumn>Value</TableColumn>
                        </TableHeader>

                        <TableBody>
                          <TableRow>
                            <TableCell className="font-bold w-[35%]">
                              Interface Number
                            </TableCell>
                            <TableCell className="font-mono">
                              {itf.interfaceNumber}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="font-bold w-[35%]">
                              Class
                            </TableCell>
                            <TableCell className="font-mono">
                              {itf.class}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="font-bold w-[35%]">
                              Subclass
                            </TableCell>
                            <TableCell className="font-mono">
                              {itf.subclass}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="font-bold w-[35%]">
                              Protocol
                            </TableCell>
                            <TableCell className="font-mono">
                              {itf.protocol}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="font-bold w-[35%]">
                              Interface String
                            </TableCell>
                            <TableCell className="font-mono">
                              {itf.interfaceString || "Unknown"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>
    </ViewContainer>
  );
}

export default USB;
