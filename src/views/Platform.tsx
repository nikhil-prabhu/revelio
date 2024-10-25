import { useEffect, useState } from "react";
import { commands, PlatformInfo, OsType, MacOSInfo } from "../bindings";
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

function Platform() {
  let [platformInfo, setPlatformInfo] = useState<PlatformInfo>();
  const [currentTheme, setCurrentTheme] = useState<utils.Variant>("light");
  const [osType, setOSType] = useState<OsType>();
  const { theme } = useTheme();

  useEffect(() => {
    if (theme!.toLowerCase().includes("dark")) {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }

    commands
      .getOsType()
      .then((osType) => {
        setOSType(osType);
        console.debug(osType);
      })
      .catch((error) => {
        console.error(error);
      });

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

  function isMacOSInfo(_obj: any): _obj is MacOSInfo {
    return osType == "MacIntel" || osType == "MacSilicon";
  }

  return (
    <ViewContainer title="Platform Information">
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-center w-full">
          <div className="mt-4">
            <div className="flex items-center justify-center w-full">
              {isMacOSInfo(platformInfo) ? (
                <div className="mt-4">
                  <div className="flex items-center justify-center w-full">
                    <Image
                      src={utils.getPlatformLogo(
                        `${platformInfo.platform} ${platformInfo.macOSVersion}`,
                        currentTheme,
                      )}
                      width={128}
                      height={128}
                      radius="none"
                    />
                  </div>

                  <Spacer />

                  <h1 className="font-bold text-lg">{platformInfo.platform}</h1>
                </div>
              ) : null}
            </div>
          </div>
        </CardHeader>

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

          <Divider className="m-4" />

          {isMacOSInfo(platformInfo) ? (
            <>
              <h1 className="font-bold text-large text-center">
                macOS Information
              </h1>
              <Table isStriped shadow="none">
                <TableHeader>
                  <TableColumn>Property</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold w-1/3">
                      macOS Version
                    </TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.macOSVersion}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">Chip Type</TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.chipType}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          ) : null}
        </CardBody>
      </Card>
    </ViewContainer>
  );
}

export default Platform;
