import { useEffect, useState } from "react";
import { commands, PlatformInfo } from "../bindings";
import {
  Card,
  CardBody,
  CardHeader,
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

function Platform() {
  let [platformInfo, setPlatformInfo] = useState<PlatformInfo>();
  const [currentTheme, setCurrentTheme] = useState<utils.Variant>("light");
  const { theme } = useTheme();

  useEffect(() => {
    if (theme!.toLowerCase().includes("dark")) {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }

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
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-center w-full">
          <div className="mt-4">
            <div className="flex items-center justify-center w-full">
              <Image
                src={utils.getPlatformLogo(platformInfo.platform, currentTheme)}
                width={128}
                height={128}
                radius="none"
              />
            </div>

            <Spacer />

            <h1 className="font-bold text-lg">{platformInfo.platform}</h1>
          </div>
        </CardHeader>

        <CardBody>
          <Table isStriped shadow="none">
            <TableHeader>
              <TableColumn>Property</TableColumn>
              <TableColumn>Value</TableColumn>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell className="font-bold w-1/3">Hostname</TableCell>
                <TableCell className="font-mono">
                  {platformInfo.hostname}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold w-1/3">
                  OS Architecture
                </TableCell>
                <TableCell className="font-mono">
                  {platformInfo.osArch}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold w-1/3">Kernel</TableCell>
                <TableCell className="font-mono">
                  {platformInfo.kernel}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </ViewContainer>
  );
}

export default Platform;
