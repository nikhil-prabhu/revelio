import { useEffect, useState } from "react";
import { commands, CpuInfo, Cache, Core } from "../bindings";
import {
  Accordion,
  AccordionItem,
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

interface CacheInfoProps {
  cache: Cache;
}

interface CoresInfoProps {
  cores: Core[];
}

// TODO: completely hide non-existent cache entries instead of just disabling them.
function CacheInfo(props: CacheInfoProps) {
  const { cache } = props;

  return (
    <Table isStriped shadow="none">
      <TableHeader>
        <TableColumn>Property</TableColumn>
        <TableColumn>Value</TableColumn>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell className="font-bold w-[35%]">Size</TableCell>
          <TableCell className="font-mono">
            {utils.formatBytes(cache.size)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-bold w-[35%]">Associativity</TableCell>
          <TableCell className="font-mono">{cache.associativity}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-bold w-[35%]">Sets</TableCell>
          <TableCell className="font-mono">{cache.sets}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-bold w-[35%]">Partitions</TableCell>
          <TableCell className="font-mono">{cache.partitions}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-bold w-[35%]">Line Size</TableCell>
          <TableCell className="font-mono">
            {utils.formatBytes(cache.lineSize)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-bold w-[35%]">Flags</TableCell>
          <TableCell className="font-mono">{cache.flags}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

// TODO: add cores info inside accordion items.
function CoresInfo(props: CoresInfoProps) {
  const { cores } = props;

  return (
    <>
      {cores.map((core) => (
        <>
          <Table
            isStriped
            shadow="none"
            topContent={<h1 className="font-bold">{core.id}:</h1>}
          >
            <TableHeader>
              <TableColumn>Property</TableColumn>
              <TableColumn>Value</TableColumn>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell className="font-bold w-[35%]">
                  Processors Count
                </TableCell>
                <TableCell className="font-mono">
                  {core.processorsCount}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold w-[35%]">CPU ID</TableCell>
                <TableCell className="font-mono">{core.cpuId}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold w-[35%]">Frequency</TableCell>
                <TableCell className="font-mono">{core.frequency}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Accordion isCompact>
            <AccordionItem
              key="processors"
              title="Processors"
              className="font-bold"
            >
              {core.processors.map((processor) => (
                <Table
                  isStriped
                  shadow="none"
                  topContent={<h1 className="font-bold">{processor.smtId}:</h1>}
                >
                  <TableHeader>
                    <TableColumn>Property</TableColumn>
                    <TableColumn>Value</TableColumn>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Windows Group ID
                      </TableCell>
                      <TableCell className="font-mono">
                        {processor.windowsGroupId}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        Windows Processor ID
                      </TableCell>
                      <TableCell className="font-mono">
                        {processor.windowsProcessorId}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-bold w-[35%]">
                        APIC ID
                      </TableCell>
                      <TableCell className="font-mono">
                        {processor.apicId}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ))}
            </AccordionItem>
          </Accordion>

          <Divider className="mt-4 mb-4" />
        </>
      ))}
    </>
  );
}

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
                <TableCell className="font-bold w-[35%]">Vendor</TableCell>
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
                <TableCell className="font-bold w-[35%]">Op-Modes</TableCell>
                <TableCell className="font-mono">{cpuInfo.opModes}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold w-[35%]">Core Count</TableCell>
                <TableCell className="font-mono">{cpuInfo.coreCount}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold w-[35%]">
                  Threads Per Core
                </TableCell>
                <TableCell className="font-mono">
                  {cpuInfo.threadsPerCore}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider className="mt-4 mb-4" />

          <h1 className="font-bold text-large text-center">
            Cores Information
          </h1>

          <CoresInfo cores={cpuInfo.cores} />

          <h1 className="font-bold text-large text-center">
            Cache Information
          </h1>

          <Accordion isCompact>
            <AccordionItem
              key="l4Cache"
              title="L4 Cache"
              className="font-bold"
              isDisabled={!cpuInfo.cacheInfo.l4}
            >
              <CacheInfo cache={cpuInfo.cacheInfo.l4!} />
            </AccordionItem>

            <AccordionItem
              key="l3Cache"
              title="L3 Cache"
              className="font-bold"
              isDisabled={!cpuInfo.cacheInfo.l3}
            >
              <CacheInfo cache={cpuInfo.cacheInfo.l3!} />
            </AccordionItem>

            <AccordionItem
              key="l2Cache"
              title="L2 Cache"
              className="font-bold"
              isDisabled={!cpuInfo.cacheInfo.l2}
            >
              <CacheInfo cache={cpuInfo.cacheInfo.l2!} />
            </AccordionItem>

            <AccordionItem
              key="l1iCache"
              title="L1i Cache"
              className="font-bold"
              isDisabled={!cpuInfo.cacheInfo.l1i}
            >
              <CacheInfo cache={cpuInfo.cacheInfo.l1i!} />
            </AccordionItem>

            <AccordionItem
              key="l1dCache"
              title="L1d Cache"
              className="font-bold"
              isDisabled={!cpuInfo.cacheInfo.l1i}
            >
              <CacheInfo cache={cpuInfo.cacheInfo.l1d!} />
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </ViewContainer>
  );
}

export default Cpu;
