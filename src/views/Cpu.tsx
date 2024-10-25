import { useEffect, useState } from "react";
import { commands, CpuInfo } from "../bindings";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
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
import * as utils from "../utils";
import { useTheme } from "next-themes";

function Cpu() {
  const [cpuInfo, setCpuInfo] = useState<CpuInfo>();
  const [currentTheme, setCurrentTheme] = useState<utils.Variant>("light");
  const { theme } = useTheme();

  useEffect(() => {
    if (theme!.toLowerCase().includes("dark")) {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }

    commands
      .getCpuInfo()
      .then((info) => {
        setCpuInfo(info);
        console.info("CPU information retrieved successfully.");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [theme]);

  // TODO: improve loading indicator.
  if (!cpuInfo) {
    return <Spinner label="Loading..." color="primary" />;
  }

  // TODO: add brand and vendor icons.
  return (
    <ViewContainer title="CPU Information">
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-center w-full">
          <div className="mt-4">
            <div className="flex items-center justify-center w-full">
              <Image
                src={utils.getCpuLogo(cpuInfo.brand, currentTheme)}
                width={128}
                height={128}
                radius="none"
              />
            </div>

            <Spacer />

            <h1 className="font-bold text-lg">{cpuInfo.brand}</h1>
          </div>
        </CardHeader>

        <Divider className="mt-4 mb-4" />

        <CardBody>
          <h1 className="font-bold text-large text-center">
            General Information
          </h1>
          <Table isStriped shadow="none">
            <TableHeader>
              <TableColumn>Property</TableColumn>
              <TableColumn>Value</TableColumn>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell className="font-bold w-[35%]">Vendor ID</TableCell>
                <TableCell className="font-mono">
                  <div className="flex items-center justify-start">
                    <Image
                      src={utils.getVendorLogo(cpuInfo.vendorId, currentTheme)}
                      width={16}
                      height={16}
                      radius="none"
                    />

                    <Spacer x={2} />

                    {cpuInfo.vendorId}
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold w-[35%]">
                  Architecture
                </TableCell>
                <TableCell className="font-mono">{cpuInfo.arch}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold w-[35%]">
                  Physical Core Count
                </TableCell>
                <TableCell className="font-mono">
                  {cpuInfo.physicalCoreCount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider className="mt-4 mb-4" />

          <h1 className="font-bold text-large text-center">
            Logical Processors Information
          </h1>
          <Table isStriped shadow="none">
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
        </CardBody>
      </Card>
    </ViewContainer>
  );
}

export default Cpu;
