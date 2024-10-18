import {ReactNode, useEffect} from "react";
import {getCurrentWindow} from "@tauri-apps/api/window";

export interface ViewContainerProps {
    title: string;
    children: ReactNode;
}

function ViewContainer(props: ViewContainerProps) {
    useEffect(() => {
        let window = getCurrentWindow();

        window.setTitle(`Revelio - ${props.title}`).then(() => {
            console.info("Set window title successfully");
        }).catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <div className={"w-full flex-row text-center items-center mb-4 wl-2 mr-2"}>
            <h1 className="font-bold m-4">{props.title}</h1>

            {props.children}
        </div>
    );
}

export default ViewContainer;
