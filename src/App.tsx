import {NextUIProvider} from "@nextui-org/react";

function App() {
    return (
        <NextUIProvider>
            <main className="light text-foreground bg-background h-screen flex flex-wrap flex-col items-center p-2">
                <h1>Hello world</h1>
            </main>
        </NextUIProvider>
    );
}

export default App;
