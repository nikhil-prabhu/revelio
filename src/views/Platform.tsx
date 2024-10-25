import { useEffect, useState } from "react";
import {
  commands,
  PlatformInfo,
  OsType,
  MacOSInfo,
  LinuxInfo,
} from "../bindings";
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
  }, [theme]);

  if (!platformInfo) {
    return <Spinner label="Loading..." color="primary" />;
  }

  function isMacOSInfo(_obj: any): _obj is MacOSInfo {
    return osType == "MacIntel" || osType == "MacSilicon";
  }

  function isLinuxInfo(_obj: any): _obj is LinuxInfo {
    return osType == "Linux";
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
                      src={utils.getMacOSLogo(
                        platformInfo.macOSVersion,
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

              {isLinuxInfo(platformInfo) ? (
                <div className="mt-4">
                  <div className="flex items-center justify-center w-full">
                    <Image
                      src={utils.getLinuxLogo(platformInfo.id, currentTheme)}
                      width={128}
                      height={128}
                      radius="none"
                    />
                  </div>

                  <Spacer />

                  <h1 className="font-bold text-lg">
                    {platformInfo.prettyName || platformInfo.platform}
                  </h1>
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

                  <TableRow>
                    <TableCell className="font-bold w-1/3">Shell</TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center justify-start">
                        <Image
                          src={utils.getUnixShellLogo(
                            platformInfo.shell,
                            currentTheme,
                          )}
                          width={16}
                          height={16}
                          radius="none"
                        />

                        <Spacer x={2} />

                        {platformInfo.shell}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          ) : null}

          {isLinuxInfo(platformInfo) ? (
            <>
              <h1 className="font-bold text-large text-center">
                Distribution Information
              </h1>
              <Table isStriped shadow="none">
                <TableHeader>
                  <TableColumn>Property</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold w-1/3">ID</TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.id}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">ID Like</TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.idLike}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">Name</TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">
                      Pretty Name
                    </TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.prettyName}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">Version</TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.version}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">
                      Version ID
                    </TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.versionId}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">
                      Version Codename
                    </TableCell>
                    <TableCell className="font-mono">
                      {platformInfo.versionCodename}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">
                      Graphics Platform
                    </TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center justify-start">
                        <Image
                          src={utils.getLinuxGraphicsPlatformLogo(
                            platformInfo.graphicsPlatform,
                            currentTheme,
                          )}
                          width={16}
                          height={16}
                          radius="none"
                        />

                        <Spacer x={2} />

                        {platformInfo.graphicsPlatform}
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">Desktop</TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center justify-start">
                        <Image
                          src={utils.getLinuxDesktopLogo(
                            platformInfo.desktop,
                            currentTheme,
                          )}
                          width={16}
                          height={16}
                          radius="none"
                        />

                        <Spacer x={2} />

                        {platformInfo.desktop}
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold w-1/3">Shell</TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center justify-start">
                        <Image
                          src={utils.getUnixShellLogo(
                            platformInfo.shell,
                            currentTheme,
                          )}
                          width={16}
                          height={16}
                          radius="none"
                        />

                        <Spacer x={2} />

                        {platformInfo.shell}
                      </div>
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
