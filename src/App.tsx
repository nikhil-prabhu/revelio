import {NextUIProvider, Spacer, Tab, Tabs} from "@nextui-org/react";
import {BsCpuFill, BsGpuCard, BsHddNetworkFill} from "react-icons/bs";
import {RiHardDriveFill} from "react-icons/ri";
import {GrSystem} from "react-icons/gr";
import {Route, Routes, useHref, useLocation, useNavigate} from "react-router-dom";
import CPU from "./views/cpu";
import GPU from "./views/gpu";
import Storage from "./views/storage";
import Network from "./views/network";
import Platform from "./views/platform";
import {commands} from "./bindings";
import {useEffect, useRef} from "react";

function App() {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const handleCtxMenu = useRef<null | ((_: MouseEvent) => void)>(null);

    useEffect(() => {
        commands.isReleaseProfile().then(yes => {
            if (yes) {
                handleCtxMenu.current = (event: MouseEvent) => {
                    event.preventDefault();
                };
            }

            if (handleCtxMenu.current) {
                document.addEventListener("contextmenu", handleCtxMenu.current);
            }
        })

        return () => {
            if (handleCtxMenu.current) {
                document.removeEventListener("contextmenu", handleCtxMenu.current);
            }
        };
    }, []);

    return (
        <NextUIProvider navigate={navigate} useHref={useHref}>
            <main className="light text-foreground bg-background h-screen flex p-2">
                <Tabs isVertical color="primary" selectedKey={pathname}>
                    <Tab key="/" href="/"
                         title={
                             <div className="flex items-center space-x-2">
                                 <BsCpuFill/>
                                 <span>CPU</span>
                             </div>
                         }
                    ></Tab>

                    <Tab key="/gpu" href="/gpu"
                         title={
                             <div className="flex items-center space-x-2">
                                 <BsGpuCard/>
                                 <span>GPU</span>
                             </div>
                         }></Tab>

                    <Tab key="/storage" href="/storage"
                         title={
                             <div className="flex items-center space-x-2">
                                 <RiHardDriveFill/>
                                 <span>Storage</span>
                             </div>
                         }></Tab>

                    <Tab key="/network" href="/network"
                         title={
                             <div className="flex items-center space-x-2">
                                 <BsHddNetworkFill/>
                                 <span>Network</span>
                             </div>
                         }></Tab>

                    <Tab key="/platform" href="/platform"
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
                    <Route path="/gpu" element={<GPU/>}/>
                    <Route path="/storage" element={<Storage/>}/>
                    <Route path="/network" element={<Network/>}/>
                    <Route path="/platform" element={<Platform/>}/>
                </Routes>
            </main>
        </NextUIProvider>
    );
}

export default App;
