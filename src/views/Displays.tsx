import { commands, DisplaysInfo } from "../bindings";
import { useEffect, useState } from "react";
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

function Displays() {
  let [displaysInfo, setDisplaysInfo] = useState<DisplaysInfo>();

  useEffect(() => {
    commands
      .getDisplaysInfo()
      .then((info) => {
        setDisplaysInfo(info);
        console.info("Displays information retrieved successfully.");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!displaysInfo) {
    return <Spinner label="Loading..." color="primary" />;
  }

  return (
    <ViewContainer title="Displays Information">
      <p className="text-sm">Total displays: {displaysInfo.totalDisplays}</p>

      <Spacer y={4} />

      {displaysInfo.displays.map((display) => (
        <>
          <Card>
            <CardHeader className="font-bold">{display.name}</CardHeader>
            <CardBody>
              <Table hideHeader removeWrapper>
                <TableHeader>
                  <TableColumn>Field</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>

                <TableBody>
                  <TableRow key={1}>
                    <TableCell className="font-bold w-1/2">
                      Dimensions
                    </TableCell>
                    <TableCell>{display.dimensions}</TableCell>
                  </TableRow>

                  <TableRow key={2}>
                    <TableCell className="font-bold w-1/2">
                      Scale Factor
                    </TableCell>
                    <TableCell>{display.scaleFactor}</TableCell>
                  </TableRow>

                  <TableRow key={3}>
                    <TableCell className="font-bold w-1/2">Position</TableCell>
                    <TableCell>{display.position}</TableCell>
                  </TableRow>

                  <TableRow key={4}>
                    <TableCell className="font-bold w-1/2">
                      Refresh Rate
                    </TableCell>
                    <TableCell>{display.refreshRate} MHz</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </>
      ))}
    </ViewContainer>
  );
}

export default Displays;
