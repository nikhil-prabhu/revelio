import {NextUIProvider, Spacer, Tab, Tabs} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {BsCpuFill, BsGpuCard, BsHddNetworkFill} from "react-icons/bs";
import {RiHardDriveFill} from "react-icons/ri";
import {GrSystem} from "react-icons/gr";
import {Route, Routes, useHref, useLocation, useNavigate} from "react-router-dom";
import Cpu from "./views/Cpu";
import Gpu from "./views/Gpu";
import Storage from "./views/Storage";
import Network from "./views/Network";
import Platform from "./views/Platform";
import {commands} from "./bindings";
import {useEffect, useRef, useState} from "react";
import Displays from "./views/Displays.tsx";
import {MdScreenshotMonitor} from "react-icons/md";
import ThemeSwitcher from "./components/ThemeSwitcher.tsx";

function App() {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const handleCtxMenu = useRef<null | ((_: MouseEvent) => void)>(null);
    const [appVersion, setAppVersion] = useState<string>();

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

        commands.getAppVersion().then(version => {
            console.info(version);
            setAppVersion(version);
        }).catch(error => {
            console.error(error);
        });

        return () => {
            if (handleCtxMenu.current) {
                document.removeEventListener("contextmenu", handleCtxMenu.current);
            }
        };
    }, []);

    return (
        <NextUIProvider navigate={navigate} useHref={useHref}>
            <NextThemesProvider attribute="class" disableTransitionOnChange>
                <main className="text-foreground bg-background h-screen flex p-2">
                    <Tabs isVertical color="primary" selectedKey={pathname} disabledKeys={["/displays"]}>
                        <Tab key="/" href="/"
                             title={
                                 <div className="flex items-center space-x-2">
                                     <BsCpuFill/>
                                     <span>CPU</span>
                                 </div>
                             }
                        />

                        <Tab key="/gpu" href="/gpu"
                             title={
                                 <div className="flex items-center space-x-2">
                                     <BsGpuCard/>
                                     <span>GPU</span>
                                 </div>
                             }/>

                        <Tab key="/displays" href="/displays"
                             title={
                                 <div className="flex items-center space-x-2">
                                     <MdScreenshotMonitor/>
                                     <span>Displays</span>
                                 </div>
                             }/>

                        <Tab key="/storage" href="/storage"
                             title={
                                 <div className="flex items-center space-x-2">
                                     <RiHardDriveFill/>
                                     <span>Storage</span>
                                 </div>
                             }/>

                        <Tab key="/network" href="/network"
                             title={
                                 <div className="flex items-center space-x-2">
                                     <BsHddNetworkFill/>
                                     <span>Network</span>
                                 </div>
                             }/>

                        <Tab key="/platform" href="/platform"
                             title={
                                 <div className="flex items-center space-x-2">
                                     <GrSystem/>
                                     <span>Platform</span>
                                 </div>
                             }/>
                    </Tabs>

                    <Spacer x={8}/>

                    <Routes>
                        <Route path="/" element={<Cpu/>}/>
                        <Route path="/gpu" element={<Gpu/>}/>
                        <Route path="/displays" element={<Displays/>}/>
                        <Route path="/storage" element={<Storage/>}/>
                        <Route path="/network" element={<Network/>}/>
                        <Route path="/platform" element={<Platform/>}/>
                    </Routes>

                    <ThemeSwitcher/>

                    <p className="fixed bottom-0 text-xs m-2">v{appVersion}</p>
                </main>
            </NextThemesProvider>
        </NextUIProvider>
    );
}

export default App;
