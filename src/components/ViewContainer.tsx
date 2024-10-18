import {ReactNode} from "react";

export interface ViewContainerProps {
    title: string;
    children: ReactNode;
}

function ViewContainer(props: ViewContainerProps) {
    return (
        <div className={"w-full flex-row text-center items-center mb-4 wl-2 mr-2"}>
            <h1 className="font-bold m-4">{props.title}</h1>

            {props.children}
        </div>
    );
}

export default ViewContainer;
