import {NextUIProvider, Spacer, Tab, Tabs} from "@nextui-org/react";
import {BsCpuFill, BsGpuCard, BsHddNetworkFill} from "react-icons/bs";
import {RiHardDriveFill} from "react-icons/ri";
import {GrSystem} from "react-icons/gr";
import {Route, Routes, useHref, useNavigate} from "react-router-dom";
import CPU from "./views/cpu.tsx";

function App() {
    const navigate = useNavigate();

    return (
        <NextUIProvider navigate={navigate} useHref={useHref}>
            <main className="light text-foreground bg-background h-screen flex p-2">
                <Tabs isVertical color="primary">
                    <Tab key="cpu"
                         title={
                             <div className="flex items-center space-x-2">
                                 <BsCpuFill/>
                                 <span>CPU</span>
                             </div>
                         }
                    ></Tab>

                    <Tab key="gpu"
                         title={
                             <div className="flex items-center space-x-2">
                                 <BsGpuCard/>
                                 <span>GPU</span>
                             </div>
                         }></Tab>

                    <Tab key="storage"
                         title={
                             <div className="flex items-center space-x-2">
                                 <RiHardDriveFill/>
                                 <span>Storage</span>
                             </div>
                         }></Tab>

                    <Tab key="network"
                         title={
                             <div className="flex items-center space-x-2">
                                 <BsHddNetworkFill/>
                                 <span>Network</span>
                             </div>
                         }></Tab>

                    <Tab key="Platform"
                         title={
                             <div className="flex items-center space-x-2">
                                 <GrSystem/>
                                 <span>Platform</span>
                             </div>
                         }></Tab>
                </Tabs>

                <Spacer x={8}/>

                <Routes>
                    <Route path="/" element={<CPU/>}/>
                </Routes>
            </main>
        </NextUIProvider>
    );
}

export default App;
