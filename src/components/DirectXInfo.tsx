import { useEffect, useState } from "react";
import { DirectXInfo as DXInfo, commands } from "../bindings";
import {
  Spinner,
  Selection,
  Select,
  Image,
  SelectItem,
  Spacer,
  Divider,
  Tabs,
  Tab,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableRow,
  TableColumn,
  TableBody,
  TableCell,
} from "@nextui-org/react";
import * as utils from "../utils";
import { useTheme } from "next-themes";

interface DeviceProps {
  info: DXInfo;
  currentDevice: number;
}

function Device(props: DeviceProps) {
  const { info, currentDevice } = props;

  return (
    <Card shadow="none">
      <CardBody>
        {info.devices.map((device) =>
          device.index === currentDevice ? (
            <Table isStriped shadow="none" fullWidth>
              <TableHeader>
                <TableColumn>Property</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="font-bold w-1/3">Device Name</TableCell>
                  <TableCell className="font-mono">
                    {device.deviceName}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold w-1/3">Vendor ID</TableCell>
                  <TableCell className="font-mono">{device.vendorId}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold w-1/3">Device ID</TableCell>
                  <TableCell className="font-mono">{device.deviceId}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold w-1/3">
                    Subsystem ID
                  </TableCell>
                  <TableCell className="font-mono">{device.subSysId}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold w-1/3">Revision</TableCell>
                  <TableCell className="font-mono">{device.revision}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold w-1/3">
                    Dedicated Video Memory
                  </TableCell>
                  <TableCell className="font-mono">
                    {utils.formatBytes(device.dedicatedVideoMemory)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold w-1/3">
                    Dedicated System Memory
                  </TableCell>
                  <TableCell className="font-mono">
                    {utils.formatBytes(device.dedicatedSystemMemory)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold w-1/3">
                    Shared System Memory
                  </TableCell>
                  <TableCell className="font-mono">
                    {utils.formatBytes(device.sharedSystemMemory)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : null,
        )}
      </CardBody>
    </Card>
  );
}

function DirectXInfo() {
  const [directXInfo, setDirectXInfo] = useState<DXInfo>();
  const [currentDevice, setCurrentDevice] = useState<Selection>(new Set(["0"]));
  const [currentTheme, setCurrentTheme] = useState<utils.Variant>("light");
  const { theme } = useTheme();

  useEffect(() => {
    if (theme!.toLowerCase().includes("dark")) {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }

    commands
      .getDirectXInfo()
      .then((info) => {
        setDirectXInfo(info);
        console.debug(info);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [theme]);

  if (!directXInfo) {
    return <Spinner label="Loading..." color="primary" />;
  }

  function getCurrentDeviceName(): string {
    for (const device of directXInfo!.devices) {
      if (Number([...currentDevice][0]) === device.index) {
        return device.deviceName;
      }
    }

    return "unknown";
  }

  return (
    <>
      <div className="flex items-center justify-center space-x-8">
        <Select
          autoFocus
          items={directXInfo.devices}
          label={`Select Device (Total: ${directXInfo.totalDevices})`}
          selectionMode="single"
          disallowEmptySelection
          onSelectionChange={setCurrentDevice}
          selectedKeys={currentDevice}
          variant="faded"
          startContent={
            <Image
              src={utils.getVendorLogo(getCurrentDeviceName(), currentTheme)}
              width={16}
              height={16}
              radius="none"
            />
          }
          className="max-w-md"
        >
          {(device) => (
            <SelectItem
              key={device.index}
              startContent={
                <Image
                  src={utils.getVendorLogo(device.deviceName, currentTheme)}
                  width={16}
                  height={16}
                  radius="none"
                />
              }
            >{`${device.index}: ${device.deviceName}`}</SelectItem>
          )}
        </Select>

        <Image
          src={utils.getGpuLogo(getCurrentDeviceName(), currentTheme)}
          removeWrapper
          width={100}
          height={100}
          radius="none"
        />
      </div>

      <Spacer y={4} />
      <Divider />

      <Tabs
        placement="end"
        color="primary"
        disabledKeys={["limits", "extensions"]}
        variant="underlined"
        disableAnimation
        className="mx-auto my-6"
      >
        <Tab key="device" title="Device" className="w-full">
          <Device
            currentDevice={Number([...currentDevice][0])}
            info={directXInfo}
          />
        </Tab>
      </Tabs>
    </>
  );
}

export default DirectXInfo;
